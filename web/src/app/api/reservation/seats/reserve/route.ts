import { serverSupabase } from '../../../../../supabase/supabase-server';
import { NextResponse } from 'next/server';
import { ReserveType } from '../../../../../types/reserve-type';

export async function POST(req: Request) {
  const supabase = await serverSupabase();

  try {
    // JSON 데이터 파싱
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('🚨 [서버] JSON 파싱 오류:', parseError);
      return NextResponse.json({ error: '잘못된 요청 형식 (JSON 파싱 실패)' }, { status: 400 });
    }

    // 필드 구조 분해
    const { seats, user_id, theater_id, total_price, viewed_at, show_time } = body;

    // 필수 데이터 검증
    if (!seats || !Array.isArray(seats) || seats.length === 0) {
      return NextResponse.json({ error: '필수 정보 누락: seats' }, { status: 400 });
    }
    if (!user_id) {
      return NextResponse.json({ error: '필수 정보 누락: user_id' }, { status: 400 });
    }
    if (!theater_id) {
      return NextResponse.json({ error: '필수 정보 누락: theater_id' }, { status: 400 });
    }
    if (!viewed_at) {
      return NextResponse.json({ error: '필수 정보 누락: viewed_at' }, { status: 400 });
    }
    if (!show_time) {
      return NextResponse.json({ error: '필수 정보 누락: show_time' }, { status: 400 });
    }
    if (total_price === undefined || isNaN(Number(total_price)) || Number(total_price) <= 0) {
      return NextResponse.json(
        { error: '필수 정보 누락 또는 유효하지 않은 total_price' },
        { status: 400 },
      );
    }

    // 🎯 theaters 테이블에서 실제 UUID(id) 조회
    const { data: theaterData, error: theaterError } = await supabase
      .from('theaters')
      .select('id')
      .eq('type', theater_id)
      .single();

    if (theaterError || !theaterData) {
      return NextResponse.json({ error: '유효하지 않은 theater_id' }, { status: 400 });
    }

    const validTheaterId = theaterData.id;

    // ✅ `viewed_at`을 ISO 8601 형식으로 변환
    const formattedViewedAt = new Date(viewed_at).toISOString();

    // ✅ 이미 예약된 좌석이 있는지 체크
    const { data: existingSeats, error: checkError } = await supabase
      .from('reservations')
      .select('seat_number, status')
      .in('seat_number', seats)
      .eq('theater_id', validTheaterId)
      .eq('viewed_at', formattedViewedAt)
      .eq('show_time', show_time)
      .in('status', ['pending', 'confirmed']); // ✅ 이미 예약된 좌석만 체크

    if (checkError) {
      console.error('🚨 [서버] 좌석 예약 상태 확인 중 오류:', checkError);
      return NextResponse.json({ error: '좌석 상태 확인 실패' }, { status: 500 });
    }

    if (existingSeats.length > 0) {
      console.error('🚨 [서버] 이미 예약된 좌석이 있음:', existingSeats);
      return NextResponse.json({ error: '이미 예약된 좌석이 있습니다.' }, { status: 409 });
    }

    // ✅ 'pending' 상태로 좌석 추가
    const insertData: ReserveType[] = seats.map((seat: string) => ({
      seat_number: seat,
      user_id: String(user_id),
      theater_id: validTheaterId,
      status: 'pending',
      total_price: Number(total_price),
      viewed_at: formattedViewedAt, // ✅ ISO 8601 변환된 값 저장
      show_time, // ✅ 기존 값 유지
    }));

    const { data, error } = await supabase.from('reservations').insert(insertData).select();
    if (error) {
      console.error('🚨 [서버] 좌석 예약 실패:', error.message);
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true, reservations: data }, { status: 201 });
  } catch (error: any) {
    console.error('🚨 서버 오류:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
