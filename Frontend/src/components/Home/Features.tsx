import { BookOpen, Users, Link2, FileText, LayoutGrid } from 'lucide-react';
import { motion } from 'motion/react';

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
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-center max-w-2xl mx-auto mb-16"
                >
                    <span className="text-amber-600 text-sm font-semibold tracking-widest uppercase">
                        Powerful tools for every story
                    </span>

                    <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-zinc-900 mt-3 mb-4">
                        Everything connected. Every detail matters.
                    </h2>

                    <p className="text-lg text-zinc-600 leading-relaxed">
                        From the smallest village to the deepest history, keep your world
                        rich, connected, and ready to tell.
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {features.map(({ icon: Icon, title, desc }, index) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                            className="group bg-white border border-zinc-200 rounded-xl p-6 hover:border-amber-300 hover:shadow-[0_8px_30px_-5px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-500 cursor-pointer"
                        >
                            <Icon className="w-8 h-8 text-emerald-800 mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1" strokeWidth={1.5} />

                            <h3 className="text-lg font-semibold text-zinc-900 mb-2">{title}</h3>

                            <p className="text-base text-zinc-500 leading-relaxed mb-4">{desc}</p>

                            <button className="flex items-center gap-1.5 text-amber-600 text-base font-medium transition-colors duration-300 group-hover:text-amber-700">
                                Learn more <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}