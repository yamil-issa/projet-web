import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_CONVERSATIONS = gql`
  query GetConversations {
    conversations {
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
  const { loading, error, data } = useQuery(GET_CONVERSATIONS);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (data && data.conversations) {
      setConversations(data.conversations);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

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
          <div className="conversation-time">{new Date(conversation.startedAt).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
};

export default ConversationsList;
