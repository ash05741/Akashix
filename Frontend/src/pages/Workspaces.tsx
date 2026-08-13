import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Plus, Loader2, X, Crosshair, Server, Terminal, ChevronRight } from 'lucide-react';

// --- GraphQL Operations ---
const GET_MY_WORKSPACES = gql`
  query GetMyWorkspaces {
    getMyWorkspaces {
      id
      name
      description
    }
  }
`;

const CREATE_WORKSPACE = gql`
  mutation CreateWorkspace($name: String!, $description: String) {
    createWorkspace(name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

// --- TypeScript Interfaces ---
interface Workspace {
    id: string;
    name: string;
    description: string | null;
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

    // --- Apollo Hooks ---
    const { data, loading, error } = useQuery<WorkspacesData>(GET_MY_WORKSPACES);

    const [createWorkspace, { loading: isCreating }] = useMutation<CreateWorkspaceData>(CREATE_WORKSPACE, {
        refetchQueries: [{ query: GET_MY_WORKSPACES }],
        onCompleted: (result) => {
            setIsModalOpen(false);
            setFormData({ name: '', description: '' });
            if (result?.createWorkspace) {
                handleEnterWorkspace(result.createWorkspace.id);
            }
        },
        onError: (err) => {
            console.error("Mutation error:", err.message);
            alert(`SYSTEM_ERR: ${err.message}`);
        }
    });

    // --- Handlers ---
    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createWorkspace({ variables: formData });
    };

    const handleEnterWorkspace = (workspaceId: string) => {
        localStorage.setItem('workspaceId', workspaceId);
        navigate('/dashboard');
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-black items-center justify-center font-mono text-zinc-500 uppercase tracking-widest text-xs">
                <Loader2 className="h-5 w-5 animate-spin mr-3" />
                Initializing Directory...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen bg-black items-center justify-center p-4">
                <div className="border border-red-500/30 bg-red-500/5 p-6 text-center max-w-md">
                    <span className="font-mono text-[10px] text-red-500 tracking-widest uppercase">
                        CRITICAL_ERR: Failed to connect to workspace directory. <br /> {error.message}
                    </span>
                </div>
            </div>
        );
    }

    const workspaces = data?.getMyWorkspaces || [];

    return (
        <div className="min-h-screen bg-black p-6 md:p-12 font-sans selection:bg-zinc-700 selection:text-white relative overflow-hidden flex flex-col items-center">

            {/* Schematic Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"></div>

            <div className="w-full max-w-6xl relative z-10 mt-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-zinc-800 pb-6 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Server className="w-6 h-6 text-white" strokeWidth={1.5} />
                            <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
                                Tenant Realms
                            </h1>
                        </div>
                        <p className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
                            Select active node to initialize dashboard environment
                        </p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 border border-white bg-white text-black hover:bg-black hover:text-white px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors rounded-none"
                    >
                        <Plus className="w-4 h-4" />
                        Deploy New Realm
                    </button>
                </div>

                {/* Grid / Empty State */}
                {workspaces.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 border border-dashed border-zinc-800 bg-black/50 backdrop-blur-sm relative">
                        <Crosshair className="absolute -top-3 -left-3 w-6 h-6 text-zinc-800" strokeWidth={1} />
                        <Crosshair className="absolute -bottom-3 -right-3 w-6 h-6 text-zinc-800" strokeWidth={1} />

                        <Terminal className="w-12 h-12 text-zinc-700 mb-6" strokeWidth={1} />
                        <h3 className="text-lg font-black text-white tracking-tight uppercase mb-2">No Active Nodes</h3>
                        <p className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase mb-8 text-center max-w-sm">
                            Directory is empty. Deploy a new workspace realm to begin compiling lore and entity data.
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 border border-zinc-700 text-zinc-300 hover:text-white hover:border-white px-6 py-3 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors rounded-none bg-zinc-900/50"
                        >
                            <Plus className="w-4 h-4" />
                            Initialize
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {workspaces.map((workspace) => (
                            <div
                                key={workspace.id}
                                onClick={() => handleEnterWorkspace(workspace.id)}
                                className="relative border border-zinc-800 bg-black/80 backdrop-blur-sm p-8 group hover:border-white hover:bg-zinc-900/30 transition-all cursor-pointer flex flex-col h-full min-h-[200px]"
                            >
                                {/* Corner Accents */}
                                <Crosshair className="absolute -top-3 -left-3 w-6 h-6 text-zinc-800 group-hover:text-white transition-colors" strokeWidth={1} />
                                <div className="absolute top-0 right-0 w-2 h-2 bg-zinc-800 group-hover:bg-white transition-colors"></div>
                                <div className="absolute bottom-0 left-0 w-2 h-2 bg-zinc-800 group-hover:bg-white transition-colors"></div>

                                <div className="font-mono text-[9px] text-zinc-600 tracking-widest uppercase mb-4">
                                    NODE_ID: {workspace.id.slice(-8)}
                                </div>

                                <h3 className="text-2xl font-black text-white tracking-tighter uppercase leading-tight mb-4 group-hover:text-white">
                                    {workspace.name}
                                </h3>

                                <p className="text-sm text-zinc-400 font-sans line-clamp-3 mb-8 flex-1">
                                    {workspace.description || <span className="italic opacity-50 font-mono text-xs uppercase tracking-wider">No desc_data</span>}
                                </p>

                                <div className="mt-auto flex justify-between items-center border-t border-zinc-800 pt-4 group-hover:border-zinc-600 transition-colors">
                                    <span className="font-mono text-[10px] font-bold tracking-widest text-zinc-500 uppercase group-hover:text-white transition-colors">
                                        Mount Volume
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Workspace Modal (Brutalist Style) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="bg-black border border-zinc-800 w-full max-w-lg relative shadow-2xl">

                        {/* Crosshairs for Modal */}
                        <Crosshair className="absolute -top-3 -left-3 w-6 h-6 text-zinc-700" strokeWidth={1} />
                        <Crosshair className="absolute -top-3 -right-3 w-6 h-6 text-zinc-700" strokeWidth={1} />
                        <Crosshair className="absolute -bottom-3 -left-3 w-6 h-6 text-zinc-700" strokeWidth={1} />
                        <Crosshair className="absolute -bottom-3 -right-3 w-6 h-6 text-zinc-700" strokeWidth={1} />

                        <div className="flex justify-between items-center p-6 border-b border-zinc-800 bg-zinc-900/20">
                            <h2 className="text-lg font-black text-white uppercase tracking-widest">Configure Realm</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-zinc-500 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="block font-mono text-[10px] text-zinc-400 tracking-widest uppercase" htmlFor="ws-name">
                                    Designation [Name]
                                </label>
                                <input
                                    id="ws-name"
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="block w-full bg-black border border-zinc-800 px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-white font-mono text-sm transition-colors rounded-none"
                                    placeholder="e.g. Project Obsidian"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block font-mono text-[10px] text-zinc-400 tracking-widest uppercase" htmlFor="ws-desc">
                                    Parameters [Description]
                                </label>
                                <textarea
                                    id="ws-desc"
                                    maxLength={200}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="block w-full bg-black border border-zinc-800 px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-white font-mono text-sm transition-colors rounded-none resize-none h-24"
                                    placeholder="Define the core parameters of this realm..."
                                />
                            </div>

                            <div className="pt-6 flex justify-end gap-4 border-t border-zinc-800 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 font-mono text-[10px] font-bold tracking-widest text-zinc-500 hover:text-white uppercase transition-colors"
                                >
                                    Abort
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating || !formData.name.trim()}
                                    className="flex items-center gap-3 border border-white bg-white text-black hover:bg-black hover:text-white px-6 py-3 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isCreating ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Compiling...
                                        </>
                                    ) : (
                                        'Deploy Node'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}