import React, { useEffect, useState, useContext } from 'react';
import { useQuery, gql } from '@apollo/client';
import { AuthContext } from '../context/AuthContext';

const GET_USER_CONVERSATIONS = gql`
  query GetUserConversations($id: Int!) {
    userConversations(id: $id) {
      id
      participants {
        id
        username
      }
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
      startedAt
    }
  }
`;

interface User {
  id: number;
  username: string;
}

interface Message {
  id: number;
  content: string;
  createdAt: string;
  author: User;
}

interface Conversation {
  id: number;
  participants: User[];
  messages: Message[];
  startedAt: string;
}

interface ConversationsListProps {
  onSelectConversation: (id: number) => void;
}

const ConversationsList: React.FC<ConversationsListProps> = ({ onSelectConversation }) => {
  const { user } = useContext(AuthContext);

  const { loading, error, data } = useQuery(GET_USER_CONVERSATIONS, {
    variables: { id: user?.sub },
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  });

  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (data && data.userConversations) {
      setConversations(data.userConversations);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;

  if (error) {
    console.error('Error loading conversations:', error);
    return <p>Error loading conversations: {error.message}</p>;
  }

  if (!conversations.length) return <p>No conversations found.</p>;

  return (
    <div className="conversations-list">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className="conversation"
          onClick={() => onSelectConversation(conversation.id)}
        >
          <div className="conversation-info">
            <div className="conversation-name">
              {conversation.participants.map(p => p.username).join(', ')}
            </div>
            <div className="conversation-message">
              {conversation.messages.length > 0
                ? conversation.messages[conversation.messages.length - 1].content
                : 'No messages yet'}
            </div>
          </div>
          <div className="conversation-time">
            {new Date(conversation.startedAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationsList;
