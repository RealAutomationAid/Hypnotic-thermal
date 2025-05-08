import { useAppwriteConnection } from '../../hooks/useAppwriteConnection';

export const AppwriteConnectionStatus = () => {
  const { isConnected, error, isLoading } = useAppwriteConnection();

  if (isLoading) {
    return <div className="p-4 bg-yellow-100 text-yellow-800 rounded">Checking Appwrite connection...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded">
        <h3 className="font-bold">Connection Error</h3>
        <p>{error}</p>
        <p className="text-sm mt-2">
          Please check your .env file and ensure that VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID are correctly set.
        </p>
      </div>
    );
  }

  if (isConnected) {
    return <div className="p-4 bg-green-100 text-green-800 rounded">✅ Connected to Appwrite successfully!</div>;
  }

  return <div className="p-4 bg-gray-100 text-gray-800 rounded">Unknown connection status</div>;
}; 