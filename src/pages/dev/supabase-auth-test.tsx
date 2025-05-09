import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

const SupabaseAuthTest = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [authState, setAuthState] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const checkSession = async () => {
    try {
      setLoading(true);
      setMessage('Checking session...');
      
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setMessage(`Error checking session: ${error.message}`);
        return;
      }
      
      // Save session state
      setAuthState({
        hasSession: !!data.session,
        session: data.session ? {
          expires_at: data.session.expires_at,
          token_type: data.session.token_type,
          user_id: data.session.user.id,
          email: data.session.user.email
        } : null
      });
      
      if (data.session) {
        // If we have a session, get user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) {
          setMessage(`Session found but error getting user: ${userError.message}`);
        } else if (userData.user) {
          setMessage(`Session check complete. User: ${userData.user.email}`);
        } else {
          setMessage('Session found but no user data available.');
        }
      } else {
        setMessage('No active session found.');
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const testLogin = async () => {
    try {
      setLoading(true);
      setMessage('Attempting login...');
      
      // Clear old auth data
      localStorage.removeItem('adminLoggedIn');
      localStorage.removeItem('cachedUserData');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        setMessage(`Login error: ${error.message}`);
        return;
      }
      
      if (data.user && data.session) {
        setMessage(`Login successful! User: ${data.user.email}`);
        
        // Set localStorage flags
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('cachedUserData', JSON.stringify(data.user));
        localStorage.setItem('lastUserCheckTime', Date.now().toString());
        
        // Check session after login
        await checkSession();
      } else {
        setMessage('Login response missing user or session data');
      }
    } catch (err: any) {
      setMessage(`Login error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const testLogout = async () => {
    try {
      setLoading(true);
      setMessage('Logging out...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setMessage(`Logout error: ${error.message}`);
        return;
      }
      
      // Clear localStorage
      localStorage.removeItem('adminLoggedIn');
      localStorage.removeItem('cachedUserData');
      localStorage.removeItem('lastUserCheckTime');
      
      setMessage('Logout successful');
      
      // Check session after logout
      await checkSession();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const clearLocalStorage = () => {
    localStorage.clear();
    setMessage('Local storage cleared');
    checkSession();
  };
  
  // Direct navigation to Admin
  const goToAdmin = () => {
    localStorage.setItem('adminLoggedIn', 'true');
    window.location.href = '/admin';
  };
  
  useEffect(() => {
    checkSession();
  }, []);
  
  // Log localStorage contents
  const logStorageContents = () => {
    const storage = {
      adminLoggedIn: localStorage.getItem('adminLoggedIn'),
      lastUserCheckTime: localStorage.getItem('lastUserCheckTime'),
      cachedUserData: localStorage.getItem('cachedUserData') ? 'exists' : 'none',
      authToken: localStorage.getItem('supabase_auth_token') ? 'exists' : 'none'
    };
    
    setMessage('LocalStorage: ' + JSON.stringify(storage, null, 2));
  };

  const testForceAuthorization = async () => {
    try {
      setLoading(true);
      setMessage('Force creating auth state...');
      
      // First check if we have a session
      const { data } = await supabase.auth.getSession();
      
      if (data.session && data.session.user) {
        // Set all auth flags
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('cachedUserData', JSON.stringify(data.session.user));
        localStorage.setItem('lastUserCheckTime', Date.now().toString());
        
        setMessage('Force auth complete - session exists. Try Admin Dashboard now.');
      } else {
        setMessage('Cannot force auth - no valid session exists. Please login first.');
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hypnotic-dark text-white p-8">
      <div className="max-w-md mx-auto">
        <Card className="bg-hypnotic-darker border-hypnotic-accent">
          <CardHeader>
            <CardTitle className="text-hypnotic-accent">Supabase Auth Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label>Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-hypnotic-dark border-gray-700"
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <label>Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-hypnotic-dark border-gray-700"
                placeholder="Enter your password"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={testLogin} 
                className="bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Test Login'}
              </Button>
              <Button 
                onClick={testLogout} 
                className="bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                Test Logout
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={checkSession} 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                Check Session
              </Button>
              <Button 
                onClick={logStorageContents} 
                className="bg-purple-600 hover:bg-purple-700"
                disabled={loading}
              >
                Check Storage
              </Button>
              <Button 
                onClick={clearLocalStorage} 
                className="bg-yellow-600 hover:bg-yellow-700"
                disabled={loading}
              >
                Clear Storage
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={testForceAuthorization} 
                className="bg-indigo-600 hover:bg-indigo-700 w-full"
                disabled={loading}
              >
                Force Authorization (if session exists)
              </Button>
            </div>
            
            <div className="mt-4">
              <h3 className="font-semibold text-xl mb-2">Result:</h3>
              <pre className="bg-black/50 p-4 rounded overflow-auto max-h-48 text-sm">
                {loading ? 'Loading...' : message || 'No results yet'}
              </pre>
            </div>
            
            {authState && (
              <div className="mt-4">
                <h3 className="font-semibold text-xl mb-2">Auth State:</h3>
                <pre className="bg-black/50 p-4 rounded overflow-auto max-h-48 text-sm">
                  {JSON.stringify(authState, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t border-gray-700 pt-4">
            <Button
              onClick={() => window.location.href = '/login'} 
              variant="outline"
              className="border-hypnotic-accent text-hypnotic-accent"
            >
              Login Page
            </Button>
            <Button
              onClick={goToAdmin}
              variant="default"
              className="bg-hypnotic-accent hover:bg-hypnotic-accent/80 text-black"
            >
              Admin Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SupabaseAuthTest; 