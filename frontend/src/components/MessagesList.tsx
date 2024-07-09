import React from 'react';
import { gql, useQuery } from '@apollo/client';

const GET_MESSAGES = gql`
  query GetMessages($conversationId: Int!) {
    conversationMessages(id: $conversationId) {
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
  const { loading, error, data } = useQuery<{ conversationMessages: Message[] }>(GET_MESSAGES, {
    variables: { conversationId },
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Make a copy of the messages array and sort it by date, from the oldest to the newest
  const sortedMessages = [...(data?.conversationMessages || [])].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="messages-list">
      {sortedMessages.map((message) => (
        <div key={message.id} className="message">
          <div className="message-text">{message.content}</div>
          <div className="message-time">{new Date(message.createdAt).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
};

export default MessagesList;
