import { serverSupabase } from '../supabase/supabase-server';

export async function getSeats(theaterId: string, seatIds?: string[]): Promise<string[]> {
  const supabase = await serverSupabase();

  if (!theaterId) {
    throw new Error('🚨 theaterId가 없습니다.');
  }

  // ✅ 1. theaterId를 UUID로 변환 (theaters 테이블에서 조회)
  const { data: theater, error: theaterError } = await supabase
    .from('theaters')
    .select('id')
    .eq('type', theaterId) // 'musicalB' 같은 type을 기준으로 검색
    .single();

  if (theaterError || !theater) {
    console.error('🚨 유효하지 않은 theaterId:', theaterId);
    throw new Error(`🚨 유효하지 않은 theaterId입니다: ${theaterId}`);
  }

  const validTheaterId = theater.id; // ✅ UUID 변환 완료

  // ✅ 2. reservations 테이블에서 해당 theater_id의 예약 좌석 조회
  let query = supabase.from('reservations').select('seat_number').eq('theater_id', validTheaterId);

  if (seatIds && seatIds.length > 0) {
    query = query.in('seat_number', seatIds);
  }

  const { data: seats, error: seatError } = await query;

  if (seatError) {
    console.error('🔥 getSeats 오류:', seatError.message);
    throw new Error(`🚨 좌석 정보를 불러오는 중 오류 발생: ${seatError.message}`);
  }

  return seats.map((seat) => seat.seat_number);
}
