// Based on https://supabase.com/docs/reference/javascript/auth-getsession
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export enum ConnectionStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  CHECKING = 'checking'
}

export function useSupabaseConnection() {
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.CHECKING);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setStatus(ConnectionStatus.CHECKING);
        
        // Based on https://supabase.com/docs/reference/javascript/auth-getsession
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setStatus(ConnectionStatus.CONNECTED);
        setError(null);
      } catch (err) {
        console.error('Supabase connection error:', err);
        setStatus(ConnectionStatus.DISCONNECTED);
        setError(err instanceof Error ? err : new Error('Unknown connection error'));
      }
    };

    checkConnection();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkConnection();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { status, error };
} 