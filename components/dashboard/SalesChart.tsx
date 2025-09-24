'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { TrendingUp, BarChart3 } from 'lucide-react'

// Mock data para o gráfico
const mockSalesData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  datasets: [
    {
      label: 'Vendas (R$)',
      data: [1200, 1900, 3000, 5000, 2000, 3000, 4500, 3200, 4800, 5200, 3800, 4200],
      borderColor: 'rgb(255, 115, 22)',
      backgroundColor: 'rgba(255, 115, 22, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: 'rgb(255, 115, 22)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8
    }
  ]
}

export function SalesChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const initChart = async () => {
      // Simular carregamento do Chart.js
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (chartRef.current) {
        const ctx = chartRef.current.getContext('2d')
        if (ctx) {
          // Simular desenho do gráfico (em produção usaria Chart.js)
          drawMockChart(ctx)
        }
      }
    }

    initChart()
  }, [])

  const drawMockChart = (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas
    const width = canvas.width
    const height = canvas.height
    
    // Limpar canvas
    ctx.clearRect(0, 0, width, height)
    
    // Configurar estilo
    ctx.strokeStyle = 'rgb(255, 115, 22)'
    ctx.fillStyle = 'rgba(255, 115, 22, 0.1)'
    ctx.lineWidth = 3
    
    // Dados do gráfico
    const data = mockSalesData.datasets[0].data
    const maxValue = Math.max(...data)
    const minValue = Math.min(...data)
    const range = maxValue - minValue
    
    // Margens
    const margin = 40
    const chartWidth = width - 2 * margin
    const chartHeight = height - 2 * margin
    
    // Desenhar área
    ctx.beginPath()
    data.forEach((value, index) => {
      const x = margin + (index / (data.length - 1)) * chartWidth
      const y = margin + chartHeight - ((value - minValue) / range) * chartHeight
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    
    // Fechar área para preenchimento
    ctx.lineTo(margin + chartWidth, margin + chartHeight)
    ctx.lineTo(margin, margin + chartHeight)
    ctx.closePath()
    ctx.fill()
    
    // Desenhar linha
    ctx.beginPath()
    data.forEach((value, index) => {
      const x = margin + (index / (data.length - 1)) * chartWidth
      const y = margin + chartHeight - ((value - minValue) / range) * chartHeight
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()
    
    // Desenhar pontos
    ctx.fillStyle = 'rgb(255, 115, 22)'
    data.forEach((value, index) => {
      const x = margin + (index / (data.length - 1)) * chartWidth
      const y = margin + chartHeight - ((value - minValue) / range) * chartHeight
      
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
      
      // Círculo branco interno
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(x, y, 2, 0, 2 * Math.PI)
      ctx.fill()
      ctx.fillStyle = 'rgb(255, 115, 22)'
    })
    
    // Desenhar labels no eixo Y
    ctx.fillStyle = '#6B7280'
    ctx.font = '12px Inter, sans-serif'
    ctx.textAlign = 'right'
    
    for (let i = 0; i <= 5; i++) {
      const value = minValue + (range * i) / 5
      const y = margin + chartHeight - (i / 5) * chartHeight
      ctx.fillText(`R$ ${Math.round(value).toLocaleString()}`, margin - 10, y + 4)
    }
    
    // Desenhar labels no eixo X
    ctx.textAlign = 'center'
    mockSalesData.labels.forEach((label, index) => {
      const x = margin + (index / (data.length - 1)) * chartWidth
      ctx.fillText(label, x, height - 10)
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="glass-card-strong">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-6 w-6 text-primary-600" />
              <h3 className="text-xl font-bold text-gray-900">Vendas dos Últimos 12 Meses</h3>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">+12.5% este mês</span>
            </div>
          </div>
          
          <div className="relative">
            <canvas
              ref={chartRef}
              width={800}
              height={300}
              className="w-full h-full"
              style={{ maxWidth: '100%', height: '300px' }}
            />
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                <span>Vendas Totais</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                Total: R$ {mockSalesData.datasets[0].data.reduce((a, b) => a + b, 0).toLocaleString()}
              </p>
              <p className="text-xs">Média mensal: R$ {Math.round(mockSalesData.datasets[0].data.reduce((a, b) => a + b, 0) / 12).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
