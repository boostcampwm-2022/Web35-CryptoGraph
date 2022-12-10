import { Button } from '@mui/material'
import Link from 'next/link'

interface ChartButtonProps {
  goto: string
  content: string
  style?: object
}
export default function Chartbutton({
  goto = '/',
  content = 'default',
  style = {}
}: ChartButtonProps) {
  return (
    <Link href={goto}>
      <Button
        style={{ width: '100%', ...style }}
        size="large"
        variant="contained"
      >
        {content}
      </Button>
    </Link>
  )
}
