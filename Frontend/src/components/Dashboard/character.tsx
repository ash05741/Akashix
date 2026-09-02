import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Plus, Loader2, User, X, Trash2, AlertTriangle, Link as LinkIcon } from 'lucide-react';
import { GET_CHARACTERS, CREATE_CHARACTER, DELETE_CHARACTER } from '../../graphql/characters';
import { motion, AnimatePresence } from 'framer-motion';

const GET_ALL_LORE = gql`
    query GetAllLore {
        getAllLore {
            id
            title
            category
        }
    }
`;

interface LoreReference {
    id: string;
    title: string;
    category: string;
}

interface Character {
    id: string;
    name: string;
    role?: string;
    stats: {
        strength: number;
        agility: number;
        intelligence: number;
    };
    relatedLore?: LoreReference[];
}

interface GetCharactersResponse {
    getCharacters: Character[];
}

interface GetAllLoreResponse {
    getAllLore: LoreReference[];
}

export const Characters = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedChar, setSelectedChar] = useState<Character | null>(null);
    const [charToDelete, setCharToDelete] = useState<{ id: string; name: string } | null>(null);

    const [newCharName, setNewCharName] = useState('');
    const [newCharRole, setNewCharRole] = useState('');
    const [stats, setStats] = useState({ strength: 10, agility: 10, intelligence: 10 });
    const [selectedLoreIds, setSelectedLoreIds] = useState<string[]>([]);

    const { data: charData, loading: charsLoading, error: charsError } = useQuery<GetCharactersResponse>(GET_CHARACTERS);
    const { data: loreData } = useQuery<GetAllLoreResponse>(GET_ALL_LORE);

    const [createCharacter, { loading: creating }] = useMutation(CREATE_CHARACTER, {
        refetchQueries: [{ query: GET_CHARACTERS }],
        onCompleted: () => {
            setIsModalOpen(false);
            setNewCharName('');
            setNewCharRole('');
            setStats({ strength: 10, agility: 10, intelligence: 10 });
            setSelectedLoreIds([]);
        },
        onError: (err) => {
            console.error("Mutation error:", err.message);
            alert(`Failed to create character: ${err.message}`);
        }
    });

    const [deleteCharacter, { loading: deleting }] = useMutation(DELETE_CHARACTER, {
        refetchQueries: [{ query: GET_CHARACTERS }],
        onCompleted: () => {
            setCharToDelete(null);
            setSelectedChar(null);
        },
        onError: (err) => {
            console.error("Delete error:", err.message);
            alert(`Failed to delete character: ${err.message}`);
            setCharToDelete(null);
        }
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCharName.trim() || !newCharRole.trim()) return;

        createCharacter({
            variables: {
                name: newCharName.trim(),
                role: newCharRole.trim(),
                stats: {
                    strength: stats.strength,
                    agility: stats.agility,
                    intelligence: stats.intelligence
                },
                relatedLore: selectedLoreIds
            }
        });
    };

    const toggleLoreSelection = (id: string) => {
        setSelectedLoreIds(prev =>
            prev.includes(id) ? prev.filter(loreId => loreId !== id) : [...prev, id]
        );
    };

    const handleDeleteClick = (e: React.MouseEvent, id: string, name: string) => {
        e.stopPropagation();
        setCharToDelete({ id, name });
    };

    const confirmDelete = () => {
        if (!charToDelete) return;
        deleteCharacter({ variables: { id: charToDelete.id } });
    };

    if (charsLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#d9a05b]" />
            </div>
        );
    }

    if (charsError) {
        return (
            <div className="rounded-xl bg-red-50 p-4 text-red-700 border border-red-200 shadow-sm">
                Failed to load characters: {charsError.message}
            </div>
        );
    }

    const characters = charData?.getCharacters || [];
    const availableLore = loreData?.getAllLore || [];

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
                    <h1 className="font-serif text-3xl font-bold text-zinc-900">Characters</h1>
                    <p className="text-sm text-zinc-500 mt-1">Manage the entities within your world.</p>
                </div>
                <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 1 }}
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 rounded-2xl bg-[#0F2C24] hover:bg-[#153b30] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all shadow-sm shrink-0 cursor-pointer"
                >
                    <Plus className="w-4 h-4 text-[#d9a05b]" />
                    New Character
                </motion.button>
            </div>

            {/* Empty State / Grid */}
            {characters.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white/50 py-20 text-center shadow-sm">
                    <User className="h-10 w-10 text-zinc-300 mb-3" strokeWidth={1.5} />
                    <h3 className="font-serif text-lg font-bold text-zinc-900">No characters found</h3>
                    <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">Deploy an entity to begin</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {characters.map((char, index) => (
                        <motion.div
                            key={char.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ y: -3 }}
                            onClick={() => setSelectedChar(char)}
                            className="rounded-3xl border border-zinc-200 bg-white p-6 md:p-8 hover:border-amber-400/60 transition-all duration-300 shadow-sm group cursor-pointer hover:shadow-md flex flex-col h-full"
                        >
                            {/* Card Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#081B21] shadow-inner shrink-0">
                                        <User className="h-6 w-6 text-[#d9a05b]" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-xl font-bold text-zinc-900 group-hover:text-amber-700 transition-colors tracking-tight">{char.name}</h3>
                                        {char.role && <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{char.role}</p>}
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => handleDeleteClick(e, char.id, char.name)}
                                    className="text-zinc-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-colors opacity-0 group-hover:opacity-100 shrink-0 cursor-pointer"
                                    title="Delete Character"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </motion.button>
                            </div>

                            {/* Core Stats */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Strength</span>
                                    <span className="text-sm text-zinc-900 font-bold">{char.stats.strength}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Agility</span>
                                    <span className="text-sm text-zinc-900 font-bold">{char.stats.agility}</span>
                                </div>
                                <div className="flex justify-between items-center pb-1">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Intelligence</span>
                                    <span className="text-sm text-zinc-900 font-bold">{char.stats.intelligence}</span>
                                </div>
                            </div>

                            {/* Lore Tags */}
                            <div className="mt-auto pt-5 border-t border-zinc-100">
                                {char.relatedLore && char.relatedLore.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {char.relatedLore.slice(0, 2).map(lore => (
                                            <span key={lore.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-xl text-[9px] uppercase font-bold tracking-widest text-amber-800 shadow-xs">
                                                <LinkIcon className="w-3 h-3 text-amber-500" />
                                                {lore.title}
                                            </span>
                                        ))}
                                        {char.relatedLore.length > 2 && (
                                            <span className="px-2.5 py-1 bg-zinc-50 border border-zinc-200 rounded-xl text-[9px] font-bold text-zinc-500 uppercase tracking-widest shadow-xs">
                                                +{char.relatedLore.length - 2} more
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-[10px] text-zinc-400 italic">No lore connections</span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* VIEW CHARACTER MODAL */}
            <AnimatePresence>
                {selectedChar && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedChar(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white border border-zinc-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center p-6 border-b border-zinc-100 bg-zinc-50 shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#081B21] shadow-inner">
                                        <User className="h-6 w-6 text-[#d9a05b]" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h2 className="font-serif text-xl font-bold text-zinc-900 mb-1 tracking-tight">{selectedChar.name}</h2>
                                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest border border-zinc-200 bg-white px-2.5 py-0.5 rounded-lg shadow-xs">Entity Profile</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={(e) => handleDeleteClick(e, selectedChar.id, selectedChar.name)}
                                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setSelectedChar(null)}
                                        className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 bg-[#FAF6ED]/30">
                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#d9a05b]"></div>
                                        About / Role
                                    </h4>
                                    <div className="bg-white border border-zinc-200 shadow-sm rounded-2xl p-5">
                                        <p className="text-zinc-700 leading-relaxed whitespace-pre-wrap text-sm">
                                            {selectedChar.role || <span className="italic text-zinc-400">No description provided.</span>}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#d9a05b]"></div>
                                        World Connections
                                    </h4>
                                    {selectedChar.relatedLore && selectedChar.relatedLore.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedChar.relatedLore.map(lore => (
                                                <span key={lore.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-[10px] font-bold tracking-widest uppercase text-amber-800 shadow-xs">
                                                    <LinkIcon className="w-3.5 h-3.5 text-amber-500" />
                                                    {lore.title}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-zinc-500 italic bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
                                            No lore connections established.
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#d9a05b]"></div>
                                        Attributes Reference
                                    </h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center justify-center">
                                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">STR</span>
                                            <span className="font-serif text-xl text-zinc-900 font-bold">{selectedChar.stats.strength}</span>
                                        </div>
                                        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center justify-center">
                                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">AGI</span>
                                            <span className="font-serif text-xl text-zinc-900 font-bold">{selectedChar.stats.agility}</span>
                                        </div>
                                        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center justify-center">
                                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">INT</span>
                                            <span className="font-serif text-xl text-zinc-900 font-bold">{selectedChar.stats.intelligence}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* CREATE MODAL */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white flex flex-col max-h-[85vh] shadow-2xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-zinc-100 bg-zinc-50 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#081B21] rounded-xl shadow-inner">
                                        <Plus className="w-4 h-4 text-[#d9a05b]" />
                                    </div>
                                    <h3 className="font-serif text-lg font-bold text-zinc-900">Draft New Entity</h3>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 p-2 rounded-xl transition-colors cursor-pointer">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar bg-[#FAF6ED]/30">
                                <form id="create-char-form" onSubmit={handleCreate} className="space-y-5">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Entity Name</label>
                                            <input
                                                required
                                                type="text"
                                                value={newCharName}
                                                onChange={(e) => setNewCharName(e.target.value)}
                                                placeholder="e.g., Kaelen of the Ash Wastes"
                                                className="block w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-[#d9a05b] focus:outline-none focus:ring-1 focus:ring-[#d9a05b] shadow-sm transition-all text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">About / Role</label>
                                            <textarea
                                                required
                                                rows={3}
                                                value={newCharRole}
                                                onChange={(e) => setNewCharRole(e.target.value)}
                                                placeholder="Describe their background or motives..."
                                                className="block w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-[#d9a05b] focus:outline-none focus:ring-1 focus:ring-[#d9a05b] resize-none custom-scrollbar shadow-sm transition-all text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                            <LinkIcon className="w-3.5 h-3.5 text-[#d9a05b]" />
                                            World Connections
                                        </label>
                                        <p className="text-xs text-zinc-400 mb-2">Link this entity to existing lore.</p>

                                        {availableLore.length === 0 ? (
                                            <div className="p-4 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-400 italic shadow-sm">
                                                No world lore found. Create lore first.
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-3 border border-zinc-200 rounded-2xl bg-white shadow-inner custom-scrollbar">
                                                {availableLore.map((lore) => (
                                                    <button
                                                        key={lore.id}
                                                        type="button"
                                                        onClick={() => toggleLoreSelection(lore.id)}
                                                        className={`px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-wider font-bold transition-all border cursor-pointer ${selectedLoreIds.includes(lore.id)
                                                            ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                                                            : 'bg-white text-zinc-500 border-zinc-200 hover:border-amber-300 hover:text-amber-800'
                                                            }`}
                                                    >
                                                        {lore.title}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-zinc-200">
                                        <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#081B21]"></div>
                                            Attributes Reference
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">
                                                <label className="block text-[9px] font-bold text-zinc-400 mb-1 uppercase tracking-widest text-center">STR</label>
                                                <input type="number" min="1" max="100" value={stats.strength} onChange={(e) => setStats({ ...stats, strength: parseInt(e.target.value) || 0 })} className="block w-full bg-transparent text-zinc-900 text-center text-sm font-bold focus:outline-none" />
                                            </div>
                                            <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">
                                                <label className="block text-[9px] font-bold text-zinc-400 mb-1 uppercase tracking-widest text-center">AGI</label>
                                                <input type="number" min="1" max="100" value={stats.agility} onChange={(e) => setStats({ ...stats, agility: parseInt(e.target.value) || 0 })} className="block w-full bg-transparent text-zinc-900 text-center text-sm font-bold focus:outline-none" />
                                            </div>
                                            <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">
                                                <label className="block text-[9px] font-bold text-zinc-400 mb-1 uppercase tracking-widest text-center">INT</label>
                                                <input type="number" min="1" max="100" value={stats.intelligence} onChange={(e) => setStats({ ...stats, intelligence: parseInt(e.target.value) || 0 })} className="block w-full bg-transparent text-zinc-900 text-center text-sm font-bold focus:outline-none" />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="p-6 border-t border-zinc-100 bg-white shrink-0 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer">Cancel</button>
                                <button form="create-char-form" type="submit" disabled={creating} className="flex items-center justify-center min-w-[110px] rounded-xl bg-[#0F2C24] hover:bg-[#153b30] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50 transition-colors shadow-sm cursor-pointer">
                                    {creating ? <Loader2 className="w-4 h-4 animate-spin text-[#d9a05b]" /> : 'Deploy'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* DELETE CONFIRMATION MODAL */}
            <AnimatePresence>
                {charToDelete && (
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
                                    <h3 className="font-serif text-xl font-bold text-zinc-900 leading-tight">Delete Character?</h3>
                                    <p className="text-xs text-zinc-500 mt-0.5">This action cannot be undone.</p>
                                </div>
                            </div>

                            <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 mb-6">
                                <p className="text-red-900 text-sm">
                                    You are about to permanently delete <span className="font-bold">"{charToDelete.name}"</span>.
                                </p>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setCharToDelete(null)}
                                    disabled={deleting}
                                    className="rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={deleting}
                                    className="flex items-center justify-center min-w-[100px] rounded-xl bg-red-600 hover:bg-red-700 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
                                >
                                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};