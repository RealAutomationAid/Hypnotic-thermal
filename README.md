# Hypnotic Villa Serenity UI with Supabase

## Project info

This project is a React-based front-end for the Hypnotic Villa Serenity application, using Supabase for authentication and data storage.

## Environment Setup

Before running the project, you need to set up your environment variables:

1. Create a `.env` file in the root directory with the following:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SB_PROJECT_ID=your-project-id
```

2. Replace the values with your actual Supabase project credentials.

## Supabase Database Setup

This project uses Supabase as its backend service. To set up the required database tables and policies:

1. Log in to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the script found in `src/scripts/create-supabase-tables.sql`

## Getting Started

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd hypnotic-villa-serenity-ui

# Step 3: Install the necessary dependencies
npm install

# Step 4: Start the development server with auto-reloading and an instant preview
npm run dev
```

## Key Features

- Authentication with Supabase Auth
- Role-based access control
- Todo example with full CRUD operations
- Protected routes for admin access

## Testing the Supabase Integration

Visit the test page at `/dev/test-supabase` to see a working example of Supabase integration with:

- Connection status display
- Todo management with Supabase
- Implementation details and code examples

## Technologies

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Auth, Database, Storage)

## Appwrite to Supabase Migration

This project has been migrated from Appwrite to Supabase. For detailed information about the migration:

1. Check `src/docs/supabase-migration-guide.md` for a comprehensive guide
2. Review the SQL setup script in `src/scripts/create-supabase-tables.sql`

## Project Structure

- `src/lib/supabase.ts` - Supabase client and core authentication functions
- `src/lib/SupabaseService.ts` - OOP-style Supabase service
- `src/lib/AuthContext.tsx` - React auth context using Supabase
- `src/components/ProtectedRoute.tsx` - Authentication guard component
- `src/pages/dev/test-supabase.tsx` - Test page for Supabase functionality

## Deployment

Follow standard Vite deployment procedures or use a platform like Vercel, Netlify, or Railway.
