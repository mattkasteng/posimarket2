'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { X, Shield, Settings, Info } from 'lucide-react'
import { getConsentPreferences, saveConsentPreferences, isConsentRequired } from '@/lib/lgpd-compliance'

export function LGPDConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    cookies: false
  })

  useEffect(() => {
    const consentRequired = isConsentRequired()
    if (consentRequired) {
      const savedPreferences = getConsentPreferences()
      setPreferences(savedPreferences)
      setShowBanner(true)
    }
  }, [])

  const handleAcceptAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      cookies: true
    }
    setPreferences(newPreferences)
    saveConsentPreferences(newPreferences)
    setShowBanner(false)
  }

  const handleRejectAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      cookies: false
    }
    setPreferences(newPreferences)
    saveConsentPreferences(newPreferences)
    setShowBanner(false)
  }

  const handleSaveSettings = () => {
    saveConsentPreferences(preferences)
    setShowBanner(false)
    setShowSettings(false)
  }

  if (!showBanner) return null

  return (
    <AnimatePresence>
      {showBanner && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setShowBanner(false)}
          />

          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4"
          >
            <div className="container mx-auto max-w-2xl">
              <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-200">
                {!showSettings ? (
                  // Banner de Consentimento
                  <>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Shield className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          Configurações de Privacidade
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Respeitamos sua privacidade. Este site usa cookies para melhorar sua experiência 
                          e fornecer funcionalidades personalizadas. Conforme a LGPD, você pode escolher 
                          quais tipos de cookies aceitar.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowBanner(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={handleAcceptAll}
                        className="flex-1 glass-button-primary"
                      >
                        Aceitar Todos
                      </Button>
                      <Button
                        onClick={handleRejectAll}
                        variant="outline"
                        className="flex-1 glass-button"
                      >
                        Rejeitar Todos
                      </Button>
                      <Button
                        onClick={() => setShowSettings(true)}
                        variant="outline"
                        className="flex-1 glass-button"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Personalizar
                      </Button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => window.location.href = '/politica-privacidade'}
                        className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1"
                      >
                        <Info className="h-3 w-3" />
                        Ler Política de Privacidade
                      </button>
                    </div>
                  </>
                ) : (
                  // Painel de Configurações
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <button
                        onClick={() => setShowSettings(false)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <X className="h-5 w-5" />
                      </button>
                      <h3 className="text-lg font-bold text-gray-900">
                        Configurar Cookies
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {/* Cookies Necessários */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">Cookies Necessários</h4>
                            <p className="text-sm text-gray-600">
                              Essenciais para o funcionamento do site
                            </p>
                          </div>
                          <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-600">
                            Sempre ativo
                          </div>
                        </div>
                      </div>

                      {/* Cookies de Análise */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">Cookies de Análise</h4>
                            <p className="text-sm text-gray-600">
                              Ajudam a entender como você usa o site
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences.analytics}
                              onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      </div>

                      {/* Cookies de Marketing */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">Cookies de Marketing</h4>
                            <p className="text-sm text-gray-600">
                              Usados para personalizar anúncios e campanhas
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences.marketing}
                              onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <Button
                        onClick={handleSaveSettings}
                        className="flex-1 glass-button-primary"
                      >
                        Salvar Preferências
                      </Button>
                      <Button
                        onClick={() => setShowSettings(false)}
                        variant="outline"
                        className="flex-1 glass-button"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

