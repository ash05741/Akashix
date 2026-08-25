import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
        <header className="sticky top-0 z-50 bg-[#081B21] backdrop-blur-sm border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="group flex items-center gap-2">
                    <Sparkles className="w-8 h-8 text-amber-400 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" strokeWidth={1.75} />
                    <span className="font-roboto font-semibold tracking-tight text-white text-xl transition-colors duration-300">
                        AKASHIX<span className="text-amber-400 transition-colors duration-300 group-hover:text-amber-300">CORE</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="font-roboto hidden lg:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <button
                            key={link.label}
                            className="group flex items-center gap-1 text-md text-zinc-300 hover:text-white transition-colors duration-300 cursor-pointer"
                        >
                            <span className="relative">
                                {link.label}
                                <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-amber-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
                            </span>
                            {link.hasDropdown && <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />}
                        </button>
                    ))}
                </nav>

                {/* Desktop Auth */}
                <div className="hidden lg:flex items-center gap-3">
                    <Link
                        to="/login"
                        className="text-md font-bold text-zinc-300 hover:text-white transition-all duration-300 px-3 py-2 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                    >
                        Log in
                    </Link>
                    <Link
                        to="/register"
                        className="bg-amber-400 hover:bg-amber-300 text-[#0B1210] text-md font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_-5px_rgba(251,191,36,0.6)] active:scale-95"
                    >
                        Get Started Free
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    onClick={() => setMobileOpen((o) => !o)}
                    aria-label="Toggle menu"
                >
                    <div className="transition-transform duration-300 active:scale-90">
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </div>
                </button>
            </div>

            {/* Mobile Menu (Animated smoothly via AnimatePresence) */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="lg:hidden border-t border-white/10 bg-[#0B1210] overflow-hidden"
                    >
                        <div className="px-4 py-4 flex flex-col gap-3">
                            {navLinks.map((link) => (
                                <span key={link.label} className="text-sm text-zinc-300 py-1 transition-all duration-300 hover:text-white hover:translate-x-2 cursor-pointer">
                                    {link.label}
                                </span>
                            ))}
                            <div className="flex flex-col gap-2 pt-2 border-t border-white/10 mt-2">
                                <Link to="/login" className="text-sm text-zinc-300 py-2 transition-all duration-300 hover:text-white hover:translate-x-2">Log in</Link>
                                <Link
                                    to="/register"
                                    className="bg-amber-400 text-[#0B1210] text-sm font-semibold px-5 py-2.5 rounded-lg text-center transition-all duration-300 hover:bg-amber-300 active:scale-95"
                                >
                                    Get Started Free
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}