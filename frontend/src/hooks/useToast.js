import { useState, useCallback } from 'react'

/**
 * @returns {[Array<{id, msg, type}>, (msg: string, type?: 'ok'|'err') => void]}
 */
export function useToast() {
  const [toasts, setToasts] = useState([])

  const show = useCallback((msg, type = 'ok', duration = 3200) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, msg, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration)
  }, [])

  return [toasts, show]
}