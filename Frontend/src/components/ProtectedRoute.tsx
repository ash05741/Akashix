import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    // Show a spinner while the auth state is being resolved
    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    // If still not authenticated after reading storage, kick to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};