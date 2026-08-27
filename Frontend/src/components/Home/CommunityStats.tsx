import { Users2, BookOpenCheck, Lightbulb, HeadphonesIcon, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const stats = [
    { icon: Users2, value: '15K+', label: 'Active Members' },
    { icon: BookOpenCheck, value: '2.5K+', label: 'Stories Shared' },
    { icon: Lightbulb, value: '850+', label: 'Worldbuilding Prompts' },
    { icon: HeadphonesIcon, value: '24/7', label: 'Community Support' },
];

export default function CommunityStats() {
    return (
        <section className="bg-[#FAF6ED] pb-24">
            <div className="max-w-[88rem] mx-auto px-4 sm:px-4 lg:px-4">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative rounded-[2rem] overflow-hidden bg-[#09171A] shadow-2xl"
                >

                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <motion.div
                            initial={{ scale: 1.15 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="absolute inset-0 bg-[url('https://images.alphacoders.com/856/thumb-1920-856977.jpg')] bg-cover bg-right opacity-50"
                        />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-r from-[#081B21] via-[#081B21]/70 via-35% to-[#081B21]/0 to-90%"></div>

                    <div className="relative z-10 p-8 lg:p-14 grid grid-cols-[1fr_1.8fr] gap-8 lg:gap-12 items-center">

                        <div className="pr-0 lg:pr-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                            >
                                <span className="text-[#D4B976] text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase">
                                    Join a growing community
                                </span>
                            </motion.div>

                            <motion.h3
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                                className="font-serif text-3xl sm:text-4xl font-medium text-white mt-4 mb-5 leading-tight"
                            >
                                Writers building worlds together.
                            </motion.h3>

                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                                className="text-zinc-300/90 leading-relaxed mb-8 text-sm sm:text-base"
                            >
                                AkashixCore is more than a tool — it's a community of storytellers
                                who inspire, support, and grow together.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group flex items-center gap-3 border border-[#D4B976]/40 hover:border-[#D4B976]/80 hover:bg-[#D4B976]/10 text-zinc-100 px-6 py-2.5 rounded-lg text-sm font-medium w-fit transition-colors duration-300 cursor-pointer"
                                >
                                    Join Our Community <ArrowRight className="w-4 h-4 text-[#D4B976] transition-transform duration-300 group-hover:translate-x-1.5" />
                                </motion.button>
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5">
                            {stats.map(({ icon: Icon, value, label }, index) => (
                                <motion.div
                                    key={label}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: 0.4 + (index * 0.1), ease: "easeOut" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group bg-[#11272B]/60 backdrop-blur-md border border-white/5 hover:border-[#D4B976]/30 hover:bg-[#11272B]/80 rounded-2xl p-6 lg:p-8 flex flex-col items-center justify-center text-center shadow-lg hover:shadow-[0_0_30px_-5px_rgba(212,185,118,0.15)] hover:-translate-y-1.5 transition-colors duration-500 cursor-pointer"
                                >
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1">
                                        <Icon className="w-6 h-6 text-[#D4B976]" strokeWidth={1.2} />
                                    </div>

                                    <div className="text-white text-3xl font-serif mb-2 transition-transform duration-500 group-hover:scale-105">{value}</div>

                                    <div className="text-zinc-400 text-[11px] lg:text-xs font-medium tracking-wide transition-colors duration-500 group-hover:text-zinc-300">
                                        {label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                    </div>
                </motion.div>
            </div>
        </section>
    );
}