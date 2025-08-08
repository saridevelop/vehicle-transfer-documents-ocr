import { useCallback, useRef } from 'react'

/**
 * Hook para mejorar la experiencia de inputs en dispositivos móviles
 * Previene problemas como el cierre del teclado y mejora la estabilidad
 */
export function useMobileInput() {
  const timeoutRef = useRef<NodeJS.Timeout>()

  const createStableInputHandler = useCallback(
    (onChange: (value: string) => void, delay: number = 300) => {
      return (value: string) => {
        // Cancela el timeout anterior si existe
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        // Programa el nuevo cambio con debounce
        timeoutRef.current = setTimeout(() => {
          onChange(value)
        }, delay)
      }
    },
    []
  )

  const handleInputFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    // Previene el zoom automático en iOS
    if (window.innerWidth < 768) {
      event.target.style.fontSize = '16px'
    }
  }, [])

  const handleInputBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    // Restaura el tamaño de fuente original
    if (window.innerWidth < 768) {
      event.target.style.fontSize = ''
    }
  }, [])

  return {
    createStableInputHandler,
    handleInputFocus,
    handleInputBlur,
  }
}
