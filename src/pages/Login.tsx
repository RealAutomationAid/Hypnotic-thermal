import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import SupabaseAuth from '@/lib/SupabaseService';
import { useAuth } from '@/lib/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('admin123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginStatus, setLoginStatus] = useState<string | null>(null);
  const [directLoginSuccess, setDirectLoginSuccess] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Check if already logged in via auth context on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await SupabaseAuth.isAuthenticated();
        if (isAuthenticated || user) {
          setDirectLoginSuccess(true);
          setLoginStatus('Already logged in! Redirecting...');
          
          // Add a small delay before redirect
          setTimeout(() => {
            navigate('/admin');
          }, 500);
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
      }
    };
    
    checkAuth();
  }, [navigate, user]);

  // Login function using Supabase
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Recheck auth status
    const isAuthenticated = await SupabaseAuth.isAuthenticated();
    if (isAuthenticated) {
      navigate('/admin');
      return;
    }
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setLoginStatus('Logging in...');

    try {
      // Login using Supabase
      const response = await SupabaseAuth.login(email, password);
      
      if (response) {
        // Set UI success state
        setDirectLoginSuccess(true);
        setLoginStatus('Login successful, redirecting...');
        
        // Redirect after a brief delay
        setTimeout(() => {
          navigate('/admin');
        }, 500);
      }
      
    } catch (err: any) {
      console.error('Login failed:', err);
      
      // Special handling for rate limit errors
      if (err?.status === 429) {
        setError('Rate limit reached. Try again in a moment, or refresh the page.');
      } else {
        setError(err?.message || 'Login failed. Check credentials and try again.');
      }
      
      setLoginStatus(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create demo account in Supabase if needed
  const handleDemoLogin = async () => {
    try {
      setIsSubmitting(true);
      setLoginStatus('Setting up demo access...');
      
      // Try to login first
      try {
        await SupabaseAuth.login('admin@admin.com', 'admin123');
        setDirectLoginSuccess(true);
        setLoginStatus('Login successful, redirecting...');
        
        setTimeout(() => {
          navigate('/admin');
        }, 500);
        return;
      } catch (loginErr) {
        // If login fails, try to create the user
        try {
          await SupabaseAuth.createUser('admin@admin.com', 'admin123', 'Admin User');
          // Then login
          await SupabaseAuth.login('admin@admin.com', 'admin123');
          
          setDirectLoginSuccess(true);
          setLoginStatus('Demo account created! Redirecting...');
          
          setTimeout(() => {
            navigate('/admin');
          }, 500);
        } catch (createErr: any) {
          if (createErr.message?.includes('already exists')) {
            setError('Admin account exists but credentials may be different. Please check and try again.');
          } else {
            throw createErr;
          }
        }
      }
    } catch (err: any) {
      console.error('Demo login failed:', err);
      setError(err?.message || 'Failed to set up demo access. Please try again.');
      setLoginStatus(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hypnotic-dark p-4">
      <Card className="w-full max-w-md bg-hypnotic-darker text-white border-hypnotic-accent">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold text-hypnotic-accent">Admin Login</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          {directLoginSuccess ? (
            <div className="flex flex-col items-center py-6">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-xl font-semibold text-green-400 mb-2">Login Successful!</h2>
              <p className="text-center text-gray-400">Redirecting to admin dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="bg-red-900/20 border-red-900 text-red-300">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
                
                {loginStatus && (
                  <Alert className="bg-blue-900/20 border-blue-900 text-blue-300">
                    <Info className="h-4 w-4" />
                    <AlertDescription>{loginStatus}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200">Email</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="admin@admin.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-hypnotic-dark border-gray-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-200">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-hypnotic-dark border-gray-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Button
                    type="submit"
                    className="w-full bg-hypnotic-accent hover:bg-hypnotic-accent/80 text-black font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Logging in...' : 'Login to Admin Panel'}
                  </Button>
                  
                  <Button 
                    type="button"
                    variant="outline"
                    className="w-full border-gray-700 hover:bg-gray-800 text-gray-300"
                    onClick={handleDemoLogin}
                  >
                    Create Demo Account
                  </Button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start text-sm text-gray-400 border-t border-gray-800 pt-4">
          <p className="font-semibold mb-1">Default Admin Credentials:</p>
          <p>• Email: admin@admin.com</p>
          <p>• Password: admin123</p>
          <p className="mt-2 text-xs">Use the demo account button if you don't have an account yet.</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login; 