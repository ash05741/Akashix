import { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
    { quote: 'AkashixCore transformed the way I organize my stories. The connections feature is a game changer!', name: 'Sarah J.', role: 'Fantasy Author' },
    { quote: 'Finally, a worldbuilding app that understands writers. Clean, powerful, and truly writer-focused.', name: 'Michael R.', role: 'Screenwriter' },
    { quote: 'I love how everything is connected. My world feels alive, detailed, and consistent.', name: 'Elena K.', role: 'Novelist' },
    { quote: 'The workspace isolation means I can run three separate series without anything bleeding together.', name: 'Dara T.', role: 'Serial Fiction Writer' },
    { quote: 'It replaced four different note apps. Everything about my universe finally lives in one place.', name: 'Priya N.', role: 'Worldbuilder' },
];

export default function Testimonials() {
    // 1. Make visibleCount responsive so mobile sees 1 card and desktop sees 3
    const [visibleCount, setVisibleCount] = useState(3);

    useEffect(() => {
        const handleResize = () => setVisibleCount(window.innerWidth < 640 ? 1 : 3);
        handleResize(); // Set on mount
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [start, setStart] = useState(0);
    const maxStart = Math.max(testimonials.length - visibleCount, 0);

    const prev = () => setStart((s) => Math.max(s - 1, 0));
    const next = () => setStart((s) => Math.min(s + 1, maxStart));

    return (
        <section className="bg-[#FAF6ED] pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-center mb-12"
                >
                    <span className="text-amber-600 text-xs font-semibold tracking-widest uppercase">
                        Loved by writers
                    </span>
                    <h3 className="font-serif text-3xl font-semibold text-zinc-900 mt-3">
                        See what creators are saying
                    </h3>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    className="flex items-center gap-4"
                >
                    <motion.button
                        onClick={prev}
                        disabled={start === 0}
                        whileHover={start !== 0 ? { scale: 1.1 } : {}}
                        whileTap={start !== 0 ? { scale: 0.9 } : {}}
                        className="hidden sm:flex w-10 h-10 rounded-full border border-zinc-300 items-center justify-center disabled:opacity-30 disabled:border-zinc-300 disabled:bg-transparent transition-colors duration-300 shrink-0 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700 hover:shadow-md cursor-pointer"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="w-4 h-4 transition-transform duration-300 hover:-translate-x-0.5" />
                    </motion.button>

                    <div className="overflow-hidden flex-1 py-4 touch-pan-y">
                        <motion.div
                            className="flex cursor-grab active:cursor-grabbing"
                            // 2. Add touch drag support!
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={(_, { offset, velocity }) => {
                                // Swipe left goes to next, swipe right goes to prev
                                if (offset.x < -50 || velocity.x < -200) next();
                                if (offset.x > 50 || velocity.x > 200) prev();
                            }}
                            animate={{ x: `-${start * (100 / visibleCount)}%` }}
                            transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        >
                            {testimonials.map((t) => (
                                <div key={t.name} className="w-full sm:w-1/3 shrink-0 px-2.5">
                                    <div className="group bg-white border border-zinc-200 rounded-xl p-6 h-full flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 hover:border-amber-300 hover:shadow-[0_8px_30px_-5px_rgba(0,0,0,0.08)] select-none">
                                        <div>
                                            <Quote className="w-5 h-5 text-amber-400 mb-4 transition-transform duration-500 group-hover:scale-125 group-hover:-translate-y-1 group-hover:rotate-[-10deg]" fill="currentColor" strokeWidth={0} />
                                            <p className="text-zinc-700 text-sm leading-relaxed mb-6 transition-colors duration-300 group-hover:text-zinc-900">{t.quote}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-emerald-700 group-hover:shadow-md pointer-events-none">
                                                {t.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-zinc-900 transition-transform duration-300 group-hover:translate-x-0.5">{t.name}</div>
                                                <div className="text-xs text-zinc-500 transition-colors duration-300 group-hover:text-amber-600">{t.role}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    <motion.button
                        onClick={next}
                        disabled={start === maxStart}
                        whileHover={start !== maxStart ? { scale: 1.1 } : {}}
                        whileTap={start !== maxStart ? { scale: 0.9 } : {}}
                        className="hidden sm:flex w-10 h-10 rounded-full border border-zinc-300 items-center justify-center disabled:opacity-30 disabled:border-zinc-300 disabled:bg-transparent transition-colors duration-300 shrink-0 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700 hover:shadow-md cursor-pointer"
                        aria-label="Next"
                    >
                        <ChevronRight className="w-4 h-4 transition-transform duration-300 hover:translate-x-0.5" />
                    </motion.button>
                </motion.div>

                {/* 3. Updated dots to match dynamic maxStart */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex justify-center gap-2 mt-6"
                >
                    {Array.from({ length: maxStart + 1 }).map((_, i) => (
                        <motion.button
                            key={i}
                            onClick={() => setStart(i)}
                            animate={{ scale: i === start ? 1.3 : 1 }}
                            whileHover={{ scale: 1.5 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 cursor-pointer ${i === start ? 'bg-zinc-800' : 'bg-zinc-300 hover:bg-zinc-400'}`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}