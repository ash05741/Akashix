import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    workspaceId: string;
    role: string;
    // Added as optional in case your backend sends it during login
    workspaceName?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (userData: User, token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    workspaceName: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [workspaceName, setWorkspaceName] = useState<string | null>(null);

    useEffect(() => {
        // Check for an existing session on load
        const storedToken = localStorage.getItem('akashix_token');
        const storedUser = localStorage.getItem('akashix_user');
        const storedWorkspaceName = localStorage.getItem('akashix_workspace_name');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            if (storedWorkspaceName) {
                setWorkspaceName(storedWorkspaceName);
            }
        }
    }, []);

    const login = (userData: User, newToken: string) => {
        localStorage.setItem('akashix_token', newToken);
        localStorage.setItem('akashix_user', JSON.stringify(userData));

        // Grab the workspace name if it exists, otherwise default it so the UI looks good
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
            workspaceName // <-- This was missing before!
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook so any component can instantly check auth status
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};