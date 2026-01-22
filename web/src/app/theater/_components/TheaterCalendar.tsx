'use client';
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { useTheaterData } from '../../../hooks/theater/useTheaterData';
import 'react-calendar/dist/Calendar.css';
import '../../../ui/calendar/calendar.css';
import { TheaterProps } from 'src/types/theater/theater-type';

const TheaterCalendar = ({ theaterId, onDateTimeSelect }: TheaterProps) => {
  const { data: theaterData, isLoading, error } = useTheaterData(theaterId);
  const [date, setDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  if (isLoading) {
    return <p className="text-center text-gray-500">🎭 데이터 로딩 중...</p>;
  }
  if (!theaterData) {
    return <p className="text-center text-red-500">❌ 극장 정보를 불러올 수 없습니다.</p>;
  }

  // start/end
  const startDate = theaterData.start_date
    ? new Date(theaterData.start_date)
    : new Date('2025-01-01');
  const endDate = theaterData.end_date ? new Date(theaterData.end_date) : new Date('2025-12-31');

  // show_time 배열
  const showTimes: string[] = theaterData.show_time ? theaterData.show_time.split(',') : [];

  // 날짜 홀/짝 필터 (예시)
  const isSelectableDate = (currentDate: Date) => {
    if (currentDate < startDate) return false;
    const dayOfMonth = currentDate.getDate();
    const isEven = dayOfMonth % 2 === 0;

    if (theaterData.allowed_days === 'even') return isEven;
    if (theaterData.allowed_days === 'odd') return !isEven;
    return true;
  };

  // "다음" 버튼
  const handleNext = () => {
    if (!date || !selectedTime) return;
    onDateTimeSelect(date, selectedTime);
  };

  return (
    <div
      className="
        w-full max-w-2xl
        rounded-2xl
        bg-black/70
        backdrop-blur
        ring-1 ring-white/10
        shadow-[0_25px_80px_rgba(0,0,0,0.75)]
        px-6 py-8
        text-white
      "
    >
      {/* STEP 1 */}
      <div className="text-center">
        <p className="text-xs tracking-[0.3em] text-white/40">STEP 01</p>
        <h2 className="mt-1 text-2xl font-semibold">
          관람 날짜 <span className="text-[#C9A66B]">선택</span>
        </h2>
      </div>

      {/* 캘린더 */}
      <div className="mt-6 flex justify-center">
        <Calendar
          onChange={(value) => setDate(value as Date)}
          value={date}
          minDate={startDate}
          maxDate={endDate}
          prev2Label={null}
          next2Label={null}
          maxDetail="month"
          locale="ko-KR"
          className="w-full"
          formatDay={(locale, date) =>
            date.toLocaleString('ko-KR', { day: 'numeric' }).replace('일', '')
          }
        />
      </div>

      {/* STEP 2 */}
      <div className="mt-10 text-center">
        <p className="text-xs tracking-[0.3em] text-white/40">STEP 02</p>
        <h2 className="mt-1 text-2xl font-semibold">
          상영 <span className="text-[#C9A66B]">시간 선택</span>
        </h2>
      </div>

      {/* 시간 버튼 */}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {showTimes.map((time) => (
          <button
            key={time}
            onClick={() => setSelectedTime(time)}
            className={`
              rounded-xl px-6 py-3
              text-sm font-semibold
              ring-1 transition
              ${
                selectedTime === time
                  ? 'bg-[#C9A66B] text-black ring-[#C9A66B] shadow-[0_10px_30px_rgba(201,166,107,0.35)]'
                  : 'bg-white/5 text-white/80 ring-white/15 hover:bg-white/10'
              }
            `}
          >
            {time}
          </button>
        ))}
      </div>

      {/* 다음 버튼 */}
      <button
        disabled={!date || !selectedTime}
        onClick={handleNext}
        className={`
          mt-10 w-full rounded-xl py-4
          text-base font-bold transition
          ${
            !date || !selectedTime
              ? 'bg-white/10 text-white/40 cursor-not-allowed'
              : 'bg-[#C9A66B] text-black hover:brightness-110 shadow-[0_20px_50px_rgba(201,166,107,0.35)]'
          }
        `}
      >
        다음 단계로
      </button>
    </div>
  );
};

export default TheaterCalendar;
