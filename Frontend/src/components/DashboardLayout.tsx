import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Settings, LogOut, Menu, X, Hexagon } from 'lucide-react';
// Make sure this path matches where your AuthContext is located
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export const DashboardLayout = () => {
    const { logout, workspaceName } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Characters', path: '/dashboard/characters', icon: Users },
        { name: 'Lore & World', path: '/dashboard/world', icon: BookOpen },
        { name: 'Settings', path: '/dashboard/settings', icon: Settings },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-black text-zinc-100 overflow-hidden">
            {/* Mobile Menu Button */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400"
                >
                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Sidebar Navigation */}
            <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 border-r border-zinc-800 bg-[#0a0a0a] transform transition-transform duration-300 ease-in-out flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
                {/* Brand Header */}
                <div className="flex items-center gap-3 h-16 px-6 border-b border-zinc-800">
                    <Hexagon className="w-6 h-6 text-zinc-100" />
                    <span className="font-bold text-lg tracking-wide">AkashixCore</span>
                </div>

                {/* Workspace Indicator */}
                <div className="px-6 py-4 border-b border-zinc-800/50">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Workspace</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <p className="text-sm font-medium text-zinc-300 truncate">
                            {workspaceName || 'Active Session'}
                        </p>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive
                                        ? 'bg-zinc-800/80 text-zinc-100 shadow-sm'
                                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                                    }
                `}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-zinc-100' : 'text-zinc-500'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Footer / Logout */}
                <div className="p-4 border-t border-zinc-800 bg-zinc-950/30">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-black relative">
                <div className="max-w-7xl mx-auto p-6 md:p-10 pt-20 md:pt-10">
                    {/* This Outlet is where the Characters and Overview pages will magically appear */}
                    <Outlet />
                </div>
            </main>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
};