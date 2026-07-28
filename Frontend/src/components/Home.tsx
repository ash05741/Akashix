import { Link } from 'react-router-dom';
import { Crosshair, Network, Key, GitCommit, Database } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-black text-zinc-300 font-sans p-4 sm:p-8 selection:bg-zinc-700 selection:text-white flex flex-col">

            {/* Outer Schematic Frame */}
            <div className="flex-1 border border-zinc-800 flex flex-col relative bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:100px_100px]">

                {/* Corner Crosshairs */}
                <Crosshair className="absolute -top-3 -left-3 w-6 h-6 text-zinc-600" strokeWidth={1} />
                <Crosshair className="absolute -top-3 -right-3 w-6 h-6 text-zinc-600" strokeWidth={1} />
                <Crosshair className="absolute -bottom-3 -left-3 w-6 h-6 text-zinc-600" strokeWidth={1} />
                <Crosshair className="absolute -bottom-3 -right-3 w-6 h-6 text-zinc-600" strokeWidth={1} />

                {/* Top Navigation Bar - Built into the schematic lines */}
                <nav className="flex border-b border-zinc-800 h-16 bg-black/80 backdrop-blur-sm z-10">
                    <div className="flex-1 flex items-center px-6 border-r border-zinc-800 gap-3">
                        <Database className="w-4 h-4 text-white" />
                        <span className="font-mono text-sm font-bold tracking-widest text-white uppercase">
                            Akashix_Core
                        </span>
                    </div>

                    {/* The Auth Buttons */}
                    <div className="flex">
                        <Link
                            to="/login"
                            className="flex items-center justify-center px-8 border-r border-zinc-800 font-mono text-xs uppercase tracking-widest hover:bg-zinc-900 transition-colors text-zinc-400 hover:text-white"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="flex items-center justify-center px-8 bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors gap-2"
                        >
                            <Key className="w-3 h-3" />
                            Register Node
                        </Link>
                    </div>
                </nav>

                {/* Main Schematic Body */}
                <main className="flex-1 flex flex-col lg:flex-row z-10 bg-black/40 backdrop-blur-sm">

                    {/* Left Data Column */}
                    <div className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col">
                        <div className="p-6 border-b border-zinc-800">
                            <h3 className="font-mono text-xs text-zinc-500 mb-4 tracking-widest">SYSTEM_SPECS</h3>
                            <ul className="space-y-3 font-mono text-[10px] uppercase text-zinc-400">
                                <li className="flex justify-between"><span>Architecture</span> <span className="text-white">MERN</span></li>
                                <li className="flex justify-between"><span>Language</span> <span className="text-white">TypeScript</span></li>
                                <li className="flex justify-between"><span>Auth_State</span> <span className="text-white">JWT_Persistent</span></li>
                                <li className="flex justify-between"><span>Tenancy</span> <span className="text-white">Isolated</span></li>
                            </ul>
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-end">
                            <Network className="w-8 h-8 text-zinc-700 mb-4" strokeWidth={1} />
                            <p className="font-mono text-xs text-zinc-500 leading-relaxed">
                                Establishing secure relational pathways between characters, artifacts, and multi-realm lore environments.
                            </p>
                        </div>
                    </div>

                    {/* Center Canvas */}
                    <div className="flex-1 p-8 lg:p-16 flex flex-col justify-center relative overflow-hidden">

                        {/* Decorative Background ID */}
                        <div className="absolute top-8 right-8 font-mono text-[10px] text-zinc-700 tracking-widest">
                            INDEX // 0x48FA
                        </div>

                        <div className="max-w-3xl">
                            <div className="flex items-center gap-2 mb-6">
                                <GitCommit className="w-4 h-4 text-zinc-500" />
                                <span className="font-mono text-xs text-zinc-500 tracking-widest">PROTOCOL INITIALIZED</span>
                            </div>

                            {/* Raw, oversized typography */}
                            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.85] tracking-tighter mb-8 uppercase">
                                Structuring <br />
                                The Void.
                            </h1>

                            <p className="text-lg text-zinc-400 max-w-xl leading-relaxed border-l border-zinc-700 pl-6 mb-12">
                                AkashixCore provides rigid, isolated infrastructure for world-builders. Define entities, manage state, and index your universe without overlapping tenant data.
                            </p>

                            {/* Center Canvas Action Area */}
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/register"
                                    className="border border-white text-white px-8 py-4 font-mono text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                                >
                                    Deploy Workspace
                                </Link>
                                <a
                                    href="https://github.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="border border-zinc-800 text-zinc-400 px-8 py-4 font-mono text-sm uppercase tracking-widest hover:border-zinc-500 transition-colors"
                                >
                                    View Source
                                </a>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Bottom Footer Frame */}
                <footer className="border-t border-zinc-800 h-10 flex items-center px-6 justify-between bg-black z-10">
                    <div className="font-mono text-[10px] text-zinc-600 tracking-widest uppercase">
                        Secure Connection Verified
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                        <span className="font-mono text-[10px] text-zinc-600 tracking-widest uppercase">
                            Systems Nominal
                        </span>
                    </div>
                </footer>
            </div>
        </div>
    );
}