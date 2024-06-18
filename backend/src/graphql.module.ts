import { Module } from '@nestjs/common';
import { HelloResolver } from './resolvers/hello.resolver';
import { UserResolver } from './resolvers/user.resolver';
import { MessageResolver } from './resolvers/message.resolver';
import { ConversationResolver } from './resolvers/conversation.resolver';

@Module({
  providers: [HelloResolver, UserResolver, MessageResolver, ConversationResolver],
})
export class GraphqlModule {}
