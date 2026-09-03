import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Search, Loader2, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SEARCH_USERS = gql`
    query SearchUsers($query: String!) {
        searchUsers(query: $query) {
            id
            name
            role
        }
    }
`;

interface SearchResult {
    id: string;
    name: string;
    role: string;
}

interface SearchUsersData {
    searchUsers: SearchResult[];
}

export const GlobalSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [executeSearch, { data, loading }] = useLazyQuery<SearchUsersData>(SEARCH_USERS);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.trim().length > 1) {
                executeSearch({ variables: { query: searchTerm } });
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, executeSearch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectUser = (userId: string) => {
        setIsOpen(false);
        setSearchTerm('');
        navigate(`/dashboard/user/${userId}`);
    };

    const searchResults = data?.searchUsers || [];

    return (
        <div ref={wrapperRef} className="relative w-full z-50 px-4 py-2">
            <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-[#d9a05b] transition-colors" strokeWidth={2} />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Search creators..."
                    className="w-full bg-zinc-100/50 border border-zinc-200 py-2.5 pl-10 pr-10 text-xs font-bold tracking-wide text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#d9a05b] focus:bg-white transition-all rounded-xl shadow-inner"
                />
                {loading && (
                    <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d9a05b] animate-spin" />
                )}
            </div>

            {/* Real-time Dropdown */}
            <AnimatePresence>
                {isOpen && searchTerm.trim().length > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-4 right-4 mt-2 bg-white border border-zinc-200 shadow-xl rounded-xl max-h-64 overflow-y-auto custom-scrollbar overflow-hidden"
                    >
                        {!loading && searchResults.length === 0 && (
                            <div className="p-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">
                                No entities found
                            </div>
                        )}

                        {searchResults.map((user: SearchResult) => (
                            <button
                                key={user.id}
                                onClick={() => handleSelectUser(user.id)}
                                className="w-full text-left p-3 hover:bg-zinc-50 border-b border-zinc-100 last:border-0 flex items-center justify-between group transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#081B21] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                                        <UserIcon className="w-4 h-4 text-[#d9a05b]" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <span className="block text-xs font-bold text-zinc-900 group-hover:text-[#d9a05b] transition-colors">
                                            {user.name}
                                        </span>
                                        <span className="block text-[9px] font-bold uppercase tracking-widest text-zinc-400 mt-0.5">
                                            {user.role}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};