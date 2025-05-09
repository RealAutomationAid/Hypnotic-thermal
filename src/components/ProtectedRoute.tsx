import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectPath?: string;
}

export const ProtectedRoute = ({
  children,
  redirectPath = '/login',
}: ProtectedRouteProps) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Get the current Supabase session
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          // Session exists, verify the user
          const { data: userData } = await supabase.auth.getUser();
          
          if (userData.user) {
            // Valid user, mark as authenticated
            localStorage.setItem('adminLoggedIn', 'true');
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } else {
          // No session, not authenticated
          setIsAuthenticated(false);
          localStorage.removeItem('adminLoggedIn');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-hypnotic-dark">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-hypnotic-accent mb-4"></div>
          <p className="text-hypnotic-accent">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Clear the login flag
    localStorage.removeItem('adminLoggedIn');
    
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
}; 