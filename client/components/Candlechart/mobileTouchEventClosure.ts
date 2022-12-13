import {
  CandleData,
  CandleChartRenderOption,
  PointerData
} from '@/types/ChartTypes'
import { handleMouseEvent } from '@/utils/chartManager'
import { D3DragEvent } from 'd3'
import { Dispatch, SetStateAction } from 'react'

const getEuclideanDistance = (touches: Touch[]): number => {
  return Math.sqrt(
    Math.pow(touches[0].clientX - touches[1].clientX, 2) +
      Math.pow(touches[0].clientY - touches[1].clientY, 2)
  )
}

export const mobileEventClosure = (
  optionSetter: Dispatch<SetStateAction<CandleChartRenderOption>>,
  translateXSetter: Dispatch<SetStateAction<number>>,
  pointerPositionSetter: Dispatch<SetStateAction<PointerData>>,
  chartAreaXsize: number,
  chartAreaYsize: number
) => {
  let prevDistance = -1
  const start = (event: D3DragEvent<SVGSVGElement, CandleData, unknown>) => {
    if (event.identifier === 'mouse' || event.sourceEvent.touches.length !== 2)
      //마우스거나 (==데스크탑이거나), 2개의 멀티터치가 아니면 아무것도 하지 않음
      return
    prevDistance = getEuclideanDistance(event.sourceEvent.touches)
  }
  const drag = (event: D3DragEvent<SVGSVGElement, CandleData, unknown>) => {
    if (event.identifier !== 'mouse' && event.sourceEvent.touches.length == 2) {
      //여기는 줌 코드
      const nowDistance = getEuclideanDistance(event.sourceEvent.touches)
      if (nowDistance === prevDistance) return
      const isZoomIn = prevDistance < nowDistance ? 0.5 : -0.5
      prevDistance = getEuclideanDistance(event.sourceEvent.touches)
      optionSetter((prev: CandleChartRenderOption) => {
        const newCandleWidth = Math.min(
          Math.max(prev.candleWidth + isZoomIn, prev.minCandleWidth),
          prev.maxCandleWidth
        )
        const newRenderCandleCount = Math.ceil(chartAreaXsize / newCandleWidth)
        return {
          ...prev,
          renderCandleCount: newRenderCandleCount,
          candleWidth: newCandleWidth
        }
      })
      return
    }
    //여기는 패닝 코드
    translateXSetter(prev => prev + event.dx)
    handleMouseEvent(
      event.sourceEvent,
      pointerPositionSetter,
      chartAreaXsize,
      chartAreaYsize
    )
  }
  const end = () => {
    prevDistance = -1
  }
  return [start, drag, end]
}
