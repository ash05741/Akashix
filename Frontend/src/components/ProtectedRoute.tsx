import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();

    // If they aren't logged in, instantly kick them to the login page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If they are logged in, render the child routes (like the Dashboard)
    return <Outlet />;
};