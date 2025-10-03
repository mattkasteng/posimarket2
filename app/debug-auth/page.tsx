'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

export default function DebugAuthPage() {
  const { data: session, status } = useSession()
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  useEffect(() => {
    addLog(`Status: ${status}`)
    if (session) {
      addLog(`Session: ${JSON.stringify(session, null, 2)}`)
    }
  }, [session, status])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔍 Debug de Autenticação</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Status do NextAuth</h2>
          <div className="space-y-2">
            <p><strong>Status:</strong> <span className={status === 'authenticated' ? 'text-green-600' : 'text-red-600'}>{status}</span></p>
            <p><strong>Session:</strong></p>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {session ? JSON.stringify(session, null, 2) : 'Nenhuma sessão ativa'}
            </pre>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Logs de Debug</h2>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-auto">
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Teste de Login</h2>
          <p className="text-gray-600 mb-4">
            Use esta página para testar o login. Os logs aparecerão acima.
          </p>
          <p className="text-sm text-gray-500">
            Email: matteuskasteng@hotmail.com<br/>
            Senha: 123456
          </p>
        </div>
      </div>
    </div>
  )
}
