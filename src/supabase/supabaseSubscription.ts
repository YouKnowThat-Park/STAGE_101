import { Database } from '@/types/supabase-type';
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
export async function fetchSeats(theaterId: string): Promise<string[]> {
  console.log(`🔍 [fetchSeats] 실행됨: ${theaterId}`);

  if (!theaterId) {
    console.error('🚨 theaterId가 없습니다.');
    return []; // ✅ 반드시 빈 배열 반환!
  }

  const { data: theater, error: theaterError } = await supabaseSubscription
    .from('theaters')
    .select('id')
    .eq('type', theaterId)
    .single();

  if (theaterError || !theater) {
    console.error(`🚨 ${theaterId} UUID 변환 실패:`, theaterError);
    return []; // ✅ 반드시 빈 배열 반환!
  }

  const validTheaterId = theater.id;
  console.log(`✅ [fetchSeats] UUID 변환 성공: ${validTheaterId}`);

  const { data, error } = await supabaseSubscription
    .from('reservations')
    .select('seat_number')
    .eq('theater_id', validTheaterId);

  if (error || !data) {
    console.error(`🚨 ${theaterId} 좌석 불러오기 실패:`, error);
    return []; // ✅ 에러 발생 시에도 빈 배열 반환!
  }

  console.log(`📡 [fetchSeats] 데이터 수신 완료:`, data);

  return data.map((s) => s.seat_number); // ✅ 반드시 `string[]` 반환!
}
// ✅ 리스너들에게 데이터 전파
function notifyListeners(theaterId: string) {
  const seatsArray = Array.from(reservedSeatsMap[theaterId] || []);
  console.log(`📢 [notifyListeners] ${theaterId} 좌석 업데이트 실행됨:`, seatsArray);

  if (!listenersMap[theaterId]) return;

  listenersMap[theaterId].forEach((listener) => {
    if (typeof listener === 'function') {
      console.log(`✅ [notifyListeners] 리스너 실행됨! 좌석:`, seatsArray);
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
export function subscribeToSeats(theaterId: string, listener: (seats: string[]) => void) {
  if (!theaterId) return;

  if (!listenersMap[theaterId]) listenersMap[theaterId] = [];
  listenersMap[theaterId].push(listener);

  console.log(`🎯 [subscribeToSeats] 리스너 등록됨: ${theaterId}`);

  fetchSeats(theaterId).then(() => {
    setTimeout(() => {
      const seats = Array.from(reservedSeatsMap[theaterId] || []);
      console.log(`✅ [subscribeToSeats] 초기 데이터 전달 (강제 업데이트 포함):`, seats);

      if (seats.length > 0) {
        listener([...seats]); // ✅ 강제 업데이트
      } else {
        console.warn(`⚠️ [subscribeToSeats] 초기 데이터가 비어 있음!`);
      }
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
        if (payload.new?.seat_number) {
          console.log(`🚀 [subscribeToSeats] 새로운 좌석 추가됨:`, payload.new.seat_number);
          reservedSeatsMap[theaterId]?.add(payload.new.seat_number);
          notifyListeners(theaterId);
        }
      },
    )
    .subscribe();
}
