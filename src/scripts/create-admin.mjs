import { Client, Users, ID } from 'node-appwrite';

// Initialize Appwrite client with the API key
const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('681bae9700045d80a790')
  .setKey('standard_5163c0c97712eaa4a3d4de7a5c761593e7e8e563b671ec528e12af27c5da205a0b643fb91361717aec6bc97bb6e722f0bb3b327fbf8219660305c46fab6c5a3c85a8c3fafd3f534f5e1baa4d7c2a37d4d1d75ed8ae5a847c1f19c60d5df6b2bb5aad1eff898ad8ead4327a164ec06f91a75560a58b60eb39d4605976f9baf3a2');

// Initialize the Users API
const users = new Users(client);

// User details
const userId = 'admin'; // Simple ID
const email = 'admin@simpleadmin.com'; 
const password = 'SimpleAdmin123!';
const name = 'Simple Admin';

async function createAdmin() {
  console.log('🔧 Creating a simple admin user...\n');
  
  try {
    // Check if user already exists
    try {
      const existingUser = await users.get(userId);
      console.log(`⚠️ User '${userId}' already exists:`, existingUser);
      console.log('Credentials:');
      console.log('- Email:', email);
      console.log('- Password:', password);
      return;
    } catch (err) {
      // This is expected if the user doesn't exist yet
      console.log('User does not exist yet, creating...');
    }
    
    // Create the user with required parameters
    const user = await users.create(
      userId,
      email,
      password,
      name
    );
    
    console.log('✅ User created successfully:', user);
    
    // Set the email as verified to avoid verification emails
    await users.updateVerification(userId, true);
    console.log('✅ Email marked as verified');
    
    console.log('\n🔑 LOGIN CREDENTIALS 🔑');
    console.log('- Email:', email);
    console.log('- Password:', password);
    console.log('\n👉 Use these credentials to log in to the admin panel.');
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
}

// Run the function
createAdmin().catch(console.error); 