import { Test, TestingModule } from '@nestjs/testing';
import { MessageResolver } from '../src/resolvers/message.resolver';
import { Message } from '../src/entities/message.entity';
import { RedisConfig } from '../src/infrastructure/configuration/redis.config';

describe('MessageResolver', () => {
  let resolver: MessageResolver;
  let redisConfig: RedisConfig;

  const messagesArray: Message[] = [
    { id: 1, content: 'Hello World', createdAt: '2024-07-08T11:38:25.000Z', author: { id: 1, username: 'user1', email: 'user1@example.com', password: '', conversationIds: [] } },
    { id: 2, content: 'Hello Nest', createdAt: '2024-07-08T12:38:25.000Z', author: { id: 2, username: 'user2', email: 'user2@example.com', password: '', conversationIds: [] } },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageResolver,
        {
          provide: RedisConfig,
          useValue: {
            getRedisClient: jest.fn().mockReturnValue({
              hget: jest.fn((key: string, id: string) => {
                if (key === 'messages') {
                  const message = messagesArray.find((msg) => msg.id === Number(id));
                  return message ? JSON.stringify(message) : null;
                }
                return null;
              }),
            }),
          },
        },
      ],
    }).compile();

    resolver = module.get<MessageResolver>(MessageResolver);
    redisConfig = module.get<RedisConfig>(RedisConfig);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('message', () => {
    it('should return a message by id', async () => {
      const messageId = 1;
      const expectedMessage = messagesArray.find((message) => message.id === messageId) as Message;

      const result = await resolver.message(messageId);

      expect(result).toEqual(expectedMessage);
    });

    it('should return null if message id does not exist', async () => {
      const messageId = 3;

      const result = await resolver.message(messageId);

      expect(result).toBeNull();
    });
  });
});
