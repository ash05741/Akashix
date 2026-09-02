import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Character } from '../models/character.js';
import { User } from '../models/user.js';
import Lore from '../models/lore.js';
import { Workspace } from '../models/workspace.js';

import { GoogleGenAI } from '@google/genai';

export interface ApolloContext {
    userId?: string;
    workspaceId?: string;
    role?: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const resolvers = {
    Query: {
        serverStatus: () => 'AkashixCore Backend Online',

        // --- WORKSPACES ---
        getMyWorkspaces: async (_parent: any, _args: any, context: ApolloContext) => {
            if (!context.userId) throw new Error('Unauthorized: Missing User ID');
            // Fetch all workspaces owned by the currently logged-in user
            return await Workspace.find({ ownerId: context.userId }).sort({ createdAt: -1 });
        },

        getWorkspace: async (_parent: any, { id }: { id: string }, context: ApolloContext) => {
            if (!context.userId) throw new Error('Unauthorized');
            const workspace = await Workspace.findOne({ _id: id, ownerId: context.userId });
            if (!workspace) throw new Error('Workspace not found');
            return workspace;
        },

        // --- SOCIAL & DISCOVERY (NEW) ---
        searchUsers: async (_parent: any, { query }: { query: string }, context: ApolloContext) => {
            if (!context.userId) throw new Error('Unauthorized: Authentication required');

            // Search users by name, case-insensitive, limited to 10 results
            return await User.find({
                name: { $regex: query, $options: 'i' }
            }).limit(10);
        },

        getUserProfile: async (_parent: any, { userId }: { userId: string }, context: ApolloContext) => {
            if (!context.userId) throw new Error('Unauthorized: Authentication required');

            // 1. Fetch the target user
            const targetUser = await User.findById(userId);
            if (!targetUser) throw new Error('User not found');

            // 2. Fetch ONLY their public workspaces using your ownerId field
            const publicWorkspaces = await Workspace.find({
                ownerId: userId,
                isPublic: true
            });

            // 3. Return the bundled profile shape expected by GraphQL
            return {
                user: targetUser,
                publicWorkspaces: publicWorkspaces
            };
        },

        // --- CHARACTERS ---
        getCharacters: async (_parent: any, _args: any, context: ApolloContext) => {
            if (!context.workspaceId) throw new Error('Unauthorized: Missing workspace ID');
            return await Character.find({ workspaceId: context.workspaceId }).populate('relatedLore');
        },

        // --- LORE ---
        getAllLore: async (_parent: any, _args: any, context: ApolloContext) => {
            if (!context.workspaceId) throw new Error('Unauthorized: Missing workspace ID');
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
            const { name, email, password } = args;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error('A user with this email already exists.');
            }

            const passwordHash = await bcrypt.hash(password, 12);

            const user = new User({
                name,
                email,
                passwordHash,
                role: 'OWNER'
            });
            await user.save();

            const token = jwt.sign(
                { userId: user.id, role: user.role },
                process.env.JWT_SECRET as string,
                { expiresIn: '7d' }
            );

            return { token, user };
        },

        login: async (_parent: any, args: any) => {
            const { email, password } = args;

            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('Invalid credentials.');
            }

            const isValid = await bcrypt.compare(password, user.passwordHash);
            if (!isValid) {
                throw new Error('Invalid credentials.');
            }

            const token = jwt.sign(
                { userId: user.id, role: user.role },
                process.env.JWT_SECRET as string,
                { expiresIn: '7d' }
            );

            return { token, user };
        },

        // --- WORKSPACE MANAGEMENT ---
        createWorkspace: async (_parent: any, { name, description }: { name: string, description?: string }, context: ApolloContext) => {
            if (!context.userId) throw new Error('Unauthorized: Missing User ID');

            const newWorkspace = new Workspace({
                name,
                description,
                ownerId: context.userId
            });

            return await newWorkspace.save();
        },

        updateWorkspacePrivacy: async (_parent: any, { id, isPublic }: { id: string, isPublic: boolean }, context: ApolloContext) => {
            if (!context.userId) throw new Error('Unauthorized');

            const workspace = await Workspace.findOneAndUpdate(
                { _id: id, ownerId: context.userId },
                { isPublic },
                { new: true }
            );

            if (!workspace) throw new Error('Workspace not found or unauthorized');
            return workspace;
        },

        deleteWorkspace: async (_parent: any, { id }: { id: string }, context: ApolloContext) => {
            if (!context.userId) throw new Error('Unauthorized: Missing User ID');

            const workspace = await Workspace.findOne({ _id: id, ownerId: context.userId });
            if (!workspace) {
                throw new Error('Workspace not found or unauthorized to delete.');
            }

            await Character.deleteMany({ workspaceId: id });
            await Lore.deleteMany({ workspaceId: id });

            await Workspace.findByIdAndDelete(id);

            return true;
        },

        // --- CHARACTER MANAGEMENT ---
        createCharacter: async (_: any, args: any, context: ApolloContext) => {
            if (!context.workspaceId) {
                throw new Error("Unauthorized: No workspace ID found");
            }

            // FIXED: We extracted relatedLoreIds from the incoming args!
            const { name, role, has3DModel, stats, relatedLore } = args;

            const newCharacter = new Character({
                workspaceId: context.workspaceId,
                name,
                role,
                has3DModel: has3DModel || false,
                stats: {
                    strength: stats?.strength ?? 10,
                    agility: stats?.agility ?? 10,
                    intelligence: stats?.intelligence ?? 10,
                },
                relatedLore: relatedLore || []
            });

            await newCharacter.save();

            // FIXED: We populate the lore data before sending it back to the frontend
            return await newCharacter.populate('relatedLore');
        },

        deleteCharacter: async (_: any, { id }: { id: string }, context: ApolloContext) => {
            if (!context.workspaceId) {
                throw new Error("Unauthorized: No workspace ID found");
            }

            const character = await Character.findOne({ _id: id, workspaceId: context.workspaceId });
            if (!character) {
                throw new Error("Character not found or you don't have permission to delete it.");
            }

            await Character.findByIdAndDelete(id);
            return true;
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

            const result = await Lore.findOneAndDelete({ _id: id, workspaceId: context.workspaceId });

            if (!result) {
                throw new Error('Lore entry not found or unauthorized to delete.');
            }

            return true;
        },

        // --- AI TOOLS ---
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