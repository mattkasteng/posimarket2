'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { LucideIcon } from 'lucide-react'

interface MetricsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'primary' | 'green' | 'blue' | 'purple' | 'orange'
}

export function MetricsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color = 'primary' 
}: MetricsCardProps) {
  const colorClasses = {
    primary: {
      bg: 'bg-primary-500',
      text: 'text-primary-600',
      bgLight: 'bg-primary-50/20'
    },
    green: {
      bg: 'bg-green-500',
      text: 'text-green-600',
      bgLight: 'bg-green-50/20'
    },
    blue: {
      bg: 'bg-blue-500',
      text: 'text-blue-600',
      bgLight: 'bg-blue-50/20'
    },
    purple: {
      bg: 'bg-purple-500',
      text: 'text-purple-600',
      bgLight: 'bg-purple-50/20'
    },
    orange: {
      bg: 'bg-orange-500',
      text: 'text-orange-600',
      bgLight: 'bg-orange-50/20'
    }
  }

  const colors = colorClasses[color]

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="glass-card-strong hover:glass-card-strong transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                {title}
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {value}
              </p>
              {subtitle && (
                <p className="text-sm text-gray-500">
                  {subtitle}
                </p>
              )}
              {trend && (
                <div className="flex items-center space-x-1 mt-2">
                  <span className={`text-xs font-medium ${
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trend.isPositive ? '+' : ''}{trend.value}%
                  </span>
                  <span className="text-xs text-gray-500">
                    vs. mês anterior
                  </span>
                </div>
              )}
            </div>
            
            <div className={`w-16 h-16 ${colors.bgLight} rounded-xl flex items-center justify-center`}>
              <Icon className={`h-8 w-8 ${colors.text}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
