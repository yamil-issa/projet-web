import { forwardRef, Module } from '@nestjs/common';
import { HelloResolver } from '../resolvers/hello.resolver';
import { UserResolver } from '../resolvers/user.resolver';
import { MessageResolver } from '../resolvers/message.resolver';
import { ConversationResolver } from '../resolvers/conversation.resolver';
import { BullMqModule } from '../infrastructure/bullmq/bullmq.module';
import { RedisConfigModule } from 'src/infrastructure/configuration/redis.config.module';
import { CreateConversationMutation } from 'src/mutations/conversation/createConversation';
import { SendMessageMutation } from 'src/mutations/message/sendMessage';
import { AuthModule } from 'src/auth/auth.module';
import { MessagesGateway } from 'src/infrastructure/gateways/messages.gateway';

@Module({
  imports: [BullMqModule, RedisConfigModule, AuthModule, forwardRef(() => GraphqlModule),],
  providers: [
    HelloResolver,
    UserResolver,
    MessageResolver,
    ConversationResolver,
    CreateConversationMutation,
    MessagesGateway,
    SendMessageMutation,
  ],
  exports: [MessagesGateway],
})
export class GraphqlModule {}
