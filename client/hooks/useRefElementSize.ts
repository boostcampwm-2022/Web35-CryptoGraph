import {
  CHART_X_AXIS_MARGIN,
  CHART_Y_AXIS_MARGIN
} from '@/constants/ChartConstants'
import { useState, useEffect } from 'react'

export interface RefElementSize {
  width: number
  height: number
}

/**
 * DOM 태그의 ref의 width, height를 상태로 return하는 커스텀 훅
 * @param ref width와 height를 얻길 원하는 html 태그의 ref
 * @returns  width와 height의 변화하는 상태값
 */
export function useRefElementSize(ref: React.RefObject<Element>) {
  const [refElementSize, setRefElementSize] = useState<RefElementSize>({
    width: CHART_Y_AXIS_MARGIN,
    height: CHART_X_AXIS_MARGIN
  })
  useEffect(() => {
    function handleResize() {
      if (ref.current === null) {
        console.error('useWindow 훅의 매개변수에 이상있음')
        return
      }
      setRefElementSize({
        width: ref.current.clientWidth,
        height: ref.current.clientHeight
      })
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [ref, ref?.current?.clientWidth, ref?.current?.clientHeight])
  return refElementSize
}
