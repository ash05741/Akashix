import { Link } from 'react-router-dom';
import { Sparkles, Users, Globe2, ShieldCheck, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';

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
            {/* FULL BLEED BACKGROUND GRADIENT */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#081B21] via-[#081B21]/60 via-35% to-transparent to-70%"></div>

            {/* CONTENT CONTAINER - Adjusted padding since the section is now a tall flexbox */}
            <div className="max-w-7xl mx-auto px-4 sm:px-2 py-10 relative z-10 w-full mt-10">
                <div className="grid lg:grid-cols-2 gap-10 items-center">

                    {/* --- LEFT COLUMN: COPY & CTA --- */}
                    <div>
                        <div className="inline-flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 rounded-full px-3 py-1 mb-6 text-xs text-amber-400 font-semibold tracking-widest uppercase">
                            <Sparkles className="w-3.5 h-3.5" />
                            Built for storytellers
                        </div>

                        <h1 className="font-serif text-5xl sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.1] tracking-tight mb-6">
                            Build Worlds.<br />
                            <span className="text-[#d9a05b]">Craft Legends.</span><br />
                            Tell Unforgettable Stories.
                        </h1>

                        <p className="text-zinc-300 text-lg leading-relaxed max-w-md mb-10">
                            AkashixCore is the all-in-one worldbuilding and narrative design
                            platform for writers, by writers.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-16">
                            <Link
                                to="/register"
                                className="bg-[#d9a05b] hover:bg-[#c28e4e] text-black font-bold px-6 py-3.5 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(217,160,91,0.3)]"
                            >
                                Start Building Free <ArrowRight className="w-4 h-4" />
                            </Link>
                            <button className="bg-zinc-900/50 backdrop-blur-sm border border-white/20 hover:bg-zinc-800 hover:border-white/40 text-white font-semibold px-6 py-3.5 rounded-lg flex items-center gap-2 transition-colors">
                                Explore Features <BookOpen className="w-4 h-4 text-zinc-400" />
                            </button>
                        </div>

                        {/* Stats Row */}
                        <div className="flex flex-wrap gap-8 lg:gap-12">
                            {stats.map(({ icon: Icon, value, label }) => (
                                <div key={label} className="flex items-center gap-3">
                                    <Icon className="w-8 h-8 text-zinc-500" strokeWidth={1.5} />
                                    <div>
                                        <div className="text-white text-lg font-bold leading-none mb-1">{value}</div>
                                        <div className="text-zinc-400 text-sm">{label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: FLOATING CARD --- */}
                    <div className="hidden lg:flex justify-end relative">
                        <div className="bg-[#081B21]/70 backdrop-blur-sm border border-white/10 rounded-2xl p-10 max-w-sm w-full shadow-2xl">
                            <h3 className="text-white text-xl font-bold leading-snug mb-8">
                                Everything you need to bring your universe to life.
                            </h3>
                            <ul className="space-y-5">
                                {checklist.map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-sm text-zinc-300 font-medium">
                                        <CheckCircle2 className="w-5 h-5 text-[#d9a05b] shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}