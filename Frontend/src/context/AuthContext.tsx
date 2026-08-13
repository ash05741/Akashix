import React, { createContext, useContext, useState, useEffect } from 'react';

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
    login: (userData: User, token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
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

    const login = (userData: User, newToken: string) => {
        localStorage.setItem('akashix_token', newToken);
        localStorage.setItem('akashix_user', JSON.stringify(userData));

        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        // Clear auth tokens and active workspace selection on signout
        localStorage.removeItem('akashix_token');
        localStorage.removeItem('akashix_user');
        localStorage.removeItem('workspaceId');

        setToken(null);
        setUser(null);
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