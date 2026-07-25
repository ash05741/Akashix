export const typeDefs = `#graphql
  # --- Existing Character Types ---
  type Stats {
    strength: Int!
    agility: Int!
    intelligence: Int!
  }

  type Character {
    id: ID!
    workspaceId: String!
    name: String!
    role: String!
    stats: Stats!
    has3DModel: Boolean!
    createdAt: String!
    updatedAt: String!
  }
    type Lore {
  id: ID!
  title: String!
  category: String!
  summary: String
  content: String
  workspaceId: ID!
  createdAt: String
  updatedAt: String
}

extend type Query {
  getAllLore: [Lore!]!
  getLoreByCategory(category: String!): [Lore!]!
}

extend type Mutation {
  createLore(title: String!, category: String!, summary: String, content: String): Lore!
  deleteLore(id: ID!): Boolean!
}

  input StatsInput {
    strength: Int
    agility: Int
    intelligence: Int
  }

  # --- New Auth Types ---
  type User {
    id: ID!
    name: String!
    email: String!
    workspaceId: String!
    role: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    serverStatus: String!
    getCharacters: [Character!]!
  }

  type Mutation {
    # Existing
    createCharacter(name: String!, role: String!, has3DModel: Boolean, stats: StatsInput): Character!
    
    deleteCharacter(id: ID!): Boolean!

    # New Auth Mutations
    register(name: String!, email: String!, password: String!, workspaceName: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload!
  }
`;