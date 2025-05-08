// Based on https://supabase.com/docs/reference/javascript/select
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { SupabaseConnectionStatus } from '../../components/ui/SupabaseConnectionStatus';

interface Todo {
  id: number;
  created_at: string;
  title: string;
  completed: boolean;
  user_id?: string;
}

// Define environment variables type
interface ImportMetaEnv {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
}

export default function TestSupabase() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Access environment variables with type safety
  const env = import.meta.env as ImportMetaEnv;
  
  // Load todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Fetch todos from Supabase
  // Mapping: Appwrite databases.listDocuments() → supabase.from('<table>').select('*')
  async function fetchTodos() {
    try {
      setLoading(true);
      setError(null);
      
      // Based on https://supabase.com/docs/reference/javascript/select
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setTodos(data || []);
    } catch (err: any) {
      console.error('Error fetching todos:', err);
      setError(err.message || 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  }
  
  // Create a new todo
  // Mapping: Appwrite databases.createDocument() → supabase.from('<table>').insert({...})
  async function addTodo() {
    if (!newTodoTitle.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Get the current user to associate with the todo
      const { data: { user } } = await supabase.auth.getUser();
      
      // Based on https://supabase.com/docs/reference/javascript/insert
      const { data, error } = await supabase
        .from('todos')
        .insert({
          title: newTodoTitle,
          completed: false,
          user_id: user?.id
        })
        .select();
      
      if (error) throw error;
      
      // Add the new todo to the list
      if (data) {
        setTodos([...data, ...todos]);
        setNewTodoTitle('');
      }
    } catch (err: any) {
      console.error('Error adding todo:', err);
      setError(err.message || 'Failed to add todo');
    } finally {
      setLoading(false);
    }
  }
  
  // Toggle todo completion status
  // Mapping: Appwrite databases.updateDocument() → supabase.from('<table>').update({...})
  async function toggleTodoStatus(id: number, currentStatus: boolean) {
    try {
      setError(null);
      
      // Based on https://supabase.com/docs/reference/javascript/update
      const { error } = await supabase
        .from('todos')
        .update({ completed: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update the local state
      setTodos(
        todos.map(todo => 
          todo.id === id ? { ...todo, completed: !currentStatus } : todo
        )
      );
    } catch (err: any) {
      console.error('Error updating todo:', err);
      setError(err.message || 'Failed to update todo');
    }
  }
  
  // Delete a todo
  // Mapping: Appwrite databases.deleteDocument() → supabase.from('<table>').delete()
  async function deleteTodo(id: number) {
    try {
      setError(null);
      
      // Based on https://supabase.com/docs/reference/javascript/delete
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update the local state
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err: any) {
      console.error('Error deleting todo:', err);
      setError(err.message || 'Failed to delete todo');
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Supabase Integration Test</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <SupabaseConnectionStatus />
          
          <div className="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Add New Todo</h2>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                placeholder="Enter a todo title..."
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addTodo}
                disabled={!newTodoTitle.trim() || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Add
              </button>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Todo List</h2>
          
          {loading && todos.length === 0 ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : todos.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No todos found. Add one to get started!</p>
          ) : (
            <ul className="divide-y">
              {todos.map(todo => (
                <li key={todo.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodoStatus(todo.id, todo.completed)}
                        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={`${todo.completed ? 'line-through text-gray-400' : ''}`}>
                        {todo.title}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          
          <button
            onClick={fetchTodos}
            className="mt-4 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Refresh
          </button>
        </div>
      </div>
      
      <div className="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Implementation Details</h2>
        
        <div className="space-y-3 text-sm">
          <h3 className="font-medium">Appwrite to Supabase Mappings:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><code>databases.listDocuments()</code> → <code>supabase.from('table').select('*')</code></li>
            <li><code>databases.createDocument()</code> → <code>supabase.from('table').insert(&#123;...&#125;)</code></li>
            <li><code>databases.updateDocument()</code> → <code>supabase.from('table').update(&#123;...&#125;).eq('id', id)</code></li>
            <li><code>databases.deleteDocument()</code> → <code>supabase.from('table').delete().eq('id', id)</code></li>
          </ul>
          
          <h3 className="font-medium mt-4">Environment Variables:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>VITE_SUPABASE_URL: {env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</li>
            <li>VITE_SUPABASE_ANON_KEY: {env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 