import { gql } from '@apollo/client';

export const GET_CHARACTERS = gql`
  query GetCharacters {
    getCharacters {
      id
      name
      stats {
        strength
        agility
        intelligence
      }
    }
  }
`;
export const CREATE_CHARACTER = gql`
  mutation CreateCharacter($name: String!) {
    createCharacter(name: $name) {
      id
      name
      stats {
        strength
        agility
        intelligence
      }
    }
  }
`;