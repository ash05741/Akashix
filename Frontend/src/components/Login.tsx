import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { LOGIN_MUTATION } from '../graphql/auth'; // The file we created earlier

// Strict TypeScript interfaces for the form data
interface LoginFormInputs {
    email: string;
    password: string;
}

// Tells TypeScript exactly what to expect back from the GraphQL server
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
            // Pass the user data and the token straight into the global context
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
        <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-gray-900 p-8 shadow-2xl border border-gray-800">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
                        AkashixCore
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Sign in to access your workspace
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label className="sr-only" htmlFor="email">Email address</label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                className={`block w-full rounded-lg border bg-gray-800 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-700'
                                    }`}
                                placeholder="Email address"
                                {...register('email', { required: 'Email is required' })}
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="sr-only" htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                className={`block w-full rounded-lg border bg-gray-800 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-700'
                                    }`}
                                placeholder="Password"
                                {...register('password', { required: 'Password is required' })}
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                        </div>
                    </div>

                    {authError && (
                        <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/50">
                            {authError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative flex w-full justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            'Sign in'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};