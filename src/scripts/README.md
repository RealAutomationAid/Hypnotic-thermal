# Supabase Admin User Creation

This directory contains scripts for creating and managing admin users in your Supabase instance for the Hypnotic Villas admin portal.

## Prerequisites

Before running any scripts in this directory, ensure you have:

1. Node.js installed (v14+)
2. Access to a Supabase project
3. A Supabase service role key with appropriate permissions

## Available Scripts

### Testing Credentials

- `test-supabase-login.js` - Test your Supabase login credentials

### Admin User Management

- `create-supabase-admin.js` - Create an admin user with the proper roles

## Getting Started

### Step 1: Install Dependencies

```bash
npm install @supabase/supabase-js
```

### Step 2: Get a Supabase Service Role Key

1. Log into your Supabase dashboard
2. Select your project
3. Go to Project Settings > API
4. Find and copy your service_role key (Warning: This key has admin privileges)

### Step 3: Create an Admin User

Run the admin user creation script:

```bash
node src/scripts/create-supabase-admin.js
```

Or with environment variables:

```bash
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key" node src/scripts/create-supabase-admin.js
```

Follow the prompts to enter admin user details.

## Troubleshooting

If you encounter issues:

1. **Permission Errors**: Ensure your service role key has the necessary permissions.
2. **Validation Errors**: Check that your admin details meet requirements (email format, password complexity).
3. **Connection Issues**: Verify your Supabase URL is correct.
4. **Supabase Connection Issues**: Ensure your Supabase instance is running and the URL is correct.

## Security Note

The service role key has unrestricted access to your database. Never commit it to your repository or share it publicly. Always use environment variables or secure methods to provide it to scripts. 