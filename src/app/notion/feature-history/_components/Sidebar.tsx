'use client';

import React, { useState } from 'react';

const Sidebar = () => {
  const [openSidebarInfo, setOpenSidebarInfo] = useState(false);

  return (
    <div className="bg-white  px-4">
      <div className="max-w-2xl mx-auto border border-gray-300 rounded-md shadow-md ">
        {/* 사이드바 정보 드롭다운 */}
        <button
          onClick={() => setOpenSidebarInfo(!openSidebarInfo)}
          className="w-full text-left px-6 py-4 bg-gray-100 hover:bg-gray-200 font-semibold text-lg transition flex justify-between items-center"
        >
          <span>✅사이드바 위치 전환</span>
          <span>{openSidebarInfo ? '▲' : '▼'}</span>
        </button>

        {openSidebarInfo && (
          <div className="px-6 py-5 bg-white space-y-4 text-gray-800 text-sm leading-relaxed">
            <h3 className="font-bold text-base">2. 사이드바 좌우 전환 기능</h3>

            <div>
              <p className="font-semibold">📌 기획 의도</p>
              <p>
                기존 페이지들은 대부분 오른손잡이를 기준으로 UI가 구성되어 있었습니다. 사이드바를
                왼쪽/오른쪽으로 전환 가능하게 만들어 왼손잡이와 오른손잡이 모두의 편의성을
                고려해보자는 의도에서 출발했습니다.
              </p>
              <p className="mt-2">{`"두 마리의 토끼를 잡아보자!" 라는 생각이었습니다 🐇🐇`}</p>
            </div>

            <div>
              <p className="font-semibold">🚫 포기한 이유</p>
              <ul className="list-disc ml-5 space-y-1 text-sm leading-relaxed">
                <li>
                  ⛔ <strong>접근성 우선순위 문제</strong> – 소극장 예약 페이지의 특성상 유저는 오랜
                  시간 체류하지 않기 때문에, 왼손잡이 편의성 향상이 체감되지 않을 가능성이
                  높았습니다.
                </li>
                <li>
                  🎨 <strong>디자인 충돌 + 미완성</strong> – 아이디어는 좋았지만 전체 레이아웃과
                  어울리는 디자인이 명확히 떠오르지 않았고, 디자인도 50% 수준으로 완성된
                  상태였습니다. 기존 UI와 통일성도 떨어질 우려가 있었습니다.
                </li>
                <li>
                  🧱 <strong>이미 구조 완성</strong> – 페이지 대부분이 어느 정도 완성된 뒤 떠오른
                  아이디어라, 구조 변경 시 너무 많은 수정이 필요했습니다. 푸터처럼 위치가 고정된
                  컴포넌트들과도 충돌 가능성이 있었어요.
                </li>
                <li>
                  🕓 <strong>시간 부족</strong> – 전면적인 구조 변경은 시간이 많이 필요한 작업이었기
                  때문에, 마감 일정 상 도입을 미루기로 결정했습니다.
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold">💬 마무리</p>
              <p>
                사용자 편의성을 확장하려는 좋은 시도였지만, 프로젝트의 목적과 현실적인 리소스를
                고려해 도입을 보류하게 되었습니다. 추후 리뉴얼 시엔 고려해볼 가치가 충분한 기능이라
                생각합니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
