import { useSupabaseConnection, ConnectionStatus } from '../../hooks/useSupabaseConnection'
import { supabaseConfig } from '../../lib/supabase'

export function SupabaseConnectionStatus() {
  const { status, error } = useSupabaseConnection()

  const getStatusLabel = (status: ConnectionStatus) => {
    switch (status) {
      case ConnectionStatus.CONNECTED:
        return '✅ Connected'
      case ConnectionStatus.DISCONNECTED:
        return '❌ Disconnected'
      case ConnectionStatus.CHECKING:
        return '⏳ Checking...'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 md:p-6">
      <h2 className="text-lg font-semibold mb-4">Supabase Connection Status</h2>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Status:</span>
          <span className="font-medium">{getStatusLabel(status)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Project URL:</span>
          <span className="font-medium">{supabaseConfig.url}</span>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Connection Error</h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  )
} 