# Supabase Troubleshooting Guide

This document provides solutions to common issues you might encounter after migrating from Appwrite to Supabase.

## Common Issues and Solutions

### 1. Missing Dependencies

**Problem**: Import errors for Supabase packages.
```
Failed to resolve import "@supabase/supabase-js" from "src/lib/supabase.ts"
```

**Solution**: Install the required dependencies.
```bash
npm install
```

If that doesn't work, try with force:
```bash
npm install @supabase/supabase-js --force
```

### 2. Vite Dependency Optimization Errors

**Problem**: Blank page with 504 error "Outdated Optimize Dep".

**Solution**: Run the development server with the force flag to rebuild dependencies.
```bash
npm run dev:force
```

### 3. Environment Variables Not Found

**Problem**: Application fails to connect to Supabase with errors about missing VITE_SUPABASE_URL.

**Solution**: Create or update the `.env` file in the project root:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SB_PROJECT_ID=your-project-id
```

### 4. TypeScript Errors

**Problem**: TypeScript errors for Supabase types.

**Solution**: Add the missing type declarations:
```bash
npm install --save-dev @supabase/supabase-js
```

### 5. Authentication Issues

**Problem**: Unable to login or register users.

**Solution**:
- Verify your Supabase credentials in the `.env` file
- Check if Email auth is enabled in Supabase dashboard (Authentication → Providers)
- Ensure your SQL tables and policies are set up correctly
- Check browser console for specific error messages

### 6. Database Permissions Errors

**Problem**: Actions like inserting or updating data fail with permission errors.

**Solution**:
1. Check your Row Level Security (RLS) policies in Supabase
2. Run the SQL setup script in `src/scripts/create-supabase-tables.sql`
3. Verify that users are authenticated before attempting data operations

### 7. React Router Protected Route Errors

**Problem**: Errors with the ProtectedRoute component.

**Solution**:
1. Make sure you're importing the named export from ProtectedRoute:
```typescript
// Correct
import { ProtectedRoute } from "./components/ProtectedRoute";

// Incorrect
import ProtectedRoute from "./components/ProtectedRoute";
```

2. Update usage to include children:
```jsx
<ProtectedRoute>
  <YourProtectedComponent />
</ProtectedRoute>
```

## Performance Optimization

### 1. Minimize Supabase API Calls

Use caching and local state to reduce the number of API calls. For example:

```typescript
const [cachedData, setCachedData] = useState(null);

useEffect(() => {
  if (!cachedData) {
    fetchDataFromSupabase().then(data => setCachedData(data));
  }
}, [cachedData]);
```

### 2. Enable RLS for Security and Performance

Row Level Security not only improves security but can also improve performance by filtering data at the database level rather than in your application code.

## Debugging Tips

1. Use the Supabase dashboard to monitor logs and API usage
2. Enable browser developer tools to check network requests and console errors
3. Add detailed logging in your application to track Supabase operations:

```typescript
const { data, error } = await supabase.from('table_name').select('*');
if (error) {
  console.error('Detailed error info:', {
    message: error.message,
    details: error.details,
    hint: error.hint,
    status: error.status
  });
}
```

## Getting Help

If you're still experiencing issues, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase GitHub Issues](https://github.com/supabase/supabase/issues)
- [Supabase Discord Community](https://discord.supabase.com) 