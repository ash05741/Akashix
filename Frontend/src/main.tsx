import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink
} from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import App from './App';
import './index.css';

// 1. Point to your LIVE Render backend
const httpLink = new HttpLink({
  uri: 'https://akashix-backend.onrender.com/graphql'
});

// 2. Intercept requests to inject BOTH the JWT and the Workspace ID
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('akashix_token');

  // Grab the workspace ID from local storage
  const workspaceId = localStorage.getItem('workspaceId');

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
      // Inject the workspace ID into the custom header
      'x-workspace-id': workspaceId || '',
    }
  });

  return forward(operation);
});

// 3. Initialize the client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);