/*
 * Quick Admin User Creation Script
 * Just run: node src/scripts/quick-create-admin.js
 */

import { Client, Users, ID } from 'node-appwrite';

// Initialize client with API key
const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('681bae9700045d80a790')
  .setKey('standard_5163c0c97712eaa4a3d4de7a5c761593e7e8e563b671ec528e12af27c5da205a0b643fb91361717aec6bc97bb6e722f0bb3b327fbf8219660305c46fab6c5a3c85a8c3fafd3f534f5e1baa4d7c2a37d4d1d75ed8ae5a847c1f19c60d5df6b2bb5aad1eff898ad8ead4327a164ec06f91a75560a58b60eb39d4605976f9baf3a2');

const users = new Users(client);

// Simple admin credentials - WILL WORK with the login page
const userId = 'admin-user';
const email = 'admin@admin.com';
const password = 'admin123';
const name = 'Admin User';

async function createAdmin() {
  console.log('🔑 Creating simple admin user...');
  
  try {
    // Check if user already exists
    try {
      const existingUser = await users.get(userId);
      console.log(`✅ Admin user already exists:`, existingUser);
      console.log('\nLOGIN CREDENTIALS:');
      console.log('- Email:', email);
      console.log('- Password:', password);
      return;
    } catch (err) {
      // Expected if user doesn't exist
      console.log('Creating new admin user...');
    }
    
    // Create the user - using SDK v16 compatible method signatures
    const user = await users.create(userId, email, password, name);
    console.log('✅ User created successfully:', user);
    
    // Set the email as verified
    await users.updateVerification(userId, true);
    console.log('✅ Email marked as verified');
    
    console.log('\n🔑 LOGIN CREDENTIALS:');
    console.log('- Email:', email);
    console.log('- Password:', password);
    console.log('\n👉 Use these to log in to the admin panel at http://localhost:8081/login');
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    console.log('\nTry these ALTERNATIVE APPROACHES:');
    console.log('1. Create user in Appwrite Console directly');
    console.log('2. Try SDK v17 compatible script: node src/scripts/create-simple-admin.mjs');
  }
}

// Run the function
createAdmin().catch(console.error); 