import React, { useState } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/', {
        query: `
         mutation CreateUser($createUserInput: CreateUserInput!) {
            createUser(createUserInput: $createUserInput) {
              id
              username
              email
            }
          }
        `,
        variables: { createUserInput : {username, email, password } },  
      });

      navigate('/login');
    } catch (err) {
      setError('Error signing up');
    }
  };

  return (
    <SignupContainer>
      <SignupForm onSubmit={handleSignup}>
        <Title>Signup</Title>
        <div>
          <Label>Username:</Label>
          <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <Label>Email:</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label>Password:</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit">Signup</Button>
      </SignupForm>
      <p>
        Already have an account? <StyledLink to="/login">Login</StyledLink>
      </p>
    </SignupContainer>
  );
};

// component style
const SignupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f7f7f7;
`;

const SignupForm = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  color: #333;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1rem;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  background-color: #19a3e8;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #1482b6;
  }
`;

const StyledLink = styled(Link)`
  color: #19a3e8;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export default Signup;
