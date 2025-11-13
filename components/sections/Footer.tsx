'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Facebook, 
  Instagram, 
  Linkedin,
  Mail, 
  Phone, 
  MapPin,
  Heart,
  Shield,
  Truck,
  Clock,
  LucideIcon
} from 'lucide-react'
import Image from 'next/image'

const footerLinks = {
  empresa: [
    { name: 'Sobre Nós', href: '/sobre-nos' },
    { name: 'Como Funciona', href: '/como-funciona' },
    { name: 'Preços', href: '/precos' },
    { name: 'Contato', href: '/contato' }
  ],
  suporte: [
    { name: 'Central de Ajuda', href: '/central-ajuda' },
    { name: 'Política de Privacidade', href: '/politica-privacidade' },
    { name: 'Termos de Uso', href: '/termos-uso' },
    { name: 'FAQ', href: '/faq' }
  ]
}

const socialLinks: Array<
  { icon: LucideIcon; href: string; label: string; type?: 'icon' } |
  { custom: 'image'; href: string; label: string; src: string }
> = [
  { icon: Facebook, href: 'https://www.facebook.com/GPositivo', label: 'Facebook' },
  { icon: Instagram, href: 'https://www.instagram.com/grupopositivo/', label: 'Instagram' },
  { custom: 'image', href: 'https://x.com/CursoPositivo', label: 'X (Twitter)', src: '/x-logo.svg' },
  { icon: Linkedin, href: 'https://br.linkedin.com/company/grupo-positivo', label: 'LinkedIn' }
]

const features = [
  { icon: Shield, text: '100% Seguro' },
  { icon: Truck, text: 'Entrega Rápida' },
  { icon: Clock, text: 'Suporte 24/7' }
]

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-primary-600/10" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Seção principal do footer */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Logo e descrição */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-white mb-4 md:mb-6">
                PosiMarket
              </h4>
              <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-6 leading-relaxed">
                A plataforma mais completa para comprar e vender itens escolares de forma prática e sustentável.
              </p>
              
              {/* Features */}
              <div className="space-y-3 mb-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <Icon className="h-4 w-4 text-primary-400" />
                      <span className="text-sm text-gray-300">{feature.text}</span>
                    </div>
                  )
                })}
              </div>
              
              {/* Social links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-gray-700/50 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-colors duration-300"
                    aria-label={social.label}
                  >
                    {'custom' in social ? (
                      <Image
                        src={social.src}
                        alt={social.label}
                        width={20}
                        height={20}
                        className="w-5 h-5"
                      />
                    ) : (
                      <social.icon className="h-5 w-5 text-gray-300 hover:text-white" />
                    )}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Links da empresa */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-white mb-6">Empresa</h4>
              <ul className="space-y-3">
                {footerLinks.empresa.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-primary-400 transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Links de suporte */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-white mb-6">Suporte</h4>
              <ul className="space-y-3">
                {footerLinks.suporte.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-primary-400 transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

          </div>
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="py-12 border-t border-gray-700/30"
        >
          <Card className="glass-card-weak border-gray-700/30 bg-gray-800/50">
            <CardContent className="p-8">
              <div className="max-w-2xl mx-auto text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Fique por dentro das novidades
                </h3>
                <p className="text-gray-300 mb-6">
                  Receba ofertas exclusivas, descontos e dicas para economizar no material escolar
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Seu melhor email"
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <Button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl">
                    <Mail className="h-4 w-4 mr-2" />
                    Inscrever
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="py-8 border-t border-gray-700/30"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400">
              <span>© 2025 PosiMarket. Feito com</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>pelo time de Inovação do Positivo</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Curitiba, PR</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>(41) 3250-3700</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
