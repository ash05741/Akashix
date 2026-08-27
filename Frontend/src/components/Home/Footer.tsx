import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { FaGithub, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const socials = [
    { name: 'GitHub', icon: FaGithub, href: 'https://github.com' },
    { name: 'Twitter', icon: FaTwitter, href: 'https://twitter.com' },
    { name: 'Instagram', icon: FaInstagram, href: 'https://instagram.com' },
    { name: 'YouTube', icon: FaYoutube, href: 'https://youtube.com' },
];

const columns = [
    {
        title: 'Product',
        links: [
            { name: 'Features', path: '/features' },
            { name: 'Pricing', path: '/pricing' },
            { name: 'Changelog', path: '/changelog' },
            { name: 'Roadmap', path: '/roadmap' },
        ],
    },
    {
        title: 'Resources',
        links: [
            { name: 'Documentation', path: '/docs' },
            { name: 'Guides', path: '/guides' },
            { name: 'Templates', path: '/templates' },
            { name: 'Blog', path: '/blog' },
        ],
    },
    {
        title: 'Community',
        links: [
            { name: 'Community Hub', path: '/community' },
            { name: 'Discord Server', path: '/discord' },
            { name: 'Events', path: '/events' },
            { name: 'Writers Wall', path: '/writers-wall' },
        ],
    },
    {
        title: 'Company',
        links: [
            { name: 'About Us', path: '/about' },
            { name: 'Careers', path: '/careers' },
            { name: 'Privacy Policy', path: '/privacy' },
            { name: 'Terms of Service', path: '/terms' },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="bg-[#0B1210] border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-10">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="lg:col-span-1"
                >
                    <Link to="/" className="flex items-center gap-2 mb-3 group">
                        <Sparkles className="w-5 h-5 text-amber-400 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" strokeWidth={1.75} />
                        <span className="font-semibold text-white">
                            AKASHIX<span className="text-amber-400">CORE</span>
                        </span>
                    </Link>
                    <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                        The all-in-one worldbuilding and narrative design platform for writers, by writers.
                    </p>

                    <div className="flex gap-4">
                        {socials.map((social, index) => (
                            <motion.a
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.name}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: 0.2 + (index * 0.1), ease: "easeOut" }}
                                whileHover={{ scale: 1.2, rotate: 8, y: -3 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-zinc-500 hover:text-white drop-shadow-none hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-colors"
                            >
                                <social.icon className="w-5 h-5" />
                            </motion.a>
                        ))}
                    </div>
                </motion.div>

                {columns.map((col, index) => (
                    <motion.div
                        key={col.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-20px" }}
                        transition={{ duration: 0.6, delay: 0.1 + (index * 0.1), ease: "easeOut" }}
                    >
                        <h4 className="text-zinc-500 text-xs font-semibold tracking-widest uppercase mb-4">
                            {col.title}
                        </h4>
                        <ul className="space-y-3">
                            {col.links.map((link) => (
                                <motion.li
                                    key={link.name}
                                    whileHover={{ x: 6 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                >
                                    <Link
                                        to={link.path}
                                        className="text-zinc-400 text-sm hover:text-white transition-colors block"
                                    >
                                        {link.name}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="border-t border-white/10 py-5"
            >
                <p className="text-center text-zinc-600 text-xs">
                    © 2026 AkashixCore. All rights reserved.
                </p>
            </motion.div>
        </footer>
    );
}