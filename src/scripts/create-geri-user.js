/**
 * CREATE GERI USER SCRIPT FOR SUPABASE
 * 
 * This script creates a specific user for the Hypnotic Villas application.
 */

import { createClient } from '@supabase/supabase-js';

// Configuration
const config = {
  supabaseUrl: process.env.VITE_SUPABASE_URL || 'https://tpkvjkirocwxkkolqmjt.supabase.co',
  supabaseKey: process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwa3Zqa2lyb2N3eGtrb2xxbWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3Mjk2MjYsImV4cCI6MjA2MjMwNTYyNn0.m2QNWce363TAVr2TWeaMGnRNFi6gVkQclhGf2t5ANfg',
  username: 'geri',
  email: 'geri@gmail.com',
  password: 'geri1122',
  displayName: 'Geri'
};

// Initialize Supabase client
const supabase = createClient(config.supabaseUrl, config.supabaseKey);

// Main function
async function createGeriUser() {
  try {
    console.log('\n🔧 Creating Geri User\n');
    
    console.log(`Creating user: ${config.username} (${config.email})`);
    
    // Try to create the user
    const { data, error } = await supabase.auth.signUp({
      email: config.email,
      password: config.password,
      options: {
        data: {
          full_name: config.displayName,
          username: config.username
        }
      }
    });
    
    if (error) {
      // If the error is that the user already exists, we'll try to sign in
      if (error.message.includes('already exists')) {
        console.log(`\n⚠️ User ${config.username} already exists.`);
        console.log(`Attempting to sign in...`);
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: config.email,
          password: config.password
        });
        
        if (signInError) {
          throw signInError;
        }
        
        console.log('\n✅ Successfully signed in with existing account!');
        console.log(`User ID: ${signInData.user.id}`);
        return;
      }
      
      throw error;
    }
    
    console.log('\n✅ User created successfully!');
    console.log(`Username: ${config.username}`);
    console.log(`Email: ${config.email}`);
    console.log(`User ID: ${data.user.id}`);
    console.log(`\nYou can now log in with:`);
    console.log(`Email: ${config.email}`);
    console.log(`Password: ${config.password}`);
    
  } catch (error) {
    console.error('\n❌ Error creating user:');
    console.error(error.message);
  }
}

// Execute the script
createGeriUser(); 