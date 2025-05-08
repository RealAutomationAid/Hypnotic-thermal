import { Client, Users, ID } from 'node-appwrite';

// Hard-coded credentials (normally would use env vars)
const endpoint = 'https://fra.cloud.appwrite.io/v1';
const projectId = '681bae9700045d80a790';
const apiKey = 'standard_5163c0c97712eaa4a3d4de7a5c761593e7e8e563b671ec528e12af27c5da205a0b643fb91361717aec6bc97bb6e722f0bb3b327fbf8219660305c46fab6c5a3c85a8c3fafd3f534f5e1baa4d7c2a37d4d1d75ed8ae5a847c1f19c60d5df6b2bb5aad1eff898ad8ead4327a164ec06f91a75560a58b60eb39d4605976f9baf3a2';

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const users = new Users(client);

// Admin user details
const userId = 'admin1';
const email = 'admin@hypnoticvillas.com';
const password = 'Admin123!';
const name = 'Admin User';

async function createAdminUser() {
  try {
    // Create a simple user with just the required parameters
    const user = await users.create(
      userId,        // userId
      email,         // email
      null,          // phone (null)
      password,      // password
      name           // name
    );
    
    console.log('User created:', user);
    
    // Verify email
    await users.updateEmailVerification(userId, true);
    console.log('Email verified for user:', userId);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createAdminUser(); 