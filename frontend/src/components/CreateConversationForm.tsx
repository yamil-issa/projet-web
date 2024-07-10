import React, { useState, useContext, useEffect } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { AuthContext } from '../context/AuthContext';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      email
    }
  }
`;

const CREATE_CONVERSATION = gql`
  mutation CreateConversation($userId1: Int!, $userId2: Int!) {
    createConversation(userId1: $userId1, userId2: $userId2) {
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

const CreateConversationForm: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [usernameSearch, setUsernameSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<{ id: number, username: string }[]>([]);

  const { data: usersData } = useQuery(GET_USERS);
  const [createConversation] = useMutation(CREATE_CONVERSATION, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  });

  useEffect(() => {
    if (usersData && usernameSearch) {
      setFilteredUsers(
        usersData.users.filter((u: { username: string }) =>
          u.username.toLowerCase().includes(usernameSearch.toLowerCase())
        )
      );
    } else {
      setFilteredUsers([]);
    }
  }, [usersData, usernameSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId && user?.sub) {
      try {
        await createConversation({
          variables: {
            userId1: user.sub,
            userId2: selectedUserId,
          },
        });
        setUsernameSearch('');
        setSelectedUserId(null);
      } catch (error) {
        console.error('Error creating conversation:', error);
      }
    }
  };

  return (
    <form className="create-conversation-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={usernameSearch}
        onChange={(e) => setUsernameSearch(e.target.value)}
        placeholder="Search username..."
      />
      {filteredUsers.length > 0 && (
        <ul className="user-list">
          {filteredUsers.map((u) => (
            <li
              key={u.id}
              className={`user-item ${selectedUserId === u.id ? 'selected' : ''}`}
              onClick={() => setSelectedUserId(u.id)}
            >
              {u.username}
            </li>
          ))}
        </ul>
      )}
      <button type="submit" disabled={!selectedUserId}>Create</button>
    </form>
  );
};

export default CreateConversationForm;
