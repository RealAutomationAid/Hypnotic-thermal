import { Client, Account } from 'node-appwrite';

// Initialize client
const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('681bae9700045d80a790');

const account = new Account(client);

// Credentials to test
const credentialsToTest = [
  { email: 'admin@admin.com', password: 'admin' },
  { email: 'admin@admin.com', password: 'admin123' },
  { email: 'admin@hypnoticvillas.com', password: 'Admin123!' },
  { email: 'admin@hypnoticvillas.com', password: 'admin123' },
  { email: 'admin@admin.com', password: 'Admin123!' },
];

async function testCredentials() {
  console.log('\n🔑 TESTING APPWRITE CREDENTIALS 🔑\n');
  console.log('Endpoint:', 'https://fra.cloud.appwrite.io/v1');
  console.log('Project ID:', '681bae9700045d80a790');
  console.log('Appwrite SDK version: v17+');
  console.log('---------------------------------------\n');

  for (const creds of credentialsToTest) {
    try {
      console.log(`Testing: ${creds.email} / ${creds.password}`);
      
      // In Appwrite v17+, you need to use createEmailSession for email-based login
      const session = await account.createEmailSession(creds.email, creds.password);
      
      console.log('✅ SUCCESS! Login worked.');
      console.log('Session:', session);
      
      // Get user details
      try {
        const user = await account.get();
        console.log('User details:', user);
      } catch (userErr) {
        console.log('Could not get user details:', userErr.message);
      }
      
      // Clean up
      try {
        await account.deleteSession('current');
        console.log('Session cleaned up.');
      } catch (deleteErr) {
        console.log('Could not delete session:', deleteErr.message);
      }
      
      console.log('\n');
      
      // We found working credentials, let's return them
      return {
        success: true,
        credentials: creds
      };
    } catch (error) {
      console.log(`❌ Failed: ${error.message}\n`);
    }
  }
  
  return {
    success: false,
    message: 'All credentials failed.'
  };
}

// Run the test
testCredentials()
  .then((result) => {
    console.log('TEST RESULTS:');
    if (result.success) {
      console.log('✅ Found working credentials:');
      console.log('- Email:', result.credentials.email);
      console.log('- Password:', result.credentials.password);
      console.log('\nUse these to log in to the admin panel.');
    } else {
      console.log('❌ No working credentials found.');
      console.log('You may need to create a user through the Appwrite console or run an admin creation script.');
    }
  })
  .catch((error) => {
    console.error('Error running test:', error);
  }); 