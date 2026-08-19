import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Loader2, ArrowLeft, User as UserIcon, Shield, Terminal, Crosshair, Server } from 'lucide-react';

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
            <div className="flex h-[80vh] items-center justify-center font-mono text-zinc-500 uppercase tracking-widest text-xs">
                <Loader2 className="h-5 w-5 animate-spin mr-3" />
                Scanning Entity Data...
            </div>
        );
    }

    if (error) {
        return (
            <div className="border border-red-500/30 bg-red-500/5 p-6 text-center max-w-md mx-auto mt-20">
                <span className="font-mono text-[10px] text-red-500 tracking-widest uppercase">
                    CRITICAL_ERR: Failed to locate entity data. <br /> {error.message}
                </span>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 border border-red-500/50 text-red-500 font-mono text-[10px] uppercase hover:bg-red-500/10"
                >
                    [ Go Back ]
                </button>
            </div>
        );
    }

    const profile = data?.getUserProfile;
    const user = profile?.user;
    const workspaces = profile?.publicWorkspaces || [];

    return (
        <div className="w-full text-zinc-300">
            {/* Navigation & Header */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-zinc-500 hover:text-white font-mono text-[10px] uppercase tracking-widest mb-8 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Return
            </button>

            {/* Profile Identity Card */}
            <div className="border border-zinc-800 bg-black/50 p-8 mb-12 relative">
                <Crosshair className="absolute -top-3 -left-3 w-6 h-6 text-zinc-700" strokeWidth={1} />
                <Crosshair className="absolute -bottom-3 -right-3 w-6 h-6 text-zinc-700" strokeWidth={1} />

                <div className="flex items-start gap-6">
                    <div className="w-20 h-20 bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0">
                        <UserIcon className="w-8 h-8 text-zinc-500" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
                            {user?.name}
                        </h1>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 uppercase tracking-widest">
                                <Shield className="w-3.5 h-3.5" />
                                {user?.role}
                            </span>
                            <span className="text-zinc-700">|</span>
                            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                                ID: {user?.id.slice(-8)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Public Workspaces Section */}
            <div className="flex items-center gap-3 mb-6">
                <Server className="w-5 h-5 text-zinc-400" />
                <h2 className="text-lg font-bold text-white uppercase tracking-widest">Public Nodes</h2>
            </div>

            {workspaces.length === 0 ? (
                <div className="border border-dashed border-zinc-800 p-12 text-center flex flex-col items-center justify-center bg-black/30">
                    <Terminal className="w-8 h-8 text-zinc-700 mb-4" />
                    <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
                        Entity has no public realms available for viewing.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workspaces.map((ws) => (
                        <div key={ws.id} className="border border-zinc-800 bg-zinc-900/20 p-6 flex flex-col h-full relative group">
                            <div className="absolute top-0 right-0 w-2 h-2 bg-zinc-800"></div>

                            <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-3">
                                {ws.name}
                            </h3>
                            <p className="text-sm text-zinc-400 flex-1 mb-6">
                                {ws.description || <span className="italic opacity-50 font-mono text-[10px] uppercase">No Description</span>}
                            </p>

                            <div className="border-t border-zinc-800 pt-4 flex justify-between items-center mt-auto">
                                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
                                    Status: Read-Only
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}