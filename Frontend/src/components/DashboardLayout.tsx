import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Settings, LogOut, Menu, X, Hexagon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export const DashboardLayout = () => {
    const { logout } = useAuth();
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
        <div className="flex min-h-screen bg-[#FAF6ED] text-zinc-900 font-sans selection:bg-amber-200 selection:text-black overflow-hidden relative">

            {/* Mobile Menu Button */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-3 bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-900 hover:border-zinc-300 transition-all rounded-2xl shadow-sm cursor-pointer"
                >
                    {isMobileMenuOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
                </button>
            </div>

            {/* Sidebar Navigation */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 border-r border-zinc-200/80 bg-white/95 backdrop-blur-md transform transition-transform duration-300 ease-in-out flex flex-col shadow-sm
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0
            `}>
                {/* Brand Header */}
                <div className="flex items-center gap-3 h-20 px-6 border-b border-zinc-100 shrink-0">
                    <div className="p-2 bg-[#081B21] rounded-xl shadow-inner">
                        <Hexagon className="w-4 h-4 text-[#d9a05b]" strokeWidth={2.2} />
                    </div>
                    <span className="font-serif text-sm font-bold tracking-wider text-zinc-900 uppercase">
                        AKASHIX<span className="text-[#d9a05b]">CORE</span>
                    </span>
                </div>

                {/* Workspace Indicator */}
                <div className="px-6 py-5 border-b border-zinc-100 shrink-0 bg-zinc-50/70">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#d9a05b]"></div>
                        Current Workspace
                    </p>
                    <p className="font-serif text-xs font-bold text-zinc-900 uppercase truncate tracking-wide bg-white border border-zinc-200/80 px-3 py-2 rounded-xl shadow-xs">
                        {workspaceName}
                    </p>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                    <div className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase mb-3 px-3">
                        Active Modules
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
                                    flex items-center gap-3 px-4 py-3 text-xs font-bold tracking-wider uppercase transition-all duration-200 rounded-2xl border cursor-pointer
                                    hover:-translate-y-0.5 active:translate-y-0.5
                                    ${isActive
                                        ? 'bg-[#081B21] text-white border-[#081B21] shadow-md'
                                        : 'bg-transparent text-zinc-600 border-transparent hover:bg-zinc-100/80 hover:text-zinc-900'
                                    }
                                `}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-[#d9a05b]' : 'text-zinc-400'}`} strokeWidth={1.8} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Footer / Logout */}
                <div className="p-4 border-t border-zinc-100 shrink-0 bg-white">
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2.5 w-full px-4 py-3 border border-zinc-200 text-xs font-bold tracking-wider uppercase text-zinc-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 transition-all duration-200 rounded-2xl shadow-xs hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" strokeWidth={1.8} />
                        Disconnect
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative z-10 flex flex-col h-screen overflow-hidden bg-[#FAF6ED]">
                <div className="flex-1 w-full p-6 md:p-10 pt-20 md:pt-10 overflow-y-auto relative custom-scrollbar">
                    <div className="max-w-7xl mx-auto h-full flex flex-col">
                        <Outlet />
                    </div>
                </div>
            </main>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
};