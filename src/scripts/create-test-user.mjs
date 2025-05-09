/**
 * CREATE TEST USER SCRIPT FOR SUPABASE
 * 
 * This script creates a test user for the Hypnotic Villas application using the Supabase API.
 */

import { createClient } from '@supabase/supabase-js';

// Configuration
const config = {
  supabaseUrl: 'https://tpkvjkirocwxkkolqmjt.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwa3Zqa2lyb2N3eGtrb2xxbWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3Mjk2MjYsImV4cCI6MjA2MjMwNTYyNn0.m2QNWce363TAVr2TWeaMGnRNFi6gVkQclhGf2t5ANfg',
  email: 'geri.test123@gmail.com',
  password: 'geri1122',
  displayName: 'Geri'
};

// Initialize Supabase client
const supabase = createClient(config.supabaseUrl, config.supabaseKey);

async function createTestUser() {
  try {
    console.log(`Creating test user with email: ${config.email}`);
    
    // Create the user
    const { data, error } = await supabase.auth.signUp({
      email: config.email,
      password: config.password,
      options: {
        data: {
          full_name: config.displayName,
          username: 'geri'
        }
      }
    });
    
    if (error) {
      if (error.message.includes('already exists')) {
        console.log(`\nUser with email ${config.email} already exists.`);
        console.log(`Attempting to sign in...`);
        
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: config.email,
          password: config.password
        });
        
        if (loginError) {
          throw loginError;
        }
        
        console.log(`\n✅ Login successful!\n`);
        console.log(`User ID: ${loginData.user.id}`);
        console.log(`Email: ${loginData.user.email}`);
        return;
      }
      
      throw error;
    }
    
    console.log(`\n✅ User created successfully!\n`);
    console.log(`User ID: ${data.user.id}`);
    console.log(`Email: ${data.user.email}`);
    console.log(`\nYou can now login with these credentials:`);
    console.log(`Email: ${config.email}`);
    console.log(`Password: ${config.password}`);
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
  }
}

// Run the function
createTestUser(); 