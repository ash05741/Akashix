import { gql } from '@apollo/client';

export const GET_CHARACTERS = gql`
  query GetCharacters {
    getCharacters {
      id
      name
      role
      stats {
        strength
        agility
        intelligence
      }
    }
  }
`;

export const CREATE_CHARACTER = gql`
  mutation CreateCharacter($name: String!, $role: String!, $stats: StatsInput) {
    createCharacter(name: $name, role: $role, stats: $stats) {
      id
      name
      role
      stats {
        strength
        agility
        intelligence
      }
    }
  }
`;

export const DELETE_CHARACTER = gql`
  mutation DeleteCharacter($id: ID!) {
    deleteCharacter(id: $id)
  }
`;