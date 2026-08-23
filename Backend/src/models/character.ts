import mongoose, { Schema, Document } from 'mongoose';

// 1. Define the TypeScript Interface for strict typing
export interface ICharacter extends Document {
    workspaceId: string;
    name: string;
    role: string;
    stats: {
        strength: number;
        agility: number;
        intelligence: number;
    };
    has3DModel: boolean;
    relatedLore: mongoose.Types.ObjectId[]; // FIXED: Added this to match the schema below
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

        // FIXED: Kept only relatedLore, making sure 'ref' points to your exact Lore model name
        relatedLore: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lore'
        }]
    },
    {
        timestamps: true
    }
);

// 3. Export the Model
export const Character = mongoose.model<ICharacter>('Character', CharacterSchema);