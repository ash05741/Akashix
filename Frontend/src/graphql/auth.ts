import { gql } from '@apollo/client';

export const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!, $workspaceName: String!) {
    register(name: $name, email: $email, password: $password, workspaceName: $workspaceName) {
      token
      user {
        id
        name
        email
        workspaceId
        role
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        workspaceId
        role
      }
    }
  }
`;