const sdk = require('node-appwrite');
const { ID } = sdk;

// Init SDK
const client = new sdk.Client();

const endpoint = process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const projectId = process.env.VITE_APPWRITE_PROJECT_ID || '681bae9700045d80a790';
const apiKey = process.env.APPWRITE_API_KEY || '';

client
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

const users = new sdk.Users(client);

async function createAdminUser() {
    try {
        // Create the admin user
        const user = await users.create(
            'admin1', // userId
            'admin@hypnoticvillas.com', // email
            '+12065550100', // phone (optional)
            'Admin123!', // password
            'Admin User' // name
        );
        
        console.log('User created successfully:', user);
        
        // Verify the user's email
        await users.updateEmailVerification(user.$id, true);
        console.log('Email verified for user:', user.$id);
        
        // Create a session for the user (optional)
        const session = await users.createSession(user.$id);
        console.log('Session created for user:', session);
        
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
}

createAdminUser(); 