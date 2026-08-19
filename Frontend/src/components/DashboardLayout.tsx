import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Settings, LogOut, Menu, X, Hexagon, Crosshair, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export const DashboardLayout = () => {
    // 1. FIXED: Removed workspaceName from useAuth
    const { logout } = useAuth();

    // 2. FIXED: Pull workspaceName directly from localStorage
    const workspaceName = localStorage.getItem('workspaceName') || 'ROOT_WORKSPACE';

    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Characters', path: '/dashboard/characters', icon: Users },
        { name: 'Lore_Index', path: '/dashboard/world', icon: BookOpen },
        { name: 'Sys_Config', path: '/dashboard/settings', icon: Settings },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-black text-zinc-300 font-sans selection:bg-zinc-700 selection:text-white overflow-hidden relative">

            {/* Global Schematic Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none z-0"></div>

            {/* Mobile Menu Button - Brutalist Style */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-3 bg-black border border-zinc-800 text-zinc-400 hover:text-white hover:border-white transition-colors rounded-none"
                >
                    {isMobileMenuOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
                </button>
            </div>

            {/* Sidebar Navigation */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 border-r border-zinc-800 bg-black/90 backdrop-blur-md transform transition-transform duration-300 ease-in-out flex flex-col
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0
            `}>
                {/* Brand Header */}
                <div className="flex items-center gap-3 h-16 px-6 border-b border-zinc-800 shrink-0">
                    <Hexagon className="w-5 h-5 text-white" strokeWidth={1.5} />
                    <span className="font-mono text-sm font-bold tracking-widest text-white uppercase">Akashix_Core</span>
                </div>

                {/* Workspace Indicator */}
                <div className="px-6 py-6 border-b border-zinc-800 shrink-0 bg-zinc-950/50">
                    <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-3">Tenant_Realm</p>
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-3 bg-white animate-pulse"></div>
                        <p className="font-mono text-xs font-bold text-white uppercase truncate tracking-wider">
                            {workspaceName}
                        </p>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    <div className="font-mono text-[10px] text-zinc-600 tracking-widest uppercase mb-4 px-2">
                        Active_Modules
                    </div>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`
                                    flex items-center gap-3 px-4 py-3 text-xs font-mono tracking-widest uppercase transition-colors rounded-none border
                                    ${isActive
                                        ? 'bg-white text-black border-white'
                                        : 'bg-transparent text-zinc-400 border-transparent hover:border-zinc-700 hover:text-white'
                                    }
                                `}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-zinc-500'}`} strokeWidth={1.5} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Footer / Logout */}
                <div className="p-4 border-t border-zinc-800 shrink-0 bg-black">
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-3 w-full px-4 py-3 border border-zinc-800 text-xs font-mono tracking-widest uppercase text-zinc-500 hover:text-white hover:border-white transition-colors rounded-none"
                    >
                        <LogOut className="w-4 h-4" strokeWidth={1.5} />
                        [ Disconnect ]
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative z-10 flex flex-col h-screen overflow-hidden">
                <div className="flex-1 w-full p-6 md:p-10 pt-24 md:pt-10 overflow-y-auto relative">

                    {/* Schematic framing for the content area */}
                    <Crosshair className="absolute top-4 left-4 w-6 h-6 text-zinc-800 hidden md:block" strokeWidth={1} />
                    <Crosshair className="absolute top-4 right-4 w-6 h-6 text-zinc-800 hidden md:block" strokeWidth={1} />

                    <div className="max-w-7xl mx-auto h-full">
                        <Outlet />
                    </div>
                </div>
            </main>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
};