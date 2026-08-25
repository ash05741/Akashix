import { BookOpen, Users, Link2, FileText, LayoutGrid } from 'lucide-react';

const features = [
    {
        icon: BookOpen,
        title: 'Lore & Worldbuilding',
        desc: 'Create locations, factions, history, and more. Build the foundation of your universe.',
    },
    {
        icon: Users,
        title: 'Characters',
        desc: 'Build deep, narrative-driven characters your readers will care about and remember.',
    },
    {
        icon: Link2,
        title: 'Connections',
        desc: 'Seamlessly connect characters, places, events, and lore. See how everything intertwines.',
    },
    {
        icon: FileText,
        title: 'Documents & Outlines',
        desc: 'Write, organize, and outline your story in a distraction-free writing environment.',
    },
    {
        icon: LayoutGrid,
        title: 'Workspaces',
        desc: 'Keep every story universe separate, private, and beautifully organized.',
    },
];

export default function Features() {
    return (
        <section className="bg-[#FAF6ED] py-24">
            <div className="max-w-8xl mx-auto px-4 sm:px-15">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    {/* Increased from text-xs to text-sm */}
                    <span className="text-amber-600 text-sm font-semibold tracking-widest uppercase">
                        Powerful tools for every story
                    </span>

                    {/* Increased from 3xl/4xl to 4xl/5xl */}
                    <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-zinc-900 mt-3 mb-4">
                        Everything connected. Every detail matters.
                    </h2>

                    {/* Added text-lg */}
                    <p className="text-lg text-zinc-600 leading-relaxed">
                        From the smallest village to the deepest history, keep your world
                        rich, connected, and ready to tell.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {features.map(({ icon: Icon, title, desc }) => (
                        <div
                            key={title}
                            className="bg-white border border-zinc-200 rounded-xl p-6 hover:border-amber-300 hover:shadow-sm transition-all"
                        >
                            <Icon className="w-8 h-8 text-emerald-800 mb-4" strokeWidth={1.5} />

                            {/* Added text-lg for slightly bigger card headers */}
                            <h3 className="text-lg font-semibold text-zinc-900 mb-2">{title}</h3>

                            {/* Increased from text-sm to text-base (which is Tailwind's default, so we just remove text-sm) */}
                            <p className="text-base text-zinc-500 leading-relaxed mb-4">{desc}</p>

                            {/* Increased from text-sm to text-base */}
                            <button className="text-amber-600 text-base font-medium hover:text-amber-700">
                                Learn more →
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}