import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Search, Loader2, User as UserIcon } from 'lucide-react';

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

// 1. ADDED: We tell TypeScript exactly what the GraphQL response looks like
interface SearchUsersData {
    searchUsers: SearchResult[];
}

export const GlobalSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const wrapperRef = useRef<HTMLDivElement>(null);

    // 2. FIXED: Pass the <SearchUsersData> interface into the hook
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
        <div ref={wrapperRef} className="relative w-full max-w-md z-50">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" strokeWidth={1.5} />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Search for creators or nodes..."
                    className="w-full bg-black border border-zinc-800 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors font-mono rounded-none"
                />
                {loading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 animate-spin" />
                )}
            </div>

            {/* Real-time Dropdown */}
            {isOpen && searchTerm.trim().length > 1 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-zinc-800 shadow-2xl max-h-64 overflow-y-auto">
                    {!loading && searchResults.length === 0 && (
                        <div className="p-4 text-xs font-mono text-zinc-500 uppercase text-center">
                            No entities found
                        </div>
                    )}

                    {searchResults.map((user: SearchResult) => (
                        <button
                            key={user.id}
                            onClick={() => handleSelectUser(user.id)}
                            className="w-full text-left p-3 hover:bg-zinc-900/50 border-b border-zinc-800/50 last:border-0 flex items-center justify-between group transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-none bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                                    <UserIcon className="w-3 h-3 text-zinc-400 group-hover:text-white" />
                                </div>
                                <span className="text-sm font-bold text-zinc-300 group-hover:text-white">
                                    {user.name}
                                </span>
                            </div>
                            <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-600">
                                {user.role}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};