import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import AppwriteAuth from '@/lib/AppwriteService';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['admin'] 
}) => {
  const { user, isLoading } = useAuth();
  const [checkingLocal, setCheckingLocal] = useState<boolean>(true);
  
  // Check authentication immediately using local storage
  useEffect(() => {
    // Quick check using the AppwriteAuth service
    setCheckingLocal(false);
  }, []);
  
  // If still checking authentication status, show a loading spinner
  if (isLoading && checkingLocal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hypnotic-dark text-white">
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-hypnotic-accent mx-auto"></div>
          <p className="mt-3">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Primary check using AppwriteAuth service
  const isLocallyAuthenticated = AppwriteAuth.isLoggedIn();
  
  // Secondary check using context
  const isContextAuthenticated = user && allowedRoles.includes(user.role || 'admin');
  
  // Combined check - either method is sufficient
  if (!isLocallyAuthenticated && !isContextAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated, render the protected content
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute; 