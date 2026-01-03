import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { toast } from 'react-hot-toast';

const AdminRoute = () => {
    const isAdmin = AuthService.isAdmin();
    
    if (!isAdmin) {
        // Optional: Show a toast notification
        // toast.error("Access denied. Admin privileges required.");
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;