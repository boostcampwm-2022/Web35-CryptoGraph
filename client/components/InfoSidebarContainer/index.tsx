import * as React from 'react'
import { ReactNode } from 'react'

interface InfoSidebarContainerProps {
  children: ReactNode
}
export default function InfoSidebarContainer({
  children
}: InfoSidebarContainerProps) {
  return (
    <>
      {React.Children.map(children, child => {
        return child
      })}
    </>
  )
}
