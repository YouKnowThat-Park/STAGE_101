'use client';

import { useState } from 'react';

const SeatSyncIssue = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white px-4">
      <div className="max-w-2xl mx-auto border border-gray-300 rounded-md shadow-md mb-6">
        {/* 드롭다운 토글 버튼 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left px-6 py-4 bg-gray-100 hover:bg-gray-200 font-semibold text-lg transition flex justify-between items-center"
        >
          <span>✅ Supabase 실시간 좌석 UI 반영 실패</span>
          <span>{isOpen ? '▲' : '▼'}</span>
        </button>

        {isOpen && (
          <div className="px-6 py-5 bg-white space-y-4 text-gray-800 text-sm leading-relaxed">
            <h3 className="font-bold text-base">🎯 문제 상황</h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>좌석 데이터는 정상적으로 Supabase에서 가져오나 UI에 반영되지 않음</li>
              <li>
                콘솔 확인 시 <code>fetchSeats()</code>가 올바른 데이터를 반환하지 않음
              </li>
              <li>
                <code>setReservedSeats</code> 호출했지만 <code>undefined</code>가 들어가면서 상태
                미반영
              </li>
              <li>
                TypeScript 오류 발생:{' '}
                <code>
                  {`'void' 형식의 인수는 'SetStateAction&lt;string[]&gt;' 형식의 매개변수에 할당될 수
                  없습니다`}
                </code>
              </li>
            </ul>

            <h3 className="font-bold text-base">🔍 원인 분석</h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>
                <code>fetchSeats()</code> 함수가 정상적으로 <code>string[]</code> 반환을 하지 않음
              </li>
              <li>
                오류 발생 시 <code>return;</code>만 있어 <code>undefined</code> 반환
              </li>
              <li>
                <code>useEffect</code> 내 <code>setReservedSeats(undefined)</code> 호출 → 무시됨
              </li>
            </ul>

            <h3 className="font-bold text-base">💡 해결 방법</h3>
            <div className="space-y-2">
              <p className="font-semibold">✅ 1. fetchSeats 함수 수정</p>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">{`
export async function fetchSeats(theaterId: string): Promise<string[]> {
  if (!theaterId) return [];

  const { data, error } = await browserSupabase
    .from('reservations')
    .select('seat_number')
    .eq('theater_id', theaterId);

  if (error || !data) return [];

  return data.map((s) => s.seat_number);
}
              `}</pre>

              <p className="font-semibold">✅ 2. useEffect 내부에서 fetchSeats를 await 처리</p>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">{`
useEffect(() => {
  async function fetchData() {
    const seats = await fetchSeats(theaterId);
    setReservedSeats(seats);
  }

  fetchData();
}, [theaterId]);
              `}</pre>
            </div>

            <h3 className="font-bold text-base">📌 적용 결과</h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>좌석 데이터가 UI에 정상 반영됨</li>
              <li>선택된 좌석은 회색으로 표시되고 선택 불가</li>
              <li>TypeScript 에러도 해결됨 (void → string[])</li>
            </ul>

            <h3 className="font-bold text-base">💬 회고</h3>
            <p>
              비동기 함수에서 반환 타입이 명확하지 않으면 상태 업데이트가 무시되거나 앱이 깨질 수
              있음. 항상 안전한 기본값 (ex. 빈 배열)을 반환하고, <code>await</code> 없이 상태
              설정하는 실수를 피할 것.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatSyncIssue;
