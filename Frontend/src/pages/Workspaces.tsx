import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Plus, Loader2, X, Crosshair, Server, Terminal, ChevronRight, User as UserIcon, Globe, Lock, Code, Box, Calendar } from 'lucide-react';
import { GlobalSearch } from '../components/GlobalSearch';

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
            <div className="flex min-h-screen bg-black items-center justify-center font-mono text-zinc-500 uppercase tracking-widest text-xs">
                <Loader2 className="h-5 w-5 animate-spin mr-3" />
                Initializing Creator Profile...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen bg-black items-center justify-center p-4">
                <div className="border border-red-500/30 bg-red-500/5 p-6 text-center max-w-md">
                    <span className="font-mono text-[10px] text-red-500 tracking-widest uppercase">
                        CRITICAL_ERR: Failed to load profile data. <br /> {error.message}
                    </span>
                </div>
            </div>
        );
    }

    const workspaces = data?.getMyWorkspaces || [];
    const publicCount = workspaces.filter(ws => ws.isPublic).length;
    const creatorName = "System Admin";

    return (
        <div className="min-h-screen bg-black font-sans selection:bg-zinc-700 selection:text-white relative overflow-x-hidden">

            {/* Global Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none fixed"></div>

            {/* --- CUSTOM BACKGROUND BANNER --- */}
            <div className="w-full h-48 md:h-64 relative border-b border-zinc-800 bg-zinc-950 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-80"></div>
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent"></div>

                <Crosshair className="absolute top-4 left-4 w-6 h-6 text-zinc-700" strokeWidth={1} />
                <Crosshair className="absolute top-4 right-4 w-6 h-6 text-zinc-700" strokeWidth={1} />
                <div className="absolute bottom-4 right-6 font-mono text-[9px] text-zinc-600 tracking-widest uppercase hidden md:block">
                    BANNER_ID: SEC-01 // RENDER_OK
                </div>
            </div>

            {/* --- OVERLAPPING PROFILE CONTAINER --- */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 -mt-20 mb-20 flex flex-col gap-12">

                {/* Profile Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                        {/* Avatar Overlay */}
                        <div className="w-32 h-32 md:w-36 md:h-36 bg-black border-2 border-zinc-800 p-2 shrink-0 relative shadow-2xl">
                            <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                                <UserIcon className="w-14 h-14 text-zinc-700" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-3.5 h-3.5 bg-white animate-pulse"></div>
                        </div>

                        {/* Identity & Tags */}
                        <div className="pb-1">
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none mb-3">
                                {creatorName}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-zinc-400">
                                <span className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5">
                                    <Code className="w-3 h-3 text-white" /> Full-Stack Architect
                                </span>
                                <span className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5">
                                    <Box className="w-3 h-3 text-white" /> 3D Entity Modeler
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Blocks */}
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="bg-black border border-zinc-800 p-4 min-w-[110px] flex-1 md:flex-none shadow-lg">
                            <div className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Total Nodes</div>
                            <div className="text-3xl font-black text-white">{workspaces.length}</div>
                        </div>
                        <div className="bg-black border border-zinc-800 p-4 min-w-[110px] flex-1 md:flex-none shadow-lg">
                            <div className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Public Hubs</div>
                            <div className="text-3xl font-black text-white">{publicCount}</div>
                        </div>
                    </div>
                </div>

                {/* --- TWO COLUMN LAYOUT --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Activity & Search */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="sticky top-6 z-40">
                            <h3 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Global Directory</h3>
                            <GlobalSearch />
                        </div>

                        {/* System Terminal Log */}
                        <div className="border border-zinc-800 bg-black/80 backdrop-blur-sm p-6 hidden md:block shadow-xl">
                            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-4">
                                <Terminal className="w-4 h-4 text-zinc-500" />
                                <span className="font-mono text-[10px] text-white uppercase tracking-widest">System Activity Log</span>
                            </div>
                            <div className="font-mono text-[10px] text-zinc-600 space-y-3">
                                <div className="flex gap-4">
                                    <span className="text-zinc-500 shrink-0">10:42 AM</span>
                                    <span className="text-zinc-300">Compiled TypeScript interfaces...</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="text-zinc-500 shrink-0">09:15 AM</span>
                                    <span className="text-zinc-300">Updated MongoDB schema rules...</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="text-zinc-500 shrink-0">Yesterday</span>
                                    <span className="text-zinc-300">Rendered mesh in Blender...</span>
                                </div>
                                <div className="flex gap-4 animate-pulse">
                                    <span className="text-zinc-500 shrink-0">Now</span>
                                    <span className="text-zinc-300">Awaiting user input_</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Workspaces Grid */}
                    <div className="lg:col-span-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 border-b border-zinc-800 pb-4 gap-4">
                            <div className="flex items-center gap-2">
                                <Server className="w-5 h-5 text-white" />
                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Tenant Realms</h2>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 border border-white bg-white text-black hover:bg-black hover:text-white px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors rounded-none w-full sm:w-auto justify-center shadow-md"
                            >
                                <Plus className="w-4 h-4" />
                                Deploy Realm
                            </button>
                        </div>

                        {/* Grid / Empty State */}
                        {workspaces.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 border border-dashed border-zinc-800 bg-black/50 shadow-xl">
                                <Terminal className="w-12 h-12 text-zinc-700 mb-4" strokeWidth={1} />
                                <h3 className="text-lg font-black text-white uppercase mb-2">No Active Nodes</h3>
                                <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-8 text-center max-w-sm">
                                    Directory is empty. Deploy a new workspace realm to begin compiling lore.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {workspaces.map((workspace) => (
                                    <div
                                        key={workspace.id}
                                        onClick={() => handleEnterWorkspace(workspace.id, workspace.name)}
                                        className="relative border border-zinc-800 bg-black/80 backdrop-blur-sm p-6 lg:p-8 group hover:border-white hover:bg-zinc-900/30 transition-all cursor-pointer flex flex-col h-full min-h-[220px] shadow-xl"
                                    >
                                        <Crosshair className="absolute -top-3 -left-3 w-5 h-5 text-zinc-800 group-hover:text-white transition-colors" strokeWidth={1} />

                                        {/* Status Badge */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">
                                                ID: {workspace.id.slice(-8)}
                                            </div>
                                            {workspace.isPublic ? (
                                                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 text-white font-mono text-[9px] uppercase tracking-widest border border-white/20">
                                                    <Globe className="w-3 h-3" /> Public
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 text-zinc-500 font-mono text-[9px] uppercase tracking-widest border border-zinc-800">
                                                    <Lock className="w-3 h-3" /> Private
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight mb-3">
                                            {workspace.name}
                                        </h3>

                                        <p className="text-sm text-zinc-400 font-sans line-clamp-3 mb-8 flex-1">
                                            {workspace.description || <span className="italic opacity-30 font-mono text-xs uppercase tracking-wider">No description parameters...</span>}
                                        </p>

                                        <div className="mt-auto flex justify-between items-center border-t border-zinc-800 pt-4 group-hover:border-zinc-600 transition-colors">
                                            <div className="flex items-center gap-2 text-zinc-500 font-mono text-[9px] uppercase tracking-widest">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(Number(workspace.createdAt)).toLocaleDateString() || 'Recently'}
                                            </div>
                                            <div className="flex items-center gap-1 font-mono text-[10px] font-bold tracking-widest text-white uppercase opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                Mount <ChevronRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Workspace Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="bg-black border border-zinc-800 w-full max-w-lg relative shadow-2xl">
                        <Crosshair className="absolute -top-3 -left-3 w-6 h-6 text-zinc-700" strokeWidth={1} />
                        <Crosshair className="absolute -top-3 -right-3 w-6 h-6 text-zinc-700" strokeWidth={1} />
                        <Crosshair className="absolute -bottom-3 -left-3 w-6 h-6 text-zinc-700" strokeWidth={1} />
                        <Crosshair className="absolute -bottom-3 -right-3 w-6 h-6 text-zinc-700" strokeWidth={1} />

                        <div className="flex justify-between items-center p-6 border-b border-zinc-800 bg-zinc-900/20">
                            <h2 className="text-lg font-black text-white uppercase tracking-widest">Configure Realm</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="block font-mono text-[10px] text-zinc-400 tracking-widest uppercase">
                                    Designation [Name]
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="block w-full bg-black border border-zinc-800 px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-white font-mono text-sm transition-colors rounded-none"
                                    placeholder="e.g. Project Obsidian"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block font-mono text-[10px] text-zinc-400 tracking-widest uppercase">
                                    Parameters [Description]
                                </label>
                                <textarea
                                    maxLength={200}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="block w-full bg-black border border-zinc-800 px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-white font-mono text-sm transition-colors rounded-none resize-none h-24"
                                    placeholder="Define the core parameters of this realm..."
                                />
                            </div>

                            <div className="pt-6 flex justify-end gap-4 border-t border-zinc-800 mt-8">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-mono text-[10px] font-bold tracking-widest text-zinc-500 hover:text-white uppercase transition-colors">
                                    Abort
                                </button>
                                <button type="submit" disabled={isCreating || !formData.name.trim()} className="flex items-center gap-3 border border-white bg-white text-black hover:bg-black hover:text-white px-6 py-3 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors rounded-none disabled:opacity-50">
                                    {isCreating ? <><Loader2 className="w-4 h-4 animate-spin" /> Compiling...</> : 'Deploy Node'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}