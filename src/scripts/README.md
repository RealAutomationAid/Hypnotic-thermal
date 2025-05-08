# Appwrite Admin User Creation

This directory contains scripts for creating and managing admin users in your Appwrite instance for the Hypnotic Villas admin portal.

## Prerequisites

Before running any scripts, make sure you have:

1. Node.js installed on your system
2. Access to an Appwrite instance at https://fra.cloud.appwrite.io/v1
3. An Appwrite API key with appropriate permissions:
   - `users.write` - Required to create and update users
   - `teams.write` - Required to create/manage admin teams (optional but recommended)

## Creating an Admin User

We provide a script that creates a verified admin user that can immediately log into the admin portal without any verification steps.

### Step 1: Install dependencies

From the project root directory, run:

```bash
npm install
```

### Step 2: Get an Appwrite API Key

1. Log into your Appwrite console at https://fra.cloud.appwrite.io/console
2. Navigate to "Project" > "API Keys"
3. Create a new API key with the following permissions:
   - `users.write`
   - `teams.write`
4. Copy the API key for use in the next step

### Step 3: Run the admin creation script

From the project root directory, run:

```bash
node src/scripts/create-verified-admin.js
```

The script can be run in two ways:

#### Option 1: Using environment variables

```bash
APPWRITE_API_KEY="your-api-key-here" node src/scripts/create-verified-admin.js
```

#### Option 2: Enter values when prompted

Simply run the script without environment variables, and you'll be prompted to enter required values:

```bash
node src/scripts/create-verified-admin.js
```

### Step 4: Test the login

Once the script completes successfully, you'll be provided with login credentials. Go to:

```
http://localhost:8081
```

And log in with the provided email and password.

## Troubleshooting

If you encounter any issues:

1. **Invalid Credentials Error**: This typically means the user was created but wasn't properly verified. Run the script again and make sure it completes the verification step.

2. **401 Unauthorized**: Check that your API key has the required permissions.

3. **User Already Exists**: The script will detect existing users with the same email and offer to replace them. If you're having login issues, choose to recreate the user.

4. **Appwrite Connection Issues**: Ensure your Appwrite instance is running and the endpoint URL is correct.

## Custom Configuration

By default, the script will generate a secure random password. You can customize all settings when prompted during script execution, or edit the configuration directly in the script. 