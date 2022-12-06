# 실시간 암호화폐 데이터 시각화 웹 서비스 - CryptoGraph📊

-   부스트캠프 멤버십 웹 7기 그룹 프로젝트
    **Web35-teamMars**

![logo primary](https://user-images.githubusercontent.com/60903175/205961174-e6bd9e88-2d0f-4b51-9eeb-d7db05af9885.svg)

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)![Express](https://img.shields.io/badge/Express.js-3982CE?style=for-the-badge&logo=Express&logoColor=white)![Next JS](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)![D3](https://img.shields.io/badge/-d3.js-brightgreen?style=for-the-badge&logo=d3.js&logoColor=white)![Emotion](https://img.shields.io/badge/-emotion-brightgreen?style=for-the-badge&logo=emotion&logoColor=white)![MUI](https://img.shields.io/badge/-MaterialUI-blue?style=for-the-badge&logo=mui&logoColor=white)

-   배포 URL: [배포 URL 바로가기](https://cryptograph.servehttp.com/)
-   팀 Notion:[Notion 바로가기](https://www.notion.so/boostcamp-wm/Web35-CryptoGraph-035444908f1f4beb8d4c1ba40e2beb4d)
-   팀 Wiki:[ Wiki 바로가기](https://github.com/boostcampwm-2022/Web35-CryptoGraph/wiki/Introduce)

### 프로젝트 소개

---

-   CryptoGraph는 Upbit Open API, CoinMarketCap API를 이용하여 암호화폐 데이터들을 차트로 시각화하는 서비스입니다.

    [메인페이지 사진]

    메인페이지 : D3.js를 통해 구현된 캔들차트, upbit open API의 데이터를 실시간으로 렌더링합니다.

    [트리맵]

    코인 실시간 변동률 시각화 Treemap 차트

    [러닝차트]

    코인 실시간 변동률 시각화 running bar 차트

# 🥈팀원 소개 🧑‍💻

<table>
  <tbody>
    <tr>
<td align="center"><a href=""><img src="width="100px;" alt=""/><br /><sub>

### J006 강재민

<img src="https://user-images.githubusercontent.com/60903175/205962455-bbdf1bbd-44d3-406e-86e4-152d19a54467.png" width="150"/>

### 불편함을 불편해할 줄 아는 프론트엔드 개발자

[이력서 바로가기](https://www.notion.so/010dc5a42f8b4c08a2f2592682eba48c)

[깃헙 바로가기 💻](http://github.com/rkdwoals159)

</td>
<td align="center"><a href=""><img src="width="100px;" alt=""/><br /><sub>

### J013 공윤배

<img src="https://user-images.githubusercontent.com/60903175/205962656-71b83106-1f56-42fa-b96b-3e9f00e8cdf7.jpg" width="250"/>

### 항상 즐겁게 개발하는 개발자

[깃헙 바로가기 💻](https://github.com/kongyb)

</td>
<td align="center"><a href=""><img src="width="100px;" alt=""/><br /><sub>

### J038 김상훈

<img width="180" alt="김상훈" src="https://user-images.githubusercontent.com/60903175/205962751-c8330cf7-c25a-48a9-a301-ff99fb2f8a6b.png">

### 불편함을 불편해할 줄 아는 프론트엔드 개발자

[이력서 바로가기](https://www.notion.so/009309ae05974be68be9ad7beded7285)

[깃헙 바로가기 💻](https://github.com/baldwinIV)

</td>

<td align="center"><a href=""><img src="width="100px;" alt=""/><br /><sub>

### J054 김준태

<img width="150" alt="김준태" src="https://user-images.githubusercontent.com/60903175/205962803-44e9d683-ed45-4908-91bc-021ded7b5e51.png">

### 같이의 가치를 아는 프론트엔드 개발자

[이력서 바로가기](https://www.notion.so/438ec182c25847df84ef53186a387fde)

[깃헙 바로가기](https://github.com/sronger)</td>

  </tr>
  </tbody>
</table>

# 📈 주요 기능

---

## 차트

### 1. 캔들차트

---

[차트 사진]

1. 익숙한 주식 봉차트를 D3.js로 구현했습니다. 분봉선택 및 줌/패닝 기능이 지원되며, 이평선 및 거래량또한 표시됩니다.(개발예정)

### 2.트리맵 차트

---

[트리맵 사진]

시총/거래량/등락률에 대해 선택된 코인들을 트리맵으로 보여주는 차트입니다. 줌/패닝 기능이 지원됩니다.

### 러닝 바 차트

---

[러닝바 차트 사진]

선택된 코인에 대해 실시간 등락률을 보여주는 차트입니다.

### 실시간 데이터

# 📚 프로젝트 구조

---

![%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98-removebg-preview_(2)](https://user-images.githubusercontent.com/60903175/205962974-0ef2a271-62c1-4dfb-94da-7741cfeec9cf.png)

# 📚 기술 스택

---

![Untitled 3](https://user-images.githubusercontent.com/60903175/205963033-51126c6f-6069-4b64-8858-a2c3bdde9163.png)

# 👊 **기술적 도전**

---

### 반응형

1. 페이지 레이아웃
2. 차트 반응형 대응

### D3.js SVG 최적화

1. 화면에 보이는 캔들만 그리기

### 실시간 데이터 관리

2. 커스텀 훅 사용하여 관리한다.

### 캔들차트 그리기

1. drag와 wheel이벤트

2. 실시간으로 변경되는 데이터에 맞추어 캔들을 새로 그리기

-   pre-fetching한 데이터와 웹소켓 데이터의 유기적 연결

###

# 💫 **트러블 슈팅**

---

-   nextjs와 styled-component
    -   styled-component + mui → emotion + mui 로 기술스택을 변경했습니다.
    1. mui는 emotion을 기본 스타일 엔진으로 사용합니다. 그래서 emotion친화적이고, 만일 styled-component를 사용할 경우 mui를 같이 사용하려면 기본적인 npm emotion라이브러리도 같이 설치되어야 합니다.
    2. styled-component를 mui와 같이 쓰려면 기존 babel-plugin을 설치해야하는데 next12에서 babel → swc로 마이그레이션 됐기 때문에 레거시 코드가 생기는 이슈가 있습니다.
-   실시간 데이터가 조금씩 늦게 반영되는 에러 (API 관련)
-   Link vs useNevigate vs window.location.href
-   5.  interface augmentation
-   모바일 퍼스트? 반응형 레이아웃 제작 순서
-   svg vs canvas
    -   캔들차트 dom element를 일정개수 이하로 제한을 두어 성능개선에 집중했습니다.(예정)
    -   이건 트러블 슈팅보다는 공부한 것 쪽으로 보내는게 낫지 않을까요? 딱히 트러블슈팅같지는 않아 보여요

# 👨‍💻 역할

---

### J006 강재민

-   Running Bar 차트 개발
-   상단바 검색창 자동완성 적용

### J013 공윤배

-   캔들차트 개발
-   실시간 코인정보 컴포넌트 개발

### J038 김상훈

-   [해결한 깃헙 이슈 바로가기](https://github.com/boostcampwm-2022/Web35-CryptoGraph/issues?q=is%3Aissue+assignee%3AbaldwinIV+)
-   레이아웃 마크업 제작 및 미디어 쿼리 활용한 반응형 적용
-   캔들차트 개발
-   프로젝트 리딩

### J054 김준태

-   트리맵 차트 개발
-   코인 선택 컴포넌트 개발
