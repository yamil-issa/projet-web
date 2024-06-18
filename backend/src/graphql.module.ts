import { Module } from '@nestjs/common';
import { HelloResolver } from './resolvers/hello.resolver';
import { UserResolver } from './resolvers/user.resolver';
import { MessageResolver } from './resolvers/message.resolver';
import { ConversationResolver } from './resolvers/conversation.resolver';
import { BullMqModule } from './infrastructure/bullmq/bullmq.module';
import { SendMessageMutation } from './mutations/message/sendMessage';
import { CreateConversationMutation } from './mutations/conversation/createConversation';

@Module({
  imports: [BullMqModule],
  providers: [
    HelloResolver,
    UserResolver,
    MessageResolver,
    ConversationResolver,
    SendMessageMutation,
    CreateConversationMutation,
  ],
})
export class GraphqlModule {}
