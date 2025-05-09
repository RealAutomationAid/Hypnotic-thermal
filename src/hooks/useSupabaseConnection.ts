// Based on https://supabase.com/docs/reference/javascript/auth-getsession
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export enum ConnectionStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  CHECKING = 'checking'
}

export function useSupabaseConnection() {
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.CHECKING);
  const [error, setError] = useState<Error | null>(null);
  const isChecking = useRef(false);

  useEffect(() => {
    // Flag to track if this is the initial check
    let isInitialCheck = true;
    
    const checkConnection = async () => {
      // Prevent concurrent connection checks
      if (isChecking.current && !isInitialCheck) {
        return;
      }
      
      isChecking.current = true;
      
      try {
        // Add throttling - don't check too frequently unless it's the initial check
        if (!isInitialCheck) {
          const lastConnectionCheck = localStorage.getItem('lastConnectionCheck');
          const currentTime = Date.now();
          
          // Only allow connection checks every 30 seconds
          if (lastConnectionCheck && (currentTime - parseInt(lastConnectionCheck)) < 30000) {
            // Use cached connection status if available
            const cachedStatus = localStorage.getItem('cachedConnectionStatus');
            if (cachedStatus) {
              setStatus(cachedStatus as ConnectionStatus);
              isChecking.current = false;
              return;
            }
          }
        }
        
        // Set initial check to false for subsequent calls
        isInitialCheck = false;
        
        // Update last check time
        const currentTime = Date.now();
        localStorage.setItem('lastConnectionCheck', currentTime.toString());
        
        if (status !== ConnectionStatus.CHECKING) {
          setStatus(ConnectionStatus.CHECKING);
        }
        
        // Based on https://supabase.com/docs/reference/javascript/auth-getsession
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        // Cache the connection status
        setStatus(ConnectionStatus.CONNECTED);
        localStorage.setItem('cachedConnectionStatus', ConnectionStatus.CONNECTED);
        setError(null);
      } catch (err) {
        console.error('Supabase connection error:', err);
        setStatus(ConnectionStatus.DISCONNECTED);
        localStorage.setItem('cachedConnectionStatus', ConnectionStatus.DISCONNECTED);
        setError(err instanceof Error ? err : new Error('Unknown connection error'));
      } finally {
        isChecking.current = false;
      }
    };

    checkConnection();
    
    // Only listen for significant auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      // Only check connection for important events to avoid loops
      if (['SIGNED_IN', 'SIGNED_OUT', 'USER_DELETED'].includes(event)) {
        checkConnection();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []); // Remove status from dependencies to prevent loops

  return { status, error };
} 