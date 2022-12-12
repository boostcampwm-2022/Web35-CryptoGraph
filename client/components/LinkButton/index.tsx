import { Button } from '@mui/material'
import Link from 'next/link'

interface ChartButtonProps {
  goto: string
  content: string
  style?: object
}
const LinkStyle = { textDecoration: 'none', width: '100%', marginTop: '8px' }

export default function Chartbutton({
  goto = '/',
  content = 'default',
  style = {}
}: ChartButtonProps) {
  return (
    <Link href={goto} style={LinkStyle}>
      <Button
        sx={{
          width: '100%',

          ...style
        }}
        size="large"
        variant="contained"
      >
        {content}
      </Button>
    </Link>
  )
}
