import { Conversation } from "../entities/conversation.entity";
import { Message } from "../entities/message.entity";
import { User } from "../entities/user.entity";

export const usersArray: User[] = [
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

// array of conversations
export const conversationsArray: Conversation[] = [
  {
    id: 1,
    participants: usersArray,
    messages: [
      {
        id: 1,
        content: 'Hello Jane',
        createdAt: '2024-05-01T12:00:00Z',
        author: usersArray[0],
      },
    ],
    startedAt: '2024-05-01T12:00:00Z',
  },
];

// array of messages
export const messagesArray: Message[] = [
  {
    id: 1,
    content: 'Hello Jane',
    createdAt: '2024-05-01T12:00:00Z',
    author: usersArray[0],
  },
  {
    id: 2,
    content: 'Hello John',
    createdAt: '2024-05-01T12:05:00Z',
    author: usersArray[1],
  }
];
