import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

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
  const [sendMessage] = useMutation(SEND_MESSAGE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendMessage({ variables: { conversationId, userId: 1, content: message } }); // Remplacez `userId: 1` par l'ID de l'utilisateur actuel
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
