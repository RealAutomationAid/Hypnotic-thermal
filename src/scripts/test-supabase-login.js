const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

// Get Supabase URL and anon key from environment variables or use defaults
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://tpkvjkirocwxkkolqmjt.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwa3Zqa2lyb2N3eGtrb2xxbWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3Mjk2MjYsImV4cCI6MjA2MjMwNTYyNn0.m2QNWce363TAVr2TWeaMGnRNFi6gVkQclhGf2t5ANfg';

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Display test information
console.log('\n🔑 TESTING SUPABASE CREDENTIALS 🔑\n');
console.log('URL:', supabaseUrl);
console.log('Anon Key:', supabaseAnonKey.substring(0, 10) + '...');
console.log('Supabase JS SDK version:', require('@supabase/supabase-js/package.json').version);

// Function to prompt for user input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Main function to test login
async function testLogin() {
  try {
    // Get email and password from user
    const email = await prompt('Enter your email: ');
    const password = await prompt('Enter your password: ');

    console.log('\nAttempting to log in...');

    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    console.log('\n✅ LOGIN SUCCESSFUL!\n');
    console.log('User ID:', data.user.id);
    console.log('Email:', data.user.email);
    console.log('Session expires at:', new Date(data.session.expires_at * 1000).toLocaleString());
    
    // Check if the user has admin metadata
    const isAdmin = data.user.app_metadata?.admin === true;
    console.log('Admin status:', isAdmin ? '✅ User is an admin' : '❌ User is NOT an admin');

    return data;
  } catch (error) {
    console.error('\n❌ LOGIN FAILED\n');
    console.error('Error message:', error.message);
    console.error('Error details:', error);
    
    if (error.status === 400) {
      console.log('\nPossible causes:');
      console.log('• Invalid credentials - check your email and password');
      console.log('• Account does not exist - verify your email address');
    } else if (error.status === 429) {
      console.log('\nToo many login attempts. Please try again later.');
    }
    
    console.log('\nTroubleshooting tips:');
    console.log('1. Verify that your Supabase URL and anon key are correct');
    console.log('2. Check that your account exists and is active');
    console.log('3. You may need to create a user through the Supabase dashboard or run an admin creation script.');
    console.log('4. If you\'re using social login, try through the web application instead');
    
    return null;
  } finally {
    rl.close();
  }
}

// Run the test
testLogin(); 