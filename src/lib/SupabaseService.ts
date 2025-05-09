// Based on https://supabase.com/docs/reference/javascript/auth-admin-createuser
import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

// Supabase Auth Service for authentication
class SupabaseAuth {
  public async login(email: string, password: string) {
    try {
      console.log(`[SupabaseAuth] Attempting to login with email: ${email}`);
      
      // Based on https://supabase.com/docs/reference/javascript/auth-signinwithpassword
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[SupabaseAuth] Login error:', error);
        throw error;
      }
      
      // Store auth state in localStorage for persistence
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('lastLoginTime', Date.now().toString());
      
      console.log('[SupabaseAuth] Login successful:', data);
      
      // Store user data in cache for faster access
      if (data.user) {
        localStorage.setItem('cachedUserData', JSON.stringify(data.user));
        localStorage.setItem('lastUserCheckTime', Date.now().toString());
      }
      
      return data;
    } catch (error) {
      console.error("[SupabaseAuth] Login failed:", error);
      throw error;
    }
  }

  public async logout() {
    try {
      console.log('[SupabaseAuth] Attempting to logout');
      // Based on https://supabase.com/docs/reference/javascript/auth-signout
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local flags on logout
      localStorage.removeItem('cachedUserData');
      localStorage.removeItem('lastUserCheckTime');
      localStorage.removeItem('lastLoginTime');
      localStorage.removeItem('adminLoggedIn');
      
      console.log('[SupabaseAuth] Logout successful');
      return true;
    } catch (error) {
      console.error("[SupabaseAuth] Logout failed:", error);
      throw error;
    }
  }

  public async getCurrentUser(): Promise<User | null> {
    try {
      // Check if we have a cached user data that's recent
      const lastUserCheckTime = localStorage.getItem('lastUserCheckTime');
      const currentTime = Date.now();
      
      if (lastUserCheckTime && (currentTime - parseInt(lastUserCheckTime)) < 10000) {
        const cachedUserData = localStorage.getItem('cachedUserData');
        if (cachedUserData) {
          console.log('[SupabaseAuth] Using cached user data');
          try {
            return JSON.parse(cachedUserData);
          } catch (e) {
            console.error('[SupabaseAuth] Error parsing cached user data:', e);
            // Continue with the regular flow if cache parsing fails
          }
        }
      }
      
      console.log('[SupabaseAuth] Checking for active session');
      // Check if we have a session first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("[SupabaseAuth] Failed to get session:", sessionError);
        return null;
      }
      
      if (!session) {
        console.log('[SupabaseAuth] No active session found');
        localStorage.removeItem('adminLoggedIn');
        return null;
      }
      
      console.log('[SupabaseAuth] Session found, fetching user');
      // If we have a session, try to get the user
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('[SupabaseAuth] Error getting user:', error);
        throw error;
      }
      
      // Cache the user data
      if (user) {
        console.log('[SupabaseAuth] User found, caching data');
        localStorage.setItem('lastUserCheckTime', currentTime.toString());
        localStorage.setItem('cachedUserData', JSON.stringify(user));
        localStorage.setItem('adminLoggedIn', 'true');
      } else {
        console.log('[SupabaseAuth] No user found despite having a session');
        localStorage.removeItem('adminLoggedIn');
      }
      
      return user;
    } catch (error) {
      console.error("[SupabaseAuth] Failed to get current user:", error);
      return null;
    }
  }

  public async isAuthenticated(): Promise<boolean> {
    console.log('[SupabaseAuth] Checking if user is authenticated');
    
    // First check localStorage for quick response
    const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (adminLoggedIn) {
      console.log('[SupabaseAuth] Admin logged in flag found');
      
      // Check if we have cached user data
      const cachedUserData = localStorage.getItem('cachedUserData');
      if (cachedUserData) {
        try {
          // Parse the cached data to verify it's valid
          JSON.parse(cachedUserData);
          console.log('[SupabaseAuth] Valid cached user data found');
          
          // If we've checked recently, return true directly
          const lastUserCheckTime = localStorage.getItem('lastUserCheckTime');
          if (lastUserCheckTime && (Date.now() - parseInt(lastUserCheckTime)) < 60000) {
            console.log('[SupabaseAuth] Using recent cached auth state');
            return true;
          }
        } catch (e) {
          console.error('[SupabaseAuth] Invalid cached user data:', e);
        }
      }
    }
    
    try {
      // Verify with Supabase directly
      const { data: { session } } = await supabase.auth.getSession();
      const result = !!session;
      console.log('[SupabaseAuth] Session check result:', result);
      
      if (result) {
        // Update localStorage flags
        localStorage.setItem('adminLoggedIn', 'true');
        
        // Also get and cache the user data
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            localStorage.setItem('cachedUserData', JSON.stringify(user));
            localStorage.setItem('lastUserCheckTime', Date.now().toString());
          }
        } catch (error) {
          console.error("[SupabaseAuth] Error getting user data:", error);
        }
      } else {
        // Clear localStorage flag if no session
        localStorage.removeItem('adminLoggedIn');
      }
      
      return result;
    } catch (error) {
      console.error("[SupabaseAuth] Auth check failed:", error);
      return false;
    }
  }

  public async createUser(email: string, password: string, name: string) {
    try {
      console.log(`Creating user with email: ${email}`);
      
      // Based on https://supabase.com/docs/reference/javascript/auth-signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            full_name: name,
            username: email.split('@')[0] // Store username in metadata
          }
        }
      });

      if (error) throw error;
      
      console.log('User created successfully:', data);
      return data;
    } catch (error) {
      console.error("Failed to create user:", error);
      throw error;
    }
  }

  // Helper function to extract username from user object
  public getUsernameFromUser(user: User | null): string | null {
    if (!user) return null;
    
    // If username is stored in metadata, use that
    if (user.user_metadata?.username) {
      return user.user_metadata.username as string;
    }
    
    // Otherwise extract from email
    return user.email?.split('@')[0] || null;
  }
}

export default new SupabaseAuth(); 