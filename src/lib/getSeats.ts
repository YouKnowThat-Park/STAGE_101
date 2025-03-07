import { serverSupabase } from '@/supabase/supabase-server';

export async function getSeats(theaterId: string, seatIds?: string[]): Promise<string[]> {
  const supabase = await serverSupabase();

  if (!theaterId) {
    throw new Error('🚨 theaterId가 없습니다.');
  }

  // ✅ 1. theaterId를 UUID로 변환
  const { data: theater, error: theaterError } = await supabase
    .from('theaters')
    .select('id')
    .eq('type', theaterId)
    .single();

  if (theaterError || !theater) {
    console.error('🚨 유효하지 않은 theaterId:', theaterId);
    throw new Error(`🚨 유효하지 않은 theaterId입니다: ${theaterId}`);
  }

  const validTheaterId = theater.id;

  // ✅ 2. reservations 테이블에서 해당 theater_id의 예약 좌석 조회
  let query = supabase.from('reservations').select('seat_number').eq('theater_id', validTheaterId);

  // ✅ 특정 좌석만 조회해야 할 경우
  if (seatIds && seatIds.length > 0) {
    query = query.in('seat_number', seatIds);
  }

  const { data: seats, error: seatError } = await query;

  if (seatError) {
    console.error('🔥 getSeats 오류:', seatError.message);
    throw new Error(`🚨 좌석 정보를 불러오는 중 오류 발생: ${seatError.message}`);
  }

  if (!seats || seats.length === 0) {
    console.error('🚨 해당 좌석 없음:', seatIds);
    throw new Error(`🚨 요청한 좌석을 찾을 수 없습니다: ${seatIds}`);
  }

  // ✅ seat_number만 추출하여 `string[]` 배열로 반환
  return seats.map((seat) => seat.seat_number);
}
