import { Module } from '@nestjs/common';
import { HelloResolver } from '../resolvers/hello.resolver';
import { UserResolver } from '../resolvers/user.resolver';
import { MessageResolver } from '../resolvers/message.resolver';
import { ConversationResolver } from '../resolvers/conversation.resolver';
import { BullMqModule } from '../infrastructure/bullmq/bullmq.module';
import { RedisConfigModule } from 'src/infrastructure/configuration/redis.config.module';
import { CreateUserMutation } from 'src/mutations/user/createUser';
import { CreateConversationMutation } from 'src/mutations/conversation/createConversation';
import { SendMessageMutation } from 'src/mutations/message/sendMessage';

@Module({
  imports: [BullMqModule, RedisConfigModule],
  providers: [
    HelloResolver,
    UserResolver,
    MessageResolver,
    ConversationResolver,
    CreateUserMutation,
    CreateConversationMutation,
    SendMessageMutation,
  ],
})
export class GraphqlModule {}
