import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../hooks/index';

const AdminProtectedRoute = () => {
  const { user, loading } = useAuth();

  // If still loading, show a loading indicator
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is not logged in or not an admin, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is not an admin, redirect to home
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // If user is an admin, allow access to the admin routes
  return <Outlet />;
};

export default AdminProtectedRoute;
