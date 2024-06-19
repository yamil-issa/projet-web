import { Args, Int, Mutation } from "@nestjs/graphql";
import { Conversation } from "src/entities/conversation.entity";
import { usersArray, conversationsArray } from "src/graphql/data";


export class CreateConversationMutation {

  private users = usersArray;
  private conversations = conversationsArray;

  @Mutation(() => Conversation)
  async createConversation(
    @Args('userId1', { type: () => Int }) userId1: number,
    @Args('userId2', { type: () => Int }) userId2: number,
  ): Promise<Conversation> {
    const user1 = this.users.find(user => user.id === userId1);
    const user2 = this.users.find(user => user.id === userId2);

    if (!user1 || !user2) {
      throw new Error('User not found');
    }

    const newConversation: Conversation = {
      id: this.conversations.length + 1,
      participants: [user1, user2],
      messages: [],
      startedAt: new Date().toISOString(),
    };

    this.conversations.push(newConversation);

    user1.conversations.push(newConversation);
    user2.conversations.push(newConversation);

    return newConversation;
  }
}
