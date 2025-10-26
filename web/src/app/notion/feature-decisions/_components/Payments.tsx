'use client';

import { useState } from 'react';

const Payments = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white px-4">
      <div className="max-w-2xl mx-auto border border-gray-300 rounded-md shadow-md mb-6">
        {/* 드롭다운 토글 버튼 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left px-6 py-4 bg-gray-100 hover:bg-gray-200 font-semibold text-lg transition flex justify-between items-center"
        >
          <span>✅ 결제 시스템 (Toss Payments) 적용 이유</span>
          <span>{isOpen ? '▲' : '▼'}</span>
        </button>

        {/* 내용 */}
        {isOpen && (
          <div className="px-6 py-5 bg-white space-y-4 text-gray-800 text-sm leading-relaxed">
            <h3 className="font-bold text-base">Toss Payments 결제 연동</h3>

            <div>
              <p className="font-semibold">📌 선택 이유</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>실제 결제와 거의 동일한 테스트 환경을 제공</li>
                <li>프론트엔드에서 쉽고 빠르게 결제 연동 가능</li>
                <li>국내 사용자에게 익숙한 결제 수단 제공</li>
                <li>안정적이고 문서화가 잘 되어 있어 도입이 용이함</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold">⚙️ 주요 구현 내용</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>결제 페이지에서 사용자 결제 정보 입력 및 처리</li>
                <li>성공/실패 콜백 처리 및 상태 저장</li>
                <li>Supabase를 통한 결제 기록 관리</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold">💬 회고</p>
              <p>
                실제 결제 환경과 유사한 구조를 통해 프론트엔드 개발 단계에서도 안전하고 신뢰성 있게
                결제 프로세스를 테스트할 수 있었습니다. 향후 실서비스 확장 시에도 유연하게 적용할 수
                있다고 판단합니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
