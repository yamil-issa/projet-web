import React, { useState } from 'react';
import ConversationsList from './components/ConversationsList';
import MessagesList from './components/MessagesList';
import SendMessageForm from './components/SendMessageForm';
import CreateConversationForm from './components/CreateConversationForm';
import './App.css';

const App: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);

  return (
    <div className="app">
      <div className="sidebar">
        <ConversationsList onSelectConversation={setSelectedConversation} />
        <CreateConversationForm />
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
  );
}

export default App;
