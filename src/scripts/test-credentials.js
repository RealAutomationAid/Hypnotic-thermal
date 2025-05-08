/*
 * Simple script to test Appwrite credentials directly
 * Run with: node src/scripts/test-credentials.js
 */
const { Client, Account } = require('node-appwrite');

// Initialize Appwrite client
const client = new Client();

// These values match what's in the Appwrite config
client
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('681bae9700045d80a790');

const account = new Account(client);

// Test both sets of credentials
async function testCredentials() {
  // Try the first set of credentials
  try {
    console.log('\n=== TESTING CREDENTIALS SET 1 ===');
    console.log('Email: admin@hypnoticvillas.com');
    console.log('Password: Admin123!');
    
    const session = await account.createEmailSession(
      'admin@hypnoticvillas.com',
      'Admin123!'
    );
    
    console.log('✅ Login successful!');
    console.log('Session:', session);
    
    // Get user information
    const user = await account.get();
    console.log('User:', user);
    
    // Delete the session
    await account.deleteSession('current');
  } catch (error) {
    console.error('❌ Login failed for credentials set 1:', error);
  }
  
  // Try the second set of credentials
  try {
    console.log('\n=== TESTING CREDENTIALS SET 2 ===');
    console.log('Email: admin@admin.com');
    console.log('Password: admin123');
    
    const session = await account.createEmailSession(
      'admin@admin.com',
      'admin123'
    );
    
    console.log('✅ Login successful!');
    console.log('Session:', session);
    
    // Get user information
    const user = await account.get();
    console.log('User:', user);
    
    // Delete the session
    await account.deleteSession('current');
  } catch (error) {
    console.error('❌ Login failed for credentials set 2:', error);
  }

  // Try admin/admin credentials
  try {
    console.log('\n=== TESTING CREDENTIALS SET 3 ===');
    console.log('Email: admin');
    console.log('Password: admin');
    
    const session = await account.createEmailSession(
      'admin',
      'admin'
    );
    
    console.log('✅ Login successful!');
    console.log('Session:', session);
    
    // Get user information
    const user = await account.get();
    console.log('User:', user);
    
    // Delete the session
    await account.deleteSession('current');
  } catch (error) {
    console.error('❌ Login failed for credentials set 3:', error);
  }
}

// Run the test
testCredentials()
  .then(() => {
    console.log('\nTests completed.');
  })
  .catch((error) => {
    console.error('Error running tests:', error);
  }); 