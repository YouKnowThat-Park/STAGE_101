'use client';
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { useTheaterData } from '../../../hooks/theater/useTheaterData';
import 'react-calendar/dist/Calendar.css';
import '@/ui/calendar/calendar.css';

interface Props {
  theaterId: string;
  onDateTimeSelect: (date: Date, time: string) => void;
}

const TheaterCalendar = ({ theaterId, onDateTimeSelect }: Props) => {
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
    <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
      <h3 className="text-lg font-bold text-red-500">STEP 1</h3>
      <h2 className="text-2xl font-extrabold text-gray-900">날짜 선택</h2>

      <div className="border rounded-md p-4 mt-4 bg-gray-50">
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
          formatDay={(locale, date) => {
            // 한글 '일' 제거
            const dayString = date.toLocaleString('ko-KR', { day: 'numeric' });
            return dayString.replace('일', '');
          }}
          tileDisabled={({ date: tileDate, view }) => {
            if (view === 'month') {
              return !isSelectableDate(tileDate);
            }
            return false;
          }}
        />
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold text-red-500">STEP 2</h3>
        <h2 className="text-2xl font-extrabold text-gray-900">시간 선택</h2>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {showTimes.map((time) => (
          <button
            key={time}
            onClick={() => setSelectedTime(time)}
            className={`px-6 py-3 font-bold rounded-md transition ${
              selectedTime === time
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {time}
          </button>
        ))}
      </div>

      <button
        className={`mt-6 w-full py-3 rounded-lg font-bold text-white transition ${
          !date || !selectedTime
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-red-500 hover:bg-red-600 shadow-lg'
        }`}
        disabled={!date || !selectedTime}
        onClick={handleNext}
      >
        다음
      </button>
    </div>
  );
};

export default TheaterCalendar;
