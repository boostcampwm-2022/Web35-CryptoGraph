import Image from 'next/image'

export default function Gnb({}) {
  return (
    <>
      <div className='background'>
        <div id='gnb-content'>
          <Image
            src="/logo-white.svg"
            width={291.31}
            height={79}
          />
          <div id='search-bar'>
            asasasa
          </div>
          <Image
            src="/userInfo.svg"
            width={100}
            height={100}
          />
        </div>
        
      </div>
      
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
        }
        #gnb-content {
          display: flex;
          justify-content:space-between;
          width: 100%;
        }
        #search-bar {
        }
        .background {
          width: 100%;
          background-color: black;
        }
        .userInfo {

        }
      `}
      </style>
    </>
  )
}