import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApolloClient } from '@apollo/client/react';

// 1. Updated User interface
interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl?: string | null;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (userData: User, token: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (fields: Partial<User>) => void; // <-- NEW: Added this to the interface
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const client = useApolloClient();

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

    const login = async (userData: User, newToken: string) => {
        // FORCE WIPE APOLLO CACHE on login to prevent cross-account data leaks
        await client.clearStore();

        localStorage.setItem('akashix_token', newToken);
        localStorage.setItem('akashix_user', JSON.stringify(userData));

        setToken(newToken);
        setUser(userData);
    };

    const logout = async () => {
        // Clear auth tokens and active workspace selection on signout
        localStorage.removeItem('akashix_token');
        localStorage.removeItem('akashix_user');
        localStorage.removeItem('workspaceId');
        localStorage.removeItem('workspaceName');

        setToken(null);
        setUser(null);

        // FORCE WIPE APOLLO CACHE on logout
        await client.clearStore();
    };

    // --- NEW: Function to safely update specific user fields (like avatarUrl) ---
    const updateUser = (fields: Partial<User>) => {
        setUser((prev) => {
            if (!prev) return null;
            const updatedUser = { ...prev, ...fields };
            localStorage.setItem('akashix_user', JSON.stringify(updatedUser));
            return updatedUser;
        });
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            updateUser, // <-- NEW: Expose it to the rest of the app
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