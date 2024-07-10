import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ConversationsList from './components/ConversationsList';
import MessagesList from './components/MessagesList';
import SendMessageForm from './components/SendMessageForm';
import CreateConversationForm from './components/CreateConversationForm';
import Login from './components/Login';
import Signup from './components/Signup';
import LogoutButton from './components/LogoutButton';
import { AuthProvider, AuthContext } from './context/AuthContext';
import './App.css';

const App: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <div className="app">
                  <div className="sidebar">
                    <LogoutButton />
                    <CreateConversationForm />
                    <ConversationsList onSelectConversation={setSelectedConversation} />
                  </div>
                  <div className="main">
                    {selectedConversation ? (
                      <>
                        <MessagesList conversationId={selectedConversation} />
                        <SendMessageForm conversationId={selectedConversation} />
                      </>
                    ) : (
                      <div>Select a conversation to start chatting</div>
                    )}
                  </div>
                </div>
              </RequireAuth>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(false);
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default App;
