import { useState, useEffect } from 'react'

/**
 * Hook para debounce de valores
 * Útil para otimizar buscas e inputs que fazem muitas requisições
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook para debounce de funções
 * Útil para limitar a frequência de execução de funções
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const debouncedCallback = ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    const newTimeoutId = setTimeout(() => {
      callback(...args)
    }, delay)

    setTimeoutId(newTimeoutId)
  }) as T

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  return debouncedCallback
}

/**
 * Hook para throttling de funções
 * Útil para limitar a frequência máxima de execução
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const [lastExecuted, setLastExecuted] = useState(0)

  const throttledCallback = ((...args: Parameters<T>) => {
    const now = Date.now()
    
    if (now - lastExecuted >= delay) {
      callback(...args)
      setLastExecuted(now)
    }
  }) as T

  return throttledCallback
}

/**
 * Hook para search com debounce
 * Combina debounce com estado de loading
 */
export function useDebouncedSearch<T>(
  searchFn: (query: string) => Promise<T[]>,
  delay: number = 300
) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debouncedQuery = useDebounce(query, delay)

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    searchFn(debouncedQuery)
      .then(setResults)
      .catch((err) => {
        setError(err.message || 'Erro na busca')
        setResults([])
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [debouncedQuery, searchFn])

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    clearResults: () => {
      setResults([])
      setQuery('')
      setError(null)
    }
  }
}
