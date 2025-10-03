'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

export default function DebugNotificacoesPage() {
  const [userData, setUserData] = useState<any>(null)
  const [allKeys, setAllKeys] = useState<string[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [correctKey, setCorrectKey] = useState<string>('')

  const loadData = () => {
    // Carregar dados do usuário
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      setUserData(user)
      // Nova chave baseada em email
      const emailKey = user.email.replace('@', '_').replace('.', '_')
      const newKey = `notifications_${emailKey}`
      setCorrectKey(newKey)

      // Carregar notificações da nova chave
      const notifStr = localStorage.getItem(newKey)
      if (notifStr) {
        setNotifications(JSON.parse(notifStr))
      } else {
        // Tentar chave antiga
        const oldKey = `notifications_${user.id}`
        const oldNotifStr = localStorage.getItem(oldKey)
        if (oldNotifStr) {
          setNotifications(JSON.parse(oldNotifStr))
          console.log('⚠️ Usando notificações da chave antiga')
        }
      }
    }

    // Listar todas as chaves de notificação
    const keys = Object.keys(localStorage).filter(k => k.includes('notification'))
    setAllKeys(keys)
  }

  useEffect(() => {
    loadData()
  }, [])

  const clearAll = () => {
    if (confirm('Limpar TODAS as notificações do localStorage?')) {
      Object.keys(localStorage)
        .filter(k => k.includes('notification'))
        .forEach(k => localStorage.removeItem(k))
      alert('✅ Todas as notificações removidas!')
      loadData()
    }
  }

  const clearCorrectKey = () => {
    if (confirm(`Limpar apenas a chave correta (${correctKey})?`)) {
      localStorage.removeItem(correctKey)
      alert('✅ Chave removida!')
      window.location.reload()
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🐛 Debug de Notificações</h1>

        {/* Informações do Usuário */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">👤 Usuário Atual</h2>
            {userData ? (
              <div className="space-y-2">
                <p><strong>Nome:</strong> {userData.nome}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>ID:</strong> {userData.id}</p>
                <p><strong>Tipo:</strong> {userData.tipoUsuario}</p>
              </div>
            ) : (
              <p className="text-red-600">❌ Usuário não está logado</p>
            )}
          </CardContent>
        </Card>

        {/* Chaves do localStorage */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">🔑 Chaves no localStorage</h2>
            <div className="space-y-2">
              <p><strong>Chave correta:</strong> <code className="bg-green-100 px-2 py-1 rounded">{correctKey}</code></p>
              <p><strong>Chaves encontradas ({allKeys.length}):</strong></p>
              <ul className="list-disc list-inside ml-4">
                {allKeys.map(key => (
                  <li key={key} className={key === correctKey ? 'text-green-600 font-bold' : 'text-gray-600'}>
                    {key}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">📬 Notificações Carregadas</h2>
            <div className="mb-4">
              <p><strong>Total:</strong> {notifications.length}</p>
              <p><strong>Não lidas:</strong> <span className="text-red-600 font-bold">{unreadCount}</span></p>
              <p><strong>Lidas:</strong> <span className="text-green-600">{notifications.length - unreadCount}</span></p>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {notifications.map((notif, index) => (
                <div 
                  key={notif.id} 
                  className={`p-3 rounded border ${notif.read ? 'bg-gray-50 border-gray-200' : 'bg-yellow-50 border-yellow-300'}`}
                >
                  <p className="font-semibold">{index + 1}. {notif.title}</p>
                  <p className="text-sm text-gray-600">{notif.message}</p>
                  <p className="text-xs mt-1">
                    <strong>ID:</strong> {notif.id} | 
                    <strong> Status:</strong> {notif.read ? '✅ Lida' : '🔴 Não lida'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">🛠️ Ações</h2>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={loadData}
                className="bg-blue-500 hover:bg-blue-600"
              >
                🔄 Recarregar Dados
              </Button>
              
              <Button 
                onClick={clearCorrectKey}
                className="bg-orange-500 hover:bg-orange-600"
              >
                🧹 Limpar Chave Correta
              </Button>
              
              <Button 
                onClick={clearAll}
                className="bg-red-500 hover:bg-red-600"
              >
                🗑️ Limpar Tudo
              </Button>
              
              <Button 
                onClick={() => window.location.href = '/dashboard/vendedor'}
                className="bg-gray-500 hover:bg-gray-600"
              >
                ← Voltar ao Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card className="mt-6 bg-blue-50">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">📝 Como Corrigir</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Clique em "🧹 Limpar Chave Correta" para resetar suas notificações</li>
              <li>A página vai recarregar</li>
              <li>Volte ao dashboard</li>
              <li>Marque notificações como lidas</li>
              <li>Faça refresh (F5)</li>
              <li>✅ Devem permanecer lidas!</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

