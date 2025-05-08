import { Client, Account, Databases, ID, Query } from 'appwrite';

// Check if environment variables are defined
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || '681bae9700045d80a790';
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'hypnotic_villas';
const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID || 'users';

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

// Configuration object with all constants
export const appwriteConfig = {
  endpoint: ENDPOINT,
  project: PROJECT_ID,
  databaseId: DATABASE_ID,
  usersCollectionId: USERS_COLLECTION_ID
};

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

// User authentication functions
export const createUser = async (email: string, password: string, name: string) => {
  try {
    // First create the user account
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    // Then create a session for the user
    if (newAccount) {
      await account.createEmailPasswordSession(email, password);
    }
    
    return newAccount;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const loginUser = async (username: string, password: string) => {
  try {
    console.log(`Attempting login with direct method: ${username}`);
    
    // Skip deleting sessions to avoid 401 errors and rate limits
    
    // Use the client that's already initialized globally
    // This avoids issues with creating fresh clients that might not be properly configured
    const session = await account.createEmailPasswordSession(username, password);
    console.log('Login successful with direct method:', session);
    
    // Store auth state in localStorage
    localStorage.setItem('adminLoggedIn', 'true');
    localStorage.setItem('hasAttemptedLogin', 'true');
    
    return session;
  } catch (error: any) {
    console.error('Login failed:', error);
    
    // Add specific handling for rate limit errors
    if (error?.code === 429) {
      console.log('Rate limit exceeded. Please wait before trying again.');
    }
    
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    return await account.deleteSession('current');
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    // First check if we have localStorage flag to avoid unnecessary API calls
    const hasAttemptedLogin = localStorage.getItem('hasAttemptedLogin') === 'true';
    if (!hasAttemptedLogin) {
      console.log('No previous login attempt found in localStorage');
      return null;
    }
    
    const user = await account.get();
    return user;
  } catch (error: any) {
    // Only log the error if it's not an unauthorized error (401)
    if (error?.code !== 401) {
      console.error('Error getting current user:', error);
    }
    return null;
  }
};

// Export ID for convenience
export { ID }; 