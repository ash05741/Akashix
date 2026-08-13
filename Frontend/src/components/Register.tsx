import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { Loader2, Database, Crosshair, Network } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { REGISTER_MUTATION } from '../graphql/auth';

// 1. Removed workspaceName
interface RegisterFormInputs {
    name: string;
    email: string;
    password: string;
}

// 2. Removed workspaceId from the expected User response
interface RegisterResponse {
    register: {
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
        };
    };
}

export const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [authError, setAuthError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();

    const [executeRegister, { loading }] = useMutation<RegisterResponse>(REGISTER_MUTATION, {
        onCompleted: (data) => {
            login(data.register.user, data.register.token);
            // 3. Changed redirect to the new Workspaces grid
            navigate('/workspaces');
        },
        onError: (error) => {
            setAuthError(error.message || 'Registration failed');
        }
    });

    const onSubmit = (data: RegisterFormInputs) => {
        setAuthError(null);
        executeRegister({
            variables: {
                name: data.name,
                email: data.email,
                password: data.password
                // 4. Removed workspaceName from the variables
            }
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black px-4 font-sans selection:bg-zinc-700 selection:text-white relative overflow-hidden py-12">

            {/* Schematic Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"></div>

            {/* Registration Frame */}
            <div className="w-full max-w-md relative z-10 border border-zinc-800 bg-black/80 backdrop-blur-md p-8 sm:p-12 shadow-2xl mt-8 mb-8">

                {/* Corner Crosshairs */}
                <Crosshair className="absolute -top-3 -left-3 w-6 h-6 text-zinc-700" strokeWidth={1} />
                <Crosshair className="absolute -top-3 -right-3 w-6 h-6 text-zinc-700" strokeWidth={1} />
                <Crosshair className="absolute -bottom-3 -left-3 w-6 h-6 text-zinc-700" strokeWidth={1} />
                <Crosshair className="absolute -bottom-3 -right-3 w-6 h-6 text-zinc-700" strokeWidth={1} />

                {/* Header */}
                <div className="flex flex-col items-center mb-8 border-b border-zinc-800 pb-8 text-center">
                    <Database className="w-6 h-6 text-white mb-4" strokeWidth={1.5} />
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2 leading-none">
                        Deploy <br /> Node
                    </h2>
                    <p className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase mt-4">
                        Initialize new user identity
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

                    {/* Name Input */}
                    <div className="space-y-2">
                        <label className="block font-mono text-[10px] text-zinc-400 tracking-widest uppercase" htmlFor="name">
                            Entity Designation [Name]
                        </label>
                        <input
                            id="name"
                            type="text"
                            className={`block w-full bg-black border px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-white font-mono text-sm transition-colors rounded-none ${errors.name ? 'border-red-500/50' : 'border-zinc-800'
                                }`}
                            placeholder="e.g. John Doe"
                            {...register('name', { required: 'Designation is required' })}
                        />
                        {errors.name && (
                            <p className="font-mono text-[10px] text-red-500 tracking-widest uppercase mt-2">
                                ERR: {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* 5. REMOVED the Workspace Input Block entirely */}

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
                            placeholder="admin@akashix.core"
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
                        <label className="block font-mono text-[10px] text-zinc-400 tracking-widest uppercase" htmlFor="password">
                            Security Key [Password]
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            className={`block w-full bg-black border px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-white font-mono text-sm transition-colors rounded-none ${errors.password ? 'border-red-500/50' : 'border-zinc-800'
                                }`}
                            placeholder="••••••••"
                            {...register('password', {
                                required: 'Security key is required',
                                minLength: { value: 6, message: 'Minimum 6 characters required' }
                            })}
                        />
                        {errors.password && (
                            <p className="font-mono text-[10px] text-red-500 tracking-widest uppercase mt-2">
                                ERR: {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Error State */}
                    {authError && (
                        <div className="border border-red-500/30 bg-red-500/5 p-4 text-center mt-4">
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
                                Provisioning...
                            </>
                        ) : (
                            <>
                                <Network className="h-4 w-4" />
                                Deploy Account
                            </>
                        )}
                    </button>
                </form>

                {/* Back to Login Link */}
                <div className="mt-8 pt-6 border-t border-zinc-800 text-center flex flex-col gap-2">
                    <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
                        Existing tenant?
                    </span>
                    <Link
                        to="/login"
                        className="font-mono text-[10px] text-white hover:text-zinc-400 tracking-widest uppercase transition-colors"
                    >
                        [ Authenticate Session ]
                    </Link>
                </div>
            </div>
        </div>
    );
};