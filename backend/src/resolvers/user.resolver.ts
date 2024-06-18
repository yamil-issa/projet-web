import { Resolver, Query, Int, Args } from '@nestjs/graphql';
import { Conversation } from 'src/entities/conversation.entity';
import { User } from 'src/entities/user.entity';
import { usersArray } from 'src/data';

@Resolver()
export class UserResolver { 
    
    private users = usersArray;

    @Query(() => User)
    user(@Args('id', { type: () => Int }) id: number): User | null{
        // Fetch user by id
        return this.users.find((user) => user.id === id) || null;
    }

    // Query to get all conversations of a user
    @Query(() => [Conversation])
    userConversations(@Args('id', { type: () => Int }) id: number): Conversation[] {
        // Fetch user by id
        const user = this.users.find((user) => user.id === id);
        if (!user) {
            return [];
        }
        return user.conversations;
    }
}
