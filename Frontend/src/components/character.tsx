import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Plus, Loader2, User, X, Trash2, AlertTriangle, Link as LinkIcon } from 'lucide-react';
import { GET_CHARACTERS, CREATE_CHARACTER, DELETE_CHARACTER } from '../graphql/characters';

// Local query to get the Lore options for the dropdown
const GET_ALL_LORE = gql`
    query GetAllLore {
        getAllLore {
            id
            title
            category
        }
    }
`;

// --- INTERFACES ---
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
    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedChar, setSelectedChar] = useState<Character | null>(null);
    const [charToDelete, setCharToDelete] = useState<{ id: string; name: string } | null>(null);

    // Form State
    const [newCharName, setNewCharName] = useState('');
    const [newCharRole, setNewCharRole] = useState('');
    const [stats, setStats] = useState({ strength: 10, agility: 10, intelligence: 10 });
    const [selectedLoreIds, setSelectedLoreIds] = useState<string[]>([]);

    // Hooks
    const { data: charData, loading: charsLoading, error: charsError } = useQuery<GetCharactersResponse>(GET_CHARACTERS);
    const { data: loreData } = useQuery<GetAllLoreResponse>(GET_ALL_LORE);

    // --- MUTATIONS ---
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

    // --- HANDLERS ---
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
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    if (charsError) {
        return (
            <div className="rounded-lg bg-red-500/10 p-4 text-red-400 border border-red-500/20">
                Failed to load characters: {charsError.message}
            </div>
        );
    }

    const characters = charData?.getCharacters || [];
    const availableLore = loreData?.getAllLore || [];

    return (
        <div className="space-y-6 relative">
            {/* Main Page Layout */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-100">Characters</h1>
                    <p className="text-zinc-400 mt-1">Manage the entities within your world.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-white transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    New Character
                </button>
            </div>

            {characters.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 py-24 text-center">
                    <User className="h-12 w-12 text-zinc-600 mb-4" />
                    <h3 className="text-lg font-medium text-zinc-200">No characters found</h3>
                    <p className="text-zinc-500 mt-1">Create your first character to begin building your lore.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {characters.map((char) => (
                        <div
                            key={char.id}
                            onClick={() => setSelectedChar(char)}
                            className="rounded-xl border border-zinc-800 bg-[#121212] p-6 hover:border-zinc-700 transition-all shadow-lg group cursor-pointer hover:shadow-xl relative flex flex-col h-full"
                        >
                            <div className="flex items-start justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800/80 border border-zinc-700/50">
                                        <User className="h-5 w-5 text-zinc-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-white transition-colors">{char.name}</h3>
                                        {/* Truncated preview of role for the card */}
                                        {char.role && <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{char.role}</p>}
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => handleDeleteClick(e, char.id, char.name)}
                                    className="text-zinc-600 hover:text-red-400 hover:bg-red-400/10 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                    title="Delete Character"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Strength</span>
                                    <span className="text-zinc-300 font-medium">{char.stats.strength}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Agility</span>
                                    <span className="text-zinc-300 font-medium">{char.stats.agility}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Intelligence</span>
                                    <span className="text-zinc-300 font-medium">{char.stats.intelligence}</span>
                                </div>
                            </div>

                            <div className="mt-auto pt-4 border-t border-zinc-800/80">
                                {char.relatedLore && char.relatedLore.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {char.relatedLore.slice(0, 3).map(lore => (
                                            <span key={lore.id} className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-[10px] uppercase font-semibold tracking-widest text-zinc-400">
                                                <LinkIcon className="w-3 h-3" />
                                                {lore.title}
                                            </span>
                                        ))}
                                        {char.relatedLore.length > 3 && (
                                            <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-[10px] text-zinc-500">
                                                +{char.relatedLore.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-xs text-zinc-600 italic">No lore connections</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* VIEW CHARACTER MODAL - WRITER FOCUSED */}
            {selectedChar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedChar(null)}>
                    <div
                        className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start p-6 border-b border-zinc-800 bg-zinc-900/30 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700/50">
                                    <User className="h-6 w-6 text-zinc-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">{selectedChar.name}</h2>
                                    <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Entity Profile</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => handleDeleteClick(e, selectedChar.id, selectedChar.name)}
                                    className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setSelectedChar(null)}
                                    className="p-2 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
                            {/* Writer's "About" Section */}
                            <div>
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-zinc-500"></div>
                                    About / Role
                                </h4>
                                <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-lg p-5">
                                    <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap text-sm">
                                        {selectedChar.role || <span className="italic text-zinc-600">No description provided.</span>}
                                    </p>
                                </div>
                            </div>

                            {/* Connections (Lore) */}
                            <div>
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-zinc-500"></div>
                                    World Connections
                                </h4>
                                {selectedChar.relatedLore && selectedChar.relatedLore.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedChar.relatedLore.map(lore => (
                                            <span key={lore.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 transition-colors rounded-md text-xs font-semibold tracking-wide text-zinc-300 cursor-default">
                                                <LinkIcon className="w-3.5 h-3.5 text-zinc-500" />
                                                {lore.title}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-zinc-600 italic bg-zinc-900/20 p-4 rounded-lg border border-zinc-800/50">
                                        No lore connections established for this entity.
                                    </p>
                                )}
                            </div>

                            {/* Core Stats */}
                            <div>
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-zinc-600/50"></div>
                                    Attributes Reference
                                </h4>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-zinc-900/30 p-3 rounded-lg border border-zinc-800/60 flex flex-col items-center justify-center">
                                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">STR</span>
                                        <span className="text-zinc-300 font-bold">{selectedChar.stats.strength}</span>
                                    </div>
                                    <div className="bg-zinc-900/30 p-3 rounded-lg border border-zinc-800/60 flex flex-col items-center justify-center">
                                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">AGI</span>
                                        <span className="text-zinc-300 font-bold">{selectedChar.stats.agility}</span>
                                    </div>
                                    <div className="bg-zinc-900/30 p-3 rounded-lg border border-zinc-800/60 flex flex-col items-center justify-center">
                                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">INT</span>
                                        <span className="text-zinc-300 font-bold">{selectedChar.stats.intelligence}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CREATE MODAL - WRITER FOCUSED */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-[#121212] flex flex-col max-h-[90vh] shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-zinc-800 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800/80 border border-zinc-700/50">
                                    <Plus className="w-4 h-4 text-zinc-400" />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-100">Draft New Entity</h3>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form id="create-char-form" onSubmit={handleCreate} className="space-y-6">

                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-300 mb-2">Entity Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={newCharName}
                                            onChange={(e) => setNewCharName(e.target.value)}
                                            placeholder="e.g., Kaelen of the Ash Wastes"
                                            className="block w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-300 mb-2">About / Role</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={newCharRole}
                                            onChange={(e) => setNewCharRole(e.target.value)}
                                            placeholder="Describe their background, motives, or role in the story..."
                                            className="block w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 resize-none custom-scrollbar"
                                        />
                                    </div>
                                </div>

                                {/* Lore Connections Selection */}
                                <div>
                                    <label className="block text-sm font-bold text-zinc-300 mb-2 flex items-center gap-2">
                                        <LinkIcon className="w-4 h-4 text-zinc-500" />
                                        World Connections
                                    </label>
                                    <p className="text-xs text-zinc-500 mb-3">Link this entity to existing lore, factions, or locations.</p>

                                    {availableLore.length === 0 ? (
                                        <div className="p-4 bg-zinc-900/30 border border-zinc-800/80 rounded-lg text-xs text-zinc-500 italic">
                                            No world lore found. Create lore first to link entities to it.
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-3 border border-zinc-800/80 rounded-lg bg-zinc-900/30 custom-scrollbar">
                                            {availableLore.map((lore) => (
                                                <button
                                                    key={lore.id}
                                                    type="button"
                                                    onClick={() => toggleLoreSelection(lore.id)}
                                                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all border ${selectedLoreIds.includes(lore.id)
                                                            ? 'bg-zinc-200 text-black border-zinc-200 shadow-sm'
                                                            : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-200'
                                                        }`}
                                                >
                                                    {lore.category}: {lore.title}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="pt-6 border-t border-zinc-800/60">
                                    <label className="block text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest">Attributes Reference (Optional)</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-zinc-900/30 p-2 rounded-lg border border-zinc-800/50">
                                            <label className="block text-[10px] font-medium text-zinc-500 mb-1 uppercase text-center">STR</label>
                                            <input type="number" min="1" max="100" value={stats.strength} onChange={(e) => setStats({ ...stats, strength: parseInt(e.target.value) || 0 })} className="block w-full bg-transparent text-zinc-300 text-center text-sm font-bold focus:outline-none" />
                                        </div>
                                        <div className="bg-zinc-900/30 p-2 rounded-lg border border-zinc-800/50">
                                            <label className="block text-[10px] font-medium text-zinc-500 mb-1 uppercase text-center">AGI</label>
                                            <input type="number" min="1" max="100" value={stats.agility} onChange={(e) => setStats({ ...stats, agility: parseInt(e.target.value) || 0 })} className="block w-full bg-transparent text-zinc-300 text-center text-sm font-bold focus:outline-none" />
                                        </div>
                                        <div className="bg-zinc-900/30 p-2 rounded-lg border border-zinc-800/50">
                                            <label className="block text-[10px] font-medium text-zinc-500 mb-1 uppercase text-center">INT</label>
                                            <input type="number" min="1" max="100" value={stats.intelligence} onChange={(e) => setStats({ ...stats, intelligence: parseInt(e.target.value) || 0 })} className="block w-full bg-transparent text-zinc-300 text-center text-sm font-bold focus:outline-none" />
                                        </div>
                                    </div>
                                </div>

                            </form>
                        </div>

                        <div className="p-6 border-t border-zinc-800 shrink-0 flex justify-end gap-3 bg-zinc-900/20">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors">Cancel</button>
                            <button form="create-char-form" type="submit" disabled={creating} className="flex items-center justify-center min-w-[120px] rounded-lg bg-white px-4 py-2 text-sm font-bold text-black hover:bg-zinc-200 disabled:opacity-50 transition-colors shadow-sm">
                                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Entity'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {charToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-[#121212] p-6 shadow-2xl overflow-hidden relative">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 blur-3xl rounded-full"></div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-zinc-100">Delete Character?</h3>
                                <p className="text-sm text-zinc-400 mt-1">This action cannot be undone.</p>
                            </div>
                        </div>

                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 my-6">
                            <p className="text-zinc-300">
                                You are about to permanently delete <span className="font-semibold text-white">"{charToDelete.name}"</span>. All associated stats and references will be removed from your workspace.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setCharToDelete(null)}
                                disabled={deleting}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleting}
                                className="flex items-center justify-center min-w-[120px] rounded-lg bg-red-500 hover:bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete Permanently'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};