import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const CREATE_CONVERSATION = gql`
  mutation CreateConversation($userId1: Int!, $userId2: Int!) {
    createConversation(userId1: $userId1, userId2: $userId2) {
      id
      participantIds
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

const CreateConversationForm: React.FC = () => {
  const [newConversationUserId, setNewConversationUserId] = useState('');
  const [createConversation] = useMutation(CREATE_CONVERSATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createConversation({ variables: { userId1: 1, userId2: parseInt(newConversationUserId) } }); // Remplacez `userId1: 1` par l'ID de l'utilisateur actuel
      setNewConversationUserId('');
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  return (
    <form className="create-conversation-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={newConversationUserId}
        onChange={(e) => setNewConversationUserId(e.target.value)}
        placeholder="User ID to start conversation with..."
      />
      <button type="submit">Create</button>
    </form>
  );
};

export default CreateConversationForm;
