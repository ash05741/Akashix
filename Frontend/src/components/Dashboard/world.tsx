import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { BookOpen, Map, Shield, Clock, Plus, Loader2, X, Trash2, AlertTriangle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    Location: <Map className="w-5 h-5 text-[#d9a05b]" strokeWidth={1.5} />,
    Faction: <Shield className="w-5 h-5 text-[#d9a05b]" strokeWidth={1.5} />,
    History: <Clock className="w-5 h-5 text-[#d9a05b]" strokeWidth={1.5} />,
    Default: <BookOpen className="w-5 h-5 text-[#d9a05b]" strokeWidth={1.5} />
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
                <Loader2 className="h-8 w-8 animate-spin text-[#d9a05b]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl bg-red-50 p-4 text-red-700 border border-red-200 shadow-sm">
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
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8 relative font-sans text-zinc-900"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-serif text-3xl font-bold text-zinc-900">World Lore</h1>
                    <p className="text-sm text-zinc-500 mt-1">Manage the locations, factions, and history of your realm.</p>
                </div>
                <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 1 }}
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 rounded-2xl bg-[#0F2C24] hover:bg-[#153b30] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all shadow-sm shrink-0 cursor-pointer"
                >
                    <Plus className="w-4 h-4 text-[#d9a05b]" />
                    New Entry
                </motion.button>
            </div>

            {/* Search Bar */}
            <div>
                <input
                    type="text"
                    placeholder="Search lore by title or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-96 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-[#d9a05b] focus:outline-none focus:ring-1 focus:ring-[#d9a05b] shadow-sm transition-all"
                />
            </div>

            {/* Grid / Empty State */}
            {filteredLore.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white/50 py-20 text-center shadow-sm">
                    <BookOpen className="h-10 w-10 text-zinc-300 mb-3" strokeWidth={1.5} />
                    <h3 className="font-serif text-lg font-bold text-zinc-900">No lore entries found</h3>
                    <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">Create your first piece of world history.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLore.map((lore: LoreItem, index: number) => (
                        <motion.div
                            key={lore.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ y: -3 }}
                            onClick={() => setSelectedLore(lore)}
                            className="rounded-3xl border border-zinc-200 bg-white p-6 md:p-8 hover:border-amber-400/60 transition-all duration-300 shadow-sm group cursor-pointer hover:shadow-md relative flex flex-col h-full"
                        >
                            <div className="flex items-start justify-between mb-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#081B21] shadow-inner shrink-0">
                                        {categoryIcons[lore.category] || categoryIcons.Default}
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-xl font-bold text-zinc-900 group-hover:text-amber-700 transition-colors tracking-tight">
                                            {lore.title}
                                        </h3>
                                        <p className="text-[10px] font-bold text-zinc-400 mt-0.5 uppercase tracking-widest">
                                            {lore.category}
                                        </p>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => handleDeleteClick(e, lore.id, lore.title)}
                                    className="text-zinc-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-colors opacity-0 group-hover:opacity-100 shrink-0 cursor-pointer"
                                    title="Delete Lore"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </motion.button>
                            </div>

                            <p className="text-sm text-zinc-500 line-clamp-3 mb-6 flex-1 leading-relaxed">
                                {lore.summary || <span className="italic opacity-60">No summary provided...</span>}
                            </p>

                            <div className="border-t border-zinc-100 pt-4 mt-auto flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                <span>Click to expand</span>
                                <span>{lore.content ? `${Math.ceil(lore.content.length / 5)} words` : 'Empty'}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* View Lore Modal */}
            <AnimatePresence>
                {selectedLore && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedLore(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white border border-zinc-200 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center p-6 border-b border-zinc-100 bg-zinc-50 shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#081B21] shadow-inner">
                                        <span className="scale-125">{categoryIcons[selectedLore.category] || categoryIcons.Default}</span>
                                    </div>
                                    <div>
                                        <h2 className="font-serif text-2xl font-bold text-zinc-900 mb-1">{selectedLore.title}</h2>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 border border-zinc-200 bg-white px-2.5 py-0.5 rounded-lg shadow-xs">
                                            {selectedLore.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={(e) => handleDeleteClick(e, selectedLore.id, selectedLore.title)}
                                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setSelectedLore(null)}
                                        className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-y-auto p-6 md:p-8 flex-1 custom-scrollbar bg-[#FAF6ED]/30 space-y-6">
                                {selectedLore.summary && (
                                    <div className="p-5 bg-white border border-zinc-200 shadow-sm rounded-2xl">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#d9a05b]"></div>
                                            Overview
                                        </h4>
                                        <p className="text-zinc-700 text-sm leading-relaxed">{selectedLore.summary}</p>
                                    </div>
                                )}

                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4 border-b border-zinc-100 pb-3 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#081B21]"></div>
                                        Full Database Entry
                                    </h4>
                                    <div className="text-zinc-800 leading-loose whitespace-pre-wrap text-[15px] font-medium">
                                        {selectedLore.content || <span className="italic text-zinc-400">No detailed history recorded for this entity.</span>}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Create Lore Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="w-full max-w-2xl rounded-3xl border border-zinc-200 bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-zinc-100 bg-zinc-50 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#081B21] rounded-xl shadow-inner">
                                        <Plus className="w-4 h-4 text-[#d9a05b]" />
                                    </div>
                                    <h3 className="font-serif text-xl font-bold text-zinc-900">Create Lore Entry</h3>
                                </div>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 p-2 rounded-xl transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="overflow-y-auto p-6 md:p-8 flex-1 custom-scrollbar bg-[#FAF6ED]/30">
                                <form id="create-lore-form" onSubmit={handleCreate} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Title</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="block w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-[#d9a05b] focus:outline-none focus:ring-1 focus:ring-[#d9a05b] shadow-sm transition-all text-sm"
                                                placeholder="e.g. The Obsidian Citadel"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Category</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="block w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 focus:border-[#d9a05b] focus:outline-none focus:ring-1 focus:ring-[#d9a05b] shadow-sm transition-all text-sm cursor-pointer"
                                            >
                                                <option value="Location">Location</option>
                                                <option value="Faction">Faction</option>
                                                <option value="History">History</option>
                                                <option value="Artifact">Artifact</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Short Summary</label>
                                        <textarea
                                            maxLength={150}
                                            value={formData.summary}
                                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                            className="block w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-[#d9a05b] focus:outline-none focus:ring-1 focus:ring-[#d9a05b] resize-none custom-scrollbar shadow-sm transition-all text-sm h-24"
                                            placeholder="Brief description for the grid card..."
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-end mb-2">
                                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Full Lore / Story</label>

                                            <div className="flex items-center gap-3">
                                                {backupContent ? (
                                                    <button
                                                        type="button"
                                                        onClick={handleUndoAI}
                                                        className="text-[10px] font-bold uppercase tracking-wider text-red-600 hover:text-red-700 px-3 py-1.5 bg-red-50 border border-red-200 rounded-xl transition-colors cursor-pointer shadow-xs"
                                                    >
                                                        Undo AI Changes
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={handleAIEnhance}
                                                        disabled={isEnhancing || !formData.content.trim()}
                                                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700 hover:text-indigo-800 px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                                                    >
                                                        {isEnhancing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-indigo-500" />}
                                                        {isEnhancing ? 'Refining...' : 'AI Enhance'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="relative">
                                            {isEnhancing && (
                                                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-200 transition-all duration-300">
                                                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
                                                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest animate-pulse">
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
                                                className="block w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-[#d9a05b] focus:outline-none focus:ring-1 focus:ring-[#d9a05b] text-sm resize-y min-h-[250px] shadow-sm disabled:bg-zinc-50 custom-scrollbar"
                                                placeholder="Write the full history, details, or story here..."
                                            />
                                        </div>
                                        <div className="text-right mt-1.5 text-[10px] font-bold text-zinc-400 tracking-wider">
                                            {formData.content.length} / 50,000 characters
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="p-6 border-t border-zinc-100 bg-white shrink-0 flex justify-end gap-3 rounded-b-3xl">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    form="create-lore-form"
                                    type="submit"
                                    disabled={isCreating || !formData.title.trim()}
                                    className="flex items-center justify-center min-w-[120px] rounded-xl bg-[#0F2C24] hover:bg-[#153b30] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
                                >
                                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin text-[#d9a05b]" /> : 'Save Entry'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* DELETE CONFIRMATION MODAL */}
            <AnimatePresence>
                {loreToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="w-full max-w-sm rounded-3xl border border-red-100 bg-white p-6 md:p-8 shadow-2xl overflow-hidden relative"
                        >
                            <div className="flex items-center gap-4 mb-5">
                                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-red-50 border border-red-100 shrink-0">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="font-serif text-xl font-bold text-zinc-900 leading-tight">Delete Lore Entry?</h3>
                                    <p className="text-xs text-zinc-500 mt-0.5">This action cannot be undone.</p>
                                </div>
                            </div>

                            <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 mb-6">
                                <p className="text-red-900 text-sm">
                                    You are about to permanently delete <span className="font-bold">"{loreToDelete.title}"</span>.
                                </p>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setLoreToDelete(null)}
                                    disabled={isDeleting}
                                    className="rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                    className="flex items-center justify-center min-w-[100px] rounded-xl bg-red-600 hover:bg-red-700 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
                                >
                                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}