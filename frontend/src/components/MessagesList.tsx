import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import io from 'socket.io-client';

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
  const { loading, error, data, refetch } = useQuery<{ conversationMessages: Message[] }>(GET_MESSAGES, {
    variables: { conversationId },
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  });
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (data) {
      const sortedMessages = [...data.conversationMessages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      setMessages(sortedMessages);
    }
  }, [data]);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SOCKET_URL as string || 'https://nestjs-app-latest.onrender.com');

    socket.emit('joinConversation', conversationId);

    socket.on('newMessage', (message: Message) => {
      setMessages(prevMessages => [...prevMessages, message].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ));
    });

    return () => {
      socket.disconnect();
    };
  }, [conversationId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="messages-list">
      {messages.map((message) => (
        <div key={message.id} className="message">
          <div className="message-text">{message.content}</div>
          <div className="message-time">{new Date(message.createdAt).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
};

export default MessagesList;
