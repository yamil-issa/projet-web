import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client';

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URL || 'https://nestjs-app-latest.onrender.com/api',
  cache: new InMemoryCache()
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
);


reportWebVitals();