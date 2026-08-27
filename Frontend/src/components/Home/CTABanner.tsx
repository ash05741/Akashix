import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function CTABanner() {
    return (
        <section className="bg-[#FAF6ED] pb-24">
            <div className="max-w-[89rem] mx-auto px-4 sm:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative bg-[#081B21] rounded-2xl overflow-hidden flex flex-col md:flex-row items-center shadow-xl min-h-[140px]"
                >
                    <div className="absolute inset-y-0 left-0 w-full md:w-2/5 overflow-hidden">
                        <motion.div
                            initial={{ scale: 1.15 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="absolute inset-0 bg-cover bg-center opacity-80"
                            style={{ backgroundImage: "url('https://images.pexels.com/photos/31566137/pexels-photo-31566137.jpeg')" }}
                        ></motion.div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#081B21]/50 to-[#081B21]"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#081B21] via-transparent to-transparent md:hidden"></div>
                    </div>

                    <div className="relative z-10 flex w-full flex-col md:flex-row items-center justify-between px-8 py-15 sm:px-12 md:pl-[35%] lg:pl-[35%] gap-8">
                        <div className="text-center md:text-left">
                            <motion.h3
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                                className="font-serif text-4xl font-medium text-white mb-4 tracking-wide"
                            >
                                Ready to build your universe?
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                                className="text-zinc-300/90 text-sm sm:text-base"
                            >
                                Join thousands of writers and start crafting stories <br /> that live forever.
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 120 }}
                            className="text-center shrink-0"
                        >
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    to="/register"
                                    className="group bg-[#EBBF6B] hover:bg-[#dfb461] text-[#0F2C24] font-bold px-7 py-3 rounded-md flex items-center gap-2 transition-colors duration-300 shadow-md inline-flex"
                                >
                                    Start Building Free <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </Link>
                            </motion.div>
                            <motion.span
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="text-zinc-400 text-sm mt-5 block"
                            >
                                No credit card required
                            </motion.span>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}