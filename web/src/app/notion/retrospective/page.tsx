// components/PageSlider.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const pages = [
  {
    title: 'INTRO · 시작의 이유',
    content: `
안녕하세요.
이번 STAGE_101 프로젝트를 기획하고 개발한 프론트엔드 개발자 박우석입니다.

영화를 좋아하고, 감상을 나누는 걸 즐기는 저에게
CGV나 메가박스처럼 좌석을 예약하고,
왓챠나 네이버 영화처럼 리뷰를 남길 수 있는 서비스를
언젠가는 꼭 만들어보고 싶다는 바람이 늘 마음 한켠에 자리잡고 있었습니다.

하지만 처음부터 방대한 데이터를 다루고 모든 기능을 구현하기보다는,
규모는 작지만 감성을 담은,
저만의 작은 극장 서비스를 만들어보자는 마음으로 STAGE_101을 시작하게 되었습니다.
    `,
  },
  {
    title: '기획 · 상상에서 출발한 서비스',
    content: `
처음 구상했던 STAGE_101은
5층짜리 소극장을 배경으로 한 꽤나 풍성한 상상에서 출발했습니다.
층별로 뮤지컬관, 연극관, 영화관이 나뉘고,
1층에는 카페와 굿즈샵, 2층에는 고객센터와 식당이 자리한 구성 속에
실시간 채팅, 관리자 계정, 포인트 적립, 리뷰 기능까지—
상용 서비스에 준하는 다양한 요소를 담고자 했습니다.

그러나 실제 구현 과정에서 우선순위와 사용성을 다시 고민하게 되었고,
**“작은 기능부터 확실하게 구현하자”**는 방향으로 무게를 조정했습니다.
결과적으로 서비스의 전체 규모는 축소되었지만,
그 과정 속에서 더 분명해진 것은 바로 사용자 경험이었습니다.

예약의 흐름, 리뷰 방식, 포인트 활용 등
실제 유저가 어떻게 느끼고 사용할지를 끊임없이 상상하고 반영하며,
정말 누군가가 사용하게 될 서비스를 만들고 있다는 감각을 처음으로 온전히 느낄 수 있었습니다.

    `,
  },
  {
    title: '구현 · 즐거움과 발견',
    content: `
부트캠프를 수료하기 전까지는 기능 구현이 제한된 환경 속에서 개발을 해왔습니다.
과제는 정해진 틀에 맞춰야 했고, 팀 프로젝트에서는 전체 중 일부만 담당했기 때문에
‘내가 주도적으로 서비스를 만들고 있다’는 감각은 상대적으로 희미했습니다.
팀원 간 연동 문제나 프로젝트 완성도에서 오는 아쉬움도 분명 존재했습니다.

그래서 수료 이후, STAGE_101을 개인 프로젝트로 진행하며
서비스의 구조를 처음부터 끝까지 직접 설계하고 구현하는 경험을 할 수 있었습니다.
특히 즐거웠던 점은, 내가 상상한 기능들을 내 손으로 구현해보며
실제로 우리가 사용하는 서비스에서 경험할 수 있는 흐름들을 직접 만들어볼 수 있었다는 점이었습니다.
이론을 넘어, 실전에서의 판단과 설계가 요구되는 순간들이 진짜 개발자의 감각을 길러주었습니다.

그 중 가장 인상 깊었던 건,
이번 프로젝트를 통해 처음으로 **“유저가 어디까지 접근할 수 있을까?”**라는 질문을 스스로에게 던지게 된 점입니다.
단순히 로그인 여부만 따지는 것이 아니라,
결제를 완료한 사용자만 특정 페이지에 접근할 수 있도록 제어하고,
URL 직접 입력이나 뒤로 가기로 인해 중복 결제가 발생하지 않도록 흐름을 설계하는 과정은
처음으로 사용자와 시스템 사이의 경계를 세우는 작업이 얼마나 중요하고 흥미로운지 깨닫게 해주었습니다.
    `,
  },
  {
    title: '트러블 · 그리고 성장의 시간',
    content: `
물론 쉽지만은 않았습니다.
초기 계획을 축소한 후에도, 구현 과정에서 계속해서 계획을 수정해야 하는 상황이 반복되었습니다.
특히 백엔드로 사용한 Supabase의 스키마 구조를 여러 차례 수정하게 되면서,
하나의 기능(A)을 위해 구조를 변경하면
그와 연결된 다른 기능(B, C)에서 예상치 못한 문제가 발생하는 일이 잦았습니다.

코드를 작성하면서는 A 기능에만 집중하게 되다 보니
자연스럽게 B와 C까지 고려하지 못했고,
결국 연쇄적인 수정이 반복되며 프로젝트 구조 전체를 몇 번이고 다시 뜯어고쳐야 했습니다.
    `,
  },
  {
    title: '압박 · 무게와 마주한 나',
    content: `
    또한, 시간이 갈수록 느껴지는 현실적인 압박도 무시할 수 없었습니다.
취업 준비와 프로젝트 사이의 균형 속에서
“얼마나 더 시간을 써도 괜찮을까?”라는 고민이 끊이지 않았습니다.
한두 명씩 주변에서 취업 소식이 들려올수록
개인 프로젝트에 전념하는 제가 금전적인 수익 없이 시간을 쓰고 있다는 불안감과 조급함도 커졌습니다.

그와 함께, 스스로에게 거는 기대감과 주변의 기대도 저를 더 무겁게 만들었습니다.
‘이 정도 시간을 들였으면 멋진 결과물이 나와야 하지 않을까?’
‘너 정도면 잘 만들었겠지’라는 말들이
처음에는 응원이었지만, 어느 순간부터는 작은 부담으로, 큰 압박으로 다가오기 시작했습니다.

내가 이 프로젝트를 얼마나 진심으로 만들고 있는지를 설명하지 않아도,
결국 결과로 보여줘야 한다는 생각에 더 완성도에 집착했고,
때로는 내가 만든 결과물보다 **‘내가 만들어야 할 무게’**에 짓눌리는 순간들도 많았습니다.
`,
  },
  {
    title: '마무리 · 증명과 다짐의 페이지',
    content: `
하지만 그럼에도 포기하지 않았습니다.
수없이 날을 새우고, 작은 에러 하나에 몇 시간을 보내도
계속 이 프로젝트를 붙잡을 수 있었던 건,
이건 누가 시켜서 하는 일이 아니라, 내가 원해서 시작한 일이었기 때문입니다.

프리드리히 니체는 말했습니다.
"나를 죽이지 못한 고통은 나를 더 강하게 만든다."
그리고 베르세르크는 이렇게 말합니다.
"도망쳐서 도착한 곳에는 낙원이란 있을 수 없다."

저는 그 말들을 마음에 새기며,
불확실함과 압박 속에서도 도망치지 않고 마주하기로 선택했습니다.

STAGE_101은 제게 단순한 프로젝트가 아닌,
‘내가 어떤 개발자가 되고 싶은지’에 대한 답이자 증명이었습니다.
앞으로도 저는, 정답을 쫓기보다
고민하고 마주하며, 더 나은 해답을 찾는 개발자로 성장해가겠습니다.

이상, 한 편의 극을 마치는 개발자 박우석이었습니다.
시청해주셔서 감사합니다.
    `,
  },
];

export default function PageSlider() {
  const [pageIndex, setPageIndex] = useState(0);

  const next = () => setPageIndex((prev) => Math.min(prev + 1, pages.length - 1));
  const prev = () => setPageIndex((prev) => Math.max(prev - 1, 0));

  return (
    <div className="w-full max-w-screen-md mx-auto px-4 py-6 text-center bg-white text-black flex flex-col items-center justify-center">
      <div className="mb-2 text-xs sm:text-sm text-gray-500">
        Page {pageIndex + 1} / {pages.length} · {pages[pageIndex].title}
      </div>

      <div className="w-full max-h-[60vh] min-h-[250px] overflow-y-auto px-1 sm:px-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={pageIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <p className="whitespace-pre-wrap text-base sm:text-lg leading-relaxed text-left">
              {pages[pageIndex].content}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2 sm:gap-4 mt-6 flex-wrap">
        <button
          onClick={prev}
          disabled={pageIndex === 0}
          className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-40 transition"
        >
          ← 이전
        </button>
        <button
          onClick={next}
          disabled={pageIndex === pages.length - 1}
          className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-40 transition"
        >
          다음 →
        </button>
      </div>
    </div>
  );
}
