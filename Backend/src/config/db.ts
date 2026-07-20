import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
    try {
        // Falls back to a local database named 'akashixcore' if no .env is found
        const uri = process.env.MONGO_URI;
        const conn = await mongoose.connect(uri as string);

        console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error}`);
        // Kills the server if the database fails to connect
        process.exit(1);
    }
};