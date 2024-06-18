import { Args, Int, Mutation } from "@nestjs/graphql";
import { usersArray, conversationsArray, messagesArray } from "src/data";
import { Message } from "src/entities/message.entity";


export class SendMessageMutation {

  private users = usersArray;
  private conversations = conversationsArray;
  private messages = messagesArray;

  @Mutation(() => Message)
  async sendMessage(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('conversationId', { type: () => Int }) conversationId: number,
    @Args('content', { type: () => String }) content: string,
  ): Promise<Message> {
    const user = this.users.find(user => user.id === userId);
    const conversation = this.conversations.find(conversation => conversation.id === conversationId);

    if (!user || !conversation) {
        throw new Error('User or Conversation not found');
      }

    const newMessage: Message = {
      id: this.messages.length + 1,
      content: content,
      createdAt: new Date().toISOString(),
      author: user,
    };

    this.messages.push(newMessage);
    conversation.messages.push(newMessage);

    return newMessage;
  }
}
