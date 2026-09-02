import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Globe, Lock, AlertTriangle, Shield, Settings as SettingsIcon, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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

const DELETE_WORKSPACE = gql`
    mutation DeleteWorkspace($id: ID!) {
        deleteWorkspace(id: $id)
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
    const navigate = useNavigate();
    const workspaceId = localStorage.getItem('workspaceId') || '';
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { data, loading, error } = useQuery<GetWorkspaceResponse>(GET_WORKSPACE, {
        variables: { id: workspaceId },
        skip: !workspaceId,
    });

    const [updatePrivacy, { loading: isUpdating }] = useMutation<UpdatePrivacyResponse>(UPDATE_PRIVACY);

    const [deleteWorkspace, { loading: isDeleting }] = useMutation(DELETE_WORKSPACE, {
        onCompleted: () => {
            localStorage.removeItem('workspaceId');
            localStorage.removeItem('workspaceName');
            navigate('/workspaces');
        },
        onError: (err) => {
            alert(`Failed to delete realm: ${err.message}`);
            setShowDeleteModal(false);
        }
    });

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
            <div className="border border-red-200 bg-white rounded-3xl p-8 text-center max-w-md mx-auto mt-10 shadow-sm">
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

    const handlePurgeWorkspace = () => {
        if (!workspaceId) return;
        deleteWorkspace({ variables: { id: workspaceId } });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl text-zinc-900 font-sans space-y-12 relative"
        >

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

                        {/* Toggle Switches */}
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
                        onClick={() => setShowDeleteModal(true)}
                        className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-mono text-[10px] font-bold uppercase tracking-widest transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0.5 hover:shadow-[0_8px_20px_-6px_rgba(220,38,38,0.5)] shadow-md rounded-xl shrink-0 cursor-pointer"
                    >
                        Initiate Purge
                    </button>
                </div>
            </section>

            {/* DELETE CONFIRMATION MODAL */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 shadow-2xl overflow-hidden relative"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-red-50 border border-red-100">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="font-serif text-2xl font-bold text-zinc-900">Purge Realm?</h3>
                                    <p className="text-xs text-zinc-500 mt-1">This action is permanent and irreversible.</p>
                                </div>
                            </div>

                            <div className="bg-red-50/50 border border-red-100 rounded-2xl p-5 mb-8">
                                <p className="text-red-900 text-sm leading-relaxed">
                                    You are about to permanently wipe <span className="font-bold underline decoration-red-300">"{workspace.name}"</span> and all its connected entities.
                                </p>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={isDeleting}
                                    className="rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                                >
                                    Abort
                                </button>
                                <button
                                    onClick={handlePurgeWorkspace}
                                    disabled={isDeleting}
                                    className="flex items-center justify-center min-w-[120px] rounded-xl bg-red-600 hover:bg-red-700 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50 transition-colors shadow-md cursor-pointer"
                                >
                                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Purge'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};