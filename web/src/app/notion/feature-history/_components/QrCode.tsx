'use client';

import React, { useState } from 'react';

const QrCode = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white px-4 ">
      <div className="max-w-2xl mx-auto border border-gray-300 rounded-md shadow-md">
        {/* 제목 버튼 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left px-6 py-4 bg-gray-100 hover:bg-gray-200 font-semibold text-lg transition flex justify-between items-center"
        >
          <span>✅QR코드 로그인 </span>
          <span>{isOpen ? '▲' : '▼'}</span>
        </button>

        {/* 펼쳐지는 내용 */}
        {isOpen && (
          <div className="px-6 py-5 bg-white space-y-4 text-gray-800 text-sm leading-relaxed">
            <h3 className="font-bold text-base">1. QR 코드 로그인 기능</h3>

            <div>
              <p className="font-semibold">📌 기획 의도</p>
              <p>
                로그인 페이지에서 QR 코드를 생성해 사용자가 간편하게 로그인할 수 있도록 구현하고
                싶었습니다. 특히 PC로 로그인할 때, 모바일로 빠르게 인증하는 UX 개선 목적이었습니다.
              </p>
            </div>

            <div>
              <p className="font-semibold">🚫 적용하지 못한 이유</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>⏱ 시간 부족</li>
                <li>📱 모바일 인증 앱 필요성</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold">💡 고민했던 점</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>
                  QR 코드를 보여주는 것까진 가능할 것 같았지만, 인증해줄 앱 또는 절차가 필요했음
                </li>
                <li>휴대폰 기본 카메라만으로 인증 가능한지 확신이 부족했음</li>
                <li>
                  QR이 랜덤 생성되었을 때, 이를 인증한 사용자가 실제 어떤 유저인지 서버에서 식별하는
                  구조에 대한 고민이 해결되지 않았음
                </li>
              </ul>
              <p className="mt-2">
                결과적으로 인증 로직에 대한 뚜렷한 구조가 부족했고, 시간 상의 제약으로 도입을
                보류했습니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QrCode;
