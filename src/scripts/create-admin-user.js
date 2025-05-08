/*
This script creates an admin user in Appwrite using the Appwrite SDK.
To run this script:

1. Install the Node Appwrite SDK: npm install node-appwrite
2. Set your Appwrite environment variables:
   - APPWRITE_ENDPOINT (e.g., https://fra.cloud.appwrite.io/v1)
   - APPWRITE_PROJECT_ID (e.g., 681bae9700045d80a790)
   - APPWRITE_API_KEY (create this in the Appwrite console with appropriate permissions)
3. Run the script: node create-admin-user.js
*/

const { Client, Users, ID } = require('node-appwrite');

// Get environment variables
const endpoint = process.env.APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const projectId = process.env.APPWRITE_PROJECT_ID || '681bae9700045d80a790';
const apiKey = process.env.APPWRITE_API_KEY;

if (!apiKey) {
  console.error('❌ Error: APPWRITE_API_KEY environment variable is required');
  process.exit(1);
}

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
    console.log('🔍 Checking if user already exists...');
    
    try {
      const existingUser = await users.get(userId);
      console.log(`⚠️ User with ID ${userId} already exists:`, existingUser);
      console.log('ℹ️ Skipping user creation. If you want to recreate this user, delete it first in the Appwrite console.');
      return;
    } catch (error) {
      // User doesn't exist, continue with creation
      console.log('✅ User does not exist, creating new user...');
    }
    
    // Create the user
    const newUser = await users.create(
      userId,
      email,
      password,
      name
    );
    
    console.log('✅ User created successfully:', newUser);
    console.log('\nLogin credentials:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('\nUse these credentials to log in to the admin panel.');
  } catch (error) {
    console.error('❌ Error creating user:', error);
  }
}

// Run the function
createAdminUser(); 