// Based on https://supabase.com/docs/reference/javascript/auth-admin-createuser
import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

// Conceptual mapping: Appwrite Auth Service → Supabase Auth Service
class SupabaseAuth {
  public async login(email: string, password: string) {
    try {
      // Based on https://supabase.com/docs/reference/javascript/auth-signinwithpassword
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  public async logout() {
    try {
      // Based on https://supabase.com/docs/reference/javascript/auth-signout
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  }

  public async getCurrentUser(): Promise<User | null> {
    try {
      // Based on https://supabase.com/docs/reference/javascript/auth-getuser
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  }

  public async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  }

  public async createUser(email: string, password: string, name: string) {
    try {
      // Based on https://supabase.com/docs/reference/javascript/auth-signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name }
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Failed to create user:", error);
      throw error;
    }
  }
}

export default new SupabaseAuth(); 