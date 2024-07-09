import React from 'react';
import { useAuth0, RedirectLoginOptions } from '@auth0/auth0-react';

interface CustomRedirectLoginOptions extends RedirectLoginOptions {
  screen_hint?: string;
}

const Signup: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  const handleSignup = () => {
    const options: CustomRedirectLoginOptions = {
      screen_hint: 'signup',
    };
    loginWithRedirect(options);
  };

  return (
    <div>
      <h2>Signup</h2>
      <button onClick={handleSignup}>
        Sign Up
      </button>
    </div>
  );
};

export default Signup;
