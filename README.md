
#  STAGE_101


 [모바일 & 데스크탑 화면]

![Frame 2 (2)](https://github.com/user-attachments/assets/26c4aa3e-da2a-4131-85d9-22d49a66d467)

```
단 한 번의 관람, 그러나 오래 남는 경험.  
소극장이라는 작고 감성적인 공간 안에서 극장 예약부터 리뷰, 포인트, 상점까지 완결성 있는 흐름을 설계한 개인 프로젝트입니다.
```

## 👨‍💻 담당 역할

| 분야         | 담당자     |
|--------------|------------|
| 🎨 UI/UX 디자인     | 박우석 |
| 🧠 기획 및 구조 설계 | 박우석 |
| 🖥 프론트엔드 개발  | 박우석 |
| 🗄 백엔드(Supabase) | 박우석 |
| 🧪 테스트 및 디버깅 | 박우석 |

> “혼자였지만, 팀처럼 움직였습니다.”

---


🚀 프로젝트 요약

- ⏱ 개발 기간: 약 10주 / 리펙터링 5주
- 🔨 주요 기능: 예약, 결제, 리뷰, 포인트, 장바구니
- 🔧 총 커밋 수: 480회+
- 💡 목표: 실사용자 흐름에 가까운 감성 기반 상영 서비스 제작
  
---

# 📁 프로젝트 전체 파일 구조

```
📦 STAGE_101/
```
```
├── alembic/                     # DB 마이그레이션 관련
├── server/                      # 백엔드 (FastAPI)
│   ├── api/                     # API 로직 (필요 시 세분화)
│   ├── models/                  # SQLAlchemy 모델
│   ├── routes/                  # API 라우트 (엔드포인트)
│   ├── schemas/                 # Pydantic 스키마 (요청/응답)
│   ├── cleanup.py               # 유저/데이터 정리 스크립트
│   ├── database.py              # DB 연결 설정
│   ├── main.py                  # FastAPI 진입점
│   ├── qrSession.py             # QR 세션 관련 로직
│   ├── requirements.txt         # Python 패키지 목록
│   ├── security.py              # 인증/암호화 유틸
│   └── websocket_manager.py     # 실시간 WebSocket 핸들러
```
```
└── web/                         # 프론트엔드 (Next.js)
    ├── public/                  # 정적 리소스 (이미지 등)
    ├── src/                     # 실제 소스코드
    │   ├── app/                 # 페이지 및 라우팅
    │   │   ├── _components/     # 페이지 공통 컴포넌트
    │   │   ├── _providers/      # 전역 Provider 설정
    │   │   ├── (auth)/          # 인증 관련 서버 컴포넌트
    │   │   ├── cart/            # 장바구니 페이지
    │   │   ├── home/            # 홈 페이지
    │   │   ├── mypage/          # 마이 페이지
    │   │   ├── notion/          # Notion 관련
    │   │   ├── payments/        # 결제 관련
    │   │   ├── qr_session/      # QR 관련
    │   │   ├── reviews/         # 리뷰 관련
    │   │   ├── shop/            # 상품 목록/상세
    │   │   ├── theater/         # 극장 페이지
    │   │   ├── layout.tsx       # 공통 레이아웃
    │   │   ├── page.tsx         # 진입점 페이지
    │   │   └── globals.css      # 전역 CSS
    │   ├── hooks/               # 커스텀 훅 (React Query 등)
    │   ├── lib/                 # API 클라이언트, 유틸 함수 등
    │   ├── store/               # Zustand 등 글로벌 상태 관리
    │   ├── types/               # 전역 TypeScript 타입
    │   ├── ui/                  # 공용 UI 컴포넌트
    │   └── utils/               # 유틸리티 함수 모음
    ├── .env.local               # 프론트 환경변수
    ├── middleware.ts            # Next.js 미들웨어
```
---

## 💡 주요 기능

- ✅ **좌석 예약 시스템**
  - 날짜 및 시간 선택 → 좌석 예약 가능
  - 다른 유저가 좌석 예약 시 **즉시 화면에 반영** (WebSocket)
  - 예약 완료 시 QR코드 발급

- ⏱ **임시 예약 로직**
  - 좌석 선택 후 30분 내 결제 미완료 시 자동 취소
  - UI 실시간 반영 (FastAPI & WebSocket)

- 💳 **결제 & 포인트 시스템**
  - 예약 완료 시 포인트 적립
  - 포인트는 내부 상점(굿즈샵/식당 등)에서 사용 가능
  - 마이페이지에서 구매 내역, 티켓 확인 및 취소 가능

- 🛍 **상점 & 장바구니**
  - 포인트 사용 상점 구현
  - 장바구니 기능 + 구매 내역 저장

- 👤 **사용자 기능**
  - 소셜 로그인 (Kakao, Google)
  - 프로필 수정, 닉네임 변경, 회원 탈퇴
  - 리뷰 작성, 랭킹 시스템 구현

---

## 🛠️ 기술 스택

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

### State & Data
![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?style=for-the-badge)

### Backend
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-CA504E?style=for-the-badge&logo=alchemy&logoColor=white)

### DB
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

### API
![TossPayments](https://img.shields.io/badge/Toss%20Payments-0064FF?style=for-the-badge)
![Kakao%20SDK](https://img.shields.io/badge/Kakao%20SDK-FFCD00?style=for-the-badge&logo=kakao&logoColor=000000)
![Google%20OAuth](https://img.shields.io/badge/Google%20OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white)

### LIB
![Day.js](https://img.shields.io/badge/Day.js-FF2D20?style=for-the-badge)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-EC5990?style=for-the-badge)
![Zod](https://img.shields.io/badge/Zod-2C2C2C?style=for-the-badge)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

### Deployment
![Amazon S3](https://img.shields.io/badge/Amazon%20S3-569A31?style=for-the-badge&logo=amazon-s3&logoColor=white)
![Amazon RDS](https://img.shields.io/badge/Amazon%20RDS-527FFF?style=for-the-badge&logo=amazonrds&logoColor=white)
![Amazon EC2](https://img.shields.io/badge/Amazon%20EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white)

---

## 🧩 나의 역할

- 전체 기획 및 서비스 흐름 설계  
- UI/UX 디자인 및 퍼블리싱  
- 프론트엔드 구현 (화면, 상태 관리, 데이터 연결)  
- FastAPI&PostgreSQL를 활용한 백엔드 처리 (실시간 DB 처리, 트리거, 인증 등)  
- 테스트 및 사용자 시나리오 검증
- AWS 배포
  
<br/>

---
## 🤓 주요 페이지 소개

<br/>
<br/>
<br/>


 ## [로그인 , 회원가입 / CSR + ServerAction]

<div align="center">
  <table style="width:70%;">
    <tr>
      <!-- 각 셀 안에서 이미지도 가운데 정렬 -->
      <td align="center">
        <img
          src="https://github.com/user-attachments/assets/7b97bc7e-5a64-4ee6-981e-ecea2f6d7eba"
          width="470"
        />
      </td>
      <td align="center">
        <img
          src="https://github.com/user-attachments/assets/3d9b3611-ec37-46e5-bfa1-abbe2d4c09f9"
          width="460"
        />
      </td>
    </tr>
  </table>
</div>


- 로그인 페이지에서는 **카카오톡 / 구글 소셜 로그인 가능**
  - 한국 사용자에게 친숙한 카카오와 구글 계정으로 빠른  서비스를 이용할 수 있게 했습니다.
- 회원가입은 **3단계에 걸쳐 정보를 입력하는 스텝-바이-스텝 방식**으로 설계되었습니다.
  - 이메일, 비밀번호부터 휴대폰번호, 생년월일까지 순차적으로 입력하게 하여 사용자 피로도를 낮추고 입력 실수를 줄이기 위한 UX를 적용했습니다.  
- 각 단계마다 유효성 검사를 즉시 수행하고, 에러 발생 시 해당 필드로 자동 포커스되도록 처리하여 사용자에게 더 직관적이고 친절한 회원가입 경험을 제공합니다.

 ## [리뷰 & 리뷰 작성 / Framer-Motion / Modal]  

<div align="center">
  <table>
    <tr>
      <td>
        <img
          width="798"
          height="940"
          alt="image"
          src="https://github.com/user-attachments/assets/f1834a09-34a3-4ca3-9b11-ffdce2d77fb1"
        />
      </td>
      <td>
        <img
          width="798"
          height="940"
          alt="image"
          src="https://github.com/user-attachments/assets/14dd9c73-8f58-4f59-97e0-4a8b82930bca"
        />
      </td>
    </tr>
  </table>
</div>

- **자연스러운 모달 애니메이션**
  - Framer Motion을 활용해 리뷰 목록과 리뷰 작성 모달이 자연스럽게 열리도록 구현했습니다.

- **실시간 리뷰 미리보기**
  - 작성 중인 리뷰가 실제로 어떻게 보여질지 실시간으로 확인할 수 있습니다.
  - 리뷰 카드에 사용될 이미지를 포스터 이미지와 프로필 이미지 중에서 선택할 수 있습니다.

 
 ## [상점 & 장바구니 / CSR ]
<div align="center">
  <table>
    <tr>
      <td>
        <img
          width="429"
          height="265"
          alt="image"
          src="https://github.com/user-attachments/assets/e09163a3-1d58-4cf6-ad5d-f6fc8626fa38"
        />
      </td>
      <td>
        <img
          width="429"
          height="265"
          alt="image"
          src="https://github.com/user-attachments/assets/0fcb6e15-6ca9-47d1-ad5f-88dae74a1fd4"
        />
      </td>
    </tr>
  </table>
</div>


- **상점 페이지**
  - 사용자는 포인트로 상품을 구매할 수 있는 상점 페이지에서 원하는 상품을 탐색할 수 있습니다.

- **상품 카드 & 상세 페이지**
  - 각 상품 카드는 포인트, 이름, 이미지 등의 정보를 제공하며, 클릭 시 해당 상품의 상세 페이지로 이동합니다.
  - 상세 페이지에서는 수량 변경, 상품 정보 확인, 장바구니 담기 기능을 제공합니다.

- **장바구니 기능**
  - 장바구니 페이지에서 담긴 상품을 한눈에 확인할 수 있으며,
    수량 변경, 선택 삭제, 전체 선택 등 기본적인 장바구니 기능을 지원합니다.

- **일괄 결제 & 포인트 연동**
  - 장바구니에 담긴 상품은 한 번에 결제할 수 있으며,
    결제 시 포인트 차감과 결제 내역 저장이 함께 처리됩니다.

- **데이터 최신 상태 유지**
  - 모든 상태 변경 후 React Query의 `invalidateQueries`를 통해 데이터를 최신 상태로 유지합니다.

- **로딩 UX 개선**
  - 스켈레톤 UI를 적용해 데이터 로딩 중에도 사용자가 끊김 없는 화면을 볼 수 있도록 했습니다.

 ## [좌석 예약 & 결제 / CSR + SSR ]
 



 ## [공연 & 상점 결제 완료 페이지 / SSR ]  
<img width="373" height="572" alt="image" src="https://github.com/user-attachments/assets/7cc5fef7-6a36-408d-9e07-40dad27021f7" />




 ## [마이페이지 기능 / CSR ]
<table align = "center">
  <tr>
    <!-- 왼쪽 큰 이미지 -->
    <td>
      <img
        width="407"
        height="857"
        alt="image"
        src="https://github.com/user-attachments/assets/cc704d0f-0009-4301-a4cf-70c5ea0a3dc6"
      />
    </td>
    <td>
      <img
        width="273"
        height="206"
        alt="image"
        src="https://github.com/user-attachments/assets/f7c1efa4-660c-4b5c-b2d7-739f02dde88d"
      /><br/>
      <img
        width="273"
        height="161"
        alt="image"
        src="https://github.com/user-attachments/assets/8ae8b24a-e91d-428d-b68e-5932b0deab74"
      /><br/>
      <img
        width="276"
        height="207"
        alt="image"
        src="https://github.com/user-attachments/assets/2c0be9a3-ac09-42ac-a8e0-0194f036abad"
      />
    </td>
  </tr>
</table>

- **예매·리뷰·구매 이력 한눈에 확인**
  - 마이페이지에서 예매 내역, 내가 작성한 리뷰, 상점 구매 이력을 한 화면에서 탭으로 나눠 확인할 수 있습니다.

- **탭 기반 화면 전환**
  - Ticket / Review / History 탭을 전환하면 페이지 이동 없이 자연스럽게 내용이 바뀌어, 끊김 없는 사용 경험을 제공합니다.

- **카드형 레이아웃**
  - 각 내역은 카드 형태로 정리되어 있어 한 번에 필요한 정보를 파악하기 쉽고, 전체적으로 통일감 있는 화면을 구성합니다.

- **마이페이지 전용 하단 영역**
  - 데스크톱 환경에서는 마이페이지 하단에 전용 푸터가 고정되어, 나의 이용 현황과 안내 정보를 한 번 더 정리해 보여줍니다.
  - 가입한 상품이나 이용 상태에 따라 푸터에 노출되는 내용이 달라집니다.

- **프로필 영역**
  - 상단 프로필 영역에서 나의 닉네임, 간단한 소개, 현재 보유 포인트 등 기본 정보를 한눈에 확인할 수 있습니다.

 ## [접근 제한 & 보안]

- **비로그인 사용자 제한**
  - 비로그인 상태에서 마이페이지 접근 시 로그인 페이지로 리다이렉트
  - 공연 선택 시 로그인 모달 노출
  - 상점에서 아이템을 장바구니에 담을 때 로그인 모달 노출
  - 비로그인 사용자는 리뷰를 최대 5개까지만 열람 가능

- **일반 사용자 권한 제한**
  - 일반 사용자는 QR 전용 페이지에 접근할 수 없도록 권한 차단

- **로그인 보안**
  - JWT를 HttpOnly 쿠키로 관리하여 토큰을 안전하게 저장
  - LocalStorage에는 사용자의 민감하지 않은 정보를 암호화/디코딩하여 저장해 보안을 강화


---

## ERD
![위](https://github.com/user-attachments/assets/dfaef0bb-2486-4c4e-bbc3-bd57a008d671)
![아래](https://github.com/user-attachments/assets/04fb9610-8738-4b1f-8a57-fde7bb8dbe1a)


---

## 🔗 배포 링크 & 데모

- **배포 주소:** [https://stage-101.vercel.app/](https://stage-101.vercel.app/)  
- **GitHub:** [https://github.com/YouKnowThat-Park](https://github.com/YouKnowThat-Park)

---

## 📝 회고 & 배운 점

[회고]
[https://stage-101.vercel.app/notion/retrospective](https://stage-101.vercel.app/notion/retrospective)  

[기능 선택 이유]
[https://stage-101.vercel.app/notion/feature-decisions](https://stage-101.vercel.app/notion/feature-decisions)

[기능적 문제]
[https://stage-101.vercel.app/notion/feature-history](https://stage-101.vercel.app/notion/feature-history)

[트러블 슈팅]
[https://stage-101.vercel.app/notion/trouble-shooting](https://stage-101.vercel.app/notion/trouble-shooting)


---

## 🙌 Thank You

**혼자서 시작했지만, 이 프로젝트를 통해 ‘사용자를 위한 개발’의 재미를 진심으로 느꼈습니다.  
언제나 배우고, 계속해서 개선하며 성장하는 개발자가 되겠습니다.**

