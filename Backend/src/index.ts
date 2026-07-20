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
            // 1. Grab the Authorization header (e.g., "Bearer eyJhbGci...")
            const authHeader = req.headers.authorization || '';

            // 2. If there's no token, return an empty context (Login/Register will still work)
            if (!authHeader.startsWith('Bearer ')) {
                return {};
            }

            // 3. Extract and verify the token
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

                // 4. Securely pass the verified data to our GraphQL resolvers
                return {
                    userId: decoded.userId,
                    workspaceId: decoded.workspaceId,
                    role: decoded.role,
                };
            } catch (err) {
                // If the token is expired or fake, we reject the context
                console.warn('⚠️ Invalid or expired token rejected.');
                return {};
            }
        },
    })
);

app.listen(4000, () => {
    console.log('🚀 AkashixCore Server ready at http://localhost:4000/graphql');
});