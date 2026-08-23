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
    relatedLore: [Lore]
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

  # --- Workspace Type ---
  type Workspace {
    id: ID!
    name: String!
    description: String
    ownerId: ID!
    isPublic: Boolean! # <-- NEW: Privacy flag
    createdAt: String
    updatedAt: String
  }

  input StatsInput {
    strength: Int
    agility: Int
    intelligence: Int
  }

  # --- Auth Types ---
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  # --- NEW: Social Profile Type ---
  type UserProfile {
    user: User!
    publicWorkspaces: [Workspace!]!
  }

  type Query {
    serverStatus: String!

    getWorkspace(id: ID!): Workspace!
    
    # Existing
    getCharacters: [Character!]!
    getAllLore: [Lore!]!
    getLoreByCategory(category: String!): [Lore!]!
    
    # Workspaces
    getMyWorkspaces: [Workspace!]!

    # NEW: Social & Discovery
    searchUsers(query: String!): [User!]!
    getUserProfile(userId: ID!): UserProfile!
  }

  type Mutation {
    # Existing Characters
    createCharacter(name: String!, role: String!, has3DModel: Boolean, stats: StatsInput, relatedLore: [ID!]): Character!
    deleteCharacter(id: ID!): Boolean!

    # Existing Lore
    createLore(title: String!, category: String!, summary: String, content: String): Lore!
    deleteLore(id: ID!): Boolean!
    enhanceLore(text: String!): String!

    # Auth Mutations
    register(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload!
    
    # Workspace Mutation
    createWorkspace(name: String!, description: String): Workspace!
    updateWorkspacePrivacy(id: ID!, isPublic: Boolean!): Workspace!
  }
`;