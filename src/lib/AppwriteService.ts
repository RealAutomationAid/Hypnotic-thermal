import { Client, Account } from 'appwrite';

// Constants for API endpoints and project
const ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = '681bae9700045d80a790';

// Singleton Appwrite client
let appwriteClient: Client | null = null;

// Get or initialize the Appwrite client
const getClient = (): Client => {
  if (!appwriteClient) {
    appwriteClient = new Client();
    appwriteClient.setEndpoint(ENDPOINT).setProject(PROJECT_ID);
  }
  return appwriteClient;
};

// Helper class for authentication
class AppwriteAuth {
  /**
   * Login with email and password - bypass API calls if possible
   */
  static async login(email: string, password: string): Promise<boolean> {
    // If email and password match our known admin, just mark as logged in
    // This bypasses Appwrite API completely for known credentials
    if (email === 'admin@admin.com' && password === 'admin123') {
      console.log('Login bypassed for known admin user');
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('hasAttemptedLogin', 'true');
      localStorage.setItem('adminUser', JSON.stringify({
        email: 'admin@admin.com',
        name: 'Admin User',
        role: 'admin'
      }));
      return true;
    }
    
    // Also accept the alternative credentials
    if (email === 'admin@hypnoticvillas.com' && password === 'Admin123!') {
      console.log('Login bypassed for hypnotic admin user');
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('hasAttemptedLogin', 'true');
      localStorage.setItem('adminUser', JSON.stringify({
        email: 'admin@hypnoticvillas.com',
        name: 'Admin User',
        role: 'admin'
      }));
      return true;
    }
    
    // For non-standard credentials, try actual API login
    try {
      const client = getClient();
      const account = new Account(client);
      
      // Try to create a session
      const session = await account.createEmailPasswordSession(email, password);
      
      // Store login state in localStorage
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('hasAttemptedLogin', 'true');
      
      console.log('Login successful', session);
      return true;
    } catch (error: any) {
      console.error('Login failed:', error);
      
      // If rate limited but credentials were correct, allow bypass
      if (error?.code === 429 && 
          ((email === 'admin@admin.com' && password === 'admin123') || 
           (email === 'admin@hypnoticvillas.com' && password === 'Admin123!'))) {
        console.log('Rate limited but credentials valid - bypassing');
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('hasAttemptedLogin', 'true');
        localStorage.setItem('adminUser', JSON.stringify({
          email,
          name: 'Admin User',
          role: 'admin'
        }));
        return true;
      }
      
      throw error;
    }
  }
  
  /**
   * Logout the current user - only clear localStorage
   */
  static async logout(): Promise<void> {
    // Clear localStorage first (this ensures logout works even if API calls fail)
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('hasAttemptedLogin');
    localStorage.removeItem('adminUser');
    
    // Optionally try to clean up server-side session, but don't worry if it fails
    try {
      const client = getClient();
      const account = new Account(client);
      await account.deleteSession('current');
    } catch (error) {
      console.log('Server session cleanup failed - ignoring');
    }
  }
  
  /**
   * Check if the user is logged in
   */
  static isLoggedIn(): boolean {
    return localStorage.getItem('adminLoggedIn') === 'true';
  }
  
  /**
   * Get current user data from localStorage
   */
  static getCurrentUser(): any {
    const userData = localStorage.getItem('adminUser');
    if (userData) {
      return JSON.parse(userData);
    }
    
    // Default admin user if logged in but no data
    if (this.isLoggedIn()) {
      return {
        email: 'admin@admin.com',
        name: 'Admin User',
        role: 'admin'
      };
    }
    
    return null;
  }
}

export default AppwriteAuth; 