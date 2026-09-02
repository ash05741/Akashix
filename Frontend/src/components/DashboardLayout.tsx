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
        <div className="flex min-h-screen bg-[#FAF6ED] text-zinc-800 font-sans selection:bg-amber-200 selection:text-black overflow-hidden relative">

            {/* Mobile Menu Button */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-3 bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-900 hover:border-zinc-300 transition-colors rounded-xl shadow-sm"
                >
                    {isMobileMenuOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
                </button>
            </div>

            {/* Sidebar Navigation */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 border-r border-zinc-200 bg-white/90 backdrop-blur-md transform transition-transform duration-300 ease-in-out flex flex-col shadow-sm
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0
            `}>
                {/* Brand Header */}
                <div className="flex items-center gap-3 h-16 px-6 border-b border-zinc-100 shrink-0">
                    <Hexagon className="w-5 h-5 text-[#d9a05b]" strokeWidth={2} />
                    <span className="font-serif text-sm font-bold tracking-wider text-zinc-900 uppercase">AKASHIX<span className="text-[#d9a05b]">CORE</span></span>
                </div>

                {/* Workspace Indicator */}
                <div className="px-6 py-5 border-b border-zinc-100 shrink-0 bg-zinc-50/50">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Current Workspace</p>
                    <div className="flex items-center gap-2.5">
                        <div className="w-1.5 h-3 bg-[#d9a05b] rounded-full animate-pulse"></div>
                        <p className="text-xs font-bold text-zinc-900 uppercase truncate tracking-wide">
                            {workspaceName}
                        </p>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
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
                                    flex items-center gap-3 px-3.5 py-3 text-xs font-bold tracking-wide uppercase transition-all rounded-xl border
                                    ${isActive
                                        ? 'bg-amber-100/70 text-amber-950 border-amber-200 shadow-sm'
                                        : 'bg-transparent text-zinc-600 border-transparent hover:bg-zinc-100 hover:text-zinc-900'
                                    }
                                `}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-700' : 'text-zinc-400'}`} strokeWidth={1.8} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Footer / Logout */}
                <div className="p-4 border-t border-zinc-100 shrink-0 bg-white">
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2.5 w-full px-4 py-2.5 border border-zinc-200 text-xs font-bold tracking-wider uppercase text-zinc-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 transition-colors rounded-xl shadow-sm cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" strokeWidth={1.8} />
                        Disconnect
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative z-10 flex flex-col h-screen overflow-hidden bg-[#FAF6ED]">
                {/* RESTORED PADDING HERE: p-6 md:p-10 pt-20 md:pt-10 */}
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