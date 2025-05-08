// User related types
export interface User {
  $id: string;
  email: string;
  name: string;
  role: string;
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Declare the Hypnotic css custom properties
declare module 'react' {
  interface CSSProperties {
    '--hypnotic-dark'?: string;
    '--hypnotic-darker'?: string;
    '--hypnotic-accent'?: string;
  }
} 