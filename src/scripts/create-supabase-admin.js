/**
 * ADMIN USER CREATION SCRIPT FOR SUPABASE
 * 
 * This script creates an admin user in Supabase using the Supabase API.
 * It requires admin API keys to set custom user claims.
 * 
 * PREREQUISITES:
 * 1. Ensure you have @supabase/supabase-js installed: npm install @supabase/supabase-js
 * 2. You need a Supabase service role key (not the anon key)
 */

const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

// Configuration
const config = {
  supabaseUrl: process.env.VITE_SUPABASE_URL || 'https://tpkvjkirocwxkkolqmjt.supabase.co',
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  adminEmail: 'admin@example.com',
  adminPassword: 'StrongPassword123!', // Should be changed immediately after creation
  adminName: 'Admin User'
};

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt function for user input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Main function
async function createAdminUser() {
  try {
    console.log('\n🔧 Supabase Admin User Creation\n');
    
    // Check for service role key
    if (!config.serviceRoleKey) {
      console.log('⚠️ No service role key found in environment variables (SUPABASE_SERVICE_ROLE_KEY)');
      config.serviceRoleKey = await prompt('Enter your Supabase service role key: ');
    }

    // Get admin details if not provided
    config.adminEmail = await prompt(`Enter admin email [${config.adminEmail}]: `) || config.adminEmail;
    config.adminPassword = await prompt(`Enter admin password [${config.adminPassword}]: `) || config.adminPassword;
    config.adminName = await prompt(`Enter admin name [${config.adminName}]: `) || config.adminName;

    // Initialize Supabase client with service role key for admin operations
    const supabase = createClient(config.supabaseUrl, config.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('\nCreating admin user...');

    // Check if user already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from('auth.users')
      .select('id, email')
      .eq('email', config.adminEmail)
      .maybeSingle();

    if (checkError) {
      console.log('Error checking for existing user:', checkError.message);
    }

    if (existingUsers) {
      console.log(`\n⚠️ User with email ${config.adminEmail} already exists.`);
      const continueAnyway = await prompt('Do you want to update this user as an admin? (y/n): ');
      
      if (continueAnyway.toLowerCase() !== 'y') {
        console.log('Operation cancelled by user.');
        return;
      }
      
      // Update existing user with admin role
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existingUsers.id,
        { 
          app_metadata: { admin: true },
          user_metadata: { full_name: config.adminName }
        }
      );
      
      if (updateError) {
        throw updateError;
      }
      
      console.log('\n✅ User successfully updated as admin!');
      console.log('Email:', config.adminEmail);
      console.log('ID:', existingUsers.id);
      return;
    }

    // Create a new user
    const { data, error } = await supabase.auth.admin.createUser({
      email: config.adminEmail,
      password: config.adminPassword,
      email_confirm: true,
      app_metadata: { admin: true },
      user_metadata: { full_name: config.adminName }
    });

    if (error) {
      throw error;
    }

    console.log('\n✅ Admin user created successfully!');
    console.log('Email:', data.user.email);
    console.log('User ID:', data.user.id);
    console.log('Admin Status: Enabled');
    console.log('\n⚠️ Important: Have the admin change their password after first login.');
    
  } catch (error) {
    console.error('\n❌ Error creating admin user:');
    console.error(error.message);
    
    console.log('\nTroubleshooting tips:');
    console.log('• Ensure your Supabase instance is running and accessible');
    console.log('• Verify you are using the service role key (not the anon key)');
    console.log('• Check for permission issues or role configurations in Supabase');
    console.log('• If using custom roles, ensure they are set up correctly');
  } finally {
    rl.close();
  }
}

// Execute the script
createAdminUser(); 