import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import styled from 'styled-components';

const LogoutButton: React.FC = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <Button onClick={handleLogout}>
      Logout
    </Button>
  );
};

const Button = styled.button`
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
`;

export default LogoutButton;
