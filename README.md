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

- ⏱ 개발 기간: 약 5주 (기획 및 개발 5주)
- 🔨 주요 기능: 예약, 결제, 리뷰, 포인트, 장바구니
- 🔧 총 커밋 수: 320회+
- 📁 전체 파일: 약 100개 이상
- 💡 목표: 실사용자 흐름에 가까운 감성 기반 상영 서비스 제작
  
---

# 📁 프로젝트 전체 파일 구조

```
📦 STAGE_101/
├── 📁 node_modules/
├── 📁 public/
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📁 _components/
│   │   │   └── 📄 ClientWrapper.tsx
│   │   ├── 📁 _providers/
│   │   │   ├── 📄 AuthProvider.tsx
│   │   │   └── 📄 providers.tsx
│   │   ├── 📁 (auth)/
│   │   │   ├── 📁 _components/
│   │   │   │   ├── 📄 AuthInputField.tsx
│   │   │   │   ├── 📄 CommonSchemas.ts
│   │   │   │   ├── 📄 Logout.tsx
│   │   │   │   └── 📄 SignUpSchema.ts
│   │   │   ├── 📁 provider/
│   │   │   │   └── 📄 route.ts
│   │   │   ├── 📁 sign-in/
│   │   │   │   ├── 📁 _components/
│   │   │   │   │   └── 📄 SignInForm.tsx
│   │   │   │   ├── 📁 kakao/
│   │   │   │   │   ├── 📄 actions.ts
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📄 actions.ts
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 sign-up/
│   │   │   │   ├── 📁 _components/
│   │   │   │   └── 📄 page.tsx
│   │   ├── 📁 api/
│   │   │   ├── 📁 auth/
│   │   │   │   ├── 📁 callback/
│   │   │   │   ├── 📁 delete-user/
│   │   │   │   ├── 📁 logout/
│   │   │   │   ├── 📁 session/
│   │   │   │   │   └── 📄 actions.ts
│   │   │   ├── 📁 cart/
│   │   │   │   ├── 📁 [id]/
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📁 home/
│   │   │   │   │   └── 📄 HomeReviews.tsx
│   │   │   │   ├── 📁 mypage/
│   │   │   │   │   ├── 📁 _components/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 notion/
│   │   │   │   ├── 📁 feature-decisions/
│   │   │   │   ├── 📁 feature-history/
│   │   │   │   ├── 📁 retrospective/
│   │   │   │   └── 📁 trouble-shooting/
│   │   │   ├── 📁 payments/
│   │   │   │   ├── 📁 _components/
│   │   │   │   │   └── 📄 ClientPaymentsPage.tsx
│   │   │   │   ├── 📁 [theaterId]/
│   │   │   │   │   ├── 📁 [id]/
│   │   │   │   │   │   ├── 📄 CheckoutClient.tsx
│   │   │   │   │   │   ├── 📄 page.tsx
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   ├── 📁 success/
│   │   │   │   │   ├── 📄 layout.tsx
│   │   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 reviews/
│   │   │   │   ├── 📁 _components/
│   │   │   │   │   ├── 📄 ReviewAddModal.tsx
│   │   │   │   │   └── 📄 ReviewPage.tsx
│   │   │   ├── 📁 shop/
│   │   │   │   ├── 📁 [id]/
│   │   │   │   │   └── 📄 page.tsx
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 theater/
│   │   │   │   ├── 📁 _components/
│   │   │   │   │   ├── 📄 CinemaA.tsx
│   │   │   │   │   ├── 📄 CinemaB.tsx
│   │   │   │   │   ├── 📄 MusicalA.tsx
│   │   │   │   │   ├── 📄 MusicalB.tsx
│   │   │   │   │   ├── 📄 TheaterCalendar.tsx
│   │   │   │   │   └── 📄 TheaterList.tsx
│   │   │   │   ├── 📁 [id]/
│   │   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 hooks/
│   │   │   ├── 📁 lib/
│   │   │   ├── 📁 store/
│   │   │   ├── 📁 supabase/
│   │   │   ├── 📁 types/
│   │   │   ├── 📁 ui/
│   │   │   │   ├── 📁 calendar/
│   │   │   │   ├── 📁 icon/
│   │   │   │   └── 📁 modal/
│   │   │   ├── 📁 utils/
│   │   │   └── 📄 middleware.ts
├── 📄 .env.local
```
---

## 💡 주요 기능

- ✅ **좌석 예약 시스템**
  - 날짜 및 시간 선택 → 좌석 예약 가능
  - 다른 유저가 좌석 예약 시 **즉시 화면에 반영** (Supabase Realtime)
  - 예약 완료 시 QR코드 발급

- ⏱ **임시 예약 로직**
  - 좌석 선택 후 30분 내 결제 미완료 시 자동 취소
  - UI 실시간 반영 (Supabase SQL + Realtime 트리거)

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
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

### Payments
![TossPayments](https://img.shields.io/badge/Toss%20Payments-0064FF?style=for-the-badge)

### LIB
![Day.js](https://img.shields.io/badge/Day.js-FF2D20?style=for-the-badge)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-EC5990?style=for-the-badge)
![Zod](https://img.shields.io/badge/Zod-2C2C2C?style=for-the-badge)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
---

## 🧩 나의 역할

- 전체 기획 및 서비스 흐름 설계  
- UI/UX 디자인 및 퍼블리싱  
- 프론트엔드 구현 (화면, 상태 관리, 데이터 연결)  
- Supabase를 활용한 백엔드 처리 (실시간 DB 처리, 트리거, 인증 등)  
- 테스트 및 사용자 시나리오 검증

---

## 🤔 기능 로직 설명

 ## [로그인 , 회원가입]

<p align="center">
  <img src="https://github.com/user-attachments/assets/7b97bc7e-5a64-4ee6-981e-ecea2f6d7eba" width="40%" />
  <img src="https://github.com/user-attachments/assets/3d9b3611-ec37-46e5-bfa1-abbe2d4c09f9" width="40%" />
</p>


- 로그인 페이지에서는 **카카오 / 구글 소셜 로그인 기능**을 중심으로,
  사용자가 빠르게 서비스를 이용할 수 있도록 간편 인증 방식을 적용했습니다.  
- 회원가입은 **3단계에 걸쳐 정보를 입력하는 스텝-바이-스텝 방식**으로 설계되었습니다.
  이메일, 비밀번호부터 휴대폰번호, 생년월일까지 순차적으로 입력하게 하여 사용자 피로도를 낮추고 입력 실수를 줄이기 위한 UX를 적용했습니다.  
- 각 단계마다 유효성 검사를 즉시 수행하고, 에러 발생 시 해당 필드로 자동 포커스되도록 처리하여 사용자에게 더 직관적이고 친절한 회원가입 경험을 제공합니다.

 ## [리뷰 & 리뷰 작성]  

 ![image](https://github.com/user-attachments/assets/2b104561-1484-49ff-bb0c-846de3a5b8e6)
<br/>
 - `framer-motion`을 활용해 리뷰 인터랙션에 부드러운 애니메이션을 적용하여 시각적 완성도를 높였습니다.  
 - 기존에는 리뷰를 별도의 페이지에서 작성했지만, 이를 **모달 구조로 변경**하고 애니메이션을 추가해  
   리뷰 작성 모달이 등장하면 기존 모달은 좌측으로 자연스럽게 이동하며 **두 개의 모달이 동시에 유지되는 UI**를 구현했습니다.  
 - 리뷰 작성 시, 사용자는 **실명/닉네임 선택**, **포스터/프로필 이미지 설정** 등 원하는 정보만 노출할 수 있도록 커스터마이징이 가능합니다.  
 - 또한, 작성 중 리뷰가 실제로 어떻게 보여질지 **실시간으로 확인 가능한 미리보기 기능**을 추가하여,  
   사용자에게 더 직관적이고 편리한 작성 경험을 제공합니다.
 - 스켈레톤UI를 통해 리뷰를 불러오는 시간동안 사용자에게 안정적인 UI를 제공했습니다.



 ## [리뷰 랭킹]

![image](https://github.com/user-attachments/assets/7b58baf2-b234-4db9-a1db-9d82da87aad0)
<br/>
 - 유저들이 작성한 리뷰 데이터를 기반으로, 리뷰 수가 많은 상위 3명의 유저를 집계하여 랭킹 형태로 제공합니다.
 - 서버 측에서 Supabase의 리뷰 테이블과 사용자 정보를 조인하여, 유저별 리뷰 개수, 닉네임, 프로필 이미지를 기준으로 정렬합니다.
 - 클라이언트에서는 framer-motion을 활용해 각 랭킹 항목에 순차적으로 등장하는 애니메이션 효과를 적용하였습니다.
 - 1~3위 유저에게는 👑, 🥈, 🥉 아이콘을 부여해 랭킹 시각화와 몰입감을 높였습니다.

<div style="margin-top:30px;"></div>

 ## [상점 & 장바구니]


  <img src="https://github.com/user-attachments/assets/472c79cf-7f9f-4953-88f8-e3edb4bc2542" width="45%" />
  <img src="https://github.com/user-attachments/assets/da46de53-6581-41a7-a574-6815ce5cccc2" width="45%" />

<br/>
<br/>

 - 사용자는 포인트로 상품을 구매할 수 있는 **상점 페이지**를 통해 원하는 상품을 탐색할 수 있습니다.
 - 각 상품 카드는 포인트, 이름, 이미지 정보를 제공하며, 클릭 시 상세 페이지로 이동합니다.
 - 상세 페이지에서는 수량 조절, 상품 정보 확인 및 장바구니 담기 기능이 제공되며,
 - 비로그인 사용자의 경우 로그인 모달이 자동으로 등장합니다.
 - 장바구니 페이지에서는 담은 상품을 목록 형태로 확인할 수 있으며,
  수량 변경, 선택 삭제, 전체 선택 등의 기능이 구현되어 있습니다.
 - **선택한 상품에 대해서만 결제가 가능하며**, 구매 버튼을 누르면 포인트 계산 후 결제 내역이 저장됩니다.
 - 모든 상태 변경 후에는 React Query의 `invalidateQueries`를 통해 데이터를 최신 상태로 유지합니다.
 - 스켈레톤UI를 통해 데이터를 불러오는 시간동안 사용자에게 안정적인 UI를 제공했습니다.


 ## [좌석 예약 & 결제]
 

  <img src="https://github.com/user-attachments/assets/cb572453-b3b7-499b-ae14-13f5e7a8c8e0" width="45%" />
  <img src="https://github.com/user-attachments/assets/cae3dd88-56d6-4924-8938-2068f8af537d" width="45%" />


 - 실제 상용 예매 서비스와 유사한 흐름을 구성하여,  
   날짜/시간 선택 → 좌석 선택 → 결제 → 완료 후 QR 발급까지의  
   **전체 좌석 예약 및 결제 시스템**을 구현했습니다.  
 - 단순한 UI 구현을 넘어서,  
   **실시간 좌석 동기화**, **중복 결제 방지**, **접근 제어**, **결제 성공 검증** 등  
   사용자 경험과 보안성을 모두 고려한 로직으로 설계되었습니다.  

 - 날짜 및 시간 선택 시, `react-calendar`를 활용하여 직관적인 캘린더 UI를 제공하고  
   홀수/짝수 날짜 필터링, 공연 시간 버튼 동적 출력 등 사용자 흐름을 고려한 구성이 반영되어 있습니다.  
 - 좌석 선택은 A~E열, 1~10번의 5x10 레이아웃으로 구현되며,  
   `Supabase`에서 **실시간 예약 정보를 받아와 이미 예약된 좌석은 선택 불가** 처리됩니다.  
 - 좌석은 최대 4개까지 선택할 수 있고, UI 상에서 선택 상태를 명확하게 시각화하였습니다.  
 - 예약 요청 시, `/api/reservation/create`를 통해 백엔드에 예약 정보를 저장하고  
   이어서 `TossPayments SDK`를 통해 **실제 결제 요청**을 수행합니다.  
 - 결제가 성공하면 `/payments/success`로 리디렉션되어 **QR코드가 발급**되며  
   마이페이지에서 티켓을 확인할 수 있습니다.



 ## [접근 제어 & 보안 로직]  

 - `결제 페이지 접근`은 사용자의 의도된 흐름을 벗어난 접근을 방지하기 위해 **sessionStorage 기반으로 제어**됩니다.  
 - 결제 페이지 진입 시, `sessionStorage.allowPaymentsAccess` 값이 true일 경우에만 접근을 허용합니다.  
 - 또한, `결제 완료 후에는 같은 세션에서 다시 접근하지 못하도록` 차단 로직이 적용되어 있어,  
   동일 좌석의 중복 결제나 URL 직접 접근 등 예상치 못한 접근을 방지할 수 있습니다.  
 - `/payments/success` 페이지는 예외로 처리하여, 결제 리디렉션 이후 정상적으로 티켓을 발급받을 수 있도록 구현하였습니다.  
 - 이러한 방식은 TossPayments의 리디렉션 흐름과도 충돌 없이 자연스럽게 연결되며,  
   실제 서비스와 유사한 사용자 보호 경험을 제공합니다.



 ## [마이페이지 기능]

  <img src="https://github.com/user-attachments/assets/0a569b78-f08d-4121-9d05-b541d4e78f48" width="250"/>
  <img src="https://github.com/user-attachments/assets/218ecda7-49a4-4d58-94a8-4179b2825905" width="250"/>
  <img src="https://github.com/user-attachments/assets/fc7a1bf8-611c-41e2-8842-e7cb41c1a8ba" width="250"/>


- 사용자는 마이페이지를 통해 자신의 **예매 내역, 작성한 리뷰, 상점 구매 이력**을 한눈에 확인할 수 있습니다.
- 각 콘텐츠는 탭(Ticket / Review / History)으로 분리되어 있으며, 선택 시 **페이지 전환 없이 부드럽게 렌더링**됩니다.
- 콘텐츠는 모두 **티켓 스타일 카드 UI**로 구성되어 있어, 시각적으로 일관된 사용자 경험을 제공합니다.
- 마이페이지 좌측에는 고정형 푸터(`MypageFooter`)가 위치하며,  
  이 푸터는 **1024px 이상의 데스크탑 환경에서만 표시**됩니다.
- 또한 로그인 상태에 따라 푸터의 내용이 달라지며,  
  **로그인하지 않은 경우 '회원 탈퇴' 버튼이 표시되지 않습니다.**
- 프로필 영역에서는 사용자의 **닉네임, 실명, 포인트 정보**가 출력되며,  
  이는 Supabase에서 실시간으로 가져온 데이터를 기반으로 합니다.
- 사용자 상태는 `Zustand`를 통해 전역 관리되며,  
  React 컴포넌트 내부에서는 `useUserStore`와 `useUserHook`을 조합해 유연하게 데이터를 활용합니다.

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

