import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { BookOpen, Users, Shield, ArrowUpRight, Plus, Sparkles, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Import useAuth

// Query to pull counts or summary data for the workspace
const GET_OVERVIEW_DATA = gql`
    query GetOverviewData {
        getCharacters {
            id
            name
            role
        }
        getAllLore {
            id
            title
            category
        }
    }
`;

interface CharacterSummary {
    id: string;
    name: string;
    role?: string;
}

interface LoreSummary {
    id: string;
    title: string;
    category: string;
}

interface OverviewData {
    getCharacters: CharacterSummary[];
    getAllLore: LoreSummary[];
}

export default function Overview() {
    const { workspaceName } = useAuth(); // 2. Extract workspaceName from context
    const { data, loading, error } = useQuery<OverviewData>(GET_OVERVIEW_DATA);

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg bg-red-500/10 p-4 text-red-400 border border-red-500/20">
                Failed to load dashboard metrics: {error.message}
            </div>
        );
    }

    const characters = data?.getCharacters || [];
    const loreEntries = data?.getAllLore || [];

    // Calculate quick metrics
    const totalCharacters = characters.length;
    const totalLore = loreEntries.length;
    const totalLocations = loreEntries.filter(l => l.category === 'Location').length;
    const totalFactions = loreEntries.filter(l => l.category === 'Faction').length;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 text-zinc-100">
            {/* Welcome Banner */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-zinc-900 to-[#121212] border border-zinc-800 p-6 rounded-2xl shadow-xl">
                <div>
                    <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1 font-medium">
                        <Sparkles className="w-4 h-4 text-zinc-400" />
                        Workspace Command Center
                    </div>
                    {/* 3. Replaced static text with dynamic workspaceName */}
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        {workspaceName ? `${workspaceName} Dashboard` : 'World Dashboard'}
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">Monitor your realm's entities, lore fragments, and active entities.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to="/dashboard/characters"
                        className="flex items-center gap-2 bg-zinc-100 text-zinc-900 hover:bg-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Manage Characters
                    </Link>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl">
                    <div className="flex items-center justify-between text-zinc-400 mb-2">
                        <span className="text-sm font-medium">Total Characters</span>
                        <Users className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div className="text-3xl font-bold text-white">{totalCharacters}</div>
                    <p className="text-xs text-zinc-500 mt-1">Tracked entities & profiles</p>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl">
                    <div className="flex items-center justify-between text-zinc-400 mb-2">
                        <span className="text-sm font-medium">Lore Entries</span>
                        <BookOpen className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div className="text-3xl font-bold text-white">{totalLore}</div>
                    <p className="text-xs text-zinc-500 mt-1">World-building fragments</p>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl">
                    <div className="flex items-center justify-between text-zinc-400 mb-2">
                        <span className="text-sm font-medium">Locations</span>
                        <ArrowUpRight className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div className="text-3xl font-bold text-white">{totalLocations}</div>
                    <p className="text-xs text-zinc-500 mt-1">Registered map zones</p>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl">
                    <div className="flex items-center justify-between text-zinc-400 mb-2">
                        <span className="text-sm font-medium">Factions</span>
                        <Shield className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div className="text-3xl font-bold text-white">{totalFactions}</div>
                    <p className="text-xs text-zinc-500 mt-1">Active organizations</p>
                </div>
            </div>

            {/* Recent Activity / Quick Streams */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Characters */}
                <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-zinc-100">Recent Characters</h3>
                        <Link to="/dashboard/characters" className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">View All →</Link>
                    </div>
                    <div className="divide-y divide-zinc-800/60">
                        {characters.slice(0, 5).map(char => (
                            <div key={char.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 font-bold text-xs">
                                        {char.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-zinc-200">{char.name}</div>
                                        <div className="text-xs text-zinc-500">{char.role || 'No Role Assigned'}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {characters.length === 0 && (
                            <p className="text-sm text-zinc-500 py-4 text-center">No characters created yet.</p>
                        )}
                    </div>
                </div>

                {/* Recent Lore */}
                <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-zinc-100">Recent World Lore</h3>
                        <Link to="/dashboard/world" className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors">View All →</Link>
                    </div>
                    <div className="divide-y divide-zinc-800/60">
                        {loreEntries.slice(0, 5).map(lore => (
                            <div key={lore.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                                <div>
                                    <div className="text-sm font-medium text-zinc-200">{lore.title}</div>
                                    <div className="text-xs text-zinc-500 uppercase tracking-wider">{lore.category}</div>
                                </div>
                            </div>
                        ))}
                        {loreEntries.length === 0 && (
                            <p className="text-sm text-zinc-500 py-4 text-center">No lore entries logged yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}