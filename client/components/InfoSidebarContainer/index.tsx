import * as React from 'react'
import { styled } from '@mui/material'
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
        // return <StyledRTV>{child}</StyledRTV>
      })}
      <LinkButton goto="/" content="Go to Main" />
    </>
  )
}

const StyledRTV = styled('div')`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  /* border: 1px solid #cac4d0;
  border-radius: 20px; */
  padding-bottom: 8px;
`
