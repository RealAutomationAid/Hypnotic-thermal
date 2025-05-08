import { useEffect, useState } from 'react';
import { account, databases, checkConnection } from '../../lib/appwrite';
import { AppwriteConnectionStatus } from '../../components/ui/AppwriteConnectionStatus';

const TestAppwritePage = () => {
  const [user, setUser] = useState<any>(null);
  const [userError, setUserError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const testAppwrite = async () => {
      setIsLoading(true);
      
      // Test account.get()
      try {
        const userData = await account.get();
        console.log('User data:', userData);
        setUser(userData);
      } catch (err) {
        console.error('Error fetching user:', err);
        setUserError('Failed to get user: ' + (err instanceof Error ? err.message : String(err)));
      }

      // Test any database operations
      try {
        // Using the Client directly to make a GET request to list databases
        // This is a workaround if the specific SDK method is not available or has type issues
        // Replace with your actual database ID if you know it
        const response = await fetch(
          `${import.meta.env.VITE_APPWRITE_ENDPOINT}/databases`,
          {
            method: 'GET',
            headers: {
              'X-Appwrite-Project': import.meta.env.VITE_APPWRITE_PROJECT_ID,
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );
        
        const data = await response.json();
        console.log('API Response:', data);
        setApiResponse(data);
      } catch (err) {
        console.error('API Error:', err);
        setApiError('Failed to fetch API data: ' + (err instanceof Error ? err.message : String(err)));
      }

      setIsLoading(false);
    };

    testAppwrite();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
        <p className="font-bold">Internal Development Page</p>
        <p>This page is for testing Appwrite integration only. Not for production use.</p>
      </div>

      <h1 className="text-3xl font-bold mb-6">Appwrite Connection Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Connection Status</h2>
        <AppwriteConnectionStatus />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">User Data (account.get)</h2>
        {isLoading ? (
          <p className="animate-pulse text-gray-500">Loading user data...</p>
        ) : userError ? (
          <div className="p-4 bg-red-50 text-red-700 rounded">
            <p className="font-bold">Error:</p>
            <p>{userError}</p>
          </div>
        ) : user ? (
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
            {JSON.stringify(user, null, 2)}
          </pre>
        ) : (
          <p className="text-gray-500">No user data available (not logged in)</p>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">API Response</h2>
        {isLoading ? (
          <p className="animate-pulse text-gray-500">Loading API data...</p>
        ) : apiError ? (
          <div className="p-4 bg-red-50 text-red-700 rounded">
            <p className="font-bold">Error:</p>
            <p>{apiError}</p>
          </div>
        ) : apiResponse ? (
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        ) : (
          <p className="text-gray-500">No API data available</p>
        )}
      </div>

      <div className="p-4 bg-gray-100 rounded text-sm">
        <h3 className="font-semibold">Debugging Info</h3>
        <p className="mb-2">Check your browser console for detailed logs.</p>
        <p>Environment Variables:</p>
        <ul className="list-disc pl-5">
          <li>VITE_APPWRITE_ENDPOINT: {import.meta.env.VITE_APPWRITE_ENDPOINT ? '✅ Set' : '❌ Missing'}</li>
          <li>VITE_APPWRITE_PROJECT_ID: {import.meta.env.VITE_APPWRITE_PROJECT_ID ? '✅ Set' : '❌ Missing'}</li>
        </ul>
      </div>
    </div>
  );
};

export default TestAppwritePage; 