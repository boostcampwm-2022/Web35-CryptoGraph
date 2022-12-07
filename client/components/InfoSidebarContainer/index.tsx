import * as React from 'react'
import LinkButton from '@/components/LinkButton'
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
      <LinkButton goto="/" content="Go to Main" />
    </>
  )
}
