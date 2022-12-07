import * as React from 'react'
import styled from '@emotion/styled'
import LinkButton from '@/components/LinkButton'
import { ReactNode } from 'react'

interface InfoSidebarContainerProps {
  children: ReactNode
}
export default function InfoSidebarContainer({
  children
}: InfoSidebarContainerProps) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      {React.Children.map(children, child => {
        return <StyledRTV>{child}</StyledRTV>
      })}
      <LinkButton goto="/" content="Go to Main" />
    </div>
  )
}

const StyledRTV = styled('div')`
  display: flex;
  width: 100%;
  height: auto;
  background-color: #ffffff;
  border: 1px solid #cac4d0;
  border-radius: 20px;
  padding-bottom: 24px;
`
