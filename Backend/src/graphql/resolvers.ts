import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Character } from '../models/character.js';
import { User } from '../models/user.js';

export interface ApolloContext {
    userId?: string;
    workspaceId?: string;
    role?: string;
}

export const resolvers = {
    Query: {
        serverStatus: () => 'AkashixCore Backend Online',

        getCharacters: async (_parent: any, _args: any, context: ApolloContext) => {
            if (!context.workspaceId) throw new Error('Unauthorized: Missing workspace ID');
            return await Character.find({ workspaceId: context.workspaceId });
        },
    },

    Mutation: {
        // --- AUTHENTICATION ---
        register: async (_parent: any, args: any) => {
            const { name, email, password, workspaceId } = args;

            // 1. Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error('A user with this email already exists.');
            }

            // 2. Hash the password (12 rounds of salt is the current enterprise standard)
            const passwordHash = await bcrypt.hash(password, 12);

            // 3. Save the new user to the database
            const user = new User({
                name,
                email,
                passwordHash,
                workspaceId,
                role: 'OWNER' // First user in a workspace is the owner
            });
            await user.save();

            // 4. Generate the JWT containing the user's core identity and tenant ID
            const token = jwt.sign(
                { userId: user.id, workspaceId: user.workspaceId, role: user.role },
                process.env.JWT_SECRET as string,
                { expiresIn: '7d' } // Token expires in 7 days
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
    },
};