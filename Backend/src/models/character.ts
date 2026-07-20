import mongoose, { Schema, Document } from 'mongoose';

// 1. Define the TypeScript Interface for strict typing
export interface ICharacter extends Document {
    workspaceId: string; // Crucial for multi-tenant isolation
    name: string;
    role: string;
    stats: {
        strength: number;
        agility: number;
        intelligence: number;
    };
    has3DModel: boolean;
    loreNodes: mongoose.Types.ObjectId[];
}

// 2. Define the Mongoose Schema
const CharacterSchema = new Schema<ICharacter>(
    {
        workspaceId: { type: String, required: true, index: true },
        name: { type: String, required: true },
        role: { type: String, required: true },
        stats: {
            strength: { type: Number, default: 10 },
            agility: { type: Number, default: 10 },
            intelligence: { type: Number, default: 10 },
        },
        has3DModel: { type: Boolean, default: false },
        loreNodes: [{ type: Schema.Types.ObjectId, ref: 'LoreNode' }], // Will link to the Lore tables later
    },
    {
        timestamps: true // Automatically adds createdAt and updatedAt
    }
);

// 3. Export the Model
export const Character = mongoose.model<ICharacter>('Character', CharacterSchema);