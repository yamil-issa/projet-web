import { Test, TestingModule } from '@nestjs/testing';
import { MessageResolver } from '../resolvers/message.resolver';
import { Message } from '../entities/message.entity';
import { messagesArray } from '../graphql/data';

describe('MessageResolver', () => {
  let resolver: MessageResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageResolver],
    }).compile();

    resolver = module.get<MessageResolver>(MessageResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('message', () => {
    it('should return a message by id', () => {
      const messageId = 1;
      const expectedMessage = messagesArray.find((message) => message.id === messageId) as Message;
    
      const result = resolver.message(messageId);
    
      expect(result).toEqual(expectedMessage);
    });

    it('should return null if message id does not exist', () => {
      const messageId = 3;

      const result = resolver.message(messageId);

      expect(result).toBeNull();
    });
  });
});
