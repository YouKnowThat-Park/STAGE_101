import { serverSupabase } from '../../../../supabase/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

type ReviewWithUser = {
  id: string;
  theater_id: string;
  user_id: string;
  users: {
    nickname: string | null;
    profile_img: string | null;
  } | null;
};

export async function GET(req: NextRequest) {
  const supabase = await serverSupabase();
  const { searchParams } = new URL(req.url);

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(
        `
        id,
        theater_id,
        user_id,
        users:users(nickname, profile_img)
      `,
      )
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.error('❌ 리뷰 조회 실패:', error);
      return NextResponse.json({ error: error?.message || '리뷰 조회 실패' }, { status: 500 });
    }

    const reviews = data as unknown as ReviewWithUser[];

    const userCounts: Record<string, { count: number; nickname: string; profile_img: string }> = {};

    reviews.forEach((review) => {
      const userId = review.user_id;
      const user = review.users ?? {
        nickname: '익명',
        profile_img: '/default.png',
      };

      if (!userCounts[userId]) {
        userCounts[userId] = {
          count: 0,
          nickname: user.nickname ?? '익명',
          profile_img: user.profile_img ?? '/default.png',
        };
      }

      userCounts[userId].count++;
    });

    const ranking = Object.entries(userCounts)
      .map(([user_id, data]) => ({ user_id, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return NextResponse.json({
      ranking,
      reviews,
    });
  } catch (err) {
    console.error('🚨 서버 오류 발생:', err);
    return NextResponse.json({ error: '서버 오류 발생' }, { status: 500 });
  }
}
