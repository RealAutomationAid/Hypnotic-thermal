/*
 * Create a simple admin user for the application
 * Run this script with Node.js to create a user that can login to the admin area
 * 
 * This fixes the "Invalid credentials" issue by creating a known user we can log in with
 * 
 * Run with: node src/scripts/create-simple-admin.mjs
 */

import { Client, Users, ID } from 'node-appwrite';

// Initialize client with API key
const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('681bae9700045d80a790')
  .setKey('standard_5163c0c97712eaa4a3d4de7a5c761593e7e8e563b671ec528e12af27c5da205a0b643fb91361717aec6bc97bb6e722f0bb3b327fbf8219660305c46fab6c5a3c85a8c3fafd3f534f5e1baa4d7c2a37d4d1d75ed8ae5a847c1f19c60d5df6b2bb5aad1eff898ad8ead4327a164ec06f91a75560a58b60eb39d4605976f9baf3a2');

const users = new Users(client);

// Admin user credentials - EXACTLY MATCHING what's in our login form
const userId = 'simple-admin';
const email = 'admin@admin.com';
const password = 'admin123';
const name = 'Admin User';
const phone = '+12065550100'; // Required valid phone format

async function createAdmin() {
  console.log('🔑 Creating admin user...');
  
  // First check if user already exists
  try {
    try {
      const existingUser = await users.get(userId);
      console.log('✓ Admin user already exists:', existingUser);
      console.log('\nLOGIN CREDENTIALS:');
      console.log('- Email:', email);
      console.log('- Password:', password);
      return;
    } catch (err) {
      // This is expected if user doesn't exist
      console.log('Creating new admin user...');
    }
    
    // Create the user with all required parameters including phone
    const user = await users.create(
      userId,    // User ID
      email,     // Email
      phone,     // Phone (with valid format)
      password,  // Password
      name       // Name
    );
    
    console.log('✓ User created successfully:', user);
    
    // Verify email and phone
    await users.updateVerification(userId, true);
    await users.updatePhoneVerification(userId, true);
    console.log('✓ Email and phone verified successfully');
    
    console.log('\nLOGIN CREDENTIALS:');
    console.log('- Email:', email);
    console.log('- Password:', password);
  } catch (err) {
    console.error('Error creating admin user:', err);
    if (err.response) {
      try {
        console.log('Error details:', JSON.parse(err.response));
      } catch (e) {
        console.log('Raw response:', err.response);
      }
    }
  }
}

// Run the creation function
createAdmin().catch(console.error); 