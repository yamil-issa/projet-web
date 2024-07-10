import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import io from 'socket.io-client';
import styled from 'styled-components';

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

  const userId = Number(localStorage.getItem('userId'));
  console.log(`Logged in userId: ${userId}`); // Debugging log

  return (
    <MessagesContainer>
      {messages.map((message) => {
        const isAuthor = message.author.id === userId;
        console.log(`Message ID: ${message.id}, isAuthor: ${isAuthor}, Author ID: ${message.author.id}`); // Debugging log
        return (
          <MessageBubble key={message.id} $isAuthor={isAuthor}>
            <Avatar>{message.author.username[0]}</Avatar>
            <MessageContentWrapper>
              <MessageContent $isAuthor={isAuthor}>
                <MessageHeader>
                  <Username>{message.author.username}</Username>
                  <MessageTime>{new Date(message.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric' })}</MessageTime>
                </MessageHeader>
                <MessageText>{message.content}</MessageText>
              </MessageContent>
            </MessageContentWrapper>
          </MessageBubble>
        );
      })}
    </MessagesContainer>
  );
};

export default MessagesList;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #f7f7f7;
`;

const MessageBubble = styled.div<{ $isAuthor: boolean }>`
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  flex-direction: ${({ $isAuthor }) => ($isAuthor ? 'row' : 'row-reverse')};
  margin-right: ${({ $isAuthor }) => ($isAuthor ? '0' : '70%')};
  justify-content: ${({ $isAuthor }) => ($isAuthor ? 'flex-end' : 'flex-start')};
  margin-bottom: 1.5rem;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #19a3e8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  margin: 0 10px;
`;

const MessageContentWrapper = styled.div`
  max-width: 60%;
`;

const MessageContent = styled.div<{ $isAuthor: boolean }>`
  background-color: ${({ $isAuthor }) => ($isAuthor ? '#e6f7ff' : '#fff')};
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;

const Username = styled.div`
  font-weight: bold;
`;

const MessageTime = styled.div`
  font-size: 0.8em;
  color: #999;
`;

const MessageText = styled.div`
  margin-top: 5px;
  word-wrap: break-word;
  white-space: pre-wrap;
`;
