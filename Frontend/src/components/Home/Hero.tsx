import { Link } from 'react-router-dom';
import { Sparkles, Users, Globe2, ShieldCheck, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

const checklist = [
    'Lore & Worldbuilding',
    'Character Development',
    'Relationship Mapping',
    'Seamless Connections',
    'Private Workspaces',
];

const stats = [
    { icon: Users, value: '3,200+', label: 'Writers & Creators' },
    { icon: Globe2, value: '7,800+', label: 'Worlds Built' },
    { icon: ShieldCheck, value: '100%', label: 'Private & Secure' },
];

export default function Hero() {
    return (
        <section
            className="relative w-full min-h-[90vh] flex items-center overflow-hidden bg-[#081B21] bg-cover bg-[center_top_20%] bg-no-repeat"
            style={{ backgroundImage: "url('https://images3.alphacoders.com/744/thumb-1920-744829.jpg')" }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-[#081B21] via-[#081B21]/60 via-35% to-transparent to-70%"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-2 py-10 relative z-10 w-full mt-10">
                <div className="grid lg:grid-cols-2 gap-10 items-center">

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <div className="group inline-flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 rounded-full px-3 py-1 mb-6 text-xs text-amber-400 font-semibold tracking-widest uppercase transition-colors duration-300 cursor-default">
                            <Sparkles className="w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                            Built for storytellers
                        </div>

                        <h1 className="font-serif text-5xl sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.1] tracking-tight mb-6">
                            Build Worlds.<br />
                            <span className="text-[#d9a05b] transition-all duration-500 hover:text-[#ebd1ac] hover:drop-shadow-[0_0_15px_rgba(217,160,91,0.4)] cursor-default">
                                Craft Legends.
                            </span><br />
                            Tell Unforgettable Stories.
                        </h1>

                        <p className="text-zinc-300 text-lg leading-relaxed max-w-md mb-10">
                            AkashixCore is the all-in-one worldbuilding and narrative design
                            platform for writers, by writers.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-16">
                            <Link
                                to="/register"
                                className="group bg-[#d9a05b] hover:bg-[#e8b577] text-black font-bold px-6 py-3.5 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-[0_0_20px_rgba(217,160,91,0.3)] hover:shadow-[0_0_30px_rgba(217,160,91,0.6)] hover:scale-105 active:scale-95"
                            >
                                Start Building Free <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                            </Link>

                            <button className="group bg-zinc-900/50 backdrop-blur-sm border border-white/20 hover:bg-zinc-800 hover:border-white/40 text-white font-semibold px-6 py-3.5 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)]">
                                Explore Features <BookOpen className="w-4 h-4 text-zinc-400 transition-transform duration-300 group-hover:-translate-y-1 group-hover:text-zinc-200" />
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-8 lg:gap-12">
                            {stats.map(({ icon: Icon, value, label }) => (
                                <div key={label} className="group flex items-center gap-3 cursor-default">
                                    <Icon className="w-8 h-8 text-zinc-500 transition-all duration-500 group-hover:text-[#d9a05b] group-hover:scale-110 group-hover:-translate-y-1" strokeWidth={1.5} />
                                    <div>
                                        <div className="text-white text-lg font-bold leading-none mb-1 transition-transform duration-300 group-hover:translate-x-0.5">{value}</div>
                                        <div className="text-zinc-400 text-sm transition-colors duration-300 group-hover:text-zinc-300">{label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        className="hidden lg:flex justify-end relative"
                    >
                        <div className="group bg-[#081B21]/70 backdrop-blur-sm border border-white/10 hover:border-[#d9a05b]/30 rounded-2xl p-10 max-w-sm w-full shadow-2xl transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(217,160,91,0.15)]">
                            <h3 className="text-white text-xl font-bold leading-snug mb-8 transition-colors duration-500 group-hover:text-zinc-100">
                                Everything you need to bring your universe to life.
                            </h3>
                            <ul className="space-y-5">
                                {checklist.map((item) => (
                                    <li key={item} className="group/item flex items-center gap-3 text-sm text-zinc-300 hover:text-white font-medium transition-colors duration-300 cursor-default">
                                        <CheckCircle2 className="w-5 h-5 text-[#d9a05b] shrink-0 transition-transform duration-300 group-hover/item:scale-110 group-hover/item:drop-shadow-[0_0_5px_rgba(217,160,91,0.5)]" />
                                        <span className="transition-transform duration-300 group-hover/item:translate-x-1">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}