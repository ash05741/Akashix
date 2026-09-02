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
        __typename?: string; // FIXED: Added this so optimisticResponse works!
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
                <Loader2 className="h-5 w-5 animate-spin mr-3" />
                Accessing Sys_Config...
            </div>
        );
    }

    if (error || !data?.getWorkspace) {
        return (
            <div className="border border-red-500/30 bg-red-500/5 p-6 text-center max-w-md mx-auto mt-10">
                <span className="font-mono text-[10px] text-red-500 tracking-widest uppercase">
                    CRITICAL_ERR: Failed to load realm configuration.
                </span>
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
        <div className="w-full max-w-4xl text-zinc-300 space-y-12">

            {/* Header */}
            <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
                <div className="p-3 bg-zinc-900 border border-zinc-700">
                    <SettingsIcon className="w-6 h-6 text-zinc-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">System Configuration</h1>
                    <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
                        Realm: {workspace.name} // ID: {workspace.id.slice(-8)}
                    </p>
                </div>
            </div>

            {/* Privacy Settings */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 mb-6">
                    <Shield className="w-5 h-5 text-zinc-400" />
                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">Access Control</h2>
                </div>

                <div className="border border-zinc-800 bg-black/50 p-6 relative overflow-hidden">
                    {isUpdating && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-white" />
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="max-w-xl">
                            <h3 className="text-lg font-bold text-white mb-2">Network Visibility</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Public realms are indexed in the Global Directory and can be viewed by anyone on the network. Private realms are strictly isolated and encrypted.
                            </p>
                        </div>

                        <div className="flex bg-zinc-900 p-1 border border-zinc-800 shrink-0">
                            <button
                                onClick={() => handleTogglePrivacy(false)}
                                className={`flex items-center gap-2 px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-widest transition-colors ${!workspace.isPublic
                                        ? 'bg-zinc-700 text-white shadow-inner'
                                        : 'text-zinc-500 hover:text-white'
                                    }`}
                            >
                                <Lock className="w-4 h-4" />
                                Private
                            </button>
                            <button
                                onClick={() => handleTogglePrivacy(true)}
                                className={`flex items-center gap-2 px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-widest transition-colors ${workspace.isPublic
                                        ? 'bg-white text-black shadow-inner'
                                        : 'text-zinc-500 hover:text-white'
                                    }`}
                            >
                                <Globe className="w-4 h-4" />
                                Public
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Danger Zone */}
            <section className="space-y-4 pt-10">
                <div className="flex items-center gap-2 mb-6">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <h2 className="text-xl font-bold text-red-500 uppercase tracking-tight">Danger Zone</h2>
                </div>

                <div className="border border-red-500/30 bg-red-500/5 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h3 className="text-lg font-bold text-zinc-200 mb-2">Purge Realm Data</h3>
                        <p className="text-sm text-zinc-500">
                            Permanently delete this workspace, including all characters, lore, and configurations. This action cannot be reversed.
                        </p>
                    </div>
                    <button className="px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/50 font-mono text-xs font-bold uppercase tracking-widest transition-colors shrink-0">
                        Initiate Purge
                    </button>
                </div>
            </section>
        </div>
    );
};