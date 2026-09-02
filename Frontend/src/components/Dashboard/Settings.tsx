import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Globe, Lock, AlertTriangle, Shield, Settings as SettingsIcon, Loader2 } from 'lucide-react';

// --- GraphQL Operations ---
const GET_WORKSPACE = gql`
    query GetWorkspace($id: ID!) {
        getWorkspace(id: $id) {
            id
            name
            isPublic
        }
    }
`;

const UPDATE_PRIVACY = gql`
    mutation UpdateWorkspacePrivacy($id: ID!, $isPublic: Boolean!) {
        updateWorkspacePrivacy(id: $id, isPublic: $isPublic) {
            id
            isPublic
        }
    }
`;

// --- TypeScript Interfaces ---
interface WorkspaceConfig {
    id: string;
    name: string;
    isPublic: boolean;
}

interface GetWorkspaceResponse {
    getWorkspace: WorkspaceConfig;
}

interface UpdatePrivacyResponse {
    updateWorkspacePrivacy: {
        __typename?: string;
        id: string;
        isPublic: boolean;
    };
}

export const Settings = () => {
    const workspaceId = localStorage.getItem('workspaceId') || '';

    const { data, loading, error } = useQuery<GetWorkspaceResponse>(GET_WORKSPACE, {
        variables: { id: workspaceId },
        skip: !workspaceId,
    });

    const [updatePrivacy, { loading: isUpdating }] = useMutation<UpdatePrivacyResponse>(UPDATE_PRIVACY);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center font-mono text-zinc-500 uppercase tracking-widest text-xs">
                <Loader2 className="h-5 w-5 animate-spin mr-3 text-[#d9a05b]" />
                Accessing Sys_Config...
            </div>
        );
    }

    if (error || !data?.getWorkspace) {
        return (
            <div className="border border-red-200 bg-white rounded-2xl p-8 text-center max-w-md mx-auto mt-10 shadow-sm">
                <span className="font-mono text-[10px] font-bold text-red-600 tracking-widest uppercase block mb-2">
                    CRITICAL_ERR: Failed to load realm configuration.
                </span>
                <p className="text-sm text-zinc-600">{error?.message}</p>
            </div>
        );
    }

    const workspace = data.getWorkspace;

    const handleTogglePrivacy = (makePublic: boolean) => {
        if (!workspaceId) return;
        updatePrivacy({
            variables: { id: workspaceId, isPublic: makePublic },
            optimisticResponse: {
                updateWorkspacePrivacy: {
                    __typename: 'Workspace',
                    id: workspaceId,
                    isPublic: makePublic,
                }
            }
        });
    };

    return (
        <div className="w-full max-w-4xl text-zinc-900 font-sans space-y-12">

            {/* Header */}
            <div className="flex items-center gap-5 border-b border-zinc-200 pb-6">
                <div className="p-3.5 bg-[#081B21] rounded-2xl shadow-inner shrink-0">
                    <SettingsIcon className="w-6 h-6 text-[#d9a05b]" strokeWidth={1.5} />
                </div>
                <div>
                    <h1 className="font-serif text-3xl font-bold text-zinc-900 tracking-tight">System Configuration</h1>
                    <p className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                        Realm: {workspace.name} // ID: {workspace.id.slice(-8).toUpperCase()}
                    </p>
                </div>
            </div>

            {/* Privacy Settings */}
            <section className="space-y-4">
                <div className="flex items-center gap-2.5 mb-4">
                    <Shield className="w-5 h-5 text-amber-600" strokeWidth={1.8} />
                    <h2 className="font-serif text-xl font-bold text-zinc-900 tracking-tight">Access Control</h2>
                </div>

                <div className="border border-zinc-200 bg-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-sm">
                    {isUpdating && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="max-w-xl">
                            <h3 className="font-serif text-lg font-bold text-zinc-900 mb-2">Network Visibility</h3>
                            <p className="text-sm text-zinc-600 leading-relaxed">
                                Public realms are indexed in the Global Directory and can be viewed by anyone on the network. Private realms are strictly isolated and encrypted.
                            </p>
                        </div>

                        {/* Toggle Switches with Smooth Tactile Hover */}
                        <div className="flex bg-zinc-100 p-1.5 border border-zinc-200 rounded-2xl shrink-0 shadow-inner">
                            <button
                                onClick={() => handleTogglePrivacy(false)}
                                className={`flex items-center gap-2 px-6 py-2.5 font-mono text-[10px] font-bold uppercase tracking-widest transition-all duration-200 rounded-xl cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5 ${!workspace.isPublic
                                        ? 'bg-white text-zinc-900 shadow-md border border-zinc-200'
                                        : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
                                    }`}
                            >
                                <Lock className="w-3.5 h-3.5" />
                                Private
                            </button>
                            <button
                                onClick={() => handleTogglePrivacy(true)}
                                className={`flex items-center gap-2 px-6 py-2.5 font-mono text-[10px] font-bold uppercase tracking-widest transition-all duration-200 rounded-xl cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5 ${workspace.isPublic
                                        ? 'bg-white text-zinc-900 shadow-md border border-zinc-200'
                                        : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
                                    }`}
                            >
                                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                                Public
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Danger Zone */}
            <section className="space-y-4 pt-4">
                <div className="flex items-center gap-2.5 mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-600" strokeWidth={1.8} />
                    <h2 className="font-serif text-xl font-bold text-red-600 tracking-tight">Danger Zone</h2>
                </div>

                <div className="border border-red-100 bg-red-50/40 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
                    <div className="max-w-xl">
                        <h3 className="font-serif text-lg font-bold text-zinc-900 mb-2">Purge Realm Data</h3>
                        <p className="text-sm text-zinc-600 leading-relaxed">
                            Permanently delete this workspace, including all characters, lore, and configurations. This action cannot be reversed.
                        </p>
                    </div>
                    <button
                        className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-mono text-[10px] font-bold uppercase tracking-widest transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0.5 hover:shadow-[0_8px_20px_-6px_rgba(220,38,38,0.5)] shadow-md rounded-xl shrink-0 cursor-pointer"
                    >
                        Initiate Purge
                    </button>
                </div>
            </section>
        </div>
    );
};