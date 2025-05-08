import { Client, Account, Databases, ID } from 'appwrite';

// Check if environment variables are defined
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

if (!ENDPOINT || !PROJECT_ID) {
  throw new Error(
    'Appwrite environment variables are missing. Please check your .env file and ensure VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID are defined.'
  );
}

// Initialize the Appwrite client
const client = new Client();

client
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID);

// Initialize and export Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export { ID }; // Re-export ID for convenience

// Function to check Appwrite connection
export const checkConnection = async () => {
  try {
    const user = await account.get();
    console.log('Appwrite connection successful:', user);
    return user;
  } catch (error) {
    console.error('Appwrite connection failed:', error);
    return null;
  }
}; 