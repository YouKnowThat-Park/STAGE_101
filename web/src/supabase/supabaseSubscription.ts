import { Database } from '../types/supabase-type';
import { createBrowserClient } from '@supabase/ssr';

export const supabaseSubscription = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// ✅ 극장별 예약된 좌석 저장
const reservedSeatsMap: Record<string, Set<string>> = {};
const listenersMap: Record<string, ((seats: string[]) => void)[]> = {};
const subscriptions: Record<string, ReturnType<typeof supabaseSubscription.channel>> = {};

// ✅ 특정 극장의 예약된 좌석 불러오기
export async function fetchSeats(
  theaterId: string,
  viewedAt: string,
  showTime: string,
): Promise<string[]> {
  if (!theaterId || !viewedAt || !showTime) {
    console.error('🚨 필수 데이터 누락 (theaterId, viewedAt, showTime)');
    return []; // ✅ 빈 배열 반환
  }

  const { data: theater, error: theaterError } = await supabaseSubscription
    .from('theaters')
    .select('id')
    .eq('type', theaterId)
    .single();

  if (theaterError || !theater) {
    console.error(`🚨 ${theaterId} UUID 변환 실패:`, theaterError);
    return [];
  }

  const validTheaterId = theater.id;

  // ✅ `viewed_at`과 `show_time` 필터 추가!
  const { data, error } = await supabaseSubscription
    .from('reservations')
    .select('seat_number')
    .eq('theater_id', validTheaterId)
    .eq('viewed_at', viewedAt) // 날짜 필터 추가
    .eq('show_time', showTime) // 시간 필터 추가
    .in('status', ['pending', 'confirmed']);

  if (error || !data) {
    console.error(`🚨 ${theaterId} 좌석 불러오기 실패:`, error);
    return [];
  }

  return data.map((s) => s.seat_number);
}

// ✅ 리스너들에게 데이터 전파
function notifyListeners(theaterId: string) {
  const seatsArray = Array.from(reservedSeatsMap[theaterId] || []);

  if (!listenersMap[theaterId]) return;

  listenersMap[theaterId].forEach((listener) => {
    if (typeof listener === 'function') {
      listener(seatsArray);
    } else {
      console.error('🚨 [notifyListeners] listener is not a function:', listener);
    }
  });

  // 🚀 `setTimeout`으로 리스너 실행 후 상태 확인
  setTimeout(() => {
    console.log(
      `🔄 [notifyListeners] 리스너 실행 후 reservedSeatsMap 상태 확인:`,
      Array.from(reservedSeatsMap[theaterId] || []),
    );
  }, 100);
}

// ✅ 특정 극장의 좌석 실시간 구독
export function subscribeToSeats(
  theaterId: string,
  viewedAt: string,
  showTime: string,
  listener: (seats: string[]) => void,
) {
  if (!theaterId || !viewedAt || !showTime) return; // ✅ 필수 값 체크

  if (!listenersMap[theaterId]) listenersMap[theaterId] = [];
  listenersMap[theaterId].push(listener);

  fetchSeats(theaterId, viewedAt, showTime).then((seats) => {
    // ✅ 올바른 인수 전달
    reservedSeatsMap[theaterId] = new Set(seats);
    setTimeout(() => {
      console.log(`✅ [subscribeToSeats] 초기 데이터 전달 (강제 업데이트 포함):`, seats);
      listener([...seats]);
    }, 100);
  });

  if (subscriptions[theaterId]) return;

  subscriptions[theaterId] = supabaseSubscription
    .channel(`reservations_${theaterId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'reservations',
        filter: `theater_id=eq.${theaterId}`,
      },
      (payload) => {
        if (
          payload.new?.seat_number &&
          payload.new.viewed_at === viewedAt && // ✅ 날짜별 좌석 필터링
          payload.new.show_time === showTime // ✅ 시간별 좌석 필터링
        ) {
          console.log(`🚀 [subscribeToSeats] 새로운 좌석 추가됨:`, payload.new.seat_number);
          reservedSeatsMap[theaterId]?.add(payload.new.seat_number);
          notifyListeners(theaterId);
        }
      },
    )
    .subscribe();
}
