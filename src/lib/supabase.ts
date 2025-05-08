// Based on https://supabase.com/docs/reference/javascript/initializing
import { createClient } from '@supabase/supabase-js';
import type { User, Session } from '@supabase/supabase-js';

// Check if environment variables are defined
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://tpkvjkirocwxkkolqmjt.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwa3Zqa2lyb2N3eGtrb2xxbWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3Mjk2MjYsImV4cCI6MjA2MjMwNTYyNn0.m2QNWce363TAVr2TWeaMGnRNFi6gVkQclhGf2t5ANfg';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Supabase environment variables are missing. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are defined.'
  );
}

// Initialize the Supabase client
// Conceptual mapping: Appwrite Client → Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Export the supabase configuration
export const supabaseConfig = {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY
};

// Function to check Supabase connection
// Conceptual mapping: Appwrite checkConnection → Supabase getUser
export const checkConnection = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    console.log('Supabase connection successful:', user);
    return user;
  } catch (error) {
    console.error('Supabase connection failed:', error);
    return null;
  }
};

// User authentication functions
// Conceptual mapping: Appwrite createUser → Supabase signUp
export const createUser = async (email: string, password: string, name: string) => {
  try {
    // Based on https://supabase.com/docs/reference/javascript/auth-signup
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
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Conceptual mapping: Appwrite loginUser → Supabase signInWithPassword
export const loginUser = async (email: string, password: string) => {
  try {
    console.log(`Attempting login with email: ${email}`);
    
    // Based on https://supabase.com/docs/reference/javascript/auth-signinwithpassword
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    
    console.log('Login successful:', data);
    
    // Store auth state in localStorage
    localStorage.setItem('adminLoggedIn', 'true');
    localStorage.setItem('hasAttemptedLogin', 'true');
    
    return data;
  } catch (error: any) {
    console.error('Login failed:', error);
    
    // Add specific handling for rate limit errors
    if (error?.status === 429) {
      console.log('Rate limit exceeded. Please wait before trying again.');
    }
    
    throw error;
  }
};

// Conceptual mapping: Appwrite logoutUser → Supabase signOut
export const logoutUser = async () => {
  try {
    // Based on https://supabase.com/docs/reference/javascript/auth-signout
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear local storage flags
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('hasAttemptedLogin');
    
    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

// Conceptual mapping: Appwrite getCurrentUser → Supabase getUser
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // First check if we have localStorage flag to avoid unnecessary API calls
    const hasAttemptedLogin = localStorage.getItem('hasAttemptedLogin') === 'true';
    if (!hasAttemptedLogin) {
      console.log('No previous login attempt found in localStorage');
      return null;
    }
    
    // Based on https://supabase.com/docs/reference/javascript/auth-getuser
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    
    return user;
  } catch (error: any) {
    // Only log the error if it's not an unauthorized error
    if (error?.status !== 401) {
      console.error('Error getting current user:', error);
    }
    return null;
  }
};

// Helper function to get the current session
// Based on https://supabase.com/docs/reference/javascript/auth-getsession
export const getSession = async (): Promise<Session | null> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}; 