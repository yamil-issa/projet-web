import React from 'react';
import { gql, useQuery } from '@apollo/client';

const GET_MESSAGES = gql`
  query GetMessages($conversationId: Int!) {
    conversation(id: $conversationId) {
      messages {
        id
        content
        createdAt
        author {
          id
          username
          email
        }
      }
    }
  }
`;

interface Message {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    username: string;
    email: string;
  };
}

interface MessagesListProps {
  conversationId: number;
}

const MessagesList: React.FC<MessagesListProps> = ({ conversationId }) => {
  const { loading, error, data } = useQuery<{ conversation: { messages: Message[] } }>(GET_MESSAGES, {
    variables: { conversationId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="messages-list">
      {data?.conversation.messages.map((message) => (
        <div key={message.id} className="message">
          <div className="message-text">{message.content}</div>
          <div className="message-time">{message.createdAt}</div>
        </div>
      ))}
    </div>
  );
};

export default MessagesList;
