// lib/supabaseSubscription.ts

import { Database } from '@/types/supabase-type';
import { createBrowserClient } from '@supabase/ssr';

export const supabaseSubscription = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// ✅ 좌석 예약 실시간 상태 저장 (전역 변수)
const reservedSeats: Set<string> = new Set();
const listeners: ((seats: string[]) => void)[] = [];

// ✅ 구독이 한 번만 실행되도록 하는 플래그
let isSubscribed = false;

// ✅ (1) 초기 예약된 좌석 불러오기 함수
export async function fetchSeats() {
  const { data, error } = await supabaseSubscription.from('reservations').select('seat_number');

  if (error) {
    console.error('초기 좌석 정보 불러오기 실패:', error);
    return;
  }

  // ✅ 초기 데이터 Set에 저장
  data.forEach((seat) => reservedSeats.add(seat.seat_number));
  listeners.forEach((listener) => listener(Array.from(reservedSeats))); // ✅ 초기 데이터 전달
}

// ✅ (2) 구독 시작 함수 (한 번만 실행됨!)
export function subscribeToSeats(listener: (seats: string[]) => void) {
  listeners.push(listener);
  listener(Array.from(reservedSeats)); // ✅ 초기 데이터 전달

  if (!isSubscribed) {
    isSubscribed = true; // ✅ 구독 중복 실행 방지

    // ✅ 초기 좌석 데이터 먼저 가져오기
    fetchSeats().then(() => {
      supabaseSubscription
        .channel('reservations')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'reservations' },
          (payload) => {
            if (payload.new?.seat_number) {
              reservedSeats.add(payload.new.seat_number);
              listeners.forEach((l) => l(Array.from(reservedSeats))); // ✅ 실시간 업데이트 반영
            }
          },
        )
        .subscribe();
    });
  }
}
