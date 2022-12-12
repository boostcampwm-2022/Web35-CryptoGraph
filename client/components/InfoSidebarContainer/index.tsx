import { Children, ReactNode } from 'react'

interface InfoSidebarContainerProps {
  children: ReactNode
}
export default function InfoSidebarContainer({
  children
}: InfoSidebarContainerProps) {
  return (
    <>
      {Children.map(children, child => {
        return child
      })}
    </>
  )
}
