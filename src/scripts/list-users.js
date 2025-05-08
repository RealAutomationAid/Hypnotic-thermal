/*
 * List All Users Script
 * Run with: node src/scripts/list-users.js
 * 
 * This script lists all users in the Appwrite project to help troubleshoot login issues
 */

import { Client, Users, Query } from 'node-appwrite';

// Initialize client with API key
const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('681bae9700045d80a790')
  .setKey('standard_5163c0c97712eaa4a3d4de7a5c761593e7e8e563b671ec528e12af27c5da205a0b643fb91361717aec6bc97bb6e722f0bb3b327fbf8219660305c46fab6c5a3c85a8c3fafd3f534f5e1baa4d7c2a37d4d1d75ed8ae5a847c1f19c60d5df6b2bb5aad1eff898ad8ead4327a164ec06f91a75560a58b60eb39d4605976f9baf3a2');

const users = new Users(client);

async function listAllUsers() {
  console.log('\n📋 LISTING ALL USERS');
  console.log('---------------------\n');
  
  try {
    // List users (up to 100)
    const userList = await users.list();
    
    if (userList.total === 0) {
      console.log('❓ No users found in the project');
      return;
    }
    
    console.log(`🧑‍💻 Found ${userList.total} users:\n`);
    
    // Print user details
    userList.users.forEach((user, index) => {
      console.log(`User #${index + 1}: ${user.name}`);
      console.log(`- ID: ${user.$id}`);
      console.log(`- Email: ${user.email}`);
      console.log(`- Email Verified: ${user.emailVerification ? 'Yes' : 'No'}`);
      console.log(`- Status: ${user.status}`);
      console.log('');
    });
    
    // Print login information for admin users
    const adminUsers = userList.users.filter(user => 
      user.email === 'admin@admin.com' || 
      user.email.includes('admin') ||
      user.name.toLowerCase().includes('admin')
    );
    
    if (adminUsers.length > 0) {
      console.log('\n🔑 POTENTIAL ADMIN USERS FOR LOGIN:');
      console.log('--------------------------------');
      
      adminUsers.forEach(admin => {
        console.log(`- Email: ${admin.email}`);
        console.log(`  ID: ${admin.$id}`);
        console.log(`  Status: ${admin.status} (${admin.emailVerification ? 'Verified' : 'Not Verified'})`);
        console.log('');
      });
      
      console.log('\n💡 TRY THESE CREDENTIALS:');
      console.log('- Email: admin@admin.com');
      console.log('- Password: admin123');
      console.log('At the login page: http://localhost:8081/login');
    } else {
      console.log('⚠️ No admin users found. Create one using the admin creation script.');
    }
    
  } catch (error) {
    console.error('❌ Error listing users:', error);
  }
}

// Run the function
listAllUsers().catch(console.error); 