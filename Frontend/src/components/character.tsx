import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Plus, Loader2, User, X } from 'lucide-react';
import { GET_CHARACTERS, CREATE_CHARACTER } from '../graphql/characters';

interface Character {
    id: string;
    name: string;
    stats: {
        strength: number;
        agility: number;
        intelligence: number;
    };
}

interface GetCharactersResponse {
    getCharacters: Character[];
}

export const Characters = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCharName, setNewCharName] = useState('');

    const { data, loading, error } = useQuery<GetCharactersResponse>(GET_CHARACTERS);

    const [createCharacter, { loading: creating }] = useMutation(CREATE_CHARACTER, {
        refetchQueries: [{ query: GET_CHARACTERS }],
        onCompleted: () => {
            setIsModalOpen(false);
            setNewCharName('');
        }
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCharName.trim()) return;

        createCharacter({
            variables: { name: newCharName.trim() }
        });
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
                Failed to load characters: {error.message}
            </div>
        );
    }

    const characters = data?.getCharacters || [];

    return (
        <div className="space-y-6 relative">
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
                        <div key={char.id} className="rounded-xl border border-zinc-800 bg-[#121212] p-6 hover:border-zinc-700 transition-colors shadow-lg">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800/80 border border-zinc-700/50">
                                    <User className="h-5 w-5 text-zinc-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-zinc-100">{char.name}</h3>
                            </div>

                            <div className="space-y-2 border-t border-zinc-800/80 pt-4">
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
                        </div>
                    ))}
                </div>
            )}

            {/* Creation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-[#121212] p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-zinc-100">Create Character</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-2">
                                    Character Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={newCharName}
                                    onChange={(e) => setNewCharName(e.target.value)}
                                    placeholder="e.g., Alaric the Shadow"
                                    className="block w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 sm:text-sm"
                                    autoFocus
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newCharName.trim() || creating}
                                    className="flex items-center justify-center min-w-[100px] rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                >
                                    {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};