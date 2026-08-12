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

  # --- NEW: Workspace Type ---
  type Workspace {
    id: ID!
    name: String!
    description: String
    ownerId: ID!
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
    # REMOVED: workspaceId: String! (User is no longer tied to one workspace)
    role: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    serverStatus: String!
    
    # Existing
    getCharacters: [Character!]!
    getAllLore: [Lore!]!
    getLoreByCategory(category: String!): [Lore!]!
    
    # NEW: Fetch workspaces for the logged-in user
    getMyWorkspaces: [Workspace!]!
  }

  type Mutation {
    # Existing Characters
    createCharacter(name: String!, role: String!, has3DModel: Boolean, stats: StatsInput): Character!
    deleteCharacter(id: ID!): Boolean!

    # Existing Lore
    createLore(title: String!, category: String!, summary: String, content: String): Lore!
    deleteLore(id: ID!): Boolean!
    enhanceLore(text: String!): String!

    # Auth Mutations (Removed workspaceName from register)
    register(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload!
    
    # NEW: Workspace Mutation
    createWorkspace(name: String!, description: String): Workspace!
  }
`;