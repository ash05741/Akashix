import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import {
    Plus, Loader2, X, Server, ChevronRight,
    User as UserIcon, Globe, Lock, Code, Calendar,
    Sparkles, Crown, Search, Castle, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

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

const formatRealmDate = (timestamp: string) => {
    if (!timestamp) return 'Recently';
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(new Date(Number(timestamp)));
};

export default function Workspaces() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
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
                Initializing profile...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen bg-[#FAF6ED] items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border border-red-200 bg-white rounded-2xl p-8 text-center max-w-md shadow-sm"
                >
                    <span className="text-xs font-bold text-red-600 uppercase tracking-widest block mb-2">
                        CRITICAL_ERR: Failed to load profile data
                    </span>
                    <p className="text-sm text-zinc-600">{error.message}</p>
                </motion.div>
            </div>
        );
    }

    const workspaces = data?.getMyWorkspaces || [];
    const filteredWorkspaces = workspaces.filter(ws =>
        ws.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const creatorName = user?.name || "Verified Creator";

    return (
        <div className="min-h-screen bg-[#FAF6ED] font-sans selection:bg-amber-200 selection:text-black text-zinc-900 pt-12 pb-24">

            <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col gap-10">

                {/* --- COMPACT PROFILE HEADER --- */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 bg-white border border-zinc-200 p-1.5 shrink-0 relative shadow-md rounded-2xl">
                            <div className="w-full h-full bg-[#081B21] rounded-xl flex items-center justify-center overflow-hidden">
                                <UserIcon className="w-8 h-8 text-[#d9a05b]" strokeWidth={2} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                        </div>

                        <div>
                            <h1 className="font-serif text-2xl md:text-3xl font-bold text-zinc-900 mb-2">
                                {creatorName}
                            </h1>
                            <span className="inline-flex items-center gap-1.5 bg-white border border-zinc-200 px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase tracking-widest text-zinc-700 shadow-sm">
                                <Code className="w-3.5 h-3.5 text-amber-600" /> OWNER
                            </span>
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-xl p-4 min-w-[140px] shadow-sm flex flex-col justify-center">
                        <div className="flex justify-between items-center mb-1">
                            <Crown className="w-4 h-4 text-amber-600" />
                            <div className="font-serif text-xl font-bold text-zinc-900">{workspaces.length}</div>
                        </div>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right mt-1">Total Realms</div>
                    </div>
                </motion.div>

                {/* --- REALMS LIST --- */}
                <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-zinc-200 pb-5">
                        <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-100">
                                <Server className="w-4 h-4 text-amber-600" />
                            </div>
                            <h2 className="font-serif text-xl md:text-2xl font-bold text-zinc-900">Tenant Realms</h2>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                            <div className="relative w-full sm:w-64">
                                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search realms..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white border border-zinc-200 rounded-lg py-2 pl-9 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#d9a05b] focus:ring-1 focus:ring-[#d9a05b] shadow-sm transition-all"
                                />
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center justify-center gap-2 bg-[#0F2C24] hover:bg-[#153b30] text-white px-5 py-2 w-full sm:w-auto text-xs font-bold uppercase tracking-wider transition-colors rounded-lg shadow-sm shrink-0"
                            >
                                <Plus className="w-4 h-4 text-[#d9a05b]" /> Deploy Realm
                            </button>
                        </div>
                    </div>

                    {filteredWorkspaces.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-300 rounded-2xl bg-white/50 shadow-sm">
                            <Terminal className="w-10 h-10 text-zinc-400 mb-3" strokeWidth={1.5} />
                            <h3 className="font-serif text-lg font-bold text-zinc-900 mb-2">No Matches Found</h3>
                            <p className="text-xs text-zinc-500 uppercase tracking-widest text-center">
                                {searchQuery ? "No realms match your search criteria." : "Directory is empty. Deploy a new workspace realm."}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {filteredWorkspaces.map((workspace, index) => (
                                <motion.div
                                    key={workspace.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    whileHover={{ y: -2 }}
                                    onClick={() => handleEnterWorkspace(workspace.id, workspace.name)}
                                    className="flex flex-col sm:flex-row bg-white border border-zinc-200 hover:border-amber-400/60 rounded-2xl p-3 gap-4 group transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                                >
                                    {/* Scaled down thumbnail */}
                                    <div className="w-full sm:w-32 h-32 rounded-xl shrink-0 shadow-inner flex items-center justify-center bg-[#081B21] relative overflow-hidden">
                                        <Castle className="w-10 h-10 text-[#d9a05b] opacity-80" strokeWidth={1.5} />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between py-1 pr-2">
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                                                    ID: {workspace.id.slice(-8).toUpperCase()}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className="flex items-center gap-1.5 px-2 py-0.5 bg-zinc-50 border border-zinc-200 rounded-md text-[9px] font-bold uppercase tracking-wider text-zinc-600">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Active
                                                    </span>

                                                    {workspace.isPublic ? (
                                                        <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[9px] uppercase tracking-wider rounded-md border border-emerald-100">
                                                            <Globe className="w-3 h-3" /> Public
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 px-2 py-0.5 bg-zinc-50 text-zinc-600 font-bold text-[9px] uppercase tracking-wider rounded-md border border-zinc-200">
                                                            <Lock className="w-3 h-3" /> Private
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <h3 className="font-serif text-xl font-bold text-zinc-900 tracking-tight mb-1 group-hover:text-amber-700 transition-colors">
                                                {workspace.name}
                                            </h3>

                                            <p className="text-sm text-zinc-500 line-clamp-1">
                                                {workspace.description || <span className="italic opacity-60">No description provided.</span>}
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-center pt-3 mt-3 border-t border-zinc-100">
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {formatRealmDate(workspace.createdAt)}
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 uppercase tracking-widest transition-transform duration-300 group-hover:translate-x-1">
                                                Mount Realm <ChevronRight className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Workspace Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            className="bg-white border border-zinc-200 w-full max-w-lg rounded-2xl relative shadow-xl overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-5 border-b border-zinc-100 bg-zinc-50">
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 bg-[#081B21] rounded-lg shadow-inner">
                                        <Sparkles className="w-4 h-4 text-[#d9a05b]" />
                                    </div>
                                    <h2 className="font-serif text-lg font-bold text-zinc-900">Configure Realm</h2>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 p-1.5 rounded-lg transition-colors cursor-pointer">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreate} className="p-6 space-y-5">
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-zinc-500 tracking-widest uppercase">
                                        Designation [Name]
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="block w-full bg-white border border-zinc-200 px-3 py-2.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#d9a05b] focus:border-[#d9a05b] rounded-lg transition-all text-sm shadow-sm"
                                        placeholder="e.g. Project Obsidian"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-zinc-500 tracking-widest uppercase">
                                        Parameters [Description]
                                    </label>
                                    <textarea
                                        maxLength={200}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="block w-full bg-white border border-zinc-200 px-3 py-2.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#d9a05b] focus:border-[#d9a05b] rounded-lg transition-all text-sm shadow-sm resize-none h-24"
                                        placeholder="Define the core parameters of this realm..."
                                    />
                                </div>

                                <div className="pt-4 flex justify-end gap-3 border-t border-zinc-100 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-5 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg uppercase tracking-wider transition-colors cursor-pointer"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isCreating || !formData.name.trim()}
                                        className="flex items-center gap-2 bg-[#0F2C24] hover:bg-[#153b30] text-white px-6 py-2 text-xs font-bold uppercase tracking-wider transition-colors rounded-lg disabled:opacity-50 shadow-sm cursor-pointer"
                                    >
                                        {isCreating ? <><Loader2 className="w-3.5 h-3.5 animate-spin text-[#d9a05b]" /> Compiling...</> : 'Deploy Node'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}