import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logoOnlyWhite from './logo-only-white.svg'
import logoWhite from './logo-white.svg'

interface LogoImgProps {
  isMobile: boolean
}

export default function LogoImg({ isMobile }: LogoImgProps) {
  const [checkMobile, setCheckMobile] = useState<boolean>(true)
  useEffect(() => {
    setCheckMobile(isMobile)
  }, [isMobile])

  const MobileImageStyle = {
    paddingRight: '16px',
    display: checkMobile ? 'grid' : 'none'
  }
  const DesktopImageStyle = {
    margin: '0px 16px 0px 32px',
    display: checkMobile ? 'none' : 'grid'
  }

  return (
    <>
      <Link href="/">
        <Image
          style={MobileImageStyle}
          src={logoOnlyWhite}
          alt=""
          width={40}
          height={40}
        />
        <Image
          style={DesktopImageStyle}
          src={logoWhite}
          alt=""
          width={200}
          height={48}
        />
      </Link>
    </>
  )
}
