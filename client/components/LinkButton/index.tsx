import { Button } from '@mui/material'
import { fontSize } from '@mui/system'
import Link from 'next/link'

interface ChartButtonProps {
  goto: string
  content: string
}
export default function Chartbutton({
  goto = '/',
  content = 'default'
}: ChartButtonProps) {
  return (
    <Link href={goto}>
      <Button
        style={{
          width: '100%'
        }}
        size="large"
        variant="contained"
      >
        {content}
      </Button>
    </Link>
  )
}
