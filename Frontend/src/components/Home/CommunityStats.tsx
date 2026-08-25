import { Users2, BookOpenCheck, Lightbulb, HeadphonesIcon, ArrowRight } from 'lucide-react';

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

                {/* Main Card Container with Background Image & Overlay */}
                <div className="relative rounded-[2rem] overflow-hidden bg-[#09171A] shadow-2xl">

                    {/* Background Image */}
                    <div className="absolute inset-0 bg-[url('https://images.alphacoders.com/856/thumb-1920-856977.jpg')] bg-cover bg-right opacity-50"></div>

                    {/* Dark Gradient Overlays for Readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#081B21] via-[#081B21]/70 via-35% to-[#081B21]/0 to-90%"></div>


                    {/* Content Grid */}
                    <div className="relative z-10 p-8 lg:p-14 grid grid-cols-[1fr_1.8fr] gap-8 lg:gap-12 items-center">

                        {/* --- LEFT SIDE: Text & CTA --- */}
                        <div className="pr-0 lg:pr-4">
                            <span className="text-[#D4B976] text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase">
                                Join a growing community
                            </span>

                            <h3 className="font-serif text-3xl sm:text-4xl font-medium text-white mt-4 mb-5 leading-tight">
                                Writers building worlds together.
                            </h3>

                            <p className="text-zinc-300/90 leading-relaxed mb-8 text-sm sm:text-base">
                                AkashixCore is more than a tool — it's a community of storytellers
                                who inspire, support, and grow together.
                            </p>

                            <button className="flex items-center gap-3 border border-[#D4B976]/40 hover:border-[#D4B976]/80 hover:bg-[#D4B976]/10 text-zinc-100 px-6 py-2.5 rounded-lg text-sm font-medium w-fit transition-all duration-300 cursor-pointer">
                                Join Our Community <ArrowRight className="w-4 h-4 text-[#D4B976]" />
                            </button>
                        </div>

                        {/* --- RIGHT SIDE: 4 Stats Cards in a Row --- */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5">
                            {stats.map(({ icon: Icon, value, label }) => (
                                <div
                                    key={label}
                                    className="bg-[#11272B]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 lg:p-8 flex flex-col items-center justify-center text-center shadow-lg"
                                >
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4">
                                        <Icon className="w-6 h-6 text-[#D4B976]" strokeWidth={1.2} />
                                    </div>

                                    <div className="text-white text-3xl font-serif mb-2">{value}</div>

                                    <div className="text-zinc-400 text-[11px] lg:text-xs font-medium tracking-wide">
                                        {label}
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}