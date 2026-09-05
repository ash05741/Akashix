import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';

interface SmoothImageProps {
    src: string;
    alt: string;
    className?: string;
}

export const SmoothImage = ({ src, alt, className = '' }: SmoothImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    return (
        <div className={`relative overflow-hidden bg-zinc-100 ${className}`}>
            {/* Skeleton / Loading State */}
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 bg-zinc-200/50 animate-pulse flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full border-2 border-zinc-300 border-t-[#d9a05b] animate-spin"></div>
                </div>
            )}

            {/* Error State (Broken Link) */}
            {hasError && (
                <div className="absolute inset-0 bg-zinc-100 flex flex-col items-center justify-center text-zinc-400">
                    <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                    <span className="text-[9px] uppercase tracking-widest font-bold">Img Failed</span>
                </div>
            )}

            {/* Actual Image (Hidden until fully loaded) */}
            <motion.img
                src={src}
                alt={alt}
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                onLoad={() => setIsLoaded(true)}
                onError={() => setHasError(true)}
                className={`w-full h-full object-cover ${className}`}
            />
        </div>
    );
};