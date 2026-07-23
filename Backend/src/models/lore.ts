import mongoose, { Schema, Document } from 'mongoose';

export interface ILore extends Document {
    title: string;
    category: string;
    summary: string;
    content: string;
    workspaceId: mongoose.Types.ObjectId;
}

const LoreSchema = new Schema<ILore>({
    title: { type: String, required: true },
    category: { type: String, required: true },
    summary: { type: String, default: '' },
    content: { type: String, default: '' },
    // Critical for multi-tenancy:
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true }
}, { timestamps: true });

export default mongoose.model<ILore>('Lore', LoreSchema);