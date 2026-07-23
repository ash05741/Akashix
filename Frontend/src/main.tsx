import React from 'react';
import ReactDOM from 'react-dom/client';
// Everything imports cleanly from the core package now
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink
} from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react'; // <-- Direct React import
import App from './App';
import './index.css'; // Make sure this points to your Tailwind file

// 1. Point to your local backend using the modern HttpLink class
const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql'
});

// 2. Use ApolloLink to intercept requests and inject the JWT
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('akashix_token');

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
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