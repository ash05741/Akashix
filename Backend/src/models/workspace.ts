import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkspace extends Document {
    name: string;
    description?: string;
    imageUrl?: string; // <-- NEW: Added to TS interface
    ownerId: mongoose.Types.ObjectId;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const workspaceSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        imageUrl: {          // <-- NEW: Added to Mongoose schema
            type: String,
            default: null
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        isPublic: { type: Boolean, default: false }
    },
    { timestamps: true }
);

export const Workspace = mongoose.model<IWorkspace>('Workspace', workspaceSchema);