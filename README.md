**# STAGE_101

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

## 📌 프로젝트 소개

**'소극장 좌석 예약 시스템'**은 사용자 중심의 흐름 설계, 실시간 데이터 처리, 포인트 시스템 등  
상용 서비스 수준의 기능을 직접 구현해본 개인 프로젝트입니다.  
Next.js와 Supabase 기반으로 구축하였으며, 실시간 좌석 예약, 결제 흐름, 상점 연동 등  
다양한 기능을 포함한 End-to-End 프로젝트입니다.

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

### Utilities
![Day.js](https://img.shields.io/badge/Day.js-FF2D20?style=for-the-badge)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-EC5990?style=for-the-badge)
![Zod](https://img.shields.io/badge/Zod-2C2C2C?style=for-the-badge)
---

## 🧩 나의 역할

- 전체 기획 및 서비스 흐름 설계  
- UI/UX 디자인 및 퍼블리싱  
- 프론트엔드 구현 (화면, 상태 관리, 데이터 연결)  
- Supabase를 활용한 백엔드 처리 (실시간 DB 처리, 트리거, 인증 등)  
- 테스트 및 사용자 시나리오 검증

---

## 📸 화면 미리보기

> 추후 이미지 삽입 가능  
> 예: `/public/images/seat-selection.png` 등
>
> [로그인 , 회원가입]  
 <p>
  <img src="https://github.com/user-attachments/assets/50780159-6d81-4c3b-89fa-3b038daa01b1" width="48%" />
  <img src="https://github.com/user-attachments/assets/14dbf2ae-c01f-42f4-ba34-ba5a520e3fc7" width="48%" />
</p>
> - 로그인 페이지에서는 **카카오 / 구글 소셜 로그인 기능**을 중심으로,  
>  사용자가 빠르게 서비스를 이용할 수 있도록 간편 인증 방식을 적용했습니다.  
> - 회원가입은 **3단계에 걸쳐 정보를 입력하는 스텝-바이-스텝 방식**으로 설계되었습니다.  
>  이메일, 비밀번호부터 휴대폰번호, 생년월일까지 순차적으로 입력하게 하여  
>  사용자 피로도를 낮추고 입력 실수를 줄이기 위한 UX를 적용했습니다.  
> - 각 단계마다 유효성 검사를 즉시 수행하고, 에러 발생 시 해당 필드로 자동 포커스되도록 처리하여  
>  사용자에게 더 직관적이고 친절한 회원가입 경험을 제공합니다.

> [리뷰 & 리뷰 작성]  
> ![image](https://github.com/user-attachments/assets/24454db4-7ba6-44f7-926e-de72056e48c9)  
> 
> - `framer-motion`을 활용해 리뷰 인터랙션에 부드러운 애니메이션을 적용하여 시각적 완성도를 높였습니다.  
> - 기존에는 리뷰를 별도의 페이지에서 작성했지만, 이를 **모달 구조로 변경**하고 애니메이션을 추가해  
>   리뷰 작성 모달이 등장하면 기존 모달은 좌측으로 자연스럽게 이동하며 **두 개의 모달이 동시에 유지되는 UI**를 구현했습니다.  
> - 리뷰 작성 시, 사용자는 **실명/닉네임 선택**, **포스터/프로필 이미지 설정** 등 원하는 정보만 노출할 수 있도록 커스터마이징이 가능합니다.  
> - 또한, 작성 중 리뷰가 실제로 어떻게 보여질지 **실시간으로 확인 가능한 미리보기 기능**을 추가하여,  
>   사용자에게 더 직관적이고 편리한 작성 경험을 제공합니다.
---

## 🔗 배포 링크 & 데모

- **배포 주소:** [https://stage-101.vercel.app/](https://stage-101.vercel.app/)  
- **GitHub:** [https://github.com/YouKnowThat-Park](https://github.com/YouKnowThat-Park)

---

## 📝 회고 & 배운 점

- 실시간 데이터 반영과 상태 관리의 복잡함을 경험하며 **사용자 중심 로직**에 대한 감각 향상  
- 1인 개발로 인해 전반적인 **서비스 구조와 흐름을 설계하는 능력** 강화  
- 기술을 사용하는 것에서 끝나지 않고, **실제 사용자 시나리오를 고민하는 개발자로서의 성장**

---

## 🙌 Thank You

**혼자서 시작했지만, 이 프로젝트를 통해 ‘사용자를 위한 개발’의 재미를 진심으로 느꼈습니다.  
언제나 배우고, 계속해서 개선하며 성장하는 개발자가 되겠습니다.**

