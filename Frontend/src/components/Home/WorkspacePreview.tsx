import {
    Play, LayoutDashboard, BookOpen, Users, Link2,
    Clock, FileText, Map as MapIcon, Layers, LayoutTemplate, Settings,
    ChevronDown, Search, Plus
} from 'lucide-react';

const navItems = [
    { icon: LayoutDashboard, label: 'Overview', active: true },
    { icon: BookOpen, label: 'Lore', active: false },
    { icon: Users, label: 'Characters', active: false },
    { icon: Link2, label: 'Connections', active: false },
    { icon: Clock, label: 'Timeline', active: false },
    { icon: FileText, label: 'Documents', active: false },
    { icon: MapIcon, label: 'Maps', active: false },
    { icon: Layers, label: 'Media', active: false },
    { icon: LayoutTemplate, label: 'Templates', active: false },
    { icon: Settings, label: 'Settings', active: false },
];

const quickStats = [
    { label: 'Lore Entries', value: 128, delta: '+12 this week' },
    { label: 'Characters', value: 38, delta: '+4 this week' },
    { label: 'Connections', value: 256, delta: '+27 this week' },
];

const activity = [
    { text: 'Kaelen Veyra was updated', time: '2h ago' },
    { text: 'You created The Crystal Spire', time: '2h ago' },
    { text: 'You linked Kaelen Veyra to The Crystal Spire', time: '3h ago' },
    { text: 'You updated War of the Shattered Sun', time: '1d ago' },
    { text: 'You created The Blood Oath', time: '2d ago' },
];

export default function WorkspacePreview() {
    return (
        <section className="bg-[#FAF6ED] py-24 px-4 sm:px-4 lg:px-4 overflow-hidden">
            <div className="max-w-[87rem] mx-auto border rounded-4xl border-zinc-200 bg-gradient-to-r from-[#C5E2C6]/80 via-[#C5E2C6]/40 via-10% to-transparent to-70%">
                <div className="grid grid-cols-1 p-4 mx-3 lg:p-6 lg:grid-cols-12 gap-12 lg:gap-8 items-center ">

                    {/* --- LEFT COLUMN: Title, Copy & Play CTA --- */}
                    <div className="lg:col-span-4 flex flex-col justify-center pr-0 lg:pr-20">
                        <span className="text-emerald-800 text-md font-medium tracking-wider uppercase mb-7">
                            DESIGNED FOR WRITERS
                        </span>

                        <h3 className="font-serif text-3xl sm:text-4xl font-semibold text-zinc-900 mb-4 leading-tight">
                            A workspace that stays out of your way so you can focus on your story.
                        </h3>

                        <p className="text-zinc-600 leading-relaxed mb-8 text-base">
                            Clean, intuitive, and powerful. Everything is just where you need it.
                        </p>

                        <button className="flex items-center gap-3 text-zinc-900 font-medium w-fit group cursor-pointer">
                            <span className="w-11 h-11 rounded-full bg-zinc-900 text-white flex items-center justify-center group-hover:bg-emerald-800 transition-colors shadow-md">
                                <Play className="w-4 h-4 fill-white ml-0.5" />
                            </span>
                            <span className="text-base font-semibold group-hover:text-emerald-800 transition-colors">See It In Action</span>
                        </button>
                    </div>

                    {/* --- RIGHT COLUMN: Full SaaS Dashboard Mockup Window --- */}
                    <div className="lg:col-span-8 bg-white border border-zinc-200/90 rounded-2xl shadow-xl overflow-hidden">

                        {/* Top App Header */}
                        <div className="h-14 border-b border-zinc-200 bg-white px-6 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="font-serif font-bold text-zinc-900 text-sm tracking-wide">
                                    <span className="text-amber-700 mr-1">✦</span>AKASHIX<span className="text-amber-700">CORE</span>
                                </span>
                            </div>

                            <div className="hidden sm:flex items-center bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 w-60 md:w-68 text-zinc-400 gap-2 text-xs">
                                <Search className="w-3.5 h-3.5 text-zinc-400" />
                                <span>Search your world...</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="bg-emerald-900 hover:bg-emerald-800 text-white font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors text-xs shadow-2xs cursor-pointer">
                                    <Plus className="w-3.5 h-3.5" /> New <ChevronDown className="w-3 h-3 opacity-70" />
                                </button>
                                <div className="w-7 h-7 rounded-full bg-zinc-800 text-white flex items-center justify-center font-medium text-xs overflow-hidden border border-zinc-300">
                                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="User" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>

                        {/* App Body Layout: Sidebar + Main Content */}
                        <div className="flex min-h-[460px]">

                            {/* Left Internal Sidebar */}
                            <div className="hidden md:flex flex-col w-52 border-r border-zinc-200 bg-[#FAF9F5] p-3.5 space-y-3">
                                <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold px-2">WORKSPACE</div>

                                <div className="bg-white border border-zinc-200 rounded-lg px-2.5 py-2 flex items-center justify-between text-zinc-800 font-medium shadow-2xs cursor-pointer text-xs">
                                    <span className="truncate">Chronicles of Elaria</span>
                                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                </div>

                                <div className="space-y-0.5 pt-1">
                                    {navItems.map(({ icon: Icon, label, active }) => (
                                        <div
                                            key={label}
                                            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-colors text-xs ${active
                                                ? 'bg-[#EFECE6] text-zinc-900 font-medium'
                                                : 'text-zinc-600 hover:bg-zinc-200/50'
                                                }`}
                                        >
                                            <Icon className={`w-4 h-4 ${active ? 'text-emerald-800' : 'text-zinc-400'}`} />
                                            {label}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Main Dashboard Panel */}
                            <div className="flex-1 p-5 sm:p-6 bg-white grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">

                                <div className="space-y-5">
                                    <h4 className="font-serif text-lg font-semibold text-zinc-900">Overview</h4>

                                    {/* Quick Stats Grid */}
                                    <div className="grid grid-cols-3 gap-2.5">
                                        {quickStats.map((s) => (
                                            <div key={s.label} className="border border-zinc-200 rounded-xl p-3 bg-white shadow-2xs">
                                                <div className="text-zinc-400 text-[10px] mb-1">{s.label}</div>
                                                <div className="font-semibold text-zinc-900 text-lg mb-0.5">{s.value}</div>
                                                <div className="text-emerald-700 text-[10px] font-medium">{s.delta}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Recent Activity Section */}
                                    <div className="border border-zinc-200 rounded-xl p-4 bg-white shadow-2xs">
                                        <div className="text-zinc-900 font-semibold text-xs mb-3">Recent Activity</div>
                                        <ul className="space-y-3">
                                            {activity.map((item, i) => (
                                                <li key={i} className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-2 text-zinc-700 truncate pr-2">
                                                        {i === 0 ? (
                                                            <div className="w-5 h-5 rounded-full bg-zinc-200 overflow-hidden shrink-0">
                                                                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                                                                ✦
                                                            </div>
                                                        )}
                                                        <span className="truncate text-zinc-800">{item.text}</span>
                                                    </div>
                                                    <span className="text-zinc-400 text-[11px] shrink-0">{item.time}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Right Side: Map Preview Card */}
                                <div className="flex flex-col rounded-xl overflow-hidden border border-zinc-200 relative bg-zinc-900 min-h-[300px] justify-between p-4 bg-[url('https://wallpapercave.com/wp/wp12519636.jpg')] bg-cover bg-center shadow-inner">
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-transparent pointer-events-none" />

                                    <div className="relative z-10">
                                        <span className="text-white font-medium text-xs bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/15">
                                            Elaria Continent
                                        </span>
                                    </div>

                                    <div className="relative z-10 w-full">
                                        <button className="w-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-medium py-2 rounded-lg border border-white/25 transition-colors text-center text-xs shadow-sm cursor-pointer">
                                            Open World Map
                                        </button>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}