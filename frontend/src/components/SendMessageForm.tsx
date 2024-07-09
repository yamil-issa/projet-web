import React, { useState, useContext } from 'react';
import { gql, useMutation } from '@apollo/client';
import { AuthContext } from '../context/AuthContext';

const SEND_MESSAGE = gql`
  mutation SendMessage($conversationId: Int!, $userId: Int!, $content: String!) {
    sendMessage(conversationId: $conversationId, userId: $userId, content: $content) {
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

interface SendMessageFormProps {
  conversationId: number;
}

const SendMessageForm: React.FC<SendMessageFormProps> = ({ conversationId }) => {
  const [message, setMessage] = useState('');
  const [sendMessage] = useMutation(SEND_MESSAGE, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  });
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error('User not authenticated');
      return;
    }
    try {
      await sendMessage({ variables: { conversationId, userId: user.sub, content: message } });
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <form className="send-message-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default SendMessageForm;
