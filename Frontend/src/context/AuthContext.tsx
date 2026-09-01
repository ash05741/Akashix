import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApolloClient } from '@apollo/client/react'; // <-- ADDED THIS

// 1. Updated User interface (workspaceId/workspaceName removed)
interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (userData: User, token: string) => Promise<void>; // <-- Updated to Promise
    logout: () => Promise<void>; // <-- Updated to Promise
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const client = useApolloClient(); // <-- ADDED THIS to get access to the cache

    // Initialize state synchronously from localStorage on frame 1
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('akashix_token');
    });

    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('akashix_user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    // Made this async so we can await the cache clearing
    const login = async (userData: User, newToken: string) => {
        // FORCE WIPE APOLLO CACHE on login to prevent cross-account data leaks
        await client.clearStore();

        localStorage.setItem('akashix_token', newToken);
        localStorage.setItem('akashix_user', JSON.stringify(userData));

        setToken(newToken);
        setUser(userData);
    };

    // Made this async so we can await the cache clearing
    const logout = async () => {
        // Clear auth tokens and active workspace selection on signout
        localStorage.removeItem('akashix_token');
        localStorage.removeItem('akashix_user');
        localStorage.removeItem('workspaceId');
        localStorage.removeItem('workspaceName'); // Good practice to clear this too

        setToken(null);
        setUser(null);

        // FORCE WIPE APOLLO CACHE on logout
        await client.clearStore();
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            isAuthenticated: !!token,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};