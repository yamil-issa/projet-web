import { Test, TestingModule } from '@nestjs/testing';
import { ConversationResolver } from '../src/resolvers/conversation.resolver';
import { Conversation } from '../src/entities/conversation.entity';
import { RedisConfig } from '../src/infrastructure/configuration/redis.config';
import { CreateConversationMutation } from '../src/mutations/conversation/createConversation';
import { SendMessageMutation } from '../src/mutations/message/sendMessage';
import { BullQueueProvider } from '../src/infrastructure/bullmq/bullQueue.provider';

describe('ConversationResolver', () => {
  let resolver: ConversationResolver;
  let redisConfig: RedisConfig;

  const conversationsArray: Conversation[] = [
    { id: 1, participantIds: [1, 2], messages: [], startedAt: '2024-07-08T11:30:00.000Z' },
    { id: 2, participantIds: [2, 3], messages: [], startedAt: '2024-07-08T12:30:00.000Z' },
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
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('conversation', () => {
    it('should return a conversation by id', async () => {
      const conversationId = 1;
      const expectedConversation = conversationsArray.find((conv) => conv.id === conversationId) as Conversation;

      const result = await resolver.conversation(conversationId);

      expect(result).toEqual(expectedConversation);
    });

    it('should return null if conversation id does not exist', async () => {
      const conversationId = 3;

      const result = await resolver.conversation(conversationId);

      expect(result).toBeNull();
    });
  });

  describe('conversations', () => {
    it('should return all conversations', async () => {
      const result = await resolver.conversations();

      expect(result).toEqual(conversationsArray);
    });
  });
});
