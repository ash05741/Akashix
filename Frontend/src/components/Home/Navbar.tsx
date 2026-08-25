import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ChevronDown, Menu, X } from 'lucide-react';

const navLinks = [
    { label: 'Features', hasDropdown: true },
    { label: 'Pricing', hasDropdown: false },
    { label: 'Resources', hasDropdown: true },
    { label: 'Community', hasDropdown: false },
    { label: 'Changelog', hasDropdown: false },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-[#0B1210]/95 backdrop-blur-sm border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" strokeWidth={1.75} />
                    <span className="font-semibold tracking-tight text-white text-lg">
                        AKASHIX<span className="text-amber-400">CORE</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <button
                            key={link.label}
                            className="flex items-center gap-1 text-sm text-zinc-300 hover:text-white transition-colors"
                        >
                            {link.label}
                            {link.hasDropdown && <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                    ))}
                </nav>

                {/* Desktop Auth */}
                <div className="hidden lg:flex items-center gap-3">
                    <Link
                        to="/login"
                        className="text-sm text-zinc-300 hover:text-white transition-colors px-3 py-2"
                    >
                        Log in
                    </Link>
                    <Link
                        to="/register"
                        className="bg-amber-400 hover:bg-amber-300 text-[#0B1210] text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                    >
                        Get Started Free
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden text-zinc-300"
                    onClick={() => setMobileOpen((o) => !o)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="lg:hidden border-t border-white/10 px-4 py-4 flex flex-col gap-3 bg-[#0B1210]">
                    {navLinks.map((link) => (
                        <span key={link.label} className="text-sm text-zinc-300 py-1">
                            {link.label}
                        </span>
                    ))}
                    <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                        <Link to="/login" className="text-sm text-zinc-300 py-2">Log in</Link>
                        <Link
                            to="/register"
                            className="bg-amber-400 text-[#0B1210] text-sm font-semibold px-5 py-2.5 rounded-lg text-center"
                        >
                            Get Started Free
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}