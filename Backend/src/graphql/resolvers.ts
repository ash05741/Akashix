import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Character } from '../models/character.js';
import { User } from '../models/user.js';
import Lore from '../models/lore.js';

export interface ApolloContext {
    userId?: string;
    workspaceId?: string;
    role?: string;
}

export const resolvers = {
    Query: {
        serverStatus: () => 'AkashixCore Backend Online',

        // --- CHARACTERS ---
        getCharacters: async (_parent: any, _args: any, context: ApolloContext) => {
            if (!context.workspaceId) throw new Error('Unauthorized: Missing workspace ID');
            return await Character.find({ workspaceId: context.workspaceId });
        },

        // --- LORE ---
        getAllLore: async (_parent: any, _args: any, context: ApolloContext) => {
            if (!context.workspaceId) throw new Error('Unauthorized: Missing workspace ID');
            // Sorting by createdAt descending puts the newest lore at the top
            return await Lore.find({ workspaceId: context.workspaceId }).sort({ createdAt: -1 });
        },

        getLoreByCategory: async (_parent: any, { category }: { category: string }, context: ApolloContext) => {
            if (!context.workspaceId) throw new Error('Unauthorized: Missing workspace ID');
            return await Lore.find({ workspaceId: context.workspaceId, category }).sort({ createdAt: -1 });
        },
    },

    Mutation: {
        // --- AUTHENTICATION ---
        register: async (_parent: any, args: any) => {
            // 1. Extract workspaceName from the GraphQL args
            const { name, email, password, workspaceName } = args;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error('A user with this email already exists.');
            }

            const passwordHash = await bcrypt.hash(password, 12);

            const user = new User({
                name,
                email,
                passwordHash,
                // 2. Give Mongoose the key it is begging for (workspaceId), 
                // but feed it the value from the schema (workspaceName)
                workspaceId: workspaceName,
                role: 'OWNER'
            });
            await user.save();

            const token = jwt.sign(
                { userId: user.id, workspaceId: user.workspaceId, role: user.role },
                process.env.JWT_SECRET as string,
                { expiresIn: '7d' }
            );

            return { token, user };
        },

        login: async (_parent: any, args: any) => {
            const { email, password } = args;

            // 1. Find the user
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('Invalid credentials.');
            }

            // 2. Compare passwords
            const isValid = await bcrypt.compare(password, user.passwordHash);
            if (!isValid) {
                throw new Error('Invalid credentials.');
            }

            // 3. Generate the JWT
            const token = jwt.sign(
                { userId: user.id, workspaceId: user.workspaceId, role: user.role },
                process.env.JWT_SECRET as string,
                { expiresIn: '7d' }
            );

            return { token, user };
        },

        // --- CHARACTER MANAGEMENT ---
        createCharacter: async (_parent: any, args: any, context: ApolloContext) => {
            if (!context.workspaceId) throw new Error('Unauthorized: Missing workspace ID');

            const newCharacter = new Character({
                ...args,
                workspaceId: context.workspaceId,
                stats: args.stats || { strength: 10, agility: 10, intelligence: 10 }
            });

            return await newCharacter.save();
        },

        // --- LORE MANAGEMENT ---
        createLore: async (_parent: any, args: any, context: ApolloContext) => {
            if (!context.workspaceId) throw new Error('Unauthorized: Missing workspace ID');

            const newLore = new Lore({
                ...args,
                workspaceId: context.workspaceId
            });

            return await newLore.save();
        },

        deleteLore: async (_parent: any, { id }: { id: string }, context: ApolloContext) => {
            if (!context.workspaceId) throw new Error('Unauthorized: Missing workspace ID');

            // Scoped to workspaceId so tenants cannot delete each other's lore
            const result = await Lore.findOneAndDelete({ _id: id, workspaceId: context.workspaceId });

            if (!result) {
                throw new Error('Lore entry not found or unauthorized to delete.');
            }

            return true;
        }
    },
};