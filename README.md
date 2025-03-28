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

