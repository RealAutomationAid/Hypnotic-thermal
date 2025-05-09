import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import SupabaseAuth from '../../lib/SupabaseService';

const TestLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loginMethod, setLoginMethod] = useState<'direct' | 'service'>('direct');

  const handleLogin = async () => {
    setIsLoading(true);
    setResult(null);
    setIsSuccess(false);
    setUserDetails(null);

    try {
      console.log(`Attempting login with email: ${username}`);
      
      // Use the email directly
      const email = username;
      
      let data;
      
      // Try login with selected method
      if (loginMethod === 'direct') {
        console.log('Using direct Supabase client method');
        // Try to login with Supabase directly
        const response = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (response.error) {
          throw response.error;
        }
        
        data = response.data;
      } else {
        console.log('Using SupabaseAuth service method');
        // Try to login with SupabaseAuth service
        const response = await SupabaseAuth.login(email, password);
        data = response;
      }
      
      console.log('Login successful:', data);
      
      if (data.user) {
        // Get user details
        setIsSuccess(true);
        setUserDetails(data.user);
        setResult('Login successful! You can now redirect to the admin panel.');
        
        // Store successful auth in localStorage for auth persistence
        localStorage.setItem('adminLoggedIn', 'true');
      } else {
        throw new Error('User not found in response');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      setIsSuccess(false);
      setResult(`Login failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateTestAccount = async () => {
    setIsLoading(true);
    setResult(null);
    setIsSuccess(false);
    setUserDetails(null);
    
    try {
      // Convert username to email format for Supabase
      const email = `${username}@example.com`;
      
      // Try to create a test account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: 'Geri',
            username: username
          }
        }
      });
      
      if (error) {
        // If the error is that the user already exists, let's try to sign in
        if (error.message.includes('already exists')) {
          setResult('User already exists. Trying to sign in...');
          handleLogin();
          return;
        }
        throw error;
      }
      
      console.log('Account created:', data);
      
      if (data.user) {
        setIsSuccess(true);
        setUserDetails(data.user);
        setResult('Test account created successfully! You can now login with these credentials.');
      } else {
        throw new Error('User not created properly');
      }
    } catch (error: any) {
      console.error('Account creation failed:', error);
      setIsSuccess(false);
      setResult(`Account creation failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Test Supabase Login</h1>
        <p className="mb-4">This page tests direct login to Supabase.</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your email address"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your password"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Login Method</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="loginMethod" 
                  checked={loginMethod === 'direct'}
                  onChange={() => setLoginMethod('direct')}
                  className="mr-2"
                />
                Direct Supabase
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="loginMethod"
                  checked={loginMethod === 'service'}
                  onChange={() => setLoginMethod('service')}
                  className="mr-2"
                />
                Auth Service
              </label>
            </div>
          </div>
          
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isLoading ? 'Logging in...' : 'Test Login'}
          </button>
          
          <button
            onClick={handleCreateTestAccount}
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-green-400"
          >
            Create Test Account
          </button>
        </div>
        
        {result && (
          <div className={`mt-4 p-3 rounded-md ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <p>{result}</p>
            
            {userDetails && (
              <div className="mt-2">
                <p><strong>User ID:</strong> {userDetails.id}</p>
                <p><strong>Email:</strong> {userDetails.email}</p>
                <p><strong>Created At:</strong> {new Date(userDetails.created_at).toLocaleString()}</p>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-600">
          <p>Suggested Test Credentials:</p>
          <p>Email: millenium@abv.bg</p>
          <p>Note: Use the password you created in Supabase</p>
        </div>
      </div>
    </div>
  );
};

export default TestLoginPage; 