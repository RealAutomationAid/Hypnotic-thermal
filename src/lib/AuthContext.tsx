import { supabase, loginUser, logoutUser, getCurrentUser } from './supabase';
import React, { createContext, useContext, useEffect, useState } from 'react';
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
  const checkAuth = async () => {
    try {
      setLoading(true);
      // Based on https://supabase.com/docs/reference/javascript/auth-getsession
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (session) {
        // If we have a session, get the user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
        setUser(user);
        setSession(session);
      } else {
        setUser(null);
        setSession(null);
      }
      
      return user;
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setSession(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const data = await loginUser(email, password);
      if (data) {
        setUser(data.user);
        setSession(data.session);
      }
      return data;
    } catch (error) {
      console.error("Login failed in AuthContext:", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Logout failed in AuthContext:", error);
    }
  };

  // Set up auth state listener on mount
  useEffect(() => {
    checkAuth();
    
    // Set up Supabase auth state change listener
    // Based on https://supabase.com/docs/reference/javascript/auth-onauthstatechange
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (session) {
          setUser(session.user);
          setSession(session);
        } else {
          setUser(null);
          setSession(null);
        }
        
        setLoading(false);
      }
    );

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

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