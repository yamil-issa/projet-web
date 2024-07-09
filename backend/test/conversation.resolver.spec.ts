import { Test, TestingModule } from '@nestjs/testing';
import { ConversationResolver } from '../src/resolvers/conversation.resolver';
import { Conversation } from '../src/entities/conversation.entity';
import { User } from '../src/entities/user.entity';
import { RedisConfig } from '../src/infrastructure/configuration/redis.config';
import { CreateConversationMutation } from '../src/mutations/conversation/createConversation';
import { SendMessageMutation } from '../src/mutations/message/sendMessage';
import { BullQueueProvider } from '../src/infrastructure/bullmq/bullQueue.provider';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

describe('ConversationResolver', () => {
  let resolver: ConversationResolver;
  let redisConfig: RedisConfig;

  const usersArray: User[] = [
    { id: 1, username: 'User1', email: 'user1@example.com', password: 'pass1', conversationIds: [] },
    { id: 2, username: 'User2', email: 'user2@example.com', password: 'pass2', conversationIds: [] },
    { id: 3, username: 'User3', email: 'user3@example.com', password: 'pass3', conversationIds: [] },
  ];

  const conversationsArray: Conversation[] = [
    { id: 1, participants: [usersArray[0], usersArray[1]], messages: [], startedAt: '2024-07-08T11:30:00.000Z' },
    { id: 2, participants: [usersArray[1], usersArray[2]], messages: [], startedAt: '2024-07-08T12:30:00.000Z' },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationResolver,
        CreateConversationMutation,
        SendMessageMutation,
        {
          provide: RedisConfig,
          useValue: {
            getRedisClient: jest.fn().mockReturnValue({
              hget: jest.fn((key: string, id: string) => {
                if (key === 'conversations') {
                  const conversation = conversationsArray.find((conv) => conv.id === Number(id));
                  return conversation ? JSON.stringify(conversation) : null;
                }
                if (key === 'users') {
                  const user = usersArray.find((usr) => usr.id === Number(id));
                  return user ? JSON.stringify(user) : null;
                }
                return null;
              }),
              hvals: jest.fn((key: string) => {
                if (key === 'conversations') {
                  return conversationsArray.map((conv) => JSON.stringify(conv));
                }
                return [];
              }),
            }),
          },
        },
        {
          provide: BullQueueProvider,
          useValue: {
            addJob: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<ConversationResolver>(ConversationResolver);
    redisConfig = module.get<RedisConfig>(RedisConfig);

    // Mock the GqlExecutionContext.create to simulate the context in the test
    jest.spyOn(GqlExecutionContext, 'create').mockImplementation((context: ExecutionContext) => {
      const gqlContext = {
        getContext: () => ({
          req: context.switchToHttp().getRequest(),
        }),
      } as GqlExecutionContext;
      return gqlContext;
    });

    // Mock the canActivate method of JwtAuthGuard
    jest.spyOn(JwtAuthGuard.prototype, 'canActivate').mockImplementation((context: ExecutionContext) => {
      const req = GqlExecutionContext.create(context).getContext().req;
      if (!req.headers.authorization) {
        throw new UnauthorizedException();
      }
      return true;
    });
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('conversation', () => {
    it('should return a conversation by id when authorized', async () => {
      const conversationId = 1;
      const expectedConversation = conversationsArray.find((conv) => conv.id === conversationId) as Conversation;

      // Mock the request with authorization header
      const mockContext = {
        req: { headers: { authorization: 'Bearer valid-token' } },
      };
      jest.spyOn(GqlExecutionContext.prototype, 'getContext').mockImplementation(() => mockContext);

      const result = await resolver.conversation(conversationId);

      expect(result).toEqual(expectedConversation);
    });

    it('should return null if conversation id does not exist when authorized', async () => {
      const conversationId = 3;

      // Mock the request with authorization header
      const mockContext = {
        req: { headers: { authorization: 'Bearer valid-token' } },
      };
      jest.spyOn(GqlExecutionContext.prototype, 'getContext').mockImplementation(() => mockContext);

      const result = await resolver.conversation(conversationId);

      expect(result).toBeNull();
    });
  });

  describe('conversations', () => {
    it('should return all conversations when authorized', async () => {
      // Mock the request with authorization header
      const mockContext = {
        req: { headers: { authorization: 'Bearer valid-token' } },
      };
      jest.spyOn(GqlExecutionContext.prototype, 'getContext').mockImplementation(() => mockContext);

      const result = await resolver.conversations();

      expect(result).toEqual(conversationsArray);
    });
  });
});
