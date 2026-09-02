import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { BookOpen, Map, Shield, Clock, Plus, Loader2, X, Trash2, AlertTriangle, Sparkles } from 'lucide-react';

// 1. Queries and Mutations
const GET_ALL_LORE = gql`
  query GetAllLore {
    getAllLore {
      id
      title
      category
      summary
      content
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
      content
    }
  }
`;

const DELETE_LORE = gql`
  mutation DeleteLore($id: ID!) {
    deleteLore(id: $id)
  }
`;

const ENHANCE_LORE = gql`
  mutation EnhanceLore($text: String!) {
    enhanceLore(text: $text)
  }
`;

// 2. TypeScript Interfaces
interface LoreItem {
    id: string;
    title: string;
    category: string;
    summary: string;
    content: string;
}

interface LoreData {
    getAllLore: LoreItem[];
}

interface EnhanceLoreData {
    enhanceLore: string;
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

    // View Lore State
    const [selectedLore, setSelectedLore] = useState<LoreItem | null>(null);

    // Delete Modal State
    const [loreToDelete, setLoreToDelete] = useState<{ id: string; title: string } | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        category: 'Location',
        summary: '',
        content: ''
    });

    // AI Backup State
    const [backupContent, setBackupContent] = useState<string | null>(null);

    // Apollo Hooks
    const { data, loading, error } = useQuery<LoreData>(GET_ALL_LORE);

    const [createLore, { loading: isCreating }] = useMutation(CREATE_LORE, {
        refetchQueries: [{ query: GET_ALL_LORE }],
        onCompleted: () => {
            setIsModalOpen(false);
            setFormData({ title: '', category: 'Location', summary: '', content: '' });
            setBackupContent(null);
        },
        onError: (err) => {
            console.error("Mutation error:", err.message);
            alert(`Failed to create lore: ${err.message}`);
        }
    });

    const [deleteLore, { loading: isDeleting }] = useMutation(DELETE_LORE, {
        refetchQueries: [{ query: GET_ALL_LORE }],
        onCompleted: () => {
            setLoreToDelete(null);
            setSelectedLore(null);
        },
        onError: (err) => {
            console.error("Delete error:", err.message);
            alert(`Failed to delete lore: ${err.message}`);
            setLoreToDelete(null);
        }
    });

    // AI Enhance Hook
    const [enhanceLore, { loading: isEnhancing }] = useMutation<EnhanceLoreData>(ENHANCE_LORE, {
        onCompleted: (data) => {
            if (data?.enhanceLore) {
                setFormData({ ...formData, content: data.enhanceLore });
            }
        },
        onError: (err) => {
            console.error("AI Enhance error:", err.message);
            alert(`Failed to enhance text: ${err.message}`);
            setBackupContent(null);
        }
    });

    // Handlers
    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createLore({ variables: formData });
    };

    const handleDeleteClick = (e: React.MouseEvent, id: string, title: string) => {
        e.stopPropagation();
        setLoreToDelete({ id, title });
    };

    const confirmDelete = () => {
        if (!loreToDelete) return;
        deleteLore({ variables: { id: loreToDelete.id } });
    };

    const handleAIEnhance = () => {
        if (!formData.content.trim()) return;
        setBackupContent(formData.content);
        enhanceLore({ variables: { text: formData.content } });
    };

    const handleUndoAI = () => {
        if (backupContent !== null) {
            setFormData({ ...formData, content: backupContent });
            setBackupContent(null);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setBackupContent(null);
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg bg-red-500/10 p-4 text-red-400 border border-red-500/20">
                Failed to load world data: {error.message}
            </div>
        );
    }

    const loreEntries = data?.getAllLore || [];
    const filteredLore = loreEntries.filter((lore: LoreItem) =>
        lore.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lore.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 relative">
            {/* Header matches Characters.tsx */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-100">World Lore</h1>
                    <p className="text-zinc-400 mt-1">Manage the locations, factions, and history of your realm.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-white transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    New Entry
                </button>
            </div>

            {/* Search Bar - Updated to match input styles */}
            <div>
                <input
                    type="text"
                    placeholder="Search lore by title or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-96 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 sm:text-sm"
                />
            </div>

            {/* Grid / Empty State */}
            {filteredLore.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 py-24 text-center">
                    <BookOpen className="h-12 w-12 text-zinc-600 mb-4" />
                    <h3 className="text-lg font-medium text-zinc-200">No lore entries found</h3>
                    <p className="text-zinc-500 mt-1">Create your first piece of world history to begin.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLore.map((lore: LoreItem) => (
                        <div
                            key={lore.id}
                            onClick={() => setSelectedLore(lore)}
                            className="rounded-xl border border-zinc-800 bg-[#121212] p-6 hover:border-zinc-700 transition-all shadow-lg group cursor-pointer hover:shadow-xl relative flex flex-col h-full"
                        >
                            <div className="flex items-start justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800/80 border border-zinc-700/50">
                                        {categoryIcons[lore.category] || categoryIcons.Default}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-white transition-colors">
                                            {lore.title}
                                        </h3>
                                        <p className="text-xs text-zinc-500 mt-0.5 uppercase tracking-widest">
                                            {lore.category}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => handleDeleteClick(e, lore.id, lore.title)}
                                    className="text-zinc-600 hover:text-red-400 hover:bg-red-400/10 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                    title="Delete Lore"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <p className="text-sm text-zinc-400 line-clamp-3 mb-6">
                                {lore.summary || <span className="italic opacity-50">No summary provided...</span>}
                            </p>

                            <div className="border-t border-zinc-800/80 pt-4 mt-auto flex justify-between items-center text-xs text-zinc-500">
                                <span>Click to expand</span>
                                <span>{lore.content ? `${Math.ceil(lore.content.length / 5)} words` : 'Empty'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* View Lore Modal (Updated aesthetic) */}
            {selectedLore && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedLore(null)}>
                    <div
                        className="bg-[#121212] border border-zinc-800 rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start p-6 border-b border-zinc-800 bg-zinc-900/30 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700/50">
                                    {categoryIcons[selectedLore.category] || categoryIcons.Default}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">{selectedLore.title}</h2>
                                    <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                                        {selectedLore.category}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => handleDeleteClick(e, selectedLore.id, selectedLore.title)}
                                    className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setSelectedLore(null)}
                                    className="p-2 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-y-auto p-6 md:p-8 flex-1 custom-scrollbar">
                            {selectedLore.summary && (
                                <div className="mb-8 p-5 bg-zinc-900/30 border border-zinc-800/80 rounded-xl">
                                    <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Overview</h4>
                                    <p className="text-zinc-300 text-sm leading-relaxed">{selectedLore.summary}</p>
                                </div>
                            )}

                            <div>
                                <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-800/80 pb-2">Full Database Entry</h4>
                                <div className="text-zinc-300 leading-loose whitespace-pre-wrap text-[15px]">
                                    {selectedLore.content || <span className="italic text-zinc-600">No detailed history recorded for this entity.</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Lore Modal (Updated aesthetic) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-2xl rounded-xl border border-zinc-800 bg-[#121212] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-6 border-b border-zinc-800 bg-zinc-900/30 shrink-0">
                            <h3 className="text-xl font-bold text-zinc-100">Create Lore Entry</h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-6 flex-1 custom-scrollbar">
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">Title</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="block w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 sm:text-sm"
                                            placeholder="e.g. The Obsidian Citadel"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-2">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="block w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 sm:text-sm appearance-none"
                                        >
                                            <option value="Location">Location</option>
                                            <option value="Faction">Faction</option>
                                            <option value="History">History</option>
                                            <option value="Artifact">Artifact</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2 mt-4">Short Summary</label>
                                    <textarea
                                        maxLength={150}
                                        value={formData.summary}
                                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                        className="block w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 sm:text-sm resize-none h-20"
                                        placeholder="Brief description for the grid card..."
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-end mb-2 mt-4">
                                        <label className="block text-sm font-medium text-zinc-400">Full Lore / Story</label>
                                        <div className="flex items-center gap-3">
                                            {backupContent ? (
                                                <button
                                                    type="button"
                                                    onClick={handleUndoAI}
                                                    className="text-xs text-red-400 hover:text-red-300 font-medium px-3 py-1.5 bg-red-400/10 rounded-md transition-colors"
                                                >
                                                    Undo AI Changes
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleAIEnhance}
                                                    disabled={isEnhancing || !formData.content.trim()}
                                                    className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-md transition-colors disabled:opacity-50"
                                                >
                                                    {isEnhancing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                                                    {isEnhancing ? 'Refining...' : 'AI Enhance'}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="relative">
                                        {isEnhancing && (
                                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#121212]/60 backdrop-blur-sm rounded-lg border border-indigo-500/30 transition-all duration-300">
                                                <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mb-3" />
                                                <span className="text-sm font-medium text-indigo-300 tracking-wide animate-pulse">
                                                    Polishing prose...
                                                </span>
                                            </div>
                                        )}
                                        <textarea
                                            maxLength={50000}
                                            value={formData.content}
                                            disabled={isEnhancing}
                                            onChange={(e) => {
                                                setFormData({ ...formData, content: e.target.value });
                                                if (backupContent) setBackupContent(null);
                                            }}
                                            className="block w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 sm:text-sm resize-y min-h-[250px] disabled:opacity-50"
                                            placeholder="Write the full history, details, or story here..."
                                        />
                                    </div>
                                    <div className="text-right mt-1 text-xs text-zinc-600">
                                        {formData.content.length} / 50,000 characters
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-6 mt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isCreating || !formData.title.trim()}
                                        className="flex items-center justify-center min-w-[100px] rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                    >
                                        {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Entry'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL - Identical to Characters.tsx */}
            {loreToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-[#121212] p-6 shadow-2xl overflow-hidden relative">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 blur-3xl rounded-full"></div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-zinc-100">Delete Lore Entry?</h3>
                                <p className="text-sm text-zinc-400 mt-1">This action cannot be undone.</p>
                            </div>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 my-6">
                            <p className="text-zinc-300">
                                You are about to permanently delete <span className="font-semibold text-white">"{loreToDelete.title}"</span>. This piece of world history will be lost from your workspace.
                            </p>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setLoreToDelete(null)}
                                disabled={isDeleting}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="flex items-center justify-center min-w-[120px] rounded-lg bg-red-500 hover:bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete Permanently'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}