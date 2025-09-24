'use client'

import { lazy, Suspense, ComponentType } from 'react'
import { motion } from 'framer-motion'

// Loading component para suspense
function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center justify-center ${className}`}
    >
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" />
        <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
        <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
      </div>
    </motion.div>
  )
}

// Loading component para páginas
export function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner className="mb-4" />
        <p className="text-gray-600">Carregando...</p>
      </div>
    </div>
  )
}

// Loading component para componentes menores
export function ComponentLoading({ height = 'h-32' }: { height?: string }) {
  return (
    <div className={`w-full ${height} flex items-center justify-center`}>
      <LoadingSpinner />
    </div>
  )
}

// Loading component para cards
export function CardLoading() {
  return (
    <div className="glass-card-weak p-6">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
          <div className="h-3 bg-gray-300 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  )
}

// Loading component para listas
export function ListLoading({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <CardLoading key={index} />
      ))}
    </div>
  )
}

// Higher-order component para lazy loading com suspense
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function LazyLoadedComponent(props: P) {
    return (
      <Suspense fallback={fallback || <ComponentLoading />}>
        <Component {...props} />
      </Suspense>
    )
  }
}

// Lazy components para páginas pesadas
export const LazyAdminDashboard = lazy(() => 
  import('@/app/(dashboard)/admin/page').then(module => ({ default: module.default }))
)

export const LazySellerDashboard = lazy(() => 
  import('@/app/(dashboard)/vendedor/page').then(module => ({ default: module.default }))
)

export const LazyProductsPage = lazy(() => 
  import('@/app/(marketplace)/produtos/page').then(module => ({ default: module.default }))
)

export const LazyCheckoutPage = lazy(() => 
  import('@/app/(marketplace)/checkout/page').then(module => ({ default: module.default }))
)

export const LazyReportsPage = lazy(() => 
  import('@/app/(dashboard)/admin/relatorios/page').then(module => ({ default: module.default }))
)

// Lazy components para componentes pesados
export const LazyAdvancedChat = lazy(() => 
  import('@/components/chat/AdvancedChat').then(module => ({ default: module.AdvancedChat }))
)

export const LazyCustomerSupportWidget = lazy(() => 
  import('@/components/chat/CustomerSupportWidget').then(module => ({ default: module.CustomerSupportWidget }))
)

export const LazyNotificationCenter = lazy(() => 
  import('@/components/notifications/NotificationCenter').then(module => ({ default: module.NotificationCenter }))
)

export const LazyEmailTemplates = lazy(() => 
  import('@/components/email/EmailTemplates').then(module => ({ default: module.EmailTemplateManager }))
)

// Lazy components para gráficos e visualizações
export const LazySalesChart = lazy(() => 
  import('@/components/dashboard/SalesChart').then(module => ({ default: module.SalesChart }))
)

export const LazyMetricsCard = lazy(() => 
  import('@/components/dashboard/MetricsCard').then(module => ({ default: module.MetricsCard }))
)

// Wrapper para lazy components com loading padrão
export const LazyAdminDashboardWithLoading = withLazyLoading(LazyAdminDashboard, <PageLoading />)
export const LazySellerDashboardWithLoading = withLazyLoading(LazySellerDashboard, <PageLoading />)
export const LazyProductsPageWithLoading = withLazyLoading(LazyProductsPage, <PageLoading />)
export const LazyCheckoutPageWithLoading = withLazyLoading(LazyCheckoutPage, <PageLoading />)
export const LazyReportsPageWithLoading = withLazyLoading(LazyReportsPage, <PageLoading />)

export const LazyAdvancedChatWithLoading = withLazyLoading(LazyAdvancedChat, <ComponentLoading height="h-64" />)
export const LazyCustomerSupportWidgetWithLoading = withLazyLoading(LazyCustomerSupportWidget)
export const LazyNotificationCenterWithLoading = withLazyLoading(LazyNotificationCenter, <ComponentLoading height="h-48" />)
export const LazyEmailTemplatesWithLoading = withLazyLoading(LazyEmailTemplates, <PageLoading />)

export const LazySalesChartWithLoading = withLazyLoading(LazySalesChart, <ComponentLoading height="h-64" />)
export const LazyMetricsCardWithLoading = withLazyLoading(LazyMetricsCard, <CardLoading />)

// Hook para lazy loading de imagens
export function useLazyImage(src: string, threshold = 0.1) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [ref, setRef] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref, threshold])

  return {
    ref: setRef,
    isInView,
    isLoaded,
    setIsLoaded
  }
}

// Componente para lazy loading de seções
export function LazySection({
  children,
  fallback = <ComponentLoading height="h-64" />,
  threshold = 0.1
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
  threshold?: number
}) {
  const [isInView, setIsInView] = useState(false)
  const [ref, setRef] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref, threshold])

  return (
    <div ref={setRef}>
      {isInView ? children : fallback}
    </div>
  )
}
