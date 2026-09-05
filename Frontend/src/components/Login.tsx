import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { Loader2, Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Link2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { FcGoogle } from 'react-icons/fc';
import { FaDiscord, FaGithub } from 'react-icons/fa';
import { SmoothImage } from './SmoothImage';
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
            role: string;
        };
    };
}

const overlayFeatures = [
    {
        icon: ShieldCheck,
        title: 'Private & Secure',
        desc: 'Your worlds are yours alone. We keep them safe.'
    },
    {
        icon: Link2,
        title: 'Everything Connected',
        desc: 'Link characters, lore, places, and more.'
    },
    {
        icon: Sparkles,
        title: 'Built for Writers',
        desc: 'Distraction-free tools that keep you in your flow.'
    }
];

export const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [authError, setAuthError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

    const [executeLogin, { loading }] = useMutation<LoginResponse>(LOGIN_MUTATION, {
        onCompleted: (data: LoginResponse) => {
            login(data.login.user, data.login.token);
            navigate('/workspaces');
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
        <div className="flex min-h-screen bg-[#FAF6ED] font-sans selection:bg-amber-200 selection:text-black overflow-x-hidden">

            {/* LEFT SIDE: Form Container */}
            <div className="w-full lg:w-[48%] xl:w-[42%] flex flex-col justify-center px-6 sm:px-12 xl:px-20 py-10 relative z-20 min-h-screen">

                {/* Brand Logo Header */}
                <div className="absolute top-6 left-6 sm:left-12 xl:left-20 flex items-center gap-2">
                    <Sparkles className="text-[#d9a05b] w-5 h-5" strokeWidth={2} />
                    <span className="font-semibold text-[#081B21] tracking-wide text-lg">
                        AKASHIX<span className="text-[#d9a05b]">CORE</span>
                    </span>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-sm mx-auto mt-8 lg:mt-4"
                >
                    <span className="text-[#d9a05b] text-[10px] font-bold tracking-[0.2em] uppercase mb-2 block">
                        WELCOME BACK
                    </span>
                    <h1 className="font-serif text-3xl sm:text-4xl text-[#081B21] mb-3 leading-tight">
                        Log in to your workspace
                    </h1>
                    <p className="text-zinc-500 text-xs sm:text-sm mb-6 leading-relaxed">
                        Enter your credentials to access your worlds and continue building.
                    </p>

                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

                        {/* Email Field */}
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold text-[#081B21]" htmlFor="email">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-zinc-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    className={`block w-full bg-white border pl-10 pr-4 py-2.5 text-[#081B21] placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#d9a05b] focus:border-[#d9a05b] rounded-lg transition-all text-sm shadow-sm ${errors.email ? 'border-red-400' : 'border-zinc-200'}`}
                                    placeholder="Enter your email"
                                    {...register('email', { required: 'Email is required' })}
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <label className="block text-xs font-semibold text-[#081B21]" htmlFor="password">
                                    Password
                                </label>
                                <a href="#" className="text-xs text-[#d9a05b] hover:text-amber-700 font-medium transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-zinc-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    className={`block w-full bg-white border pl-10 pr-10 py-2.5 text-[#081B21] placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#d9a05b] focus:border-[#d9a05b] rounded-lg transition-all text-sm shadow-sm ${errors.password ? 'border-red-400' : 'border-zinc-200'}`}
                                    placeholder="Enter your password"
                                    {...register('password', { required: 'Password is required' })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center gap-2 pt-0.5">
                            <input
                                type="checkbox"
                                id="remember"
                                className="w-4 h-4 rounded border-zinc-300 text-[#0F2C24] focus:ring-[#0F2C24]"
                            />
                            <label htmlFor="remember" className="text-xs text-zinc-600 font-medium cursor-pointer">
                                Remember me
                            </label>
                        </div>

                        {authError && (
                            <div className="text-xs text-red-500 bg-red-50 border border-red-100 p-2.5 rounded-lg">
                                {authError}
                            </div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex justify-between items-center bg-[#0F2C24] hover:bg-[#153b30] px-5 py-3 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 mt-1 cursor-pointer shadow-md"
                        >
                            <span>{loading ? 'Logging in...' : 'Log In'}</span>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                        </motion.button>
                    </form>

                    {/* Social Logins */}
                    <div className="mt-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-px bg-zinc-200 flex-1"></div>
                            <span className="text-[10px] text-zinc-400 uppercase tracking-widest">or continue with</span>
                            <div className="h-px bg-zinc-200 flex-1"></div>
                        </div>

                        <div className="grid grid-cols-3 gap-2.5">
                            <button className="flex items-center justify-center gap-2 bg-white border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 py-2.5 px-3 rounded-lg text-xs font-medium text-zinc-700 transition-all cursor-pointer shadow-sm">
                                <FcGoogle className="w-4 h-4 shrink-0" /> <span className="truncate">Google</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 bg-white border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 py-2.5 px-3 rounded-lg text-xs font-medium text-zinc-700 transition-all cursor-pointer shadow-sm">
                                <FaDiscord className="w-4 h-4 text-[#5865F2] shrink-0" /> <span className="truncate">Discord</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 bg-white border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 py-2.5 px-3 rounded-lg text-xs font-medium text-zinc-700 transition-all cursor-pointer shadow-sm">
                                <FaGithub className="w-4 h-4 shrink-0" /> <span className="truncate">GitHub</span>
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-xs text-zinc-600 mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-[#d9a05b] font-semibold hover:text-amber-700 transition-colors">
                            Sign up
                        </Link>
                    </p>

                    <div className="flex items-center justify-center gap-2 mt-8 text-zinc-400">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        <span className="text-[11px]">Your data is encrypted and secure</span>
                    </div>

                </motion.div>
            </div>

            {/* RIGHT SIDE: Seamless Cinematic Image & Feature Overlays */}
            <div className="hidden lg:block lg:w-[52%] xl:w-[58%] relative overflow-hidden bg-[#081B21]">

                {/* Background Image */}
                <SmoothImage
                    src="https://images2.alphacoders.com/134/thumb-1920-1349521.png"
                    alt="Atmospheric Background"
                    className="absolute inset-0 w-full h-full scale-105 z-0"
                />

                {/* --- THE SEAMLESS FADE FIX --- */}
                {/* Multi-step gradient overlay that gently transitions the image into the solid #FAF6ED left panel */}
                <div className="absolute inset-y-0 left-0 w-96 bg-gradient-to-r from-[#FAF6ED] via-[#FAF6ED]/70 to-transparent pointer-events-none z-10" />

                {/* Bottom Dark Vignette for Floating Cards Contrast */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#081B21] via-[#081B21]/50 to-transparent pointer-events-none z-10"></div>

                {/* Floating Feature Cards on Image */}
                <div className="absolute bottom-10 left-12 right-12 z-20 max-w-md mx-auto xl:mr-20 space-y-2.5">
                    {overlayFeatures.map(({ icon: Icon, title, desc }, idx) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 + (idx * 0.1) }}
                            className="bg-[#081B21]/80 backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center gap-3.5 shadow-xl"
                        >
                            <div className="bg-[#11272B] border border-white/10 p-2 rounded-lg shrink-0">
                                <Icon className="w-4 h-4 text-[#d9a05b]" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h4 className="text-white text-xs font-semibold mb-0.5">{title}</h4>
                                <p className="text-zinc-400 text-[11px] leading-tight">{desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};