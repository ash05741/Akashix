import { useState } from 'react';
// Assuming you use lucide-react, otherwise strip the icons out
import { BookOpen, Map, Shield, Clock, Plus } from 'lucide-react';

// Temporary mock data until we build the GraphQL query
const MOCK_LORE = [
    { id: '1', title: 'The Obsidian Citadel', category: 'Location', summary: 'The central stronghold and seat of power in the northern realms.' },
    { id: '2', title: 'Crimson Vanguard', category: 'Faction', summary: 'Elite warriors bound by blood magic.' },
    { id: '3', title: 'The First Sundering', category: 'History', summary: 'The cataclysmic event that shattered the continents.' }
];

const categoryIcons: Record<string, React.ReactNode> = {
    Location: <Map className="w-5 h-5 text-zinc-400" />,
    Faction: <Shield className="w-5 h-5 text-zinc-400" />,
    History: <Clock className="w-5 h-5 text-zinc-400" />,
    Default: <BookOpen className="w-5 h-5 text-zinc-400" />
};

export default function World() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="p-6 max-w-7xl mx-auto text-zinc-100">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Lore & World</h1>
                    <p className="text-sm text-zinc-400 mt-1">Manage your world-building elements, locations, and history.</p>
                </div>
                <button className="flex items-center gap-2 bg-zinc-100 text-zinc-900 hover:bg-zinc-200 px-4 py-2 rounded-md font-medium transition-colors">
                    <Plus className="w-4 h-4" />
                    New Entry
                </button>
            </div>

            {/* Filters / Search */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search lore..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-96 bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-700 placeholder:text-zinc-600"
                />
            </div>

            {/* Lore Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_LORE.map((lore) => (
                    <div key={lore.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-lg hover:border-zinc-700 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-zinc-950 rounded-md border border-zinc-800">
                                {categoryIcons[lore.category] || categoryIcons.Default}
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                {lore.category}
                            </span>
                        </div>
                        <h3 className="text-xl font-semibold text-zinc-100 mb-2 group-hover:text-white transition-colors">
                            {lore.title}
                        </h3>
                        <p className="text-sm text-zinc-400 line-clamp-3">
                            {lore.summary}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}