/*
 * Direct Admin User Creation Script
 * This script uses SDK v11+ compatible methods to create an admin user
 * Run with: node src/scripts/direct-create-admin.js
 */

import { Client, Users, ID } from 'node-appwrite';

// Initialize client with API key that has users.write permission
const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('681bae9700045d80a790')
  .setKey('standard_5163c0c97712eaa4a3d4de7a5c761593e7e8e563b671ec528e12af27c5da205a0b643fb91361717aec6bc97bb6e722f0bb3b327fbf8219660305c46fab6c5a3c85a8c3fafd3f534f5e1baa4d7c2a37d4d1d75ed8ae5a847c1f19c60d5df6b2bb5aad1eff898ad8ead4327a164ec06f91a75560a58b60eb39d4605976f9baf3a2');

const users = new Users(client);

// User to create - will be used with createEmailPasswordSession
const userId = 'simple-admin'; // Simple, valid user ID
const email = 'admin@admin.com';  
const password = 'admin123';
const name = 'Admin User';

async function createSimpleAdmin() {
  console.log('\n🔑 CREATING SIMPLIFIED ADMIN USER');
  console.log('-----------------------------------');
  console.log('User ID:', userId);
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('Name:', name);
  console.log('-----------------------------------\n');
  
  try {
    // First check if user exists
    try {
      const existingUser = await users.get(userId);
      console.log('✅ User already exists:', existingUser);
      
      // Delete user to recreate
      console.log('🗑️ Removing existing user to recreate with fresh credentials...');
      await users.delete(userId);
      console.log('✅ User deleted successfully');
    } catch(err) {
      // User doesn't exist, which is fine
      console.log('ℹ️ No existing user found, creating new one...');
    }
    
    // Now create a new user with SDK v11+ compatible syntax
    try {
      // Basic compatible version with just required fields
      const newUser = await users.create(
        userId,      // userId
        email,       // email 
        password,    // password
        name         // name
      );
      
      console.log('✅ User created successfully:', newUser);
      
      // Mark email as verified
      await users.updateVerification(userId, true);
      console.log('✅ Email marked as verified');
      
      console.log('\n🔐 LOGIN CREDENTIALS');
      console.log('- Email: admin@admin.com');
      console.log('- Password: admin123');
      console.log('\nUse these credentials at http://localhost:8081/login');
      
      return newUser;
    } catch (createError) {
      console.error('❌ Error creating user:', createError.message);
      
      if (createError.message.includes('phone')) {
        console.log('\n🔧 Phone validation issue detected. Trying alternative creation method...');
        // For SDK versions that require phone
        try {
          const newUser = await users.create(
            userId,            
            email,            
            '+12345678900',    // Phone field with valid format
            password,          
            name               
          );
          
          console.log('✅ User created successfully with phone number:', newUser);
          
          // Mark email and phone as verified
          await users.updateVerification(userId, true);
          await users.updatePhoneVerification(userId, true);
          console.log('✅ Email and phone marked as verified');
          
          console.log('\n🔐 LOGIN CREDENTIALS');
          console.log('- Email: admin@admin.com');
          console.log('- Password: admin123');
          console.log('\nUse these credentials at http://localhost:8081/login');
          
          return newUser;
        } catch (altError) {
          console.error('❌ Alternative creation method also failed:', altError.message);
          throw altError;
        }
      } else {
        throw createError;
      }
    }
  } catch (error) {
    console.error('❌ User creation failed:', error.message);
    console.log('\n📋 TROUBLESHOOTING GUIDE:');
    console.log('1. Try creating the user directly in the Appwrite Console');
    console.log('2. Check the API key permissions (needs users.write)');
    console.log('3. Verify the project ID is correct: 681bae9700045d80a790');
  }
}

// Run the function
createSimpleAdmin().catch(console.error); 