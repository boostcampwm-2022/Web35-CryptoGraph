import { useState, useEffect } from 'react'

interface WindowSize {
  width: number
  height: number
}

/**
 * DOM 태그의 ref의 width, height를 상태로 return하는 커스텀 훅
 * @param ref width와 height를 얻길 원하는 html 태그의 ref
 * @returns  width와 height의 변화하는 상태값
 */
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
  }, [ref])
  return windowSize
}
