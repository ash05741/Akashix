import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    name: string;
    role: 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER'; // Ready for role-based authorization
}

const UserSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, required: true },
        name: { type: String, required: true },
        role: {
            type: String,
            enum: ['OWNER', 'ADMIN', 'EDITOR', 'VIEWER'],
            default: 'OWNER'
        }
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);