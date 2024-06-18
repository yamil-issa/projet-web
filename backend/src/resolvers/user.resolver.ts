import { Resolver, Query, Int, Args } from '@nestjs/graphql';
import { Conversation } from 'src/graphql/entities/conversation.entity';
import { User } from 'src/graphql/entities/user.entity';

@Resolver()
export class UserResolver { 
    // array of users
    private users = [
        {
            id: 1,
            username: 'john_doe',
            email: 'doe@gmail.com',
            password: '123',
            conversations: [],
        },
        {
            id: 2,
            username: 'jane_doe',
            email: 'jane@gmail.com',
            password: '456',
            conversations: [],
        },
    ];

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
