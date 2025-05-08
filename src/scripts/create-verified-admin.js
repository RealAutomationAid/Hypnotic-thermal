#!/usr/bin/env node

/**
 * ADMIN USER CREATION SCRIPT FOR APPWRITE
 * 
 * This script creates a verified admin user in Appwrite that can immediately log in.
 * It sets the email verification status to true so there's no need to verify via email.
 * 
 * Usage:
 * 1. Ensure you have node-appwrite installed: npm install node-appwrite
 * 2. Run this script: node create-verified-admin.js
 */

const { Client, Users, ID, Teams } = require('node-appwrite');
const readline = require('readline');
const crypto = require('crypto');

// Configuration (will be overridden by CLI arguments)
const config = {
  endpoint: 'https://fra.cloud.appwrite.io/v1',
  projectId: '681bae9700045d80a790',
  apiKey: '', // Will be prompted if not provided as an environment variable
  userId: ID.unique(), // Generate a unique ID by default
  email: 'admin@hypnoticvillas.com',
  password: generateSecurePassword(), // Generate a secure password by default
  name: 'Admin User',
  adminTeamId: 'admins', // If you have a team for admins
  shouldCreateAdminTeam: true, // Create admin team if it doesn't exist
};

// Generate a secure random password (16 characters with special chars, numbers, etc.)
function generateSecurePassword() {
  const length = 16;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    password += charset[randomIndex];
  }
  
  return password;
}

// Create readline interface for prompting user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt user for input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupConfig() {
  // Use environment variables if available
  config.apiKey = process.env.APPWRITE_API_KEY || config.apiKey;
  config.endpoint = process.env.APPWRITE_ENDPOINT || config.endpoint;
  config.projectId = process.env.APPWRITE_PROJECT_ID || config.projectId;
  
  console.log('\n🔧 Appwrite Admin User Creation\n');
  
  // If API key not provided, prompt for it (required)
  if (!config.apiKey) {
    console.log('⚠️ No API key found in environment variables (APPWRITE_API_KEY)');
    config.apiKey = await prompt('Enter your Appwrite API key: ');
    
    if (!config.apiKey) {
      console.error('❌ Error: API key is required');
      process.exit(1);
    }
  }
  
  // Display current configuration
  console.log('\n📋 Current Configuration:');
  console.log(`• Endpoint: ${config.endpoint}`);
  console.log(`• Project ID: ${config.projectId}`);
  console.log(`• User ID: ${config.userId}`);
  console.log(`• Email: ${config.email}`);
  console.log(`• Password: ${config.password}`);
  console.log(`• Name: ${config.name}`);
  
  // Ask if user wants to modify this configuration
  const shouldModify = await prompt('\nDo you want to modify this configuration? (y/N): ');
  
  if (shouldModify.toLowerCase() === 'y') {
    const newEmail = await prompt(`Email (${config.email}): `);
    if (newEmail) config.email = newEmail;
    
    const newPassword = await prompt(`Password (leave empty to keep generated password): `);
    if (newPassword) config.password = newPassword;
    
    const newName = await prompt(`Name (${config.name}): `);
    if (newName) config.name = newName;
    
    console.log('\n📋 Updated Configuration:');
    console.log(`• Email: ${config.email}`);
    console.log(`• Password: ${config.password}`);
    console.log(`• Name: ${config.name}`);
  }
  
  // Final confirmation
  const confirmation = await prompt('\n⚠️ Ready to create user. Continue? (Y/n): ');
  if (confirmation.toLowerCase() === 'n') {
    console.log('❌ Operation cancelled by user');
    process.exit(0);
  }
}

async function createAdminUser() {
  try {
    await setupConfig();
    
    // Initialize Appwrite client
    const client = new Client();
    client
      .setEndpoint(config.endpoint)
      .setProject(config.projectId)
      .setKey(config.apiKey);
    
    const users = new Users(client);
    const teams = new Teams(client);
    
    // Check if admin team exists
    let adminTeam = null;
    if (config.shouldCreateAdminTeam) {
      try {
        console.log(`\n🔍 Checking if admin team "${config.adminTeamId}" exists...`);
        
        try {
          adminTeam = await teams.get(config.adminTeamId);
          console.log(`✅ Admin team exists: ${adminTeam.name}`);
        } catch (error) {
          // Team doesn't exist, create it
          console.log(`🔧 Creating admin team "${config.adminTeamId}"...`);
          adminTeam = await teams.create(config.adminTeamId, 'Administrators');
          console.log(`✅ Admin team created: ${adminTeam.name}`);
        }
      } catch (error) {
        console.warn(`⚠️ Could not verify or create admin team: ${error.message}`);
        console.warn('Continuing without team creation...');
      }
    }
    
    // Check if user already exists with the provided email
    console.log('\n🔍 Checking if user already exists...');
    
    try {
      // Try to find user by email
      const usersList = await users.list([`email=${config.email}`]);
      
      if (usersList.total > 0) {
        const existingUser = usersList.users[0];
        console.log(`⚠️ User with email ${config.email} already exists (ID: ${existingUser.$id})`);
        
        // Ask if user wants to recreate this user
        const shouldRecreate = await prompt('Do you want to delete and recreate this user? (y/N): ');
        
        if (shouldRecreate.toLowerCase() === 'y') {
          console.log(`🗑️ Deleting user ${existingUser.$id}...`);
          await users.delete(existingUser.$id);
          console.log('✅ User deleted successfully');
        } else {
          console.log('ℹ️ Skipping user creation.');
          rl.close();
          return;
        }
      }
    } catch (error) {
      console.log(`ℹ️ Error checking existing users: ${error.message}`);
      console.log('Continuing with user creation...');
    }
    
    // Create the user
    console.log('\n🔧 Creating new user...');
    const newUser = await users.create(
      config.userId,
      config.email,
      config.password,
      config.name
    );
    
    console.log(`✅ User created successfully (ID: ${newUser.$id})`);
    
    // Set email as verified
    console.log('🔧 Setting email as verified...');
    await users.updateEmailVerification(newUser.$id, true);
    console.log('✅ Email verified successfully');
    
    // Add user to admin team if both exist
    if (adminTeam && newUser) {
      try {
        console.log(`🔧 Adding user to admin team "${adminTeam.name}"...`);
        await teams.createMembership(
          adminTeam.$id,
          newUser.$id,
          ['owner'], // Roles: 'owner', 'admin', 'developer', 'member'
          config.email,
          null, // URL to redirect to after accepting the invitation (only relevant if email is not verified)
          config.name
        );
        console.log('✅ User added to admin team successfully');
      } catch (error) {
        console.warn(`⚠️ Could not add user to admin team: ${error.message}`);
      }
    }
    
    // Success message with login details
    console.log('\n✅ ADMIN USER CREATED SUCCESSFULLY');
    console.log('\n📝 LOGIN CREDENTIALS:');
    console.log('-------------------');
    console.log(`• Email: ${config.email}`);
    console.log(`• Password: ${config.password}`);
    console.log('-------------------');
    console.log('\n🌐 LOGIN URL:');
    console.log(`• http://localhost:8081/`);
    console.log('\n🔐 Test these credentials immediately to verify they work.');
    console.log('⚙️ If you face any issues, check the permissions and roles in your Appwrite console.');
    
  } catch (error) {
    console.error('\n❌ Error creating admin user:');
    console.error(error.message);
    
    // Check if error response contains more details
    if (error.response) {
      try {
        const responseData = JSON.parse(error.response);
        console.error('Response details:', responseData);
      } catch (e) {
        console.error('Raw response:', error.response);
      }
    }
    
    console.log('\n🔍 TROUBLESHOOTING:');
    console.log('• Check that your API key has the necessary permissions (users.write, teams.write)');
    console.log('• Ensure your Appwrite instance is running and accessible');
    console.log('• Verify your endpoint URL and project ID are correct');
  } finally {
    rl.close();
  }
}

// Run the script
createAdminUser(); 