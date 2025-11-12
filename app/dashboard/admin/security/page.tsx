'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface SecurityStatusResponse {
  success: boolean
  error?: string
  mfa?: {
    enabled: boolean
    enabledAt?: string | null
    backupCodesRemaining: number
    pendingSetup: boolean
  }
  apiKeys?: Array<{
    id: string
    nome: string
    descricao?: string | null
    createdAt: string
    updatedAt: string
    expiresAt?: string | null
    lastUsedAt?: string | null
    revokedAt?: string | null
  }>
}

interface SetupResponse {
  success: boolean
  secret?: string
  otpauthUrl?: string
  backupCodes?: string[]
  error?: string
}

const STATUS_ENDPOINT = '/api/admin/security/status'

async function fetchStatus(): Promise<SecurityStatusResponse> {
  const res = await fetch(STATUS_ENDPOINT, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })

  return res.json()
}

export default function AdminSecurityPage() {
  const [status, setStatus] = useState<SecurityStatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [setupData, setSetupData] = useState<SetupResponse | null>(null)
  const [setupError, setSetupError] = useState<string | null>(null)
  const [verifyToken, setVerifyToken] = useState('')

  const [disableOtp, setDisableOtp] = useState('')
  const [disableBackup, setDisableBackup] = useState('')
  const [disableMessage, setDisableMessage] = useState<string | null>(null)

  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyDescription, setNewKeyDescription] = useState('')
  const [newKeyExpiry, setNewKeyExpiry] = useState('')
  const [keyMessage, setKeyMessage] = useState<string | null>(null)
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const [apiKeyLoading, setApiKeyLoading] = useState(false)

  const backupCodesRemaining = useMemo(
    () => status?.mfa?.backupCodesRemaining ?? 0,
    [status?.mfa?.backupCodesRemaining]
  )

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await fetchStatus()
        if (!data.success) {
          setError(data.error ?? 'Não foi possível carregar o status de segurança.')
        } else {
          setStatus(data)
          setError(null)
        }
      } catch (err) {
        console.error('❌ Security Page - Erro ao carregar status:', err)
        setError('Erro ao carregar status de segurança.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const handleStartSetup = async () => {
    try {
      setSetupError(null)
      setVerifyToken('')
      const res = await fetch('/api/admin/mfa/setup', { method: 'POST' })
      const data: SetupResponse = await res.json()

      if (!data.success) {
        setSetupError(data.error ?? 'Não foi possível iniciar a configuração de MFA.')
        return
      }

      setSetupData(data)
      setStatus((prev) =>
        prev
          ? {
              ...prev,
              mfa: {
                ...prev.mfa,
                pendingSetup: true,
                enabled: false,
                backupCodesRemaining: data.backupCodes?.length ?? 0
              }
            }
          : prev
      )
    } catch (err) {
      console.error('❌ Security Page - Erro setup MFA:', err)
      setSetupError('Erro inesperado ao iniciar configuração de MFA.')
    }
  }

  const handleConfirmSetup = async () => {
    if (!verifyToken || verifyToken.length < 6) {
      setSetupError('Informe o código de 6 dígitos do aplicativo autenticador.')
      return
    }

    try {
      setSetupError(null)
      const res = await fetch('/api/admin/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: verifyToken })
      })
      const data = await res.json()

      if (!data.success) {
        setSetupError(data.error ?? 'Não foi possível validar o código informado.')
        return
      }

      setSetupData(null)
      setVerifyToken('')
      setStatus((prev) =>
        prev
          ? {
              ...prev,
              mfa: {
                enabled: true,
                enabledAt: new Date().toISOString(),
                backupCodesRemaining: prev.mfa?.backupCodesRemaining ?? 0,
                pendingSetup: false
              }
            }
          : prev
      )
      setError(null)
    } catch (err) {
      console.error('❌ Security Page - Erro confirmar MFA:', err)
      setSetupError('Erro inesperado ao confirmar MFA.')
    }
  }

  const handleDisableMfa = async () => {
    if (!disableOtp && !disableBackup) {
      setDisableMessage('Forneça o código do autenticador ou um código de backup.')
      return
    }

    try {
      setDisableMessage(null)
      const res = await fetch('/api/admin/mfa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: disableOtp, backupCode: disableBackup })
      })
      const data = await res.json()

      if (!data.success) {
        setDisableMessage(data.error ?? 'Não foi possível desabilitar o MFA.')
        return
      }

      setDisableOtp('')
      setDisableBackup('')
      setStatus((prev) =>
        prev
          ? {
              ...prev,
              mfa: {
                enabled: false,
                enabledAt: null,
                backupCodesRemaining: 0,
                pendingSetup: false
              }
            }
          : prev
      )
      setSetupData(null)
    } catch (err) {
      console.error('❌ Security Page - Erro ao desabilitar MFA:', err)
      setDisableMessage('Erro inesperado ao desabilitar MFA.')
    }
  }

  const handleRegenerateBackupCodes = async () => {
    if (!verifyToken || verifyToken.length < 6) {
      setSetupError('Informe o código do autenticador para gerar novos códigos de backup.')
      return
    }

    try {
      const res = await fetch('/api/admin/mfa/backup-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: verifyToken })
      })
      const data = await res.json()

      if (!data.success) {
        setSetupError(data.error ?? 'Não foi possível gerar novos códigos.')
        return
      }

      setSetupData({ success: true, backupCodes: data.backupCodes })
      setStatus((prev) =>
        prev
          ? {
              ...prev,
              mfa: {
                enabled: true,
                enabledAt: prev.mfa?.enabledAt ?? new Date().toISOString(),
                backupCodesRemaining: data.backupCodes?.length ?? 0,
                pendingSetup: false
              }
            }
          : prev
      )
      setSetupError('Novos códigos de backup gerados. Salve-os em local seguro.')
    } catch (err) {
      console.error('❌ Security Page - Erro gerar backup codes:', err)
      setSetupError('Erro inesperado ao gerar códigos de backup.')
    }
  }

  const handleCreateApiKey = async () => {
    if (!newKeyName) {
      setKeyMessage('Informe um nome para a API key.')
      return
    }

    try {
      setApiKeyLoading(true)
      setKeyMessage(null)
      setGeneratedKey(null)

      const res = await fetch('/api/admin/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: newKeyName,
          descricao: newKeyDescription || undefined,
          expiresAt: newKeyExpiry ? new Date(newKeyExpiry).toISOString() : undefined
        })
      })

      const data = await res.json()
      if (!data.success) {
        setKeyMessage(data.error ?? 'Não foi possível criar a API key.')
        return
      }

      setGeneratedKey(data.plaintext)
      setKeyMessage('Copie o valor da API key agora. Ele não será mostrado novamente.')
      setStatus((prev) =>
        prev
          ? {
              ...prev,
              apiKeys: prev.apiKeys ? [data.apiKey, ...prev.apiKeys] : [data.apiKey]
            }
          : prev
      )
      setNewKeyName('')
      setNewKeyDescription('')
      setNewKeyExpiry('')
    } catch (err) {
      console.error('❌ Security Page - Erro criar API key:', err)
      setKeyMessage('Erro inesperado ao criar API key.')
    } finally {
      setApiKeyLoading(false)
    }
  }

  const handleRevokeKey = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/api-keys/${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (!data.success) {
        setKeyMessage(data.error ?? 'Não foi possível revogar a API key.')
        return
      }

      setStatus((prev) =>
        prev
          ? {
              ...prev,
              apiKeys: prev.apiKeys?.map((key) =>
                key.id === id
                  ? {
                      ...key,
                      revokedAt: new Date().toISOString()
                    }
                  : key
              ) ?? []
            }
          : prev
      )
    } catch (err) {
      console.error('❌ Security Page - Erro revogar API key:', err)
      setKeyMessage('Erro inesperado ao revogar API key.')
    }
  }

  const handleUpdateKey = async (id: string, nome: string, descricao?: string | null, expiresAt?: string | null) => {
    try {
      const res = await fetch(`/api/admin/api-keys/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, descricao, expiresAt })
      })
      const data = await res.json()
      if (!data.success) {
        setKeyMessage(data.error ?? 'Não foi possível atualizar a API key.')
        return
      }

      setStatus((prev) =>
        prev
          ? {
              ...prev,
              apiKeys: prev.apiKeys?.map((key) => (key.id === id ? data.apiKey : key)) ?? []
            }
          : prev
      )
    } catch (err) {
      console.error('❌ Security Page - Erro atualizar API key:', err)
      setKeyMessage('Erro inesperado ao atualizar API key.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white shadow rounded-md p-6">
            <p className="text-gray-600">Carregando configurações de segurança...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Segurança da Conta</h1>
          <p className="text-gray-600">
            Gerencie autenticação multifator (MFA) e chaves de API. Todas as ações são auditadas e não
            impactam as funcionalidades existentes do marketplace.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-4">
            {error}
          </div>
        )}

        <section className="bg-white shadow rounded-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Autenticação Multifator (MFA)</h2>
              <p className="text-gray-600">
                Proteja o acesso administrativo com um segundo fator de autenticação.
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${status?.mfa?.enabled ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {status?.mfa?.enabled ? 'Ativo' : 'Inativo'}
            </span>
          </div>

          {status?.mfa?.enabled && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h3 className="text-green-800 font-semibold">Status</h3>
                <p className="text-green-700 text-sm">MFA habilitado para esta conta administrativa.</p>
                <p className="text-green-700 text-sm mt-2">
                  Códigos de backup disponíveis: <strong>{backupCodesRemaining}</strong>
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4 space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="otp-regenerate">
                  Código do autenticador (para gerar novos backups)
                </label>
                <Input
                  id="otp-regenerate"
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  value={verifyToken}
                  onChange={(e) => setVerifyToken(e.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="secondary" onClick={handleRegenerateBackupCodes}>
                    Gerar novos códigos de backup
                  </Button>
                </div>
              </div>
            </div>
          )}

          {!status?.mfa?.enabled && !status?.mfa?.pendingSetup && (
            <Button type="button" onClick={handleStartSetup}>
              Iniciar configuração de MFA
            </Button>
          )}

          {(status?.mfa?.pendingSetup || setupData?.backupCodes) && (
            <div className="border border-blue-200 bg-blue-50 rounded-md p-4 space-y-4">
              <h3 className="text-blue-800 font-semibold">Configuração pendente</h3>
              <ol className="list-decimal list-inside text-blue-700 space-y-1 text-sm">
                <li>Escaneie o QR Code no aplicativo autenticador ou adicione manualmente o código secreto.</li>
                <li>Salve os códigos de backup em local seguro.</li>
                <li>Informe o código do aplicativo abaixo para concluir.</li>
              </ol>

              {setupData?.otpauthUrl && (
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(setupData.otpauthUrl)}`}
                    alt="QR Code MFA"
                    className="rounded-md border border-blue-200"
                  />
                  <div className="space-y-2 text-sm text-blue-700">
                    <p>
                      Código secreto: <code className="font-mono text-xs bg-white px-1 py-0.5 rounded border border-blue-200">{setupData.secret}</code>
                    </p>
                    {setupData.backupCodes && (
                      <div>
                        <p className="font-semibold">Códigos de backup (use uma única vez cada):</p>
                        <ul className="font-mono text-xs grid grid-cols-2 gap-2 bg-white border border-blue-200 rounded-md p-2">
                          {setupData.backupCodes.map((code) => (
                            <li key={code}>{code}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-blue-800" htmlFor="otp-confirm">
                  Código do autenticador (6 dígitos)
                </label>
                <Input
                  id="otp-confirm"
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  value={verifyToken}
                  onChange={(e) => setVerifyToken(e.target.value)}
                />
                <Button type="button" onClick={handleConfirmSetup}>
                  Concluir configuração
                </Button>
              </div>

              {setupError && (
                <div className="bg-white border border-red-200 text-red-700 rounded-md p-3 text-sm">
                  {setupError}
                </div>
              )}
            </div>
          )}

          {status?.mfa?.enabled && (
            <div className="border border-red-200 bg-red-50 rounded-md p-4 space-y-3">
              <h3 className="text-red-800 font-semibold">Desabilitar MFA</h3>
              <p className="text-sm text-red-700">
                Esta ação remove a proteção adicional. Requer o código atual do autenticador ou um código de backup válido.
              </p>
              <div className="grid md:grid-cols-2 gap-2">
                <Input
                  type="text"
                  placeholder="Código do autenticador"
                  value={disableOtp}
                  onChange={(e) => setDisableOtp(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Código de backup"
                  value={disableBackup}
                  onChange={(e) => setDisableBackup(e.target.value)}
                />
              </div>
              <Button type="button" variant="destructive" onClick={handleDisableMfa}>
                Desabilitar MFA
              </Button>
              {disableMessage && (
                <div className="text-sm text-red-700">{disableMessage}</div>
              )}
            </div>
          )}
        </section>

        <section className="bg-white shadow rounded-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Gestão de API Keys</h2>
              <p className="text-gray-600">
                Gere chaves de acesso para integrações externas. Mantenha-as seguras e revogue quando não forem mais necessárias.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 bg-gray-50 border border-gray-200 rounded-md p-4">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="api-key-name">
                Nome da API key
              </label>
              <Input
                id="api-key-name"
                type="text"
                placeholder="Ex: Integração ERP"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
              <label className="text-sm font-medium text-gray-700" htmlFor="api-key-description">
                Descrição
              </label>
              <textarea
                id="api-key-description"
                className="w-full border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                placeholder="Opcional: descreva o uso da chave"
                value={newKeyDescription}
                onChange={(e) => setNewKeyDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="api-key-expiry">
                Expira em (opcional)
              </label>
              <Input
                id="api-key-expiry"
                type="date"
                value={newKeyExpiry}
                onChange={(e) => setNewKeyExpiry(e.target.value)}
              />
              <Button type="button" onClick={handleCreateApiKey} disabled={apiKeyLoading}>
                {apiKeyLoading ? 'Gerando...' : 'Gerar nova API key'}
              </Button>
              {keyMessage && <p className="text-sm text-gray-600">{keyMessage}</p>}
              {generatedKey && (
                <div className="bg-white border border-green-200 text-green-700 rounded-md p-3 text-sm">
                  <p className="font-semibold">Copie sua API key:</p>
                  <code className="block font-mono text-xs break-all mt-1">{generatedKey}</code>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">API keys ativas</h3>
            {status?.apiKeys && status.apiKeys.length > 0 ? (
              <div className="space-y-3">
                {status.apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="border border-gray-200 rounded-md p-4 bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{key.nome}</p>
                      {key.descricao && (
                        <p className="text-sm text-gray-600">{key.descricao}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Criada em {new Date(key.createdAt).toLocaleString('pt-BR')}
                        {key.expiresAt ? ` • Expira em ${new Date(key.expiresAt).toLocaleDateString('pt-BR')}` : ''}
                        {key.revokedAt ? ` • Revogada em ${new Date(key.revokedAt).toLocaleString('pt-BR')}` : ''}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>
                          handleUpdateKey(
                            key.id,
                            prompt('Atualizar nome da API key', key.nome) ?? key.nome,
                            prompt('Atualizar descrição da API key', key.descricao ?? '') ?? key.descricao ?? undefined,
                            key.expiresAt ? new Date(key.expiresAt).toISOString() : null
                          )
                        }
                      >
                        Editar
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        disabled={Boolean(key.revokedAt)}
                        onClick={() => handleRevokeKey(key.id)}
                      >
                        {key.revokedAt ? 'Revogada' : 'Revogar'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">Nenhuma API key cadastrada ainda.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
