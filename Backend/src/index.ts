import 'dotenv/config';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import cors from 'cors';
import jwt from 'jsonwebtoken';

import { connectDB } from './config/db.js';
import { typeDefs } from './graphql/typeDefs.js';
import { resolvers, ApolloContext } from './graphql/resolvers.js';

const app = express();
await connectDB();

const apolloServer = new ApolloServer<ApolloContext>({
    typeDefs,
    resolvers
});
await apolloServer.start();

app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(apolloServer, {
        context: async ({ req }): Promise<ApolloContext> => {
            // 1. Grab the Authorization header
            const authHeader = req.headers.authorization || '';

            // 2. NEW: Grab the workspace ID from custom headers (Express lowercases headers automatically)
            const workspaceId = req.headers['x-workspace-id'] as string | undefined;

            // 3. If there's no token, return context with only workspaceId (Login/Register still works)
            if (!authHeader.startsWith('Bearer ')) {
                return { workspaceId };
            }

            // 4. Extract and verify the token
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

                // 5. Combine the secure identity from the JWT with the workspace route from the header
                return {
                    userId: decoded.userId,
                    role: decoded.role,
                    workspaceId: workspaceId, // Now injected dynamically per-request!
                };
            } catch (err) {
                // If the token is expired or fake, reject auth but keep workspace context just in case
                console.warn('⚠️ Invalid or expired token rejected.');
                return { workspaceId };
            }
        },
    })
);

app.listen(4000, () => {
    console.log('🚀 AkashixCore Server ready at http://localhost:4000/graphql');
});