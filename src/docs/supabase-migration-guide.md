# Appwrite to Supabase Migration Guide

This guide provides instructions for migrating from Appwrite to Supabase. It outlines the conceptual differences, key mappings, and implementation details.

## Key Differences Between Appwrite and Supabase

| Appwrite | Supabase | Notes |
|----------|----------|-------|
| Document Database | PostgreSQL Database | Supabase uses a relational database rather than a document store |
| Collections | Tables | Define tables with explicit schemas in Supabase |
| Documents | Rows | Structured data with defined columns |
| Indexes | SQL Indexes | Create indexes with standard SQL syntax |
| Permissions | Row Level Security (RLS) | Define fine-grained access control at the row level |
| Client SDK | Supabase SDK | Similar API with method differences |
| Storage Buckets | Storage Buckets | Similar concepts, different API methods |

## Environment Setup

1. Create a `.env` file with your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SB_PROJECT_ID=your-project-id
```

2. Install the Supabase JavaScript SDK:

```bash
npm install @supabase/supabase-js
```

## Client Initialization

### Appwrite:

```typescript
import { Client, Account, Databases } from 'appwrite';

const client = new Client();
client
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);
```

### Supabase:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);
```

## Database Operations Mapping

### Fetching Data

#### Appwrite:
```typescript
const { documents } = await databases.listDocuments(
  DATABASE_ID,
  COLLECTION_ID,
  [Query.orderDesc('$createdAt')]
);
```

#### Supabase:
```typescript
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .order('created_at', { ascending: false });
```

### Creating Records

#### Appwrite:
```typescript
const document = await databases.createDocument(
  DATABASE_ID,
  COLLECTION_ID,
  ID.unique(),
  { name: 'John Doe', age: 30 }
);
```

#### Supabase:
```typescript
const { data, error } = await supabase
  .from('table_name')
  .insert({ name: 'John Doe', age: 30 })
  .select();
```

### Updating Records

#### Appwrite:
```typescript
await databases.updateDocument(
  DATABASE_ID,
  COLLECTION_ID,
  DOCUMENT_ID,
  { age: 31 }
);
```

#### Supabase:
```typescript
const { error } = await supabase
  .from('table_name')
  .update({ age: 31 })
  .eq('id', recordId);
```

### Deleting Records

#### Appwrite:
```typescript
await databases.deleteDocument(
  DATABASE_ID,
  COLLECTION_ID,
  DOCUMENT_ID
);
```

#### Supabase:
```typescript
const { error } = await supabase
  .from('table_name')
  .delete()
  .eq('id', recordId);
```

## Authentication Mapping

### User Registration

#### Appwrite:
```typescript
const newAccount = await account.create(
  ID.unique(),
  email,
  password,
  name
);
```

#### Supabase:
```typescript
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { 
      full_name: name 
    }
  }
});
```

### User Login

#### Appwrite:
```typescript
const session = await account.createEmailSession(email, password);
```

#### Supabase:
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
});
```

### User Logout

#### Appwrite:
```typescript
await account.deleteSession('current');
```

#### Supabase:
```typescript
const { error } = await supabase.auth.signOut();
```

### Get Current User

#### Appwrite:
```typescript
const user = await account.get();
```

#### Supabase:
```typescript
const { data: { user }, error } = await supabase.auth.getUser();
```

## Storage Operations Mapping

### Upload File

#### Appwrite:
```typescript
const file = await storage.createFile(
  BUCKET_ID,
  ID.unique(),
  document
);
```

#### Supabase:
```typescript
const { data, error } = await supabase.storage
  .from('bucket_name')
  .upload('file_path', file);
```

### Download File

#### Appwrite:
```typescript
const file = await storage.getFileDownload(
  BUCKET_ID,
  FILE_ID
);
```

#### Supabase:
```typescript
const { data, error } = await supabase.storage
  .from('bucket_name')
  .download('file_path');
```

### Delete File

#### Appwrite:
```typescript
await storage.deleteFile(
  BUCKET_ID,
  FILE_ID
);
```

#### Supabase:
```typescript
const { error } = await supabase.storage
  .from('bucket_name')
  .remove(['file_path']);
```

## Database Schema Setup

To set up your Supabase database, you can use the SQL script in `src/scripts/create-supabase-tables.sql`. This script:

1. Creates necessary tables to replace Appwrite collections
2. Sets up Row Level Security (RLS) policies for proper access control
3. Creates indexes for optimal performance
4. Sets up triggers for timestamps and profile creation

Run this script in the Supabase SQL Editor in your project dashboard.

## Row Level Security (RLS) vs. Appwrite Permissions

Supabase uses PostgreSQL's Row Level Security for access control:

1. Each table needs RLS enabled: `ALTER TABLE public.my_table ENABLE ROW LEVEL SECURITY;`
2. Create policies that define who can perform what actions:

```sql
CREATE POLICY "Users can view their own data" 
  ON public.my_table FOR SELECT
  USING (auth.uid() = user_id);
```

This replaces Appwrite's permission system with more granular database-level controls.

## Error Handling

Supabase error handling differs from Appwrite. Always check for the `error` property in responses:

```typescript
const { data, error } = await supabase.from('my_table').select('*');

if (error) {
  console.error('Error fetching data:', error);
  // Handle error appropriately
  return;
}

// Process data
console.log('Data:', data);
```

## Realtime Subscriptions

Appwrite and Supabase both support realtime functionality, but with different approaches:

### Supabase:
```typescript
const subscription = supabase
  .channel('table_changes')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'my_table' },
    (payload) => {
      console.log('New record:', payload.new);
    }
  )
  .subscribe();
```

Remember to unsubscribe when done:
```typescript
subscription.unsubscribe();
```

## Next Steps

1. Review each file where Appwrite is used and replace with equivalent Supabase code
2. Update environment variables in your deployment configuration
3. Test thoroughly to ensure all functionality works as expected
4. Consider using TypeScript generated types for better type safety with Supabase

For more detailed information, refer to the [Supabase JavaScript documentation](https://supabase.com/docs/reference/javascript). 