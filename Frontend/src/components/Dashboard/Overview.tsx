import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import {
    Users, Shield, Loader2, ChevronRight, Plus,
    Map, FileText, User as UserIcon, Code, BookOpen
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

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
    const { user } = useAuth();
    const navigate = useNavigate();
    const workspaceName = localStorage.getItem('workspaceName') || 'Root Node';

    const { data, loading, error } = useQuery<OverviewData>(GET_OVERVIEW_DATA);

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex h-screen bg-[#FAF6ED] items-center justify-center"
            >
                <Loader2 className="h-8 w-8 animate-spin text-[#d9a05b]" />
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-red-50 p-6 text-red-700 border border-red-200 shadow-sm m-6"
            >
                Failed to load dashboard metrics: {error.message}
            </motion.div>
        );
    }

    const characters = data?.getCharacters || [];
    const loreEntries = data?.getAllLore || [];

    const totalCharacters = characters.length;
    const totalLore = loreEntries.length;
    const totalLocations = loreEntries.filter(l => l.category === 'Location').length;
    const totalFactions = loreEntries.filter(l => l.category === 'Faction').length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="min-h-screen bg-[#FAF6ED] text-zinc-900 font-sans pb-16 pt-8 md:pt-12 selection:bg-amber-200"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                {/* Clean, Compact Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-zinc-200 pb-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-white border border-zinc-200 p-1 shrink-0 relative shadow-sm rounded-2xl">
                            <div className="w-full h-full bg-[#081B21] rounded-xl flex items-center justify-center shadow-inner">
                                <UserIcon className="w-6 h-6 text-[#d9a05b]" strokeWidth={2} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                        </div>

                        <div>
                            <h1 className="font-serif text-2xl md:text-3xl font-bold text-zinc-900 mb-1">
                                {user?.name || 'Raj'}
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 bg-white border border-zinc-200 text-zinc-700 text-[9px] font-bold uppercase tracking-widest rounded-lg shadow-xs flex items-center gap-1.5">
                                    <Code className="w-3 h-3 text-amber-600" /> Owner
                                </span>
                                <span className="text-xs text-zinc-500 font-medium">
                                    Realm: <span className="text-zinc-900 font-bold">{workspaceName}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ y: -1 }}
                        whileTap={{ y: 1 }}
                        onClick={() => navigate('/workspaces')}
                        className="flex items-center gap-2 bg-white border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-700 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 shadow-sm cursor-pointer"
                    >
                        Switch Realm <ChevronRight className="w-3.5 h-3.5" />
                    </motion.button>
                </div>

                {/* Top Metrics Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 text-zinc-400 mb-2">
                            <Users className="w-4 h-4 text-amber-600" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Characters</span>
                        </div>
                        <div className="font-serif text-3xl font-bold text-zinc-900">{totalCharacters}</div>
                    </motion.div>
                    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 text-zinc-400 mb-2">
                            <Map className="w-4 h-4 text-emerald-600" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Locations</span>
                        </div>
                        <div className="font-serif text-3xl font-bold text-zinc-900">{totalLocations}</div>
                    </motion.div>
                    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 text-zinc-400 mb-2">
                            <Shield className="w-4 h-4 text-purple-600" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Factions</span>
                        </div>
                        <div className="font-serif text-3xl font-bold text-zinc-900">{totalFactions}</div>
                    </motion.div>
                    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 text-zinc-400 mb-2">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Total Lore</span>
                        </div>
                        <div className="font-serif text-3xl font-bold text-zinc-900">{totalLore}</div>
                    </motion.div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Recent Characters */}
                        <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100">
                                <h3 className="font-serif text-xl font-bold text-zinc-900">Recent Characters</h3>
                                <Link to="/dashboard/characters" className="text-[10px] font-bold text-amber-700 uppercase tracking-widest hover:underline">View all</Link>
                            </div>
                            <div className="space-y-4">
                                {characters.slice(0, 5).map(char => (
                                    <div key={char.id} className="flex items-center gap-4 group p-2 rounded-2xl hover:bg-zinc-50 transition-colors">
                                        <div className="w-12 h-12 rounded-2xl bg-[#081B21] flex items-center justify-center shrink-0 shadow-inner">
                                            <span className="text-[#d9a05b] font-serif font-bold text-sm">{char.name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-zinc-900 group-hover:text-amber-700 transition-colors">{char.name}</div>
                                            <div className="text-xs text-zinc-500 line-clamp-1">{char.role || 'No role defined'}</div>
                                        </div>
                                    </div>
                                ))}
                                {characters.length === 0 && (
                                    <p className="text-sm text-zinc-400 italic py-4">No characters established in this realm yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Recent Lore */}
                        <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100">
                                <h3 className="font-serif text-xl font-bold text-zinc-900">Recent World Lore</h3>
                                <Link to="/dashboard/world" className="text-[10px] font-bold text-amber-700 uppercase tracking-widest hover:underline">View all</Link>
                            </div>
                            <div className="space-y-4">
                                {loreEntries.slice(0, 5).map(lore => (
                                    <div key={lore.id} className="flex items-center justify-between group p-2 rounded-2xl hover:bg-zinc-50 transition-colors">
                                        <div>
                                            <div className="text-sm font-bold text-zinc-900 group-hover:text-amber-700 transition-colors mb-1">{lore.title}</div>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest bg-zinc-100 text-zinc-600 border border-zinc-200 shadow-xs">
                                                {lore.category}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {loreEntries.length === 0 && (
                                    <p className="text-sm text-zinc-400 italic py-4">No world building documents found.</p>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Right Column (Quick Actions) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm">
                            <h3 className="font-serif text-lg font-bold text-zinc-900 mb-5">Quick Actions</h3>
                            <div className="space-y-2.5">
                                <Link to="/dashboard/characters" className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-zinc-50 border border-zinc-100 hover:border-zinc-200 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600 group-hover:bg-amber-100 transition-colors"><UserIcon className="w-4 h-4" /></div>
                                        <span className="text-xs font-bold text-zinc-700">New Character</span>
                                    </div>
                                    <Plus className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 transition-transform group-hover:scale-110" />
                                </Link>
                                <Link to="/dashboard/world" className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-zinc-50 border border-zinc-100 hover:border-zinc-200 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-100 transition-colors"><Map className="w-4 h-4" /></div>
                                        <span className="text-xs font-bold text-zinc-700">Add Location</span>
                                    </div>
                                    <Plus className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 transition-transform group-hover:scale-110" />
                                </Link>
                                <Link to="/dashboard/world" className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-zinc-50 border border-zinc-100 hover:border-zinc-200 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600 group-hover:bg-purple-100 transition-colors"><Shield className="w-4 h-4" /></div>
                                        <span className="text-xs font-bold text-zinc-700">Create Faction</span>
                                    </div>
                                    <Plus className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 transition-transform group-hover:scale-110" />
                                </Link>
                                <Link to="/dashboard/world" className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-zinc-50 border border-zinc-100 hover:border-zinc-200 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-100 transition-colors"><FileText className="w-4 h-4" /></div>
                                        <span className="text-xs font-bold text-zinc-700">Draft Document</span>
                                    </div>
                                    <Plus className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 transition-transform group-hover:scale-110" />
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </motion.div>
    );
}