import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    workspaceId: string;
    role: string;
    workspaceName?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (userData: User, token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    workspaceName: string | null;
    isLoading: boolean; // <-- Added to prevent premature redirects
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    // 1. Initialize state synchronously from localStorage on frame 1
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('akashix_token');
    });

    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('akashix_user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [workspaceName, setWorkspaceName] = useState<string | null>(() => {
        return localStorage.getItem('akashix_workspace_name');
    });

    const [isLoading, setIsLoading] = useState(true);

    // 2. Mark loading as finished after initial mount check
    useEffect(() => {
        setIsLoading(false);
    }, []);

    const login = (userData: User, newToken: string) => {
        localStorage.setItem('akashix_token', newToken);
        localStorage.setItem('akashix_user', JSON.stringify(userData));

        const wName = userData.workspaceName || 'My Workspace';
        localStorage.setItem('akashix_workspace_name', wName);

        setToken(newToken);
        setUser(userData);
        setWorkspaceName(wName);
    };

    const logout = () => {
        localStorage.removeItem('akashix_token');
        localStorage.removeItem('akashix_user');
        localStorage.removeItem('akashix_workspace_name');
        setToken(null);
        setUser(null);
        setWorkspaceName(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            isAuthenticated: !!token,
            workspaceName,
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