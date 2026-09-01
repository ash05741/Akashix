import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Plus, Loader2, X, Server, Terminal, ChevronRight, User as UserIcon, Globe, Lock, Code, Box, Calendar, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlobalSearch } from '../components/GlobalSearch';
import { useAuth } from '../context/AuthContext'; // <-- Imported useAuth

// --- GraphQL Operations ---
const GET_MY_WORKSPACES = gql`
  query GetMyWorkspaces {
    getMyWorkspaces {
      id
      name
      description
      isPublic
      createdAt
    }
  }
`;

const CREATE_WORKSPACE = gql`
  mutation CreateWorkspace($name: String!, $description: String) {
    createWorkspace(name: $name, description: $description) {
      id
      name
      description
      isPublic
    }
  }
`;

// --- TypeScript Interfaces ---
interface Workspace {
    id: string;
    name: string;
    description: string | null;
    isPublic: boolean;
    createdAt: string;
}

interface WorkspacesData {
    getMyWorkspaces: Workspace[];
}

interface CreateWorkspaceData {
    createWorkspace: Workspace;
}

export default function Workspaces() {
    const navigate = useNavigate();
    const { user } = useAuth(); // <-- Pulled user data from context

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '' });

    const { data, loading, error } = useQuery<WorkspacesData>(GET_MY_WORKSPACES);

    const [createWorkspace, { loading: isCreating }] = useMutation<CreateWorkspaceData>(CREATE_WORKSPACE, {
        refetchQueries: [{ query: GET_MY_WORKSPACES }],
        onCompleted: (result) => {
            setIsModalOpen(false);
            setFormData({ name: '', description: '' });
            if (result?.createWorkspace) {
                handleEnterWorkspace(result.createWorkspace.id, result.createWorkspace.name);
            }
        },
        onError: (err) => {
            console.error("Mutation error:", err.message);
            alert(`SYSTEM_ERR: ${err.message}`);
        }
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createWorkspace({ variables: formData });
    };

    const handleEnterWorkspace = (id: string, name: string) => {
        localStorage.setItem('workspaceId', id);
        localStorage.setItem('workspaceName', name);
        navigate('/dashboard');
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-[#FAF6ED] items-center justify-center text-zinc-500 font-medium text-sm tracking-wide">
                <Loader2 className="h-5 w-5 animate-spin mr-3 text-[#d9a05b]" />
                Initializing creator profile...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen bg-[#FAF6ED] items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border border-red-500/30 bg-red-500/5 rounded-2xl p-8 text-center max-w-md shadow-xl"
                >
                    <span className="text-xs font-semibold text-red-500 uppercase tracking-widest block mb-2">
                        CRITICAL_ERR: Failed to load profile data
                    </span>
                    <p className="text-sm text-zinc-600">{error.message}</p>
                </motion.div>
            </div>
        );
    }

    const workspaces = data?.getMyWorkspaces || [];
    const publicCount = workspaces.filter(ws => ws.isPublic).length;

    // <-- Replaced hardcoded "System Admin" with actual user name
    const creatorName = user?.name || "Verified Creator";

    return (
        <div className="min-h-screen bg-[#FAF6ED] font-sans selection:bg-amber-200 selection:text-black relative overflow-x-hidden text-zinc-800">

            {/* --- CINEMATIC BANNER --- */}
            <div className="w-full h-52 md:h-72 relative bg-[#081B21] overflow-hidden shadow-lg">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 filter brightness-90"
                    style={{ backgroundImage: "url('https://images3.alphacoders.com/744/thumb-1920-744829.jpg')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6ED] via-[#081B21]/60 to-[#081B21]/80"></div>

                <div className="absolute top-6 left-6 md:left-12 flex items-center gap-2">
                    <Sparkles className="text-[#d9a05b] w-5 h-5" strokeWidth={2} />
                    <span className="font-semibold text-white tracking-wide text-lg drop-shadow">
                        AKASHIX<span className="text-[#d9a05b]">CORE</span>
                    </span>
                </div>
            </div>

            {/* --- OVERLAPPING PROFILE CONTAINER --- */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 -mt-24 mb-20 flex flex-col gap-12">

                {/* Profile Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                        {/* Avatar Card */}
                        <div className="w-32 h-32 md:w-36 md:h-36 bg-white border border-zinc-200 p-2 shrink-0 relative shadow-2xl rounded-2xl">
                            <div className="w-full h-full bg-[#081B21] rounded-xl flex items-center justify-center overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#081B21] to-[#11272B]"></div>
                                <UserIcon className="w-14 h-14 text-[#d9a05b] relative z-10" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
                        </div>

                        {/* Identity & Tags */}
                        <div className="pb-1">
                            <h1 className="font-serif text-4xl md:text-5xl font-medium text-zinc-900 tracking-tight mb-3">
                                {creatorName}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2.5 text-xs">
                                {/* <-- Added dynamic role from AuthContext */}
                                <span className="flex items-center gap-1.5 bg-white border border-zinc-200 px-3 py-1.5 rounded-lg font-medium text-zinc-700 shadow-sm capitalize">
                                    <Code className="w-3.5 h-3.5 text-[#d9a05b]" /> {user?.role || 'Creator'}
                                </span>
                                <span className="flex items-center gap-1.5 bg-white border border-zinc-200 px-3 py-1.5 rounded-lg font-medium text-zinc-700 shadow-sm">
                                    <Box className="w-3.5 h-3.5 text-[#d9a05b]" /> 3D Entity Modeler
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Blocks */}
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="bg-white border border-zinc-200 rounded-2xl p-5 min-w-[120px] flex-1 md:flex-none shadow-sm">
                            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1">Total Realms</div>
                            <div className="font-serif text-3xl font-semibold text-zinc-900">{workspaces.length}</div>
                        </div>
                        <div className="bg-white border border-zinc-200 rounded-2xl p-5 min-w-[120px] flex-1 md:flex-none shadow-sm">
                            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1">Public Hubs</div>
                            <div className="font-serif text-3xl font-semibold text-zinc-900">{publicCount}</div>
                        </div>
                    </div>
                </motion.div>

                {/* --- TWO COLUMN LAYOUT --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Search & System Activity */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="sticky top-6 z-40">
                            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">Global Directory</span>
                            <GlobalSearch />
                        </div>

                        {/* System Terminal Log Card */}
                        <div className="border border-zinc-200 bg-white rounded-2xl p-6 hidden md:block shadow-sm">
                            <div className="flex items-center gap-2.5 border-b border-zinc-100 pb-3 mb-4">
                                <Terminal className="w-4 h-4 text-[#d9a05b]" />
                                <span className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">System Activity Log</span>
                            </div>
                            <div className="text-xs text-zinc-600 space-y-3">
                                <div className="flex gap-4">
                                    <span className="text-zinc-400 shrink-0 font-mono">10:42 AM</span>
                                    <span className="text-zinc-700">Compiled TypeScript interfaces...</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="text-zinc-400 shrink-0 font-mono">09:15 AM</span>
                                    <span className="text-zinc-700">Updated MongoDB schema rules...</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="text-zinc-400 shrink-0 font-mono">Yesterday</span>
                                    <span className="text-zinc-700">Rendered mesh in Blender...</span>
                                </div>
                                <div className="flex gap-4 animate-pulse">
                                    <span className="text-amber-600 shrink-0 font-mono">Now</span>
                                    <span className="text-zinc-900 font-medium">Awaiting user input_</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Workspaces Grid */}
                    <div className="lg:col-span-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 border-b border-zinc-200 pb-4 gap-4">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                    <Server className="w-4 h-4 text-amber-600" />
                                </div>
                                <h2 className="font-serif text-2xl font-semibold text-zinc-900">Tenant Realms</h2>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 bg-[#0F2C24] hover:bg-[#153b30] text-white px-5 py-3 text-xs font-medium uppercase tracking-wider transition-colors rounded-xl w-full sm:w-auto justify-center shadow-md cursor-pointer"
                            >
                                <Plus className="w-4 h-4 text-[#d9a05b]" />
                                Deploy Realm
                            </motion.button>
                        </div>

                        {/* Grid / Empty State */}
                        {workspaces.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-32 border border-dashed border-zinc-300 rounded-3xl bg-white/50 shadow-sm"
                            >
                                <Terminal className="w-12 h-12 text-zinc-400 mb-4" strokeWidth={1.5} />
                                <h3 className="font-serif text-xl font-semibold text-zinc-900 mb-2">No Active Nodes</h3>
                                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-6 text-center max-w-sm">
                                    Directory is empty. Deploy a new workspace realm to begin compiling lore.
                                </p>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {workspaces.map((workspace, index) => (
                                    <motion.div
                                        key={workspace.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                        whileHover={{ y: -4 }}
                                        onClick={() => handleEnterWorkspace(workspace.id, workspace.name)}
                                        className="relative bg-white border border-zinc-200 hover:border-amber-400/60 rounded-2xl p-6 lg:p-7 group transition-all duration-300 cursor-pointer flex flex-col h-full min-h-[220px] shadow-sm hover:shadow-xl"
                                    >
                                        {/* Status Badge */}
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                                                ID: {workspace.id.slice(-8)}
                                            </span>
                                            {workspace.isPublic ? (
                                                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold text-[10px] uppercase tracking-wider rounded-lg border border-emerald-200">
                                                    <Globe className="w-3 h-3" /> Public
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 text-zinc-600 font-semibold text-[10px] uppercase tracking-wider rounded-lg border border-zinc-200">
                                                    <Lock className="w-3 h-3" /> Private
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="font-serif text-xl font-semibold text-zinc-900 tracking-tight mb-2 group-hover:text-amber-700 transition-colors">
                                            {workspace.name}
                                        </h3>

                                        <p className="text-sm text-zinc-600 line-clamp-3 mb-6 flex-1 leading-relaxed">
                                            {workspace.description || <span className="italic opacity-40 text-xs">No description parameters provided...</span>}
                                        </p>

                                        <div className="mt-auto flex justify-between items-center border-t border-zinc-100 pt-4">
                                            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(Number(workspace.createdAt)).toLocaleDateString() || 'Recently'}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 uppercase transition-transform duration-300 group-hover:translate-x-1">
                                                Mount <ChevronRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Workspace Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="bg-white border border-zinc-200 w-full max-w-lg rounded-3xl relative shadow-2xl overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-zinc-100 bg-zinc-50">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-[#d9a05b]" />
                                    <h2 className="font-serif text-xl font-semibold text-zinc-900">Configure Realm</h2>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreate} className="p-8 space-y-5">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-zinc-700 tracking-wide uppercase">
                                        Designation [Name]
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="block w-full bg-white border border-zinc-200 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#d9a05b] focus:border-[#d9a05b] rounded-xl transition-all text-sm shadow-sm"
                                        placeholder="e.g. Project Obsidian"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-zinc-700 tracking-wide uppercase">
                                        Parameters [Description]
                                    </label>
                                    <textarea
                                        maxLength={200}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="block w-full bg-white border border-zinc-200 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#d9a05b] focus:border-[#d9a05b] rounded-xl transition-all text-sm shadow-sm resize-none h-24"
                                        placeholder="Define the core parameters of this realm..."
                                    />
                                </div>

                                <div className="pt-4 flex justify-end gap-3 border-t border-zinc-100 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-5 py-2.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 uppercase tracking-wider transition-colors cursor-pointer"
                                    >
                                        Abort
                                    </button>
                                    <motion.button
                                        type="submit"
                                        disabled={isCreating || !formData.name.trim()}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center gap-2 bg-[#0F2C24] hover:bg-[#153b30] text-white px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors rounded-xl disabled:opacity-50 shadow-md cursor-pointer"
                                    >
                                        {isCreating ? <><Loader2 className="w-4 h-4 animate-spin text-[#d9a05b]" /> Compiling...</> : 'Deploy Node'}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}