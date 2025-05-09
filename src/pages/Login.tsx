import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // User is already logged in, redirect to admin dashboard
        navigate('/admin');
      }
    };
    
    checkSession();
  }, [navigate]);

  // Handle login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      // Start login process
      setIsSubmitting(true);
      setError(null);
      setMessage('Logging in...');
      
      // Attempt to sign in with Supabase
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      // Handle login errors
      if (loginError) {
        throw loginError;
      }
      
      // Validate login response
      if (!data || !data.user) {
        throw new Error('Login failed - no user data returned');
      }
      
      // Set basic localStorage flags
      localStorage.setItem('adminLoggedIn', 'true');
      
      // Show success message and redirect
      setMessage('Login successful! Redirecting to dashboard...');

      // Navigate to admin dashboard
      navigate('/admin');
      
    } catch (err: any) {
      // Handle specific error cases
      if (err.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
      } else if (err?.status === 429) {
        setError('Too many login attempts. Please wait a moment and try again.');
      } else {
        setError(err?.message || 'Login failed. Please try again.');
      }
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
              
              {message && (
                <Alert className="bg-blue-900/20 border-blue-900 text-blue-300">
                  <Info className="h-4 w-4" />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
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
              
              <Button
                type="submit"
                className="w-full bg-hypnotic-accent hover:bg-hypnotic-accent/80 text-black font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Login to Admin Panel'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login; 