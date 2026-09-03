import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Loader2, ArrowLeft, User as UserIcon, Shield, Server, Globe, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

const GET_USER_PROFILE = gql`
    query GetUserProfile($userId: ID!) {
        getUserProfile(userId: $userId) {
            user {
                id
                name
                role
            }
            publicWorkspaces {
                id
                name
                description
            }
        }
    }
`;

interface ProfileData {
    getUserProfile: {
        user: {
            id: string;
            name: string;
            role: string;
        };
        publicWorkspaces: Array<{
            id: string;
            name: string;
            description: string | null;
        }>;
    };
}

export default function UserProfile() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data, loading, error } = useQuery<ProfileData>(GET_USER_PROFILE, {
        variables: { userId: id },
        skip: !id,
    });

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex h-[60vh] items-center justify-center font-mono text-zinc-500 uppercase tracking-widest text-xs"
            >
                <Loader2 className="h-6 w-6 animate-spin mr-3 text-[#d9a05b]" />
                Scanning Entity Data...
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl bg-red-50 p-8 text-center max-w-md mx-auto mt-20 border border-red-200 shadow-sm"
            >
                <span className="font-mono text-[10px] font-bold text-red-600 tracking-widest uppercase block mb-4">
                    CRITICAL_ERR: Failed to locate entity
                </span>
                <p className="text-sm text-red-800 mb-6">{error.message}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-2.5 bg-white border border-red-200 text-red-600 font-bold text-xs uppercase tracking-wider hover:bg-red-50 rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                    Return
                </button>
            </motion.div>
        );
    }

    const profile = data?.getUserProfile;
    const user = profile?.user;
    const workspaces = profile?.publicWorkspaces || [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-6xl mx-auto text-zinc-900 space-y-10"
        >
            {/* Navigation / Return */}
            <motion.button
                whileHover={{ x: -4 }}
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
            >
                <ArrowLeft className="w-4 h-4" />
                Return to Directory
            </motion.button>

            {/* Profile Identity Card */}
            <div className="border border-zinc-200 bg-white rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
                    <div className="w-24 h-24 bg-[#081B21] rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                        <UserIcon className="w-10 h-10 text-[#d9a05b]" strokeWidth={1.5} />
                    </div>

                    <div>
                        <h1 className="font-serif text-4xl font-bold text-zinc-900 tracking-tight mb-3">
                            {user?.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-[10px] font-bold text-zinc-600 uppercase tracking-widest shadow-sm">
                                <Shield className="w-3.5 h-3.5 text-amber-600" />
                                {user?.role}
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-[10px] font-bold text-zinc-600 uppercase tracking-widest shadow-sm">
                                <Fingerprint className="w-3.5 h-3.5 text-zinc-400" />
                                ID: {user?.id.slice(-8)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Public Workspaces Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <Globe className="w-5 h-5 text-emerald-600" />
                    <h2 className="font-serif text-2xl font-bold text-zinc-900 tracking-tight">Public Realms</h2>
                </div>

                {workspaces.length === 0 ? (
                    <div className="border border-dashed border-zinc-300 bg-white/50 rounded-3xl p-16 text-center flex flex-col items-center justify-center shadow-sm">
                        <Server className="w-10 h-10 text-zinc-300 mb-4" />
                        <h3 className="font-serif text-lg font-bold text-zinc-900 mb-1">No Public Data</h3>
                        <p className="text-xs text-zinc-500 uppercase tracking-widest">
                            This entity has no public realms available for viewing.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {workspaces.map((ws, index) => (
                            <motion.div
                                key={ws.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                whileHover={{ y: -4 }}
                                className="border border-zinc-200 bg-white rounded-3xl p-8 flex flex-col h-full hover:border-amber-400/60 hover:shadow-md transition-all duration-300 cursor-default group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <Server className="w-5 h-5" />
                                    </div>
                                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 px-2 py-1 rounded-lg border border-zinc-100">
                                        Read-Only
                                    </span>
                                </div>

                                <h3 className="font-serif text-xl font-bold text-zinc-900 tracking-tight mb-3 group-hover:text-amber-700 transition-colors">
                                    {ws.name}
                                </h3>

                                <p className="text-sm text-zinc-600 flex-1 leading-relaxed">
                                    {ws.description || <span className="italic text-zinc-400">No narrative description provided.</span>}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}