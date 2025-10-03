'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { ShoppingCart, Recycle, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function HeroSection() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Verificar se o usuário está logado
    const checkLoginStatus = () => {
      const user = localStorage.getItem('user')
      const loggedIn = localStorage.getItem('isLoggedIn')
      setIsLoggedIn(!!user && loggedIn === 'true')
    }

    checkLoginStatus()
  }, [])

  const handleQueroVender = () => {
    if (isLoggedIn) {
      // Se estiver logado, redirecionar para dashboard de vendedor
      router.push('/dashboard/vendedor')
    } else {
      // Se não estiver logado, redirecionar para cadastro
      router.push('/cadastro')
    }
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background com gradiente e imagem desfocada */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&h=1080&fit=crop')",
            filter: 'blur(3px)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/90 via-primary-600/90 to-primary-700/90" />
        {/* Overlay para melhorar contraste */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="glass-card-strong p-12 max-w-4xl text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 20px 40px rgba(249, 115, 22, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.3)'
            }}
          >
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6 drop-shadow-lg"
                >
                  PosiMarket
                </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl lg:text-2xl text-orange-100 leading-relaxed mb-8 max-w-3xl mx-auto drop-shadow-md"
            >
              Compre e venda uniformes, materiais e livros escolares de forma prática e sustentável
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Link href="/produtos">
                <Button 
                  size="lg" 
                  className="bg-orange-500 text-white hover:bg-orange-600 hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-bold shadow-xl border-2 border-orange-500 hover:border-orange-600"
                  style={{
                    boxShadow: '0 8px 24px rgba(249, 115, 22, 0.4)',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Comprar Agora
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleQueroVender}
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold shadow-xl"
                style={{
                  boxShadow: '0 8px 24px rgba(255, 255, 255, 0.2)'
                }}
              >
                <Recycle className="h-5 w-5 mr-2" />
                Quero Vender
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Elementos decorativos flutuantes */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm"
      />
      <motion.div
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-20 right-10 w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm"
      />
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          x: [0, 10, 0]
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute top-1/2 right-20 w-12 h-12 bg-white/10 rounded-full backdrop-blur-sm"
      />
    </section>
  )
}
