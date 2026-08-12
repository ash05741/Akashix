import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkspace extends Document {
    name: string;
    description?: string;
    ownerId: mongoose.Types.ObjectId;
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
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
);

export const Workspace = mongoose.model('Workspace', workspaceSchema);