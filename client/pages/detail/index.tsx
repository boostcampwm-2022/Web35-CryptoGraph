import { GetServerSideProps } from 'next'

//[market] 서브 도메인 없이 접속했을떄 main화면으로 라우팅
export default function RedirectToMain() {
  return <div />
}

export const getServerSideProps: GetServerSideProps = async context => {
  return {
    redirect: {
      permanent: false,
      destination: '/'
    }
  }
}
