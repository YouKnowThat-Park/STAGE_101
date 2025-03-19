// /pages/api/reviews/watched-theaters.ts
import { serverSupabase } from '@/supabase/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

// Define the Theater type
interface Theater {
  id: string;
  name: string;
}

// Define the reservation type with the correct structure for 'theaters'
interface Reservation {
  theater_id: string;
  theaters: { name: string } | { name: string }[]; // 'theaters' could be an array or an object
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await serverSupabase();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId'); // Get the user ID from query parameters

    if (!userId) {
      return NextResponse.json({ error: '사용자 ID가 필요합니다.' }, { status: 400 });
    }

    // Fetch the theaters the user has made reservations at
    const { data, error } = await supabase
      .from('reservations')
      .select('theater_id, theaters(name)') // Select the theater name from the 'theaters' table
      .eq('user_id', userId);

    if (error) {
      console.error('❌ [ERROR] 극장 목록 조회 실패:', error);
      return NextResponse.json({ error: '극장 목록을 가져오지 못했습니다.' }, { status: 500 });
    }

    // Process the theater data
    const theaters =
      data?.map((reservation: Reservation) => {
        const theater = reservation.theaters; // Get the theaters data

        // Check if theater is an array or an object and safely access the 'name' field
        const theaterName = Array.isArray(theater) ? theater[0]?.name : theater?.name;

        return {
          id: reservation.theater_id,
          name: theaterName || 'Unknown Theater', // Default to 'Unknown Theater' if no name is found
        };
      }) ?? [];

    return NextResponse.json({ theaters }, { status: 200 });
  } catch (error) {
    console.error('❌ [ERROR] 서버 내부 오류:', error);
    return NextResponse.json({ error: '서버 내부 오류 발생' }, { status: 500 });
  }
}
