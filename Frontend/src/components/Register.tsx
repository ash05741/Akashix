import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { REGISTER_MUTATION } from '../graphql/auth';

// 1. What the form collects
interface RegisterFormInputs {
    name: string;
    email: string;
    password: string;
    workspaceName: string;
}

// 2. What the server returns (Notice: it returns workspaceId, NOT workspaceName)
interface RegisterResponse {
    register: {
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

export const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [authError, setAuthError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();

    const [executeRegister, { loading }] = useMutation<RegisterResponse>(REGISTER_MUTATION, {
        onCompleted: (data) => {
            login(data.register.user, data.register.token);
            navigate('/dashboard');
        },
        onError: (error) => {
            setAuthError(error.message || 'Registration failed');
        }
    });

    const onSubmit = (data: RegisterFormInputs) => {
        setAuthError(null);
        // 3. We SEND workspaceName to the backend here
        executeRegister({
            variables: {
                name: data.name,
                email: data.email,
                password: data.password,
                workspaceName: data.workspaceName
            }
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-[#121212] p-8 shadow-2xl border border-zinc-800/80">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-zinc-100 tracking-tight">
                        Join AkashixCore
                    </h2>
                    <p className="mt-2 text-center text-sm text-zinc-400">
                        Create your workspace to get started
                    </p>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <label className="sr-only" htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                className={`block w-full rounded-lg border bg-zinc-900/50 px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 sm:text-sm ${errors.name ? 'border-red-500/50 focus:ring-red-500' : 'border-zinc-800'
                                    }`}
                                placeholder="Full Name"
                                {...register('name', { required: 'Name is required' })}
                            />
                        </div>

                        <div>
                            <label className="sr-only" htmlFor="workspaceName">Workspace Name</label>
                            <input
                                id="workspaceName"
                                type="text"
                                className={`block w-full rounded-lg border bg-zinc-900/50 px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 sm:text-sm ${errors.workspaceName ? 'border-red-500/50 focus:ring-red-500' : 'border-zinc-800'
                                    }`}
                                placeholder="Workspace Name (e.g., My Company)"
                                {...register('workspaceName', { required: 'Workspace is required' })}
                            />
                        </div>

                        <div>
                            <label className="sr-only" htmlFor="email">Email address</label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                className={`block w-full rounded-lg border bg-zinc-900/50 px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 sm:text-sm ${errors.email ? 'border-red-500/50 focus:ring-red-500' : 'border-zinc-800'
                                    }`}
                                placeholder="Email address"
                                {...register('email', { required: 'Email is required' })}
                            />
                        </div>

                        <div>
                            <label className="sr-only" htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="new-password"
                                className={`block w-full rounded-lg border bg-zinc-900/50 px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 sm:text-sm ${errors.password ? 'border-red-500/50 focus:ring-red-500' : 'border-zinc-800'
                                    }`}
                                placeholder="Password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Must be at least 6 characters' }
                                })}
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
                        </div>
                    </div>

                    {authError && (
                        <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                            {authError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative flex w-full justify-center rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-900 hover:bg-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-[#121212] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin text-zinc-600" />
                        ) : (
                            'Create Workspace'
                        )}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-zinc-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-zinc-200 hover:text-white hover:underline transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};