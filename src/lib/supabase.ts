// Based on https://supabase.com/docs/reference/javascript/initializing
import { createClient } from '@supabase/supabase-js';
import type { User, Session } from '@supabase/supabase-js';

// Get environment variables or use fallback values
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://tpkvjkirocwxkkolqmjt.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwa3Zqa2lyb2N3eGtrb2xxbWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3Mjk2MjYsImV4cCI6MjA2MjMwNTYyNn0.m2QNWce363TAVr2TWeaMGnRNFi6gVkQclhGf2t5ANfg';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Supabase environment variables are missing. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are defined.'
  );
}

// Initialize the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    storage: localStorage
  }
});

// Export Supabase config for access elsewhere
export const supabaseConfig = {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY
};

/**
 * Sign up a new user
 */
export const createUser = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { 
        full_name: name 
      }
    }
  });

  if (error) throw error;
  return data;
};

/**
 * Log in a user with email and password
 */
export const loginUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  // Clear any existing auth data before attempting login
  localStorage.removeItem('adminLoggedIn');
  
  // Attempt to sign in
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  
  if (!data || !data.user) {
    throw new Error('Login failed: No user data returned');
  }
  
  // Store auth state in localStorage
  localStorage.setItem('adminLoggedIn', 'true');
  
  return data;
};

/**
 * Log out the current user
 */
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  
  // Clear auth flag regardless of signOut result
  localStorage.removeItem('adminLoggedIn');
  
  if (error) throw error;
  return true;
};

/**
 * Get the current user, if any
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  
  return data.user;
};

/**
 * Get the current session, if any
 */
export const getSession = async (): Promise<Session | null> => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  
  return data.session;
}; 