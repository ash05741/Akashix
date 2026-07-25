import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { BookOpen, Map, Shield, Clock, Plus, Loader2, X, Trash2 } from 'lucide-react';

// 1. Queries and Mutations
const GET_ALL_LORE = gql`
  query GetAllLore {
    getAllLore {
      id
      title
      category
      summary
    }
  }
`;

const CREATE_LORE = gql`
  mutation CreateLore($title: String!, $category: String!, $summary: String, $content: String) {
    createLore(title: $title, category: $category, summary: $summary, content: $content) {
      id
      title
      category
      summary
    }
  }
`;

// NEW: Delete Mutation
const DELETE_LORE = gql`
  mutation DeleteLore($id: ID!) {
    deleteLore(id: $id)
  }
`;

// 2. TypeScript Interfaces
interface LoreItem {
    id: string;
    title: string;
    category: string;
    summary: string;
}

interface LoreData {
    getAllLore: LoreItem[];
}

const categoryIcons: Record<string, React.ReactNode> = {
    Location: <Map className="w-5 h-5 text-zinc-400" />,
    Faction: <Shield className="w-5 h-5 text-zinc-400" />,
    History: <Clock className="w-5 h-5 text-zinc-400" />,
    Default: <BookOpen className="w-5 h-5 text-zinc-400" />
};

export default function World() {
    // UI State
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        category: 'Location', // Default selection
        summary: '',
        content: ''
    });

    // Apollo Hooks
    const { data, loading, error } = useQuery<LoreData>(GET_ALL_LORE);

    const [createLore, { loading: isCreating }] = useMutation(CREATE_LORE, {
        refetchQueries: [{ query: GET_ALL_LORE }],
        onCompleted: () => {
            setIsModalOpen(false);
            setFormData({ title: '', category: 'Location', summary: '', content: '' });
        },
        onError: (err) => {
            console.error("Mutation error:", err.message);
            alert(`Failed to create lore: ${err.message}`);
        }
    });

    // NEW: Delete Hook
    const [deleteLore] = useMutation(DELETE_LORE, {
        refetchQueries: [{ query: GET_ALL_LORE }],
        onError: (err) => {
            console.error("Delete error:", err.message);
            alert(`Failed to delete lore: ${err.message}`);
        }
    });

    // Handlers
    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createLore({ variables: formData });
    };

    // NEW: Delete Handler
    const handleDelete = (e: React.MouseEvent, id: string, title: string) => {
        e.stopPropagation(); // Prevents triggering any future click events on the card itself
        if (window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
            deleteLore({ variables: { id } });
        }
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="rounded-md bg-red-500/10 p-4 text-red-500 border border-red-500/20">
                    <p>Failed to load world data: {error.message}</p>
                </div>
            </div>
        );
    }

    const loreEntries = data?.getAllLore || [];
    const filteredLore = loreEntries.filter((lore: LoreItem) =>
        lore.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lore.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto text-zinc-100">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Lore & World</h1>
                    <p className="text-sm text-zinc-400 mt-1">Manage your world-building elements, locations, and history.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-zinc-100 text-zinc-900 hover:bg-zinc-200 px-4 py-2 rounded-md font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Entry
                </button>
            </div>

            {/* Search */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search lore..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-96 bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-700 placeholder:text-zinc-600"
                />
            </div>

            {/* Grid / Empty State */}
            {filteredLore.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 rounded-lg border border-dashed border-zinc-800 bg-zinc-900/50">
                    <BookOpen className="w-12 h-12 text-zinc-600 mb-4" />
                    <h3 className="text-lg font-medium text-zinc-300">No lore entries found</h3>
                    <p className="text-sm text-zinc-500 mt-1">Get started by creating your first piece of world history.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLore.map((lore: LoreItem) => (
                        <div key={lore.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-lg hover:border-zinc-700 transition-colors group cursor-pointer relative">
                            {/* Card Header with Delete Button */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-zinc-950 rounded-md border border-zinc-800">
                                        {categoryIcons[lore.category] || categoryIcons.Default}
                                    </div>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                        {lore.category}
                                    </span>
                                </div>
                                <button
                                    onClick={(e) => handleDelete(e, lore.id, lore.title)}
                                    className="text-zinc-600 hover:text-red-400 hover:bg-red-400/10 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                    title="Delete Lore"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <h3 className="text-xl font-semibold text-zinc-100 mb-2 group-hover:text-white transition-colors">
                                {lore.title}
                            </h3>
                            <p className="text-sm text-zinc-400 line-clamp-3">
                                {lore.summary}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Lore Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-lg w-full max-w-lg shadow-xl overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-zinc-900/50">
                            <h2 className="text-lg font-semibold text-zinc-100">Create New Lore Entry</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-zinc-400 hover:text-zinc-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                                    placeholder="e.g. The Obsidian Citadel"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700 appearance-none"
                                >
                                    <option value="Location">Location</option>
                                    <option value="Faction">Faction</option>
                                    <option value="History">History</option>
                                    <option value="Artifact">Artifact</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Short Summary</label>
                                <textarea
                                    maxLength={150}
                                    value={formData.summary}
                                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700 resize-none h-20"
                                    placeholder="Brief description for the grid card..."
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-md font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="flex items-center gap-2 bg-zinc-100 text-zinc-900 hover:bg-zinc-200 px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
                                >
                                    {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Create Entry
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}