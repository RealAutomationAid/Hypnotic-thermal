import { useEffect, useState } from 'react';
import { account } from '../lib/appwrite';

export const useAppwriteConnection = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsLoading(true);
        const userData = await account.get();
        console.log('Appwrite connection successful:', userData);
        setUser(userData);
        setIsConnected(true);
        setError(null);
      } catch (err) {
        console.error('Appwrite connection failed:', err);
        setIsConnected(false);
        setUser(null);
        setError('Failed to connect to Appwrite: ' + (err instanceof Error ? err.message : String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  return { isConnected, user, error, isLoading };
}; 