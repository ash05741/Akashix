import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Character } from '../models/character.js';
import { User } from '../models/user.js';
import Lore from '../models/lore.js';

// 1. Updated Import for the new unified SDK
import { GoogleGenAI } from '@google/genai';

export interface ApolloContext {
    userId?: string;
    workspaceId?: string;
    role?: string;
}

// 2. Initialize the new SDK (Removed the unused 'model' variable from here)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

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
        createCharacter: async (_: any, args: any, context: ApolloContext) => {
            // MATCHED TO LORE: Check context.workspaceId directly
            if (!context.workspaceId) {
                throw new Error("Unauthorized: No workspace ID found");
            }

            const { name, role, has3DModel, stats } = args;

            // Create and Save to Mongoose
            const newCharacter = new Character({
                workspaceId: context.workspaceId,
                name,
                role,
                has3DModel: has3DModel || false,
                stats: {
                    // If they didn't provide a specific stat, fallback to the default of 10
                    strength: stats?.strength ?? 10,
                    agility: stats?.agility ?? 10,
                    intelligence: stats?.intelligence ?? 10,
                },
            });

            await newCharacter.save();
            return newCharacter;
        },

        deleteCharacter: async (_: any, { id }: { id: string }, context: ApolloContext) => {
            // 1. Check auth exactly like the others
            if (!context.workspaceId) {
                throw new Error("Unauthorized: No workspace ID found");
            }

            // 2. Find it and make sure it belongs to this workspace (security measure)
            const character = await Character.findOne({ _id: id, workspaceId: context.workspaceId });
            if (!character) {
                throw new Error("Character not found or you don't have permission to delete it.");
            }

            // 3. Delete it
            await Character.findByIdAndDelete(id);
            return true; // Matches the Boolean! in typeDefs
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
        },

        // 3. Updated AI Mutation using the new SDK syntax
        enhanceLore: async (_: any, { text }: { text: string }) => {
            try {
                const prompt = `
                    You are a strict copyeditor. Fix the grammar, spelling, and punctuation of the following text. 
                    Do NOT change the creative tone, do NOT add new plot points, and do NOT change character names. 
                    Return ONLY the corrected text, with no introductory or concluding remarks.
                    
                    Text:
                    ${text}
                `;

                const response = await ai.models.generateContent({
                    model: "gemini-3.6-flash",
                    contents: prompt
                });

                if (!response.text) {
                    throw new Error("No text returned from AI");
                }

                return response.text.trim();

            } catch (error) {
                console.error("AI Enhancement Error:", error);
                throw new Error("Failed to enhance text.");
            }
        }
    },
};