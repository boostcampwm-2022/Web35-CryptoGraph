import { useState, useEffect } from 'react'

interface WindowSize {
  width: number
  height: number
}

export function useWindowSize(ref: React.RefObject<HTMLElement>) {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0
  })
  useEffect(() => {
    function handleResize() {
      if (ref.current === null) {
        console.error('useWindow 훅의 매개변수에 이상있음')
        return
      }
      setWindowSize({
        width: ref.current.getBoundingClientRect().width,
        height: ref.current.getBoundingClientRect().height
      })
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return windowSize
}
