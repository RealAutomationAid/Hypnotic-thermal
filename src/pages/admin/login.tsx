import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';

// Import Appwrite directly
import { Client, Account } from 'appwrite';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Initialize a fresh client for this login attempt
      const client = new Client();
      client
        .setEndpoint('https://fra.cloud.appwrite.io/v1')
        .setProject('681bae9700045d80a790');
      
      const account = new Account(client);
      
      // Clear any existing sessions
      try {
        await account.deleteSessions();
        console.log('Cleared existing sessions');
      } catch (e) {
        console.log('No active sessions to delete');
      }
      
      console.log(`Attempting login with: ${email} / ${password}`);
      
      // Try login with email session
      try {
        // @ts-ignore - Ignore TS errors with different SDK versions
        const session = await account.createEmailSession(email, password);
        console.log('Login successful with createEmailSession:', session);
        
        // Get user details
        const user = await account.get();
        console.log('User details:', user);
        
        setIsSuccess(true);
        setTimeout(() => {
          localStorage.setItem('adminLoggedIn', 'true');
          navigate('/admin');
        }, 1000);
      } catch (emailError) {
        console.error('Error with createEmailSession:', emailError);
        
        // Try alternative method
        try {
          console.log('Trying alternative login method...');
          // @ts-ignore - Ignore TS errors with different SDK versions
          const session = await account.createSession(email, password);
          console.log('Login successful with createSession:', session);
          
          const user = await account.get();
          console.log('User details:', user);
          
          setIsSuccess(true);
          setTimeout(() => {
            localStorage.setItem('adminLoggedIn', 'true');
            navigate('/admin');
          }, 1000);
        } catch (sessionError) {
          console.error('Error with createSession:', sessionError);
          throw new Error('All login methods failed');
        }
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(`Invalid credentials. Please check the email and password.`);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md p-6 space-y-6 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-gray-500 mt-2">Enter your credentials to access the admin dashboard</p>
        </div>
        
        {isSuccess ? (
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <AlertDescription>Login successful! Redirecting to admin panel...</AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            
            <div className="mt-4 bg-blue-50 p-3 rounded text-sm text-blue-800">
              <p className="font-medium">Login credentials:</p>
              <p>Email: admin@admin.com</p>
              <p>Password: admin123</p>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default AdminLogin; 