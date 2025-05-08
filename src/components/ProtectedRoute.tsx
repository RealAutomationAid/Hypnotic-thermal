import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectPath?: string;
}

export const ProtectedRoute = ({
  children,
  redirectPath = '/login',
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { user, loading, checkAuth } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        setIsVerifying(true);
        await checkAuth();
      } catch (error) {
        console.error('Auth verification failed:', error);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAuth();
  }, [checkAuth]);

  // Show loading state while checking authentication
  if (loading || isVerifying) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If user is authenticated, render the protected content
  return <>{children}</>;
}; 