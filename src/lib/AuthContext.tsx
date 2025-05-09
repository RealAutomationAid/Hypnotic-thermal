import { supabase, loginUser, logoutUser, getCurrentUser, getSession } from './supabase';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';

// Define the shape of our auth context
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<User | null>;
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  login: async () => null,
  logout: async () => {},
  checkAuth: async () => null,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// AuthProvider component that wraps the app and provides auth context
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to check if user is authenticated
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get the current session directly
      const currentSession = await getSession();
      
      if (!currentSession) {
        // No session, clear state
        setUser(null);
        setSession(null);
        setLoading(false);
        return null;
      }
      
      // If we have a session, set it
      setSession(currentSession);
      
      // Get the user data
      try {
        const { data: { user: currentUser }, error } = await supabase.auth.getUser();
        
        if (error) {
          throw error;
        }
        
        if (currentUser) {
          setUser(currentUser);
          setLoading(false);
          return currentUser;
        } else {
          setUser(null);
          setLoading(false);
          return null;
        }
      } catch (error) {
        console.error("Error getting user data:", error);
        setUser(null);
        setLoading(false);
        return null;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setSession(null);
      setLoading(false);
      return null;
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const data = await loginUser(email, password);
      if (data) {
        setUser(data.user);
        setSession(data.session);
        localStorage.setItem('adminLoggedIn', 'true');
      }
      setLoading(false);
      return data;
    } catch (error) {
      console.error("Login failed in AuthContext:", error);
      setLoading(false);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      setUser(null);
      setSession(null);
      localStorage.removeItem('adminLoggedIn');
      setLoading(false);
    } catch (error) {
      console.error("Logout failed in AuthContext:", error);
      setLoading(false);
    }
  };

  // Set up auth state listener on mount
  useEffect(() => {
    // Check auth on component mount
    checkAuth();
    
    // Set up Supabase auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        // Immediately update session state
        if (newSession) {
          setSession(newSession);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
        }
        
        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            if (newSession) {
              try {
                // Get user data
                const { data: { user: currentUser }, error } = await supabase.auth.getUser();
                
                if (error) {
                  console.error("Error getting user after sign in:", error);
                  break;
                }
                
                if (currentUser) {
                  // Set user state
                  setUser(currentUser);
                  
                  // Update localStorage
                  localStorage.setItem('adminLoggedIn', 'true');
                }
              } catch (error) {
                console.error("Error in SIGNED_IN handler:", error);
              }
            }
            break;
            
          case 'SIGNED_OUT':
            setUser(null);
            setSession(null);
            
            // Clear localStorage
            localStorage.removeItem('adminLoggedIn');
            break;
            
          case 'USER_UPDATED':
            if (newSession) {
              setSession(newSession);
              try {
                const { data: { user: updatedUser }, error } = await supabase.auth.getUser();
                
                if (error) {
                  console.error("Error getting updated user:", error);
                  break;
                }
                
                if (updatedUser) {
                  setUser(updatedUser);
                }
              } catch (error) {
                console.error("Error in USER_UPDATED handler:", error);
              }
            }
            break;
            
          case 'TOKEN_REFRESHED':
            if (newSession) {
              setSession(newSession);
            }
            break;
            
          case 'INITIAL_SESSION':
            if (newSession) {
              setSession(newSession);
              
              // Only fetch user if we don't already have one
              if (!user) {
                try {
                  const { data: { user: initialUser }, error } = await supabase.auth.getUser();
                  
                  if (error) {
                    console.error("Error getting initial user:", error);
                    break;
                  }
                  
                  if (initialUser) {
                    setUser(initialUser);
                    localStorage.setItem('adminLoggedIn', 'true');
                  }
                } catch (error) {
                  console.error("Error in INITIAL_SESSION handler:", error);
                }
              }
            }
            break;
        }
        
        setLoading(false);
      }
    );

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [checkAuth, user]);

  // Context value
  const value = {
    user,
    session,
    loading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 