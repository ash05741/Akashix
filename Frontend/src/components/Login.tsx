import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { Loader2, Database, Key, Crosshair } from 'lucide-react';
import { useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { LOGIN_MUTATION } from '../graphql/auth';

interface LoginFormInputs {
    email: string;
    password: string;
}

interface LoginResponse {
    login: {
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
            workspaceId: string;
            role: string;
        };
    };
}

export const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [authError, setAuthError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

    const [executeLogin, { loading }] = useMutation<LoginResponse>(LOGIN_MUTATION, {
        onCompleted: (data: LoginResponse) => {
            login(data.login.user, data.login.token);
            navigate('/dashboard');
        },
        onError: (error: Error) => {
            setAuthError(error.message || 'Invalid credentials');
        }
    });

    const onSubmit = (data: LoginFormInputs) => {
        setAuthError(null);
        executeLogin({ variables: { email: data.email, password: data.password } });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black px-4 font-sans selection:bg-zinc-700 selection:text-white relative overflow-hidden">

            {/* Schematic Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"></div>

            {/* Login Frame */}
            <div className="w-full max-w-md relative z-10 border border-zinc-800 bg-black/80 backdrop-blur-md p-8 sm:p-12 shadow-2xl">

                {/* Corner Crosshairs */}
                <Crosshair className="absolute -top-3 -left-3 w-6 h-6 text-zinc-700" strokeWidth={1} />
                <Crosshair className="absolute -top-3 -right-3 w-6 h-6 text-zinc-700" strokeWidth={1} />
                <Crosshair className="absolute -bottom-3 -left-3 w-6 h-6 text-zinc-700" strokeWidth={1} />
                <Crosshair className="absolute -bottom-3 -right-3 w-6 h-6 text-zinc-700" strokeWidth={1} />

                {/* Header */}
                <div className="flex flex-col items-center mb-10 border-b border-zinc-800 pb-8 text-center">
                    <Database className="w-6 h-6 text-white mb-4" strokeWidth={1.5} />
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2 leading-none">
                        System <br /> Access
                    </h2>
                    <p className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase mt-4">
                        Provide credentials to initialize workspace
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-5">

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="block font-mono text-[10px] text-zinc-400 tracking-widest uppercase" htmlFor="email">
                                Identity [Email]
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                className={`block w-full bg-black border px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-white font-mono text-sm transition-colors rounded-none ${errors.email ? 'border-red-500/50' : 'border-zinc-800'
                                    }`}
                                placeholder="sys.admin@akashix.core"
                                {...register('email', { required: 'Identity string is required' })}
                            />
                            {errors.email && (
                                <p className="font-mono text-[10px] text-red-500 tracking-widest uppercase mt-2">
                                    ERR: {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="block font-mono text-[10px] text-zinc-400 tracking-widest uppercase" htmlFor="password">
                                    Security Key [Password]
                                </label>
                            </div>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                className={`block w-full bg-black border px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-white font-mono text-sm transition-colors rounded-none ${errors.password ? 'border-red-500/50' : 'border-zinc-800'
                                    }`}
                                placeholder="••••••••"
                                {...register('password', { required: 'Security key is required' })}
                            />
                            {errors.password && (
                                <p className="font-mono text-[10px] text-red-500 tracking-widest uppercase mt-2">
                                    ERR: {errors.password.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Error State */}
                    {authError && (
                        <div className="border border-red-500/30 bg-red-500/5 p-4 text-center">
                            <span className="font-mono text-[10px] text-red-500 tracking-widest uppercase">
                                SYSTEM_ERR: {authError}
                            </span>
                        </div>
                    )}

                    {/* Submit Action */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-3 border border-white bg-white px-4 py-4 font-mono text-xs font-bold text-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-8 rounded-none"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Authenticating...
                            </>
                        ) : (
                            <>
                                <Key className="h-4 w-4" />
                                Authenticate Node
                            </>
                        )}
                    </button>
                </form>

                {/* Back to Terminal / Schematic Link */}
                <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="font-mono text-[10px] text-zinc-600 hover:text-white tracking-widest uppercase transition-colors"
                    >
                        [ Abort & Return to Core ]
                    </button>
                </div>
            </div>
        </div>
    );
};