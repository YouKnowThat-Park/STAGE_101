import { browserSupabase } from '@/supabase/supabase-client';

export const fetchTheaterData = async (theaterId: string) => {
  const supabase = browserSupabase();

  const { data, error } = await supabase
    .from('theaters')
    .select(
      'id, name, description, price, show_time, total_time, created_at, image_url, video_url, status, type, allowed_days, start_date, end_date, main_img',
    )
    .eq('type', theaterId) // 🔥 수정: type이 아니라 id로 조회해야 정확함
    .single();

  if (error) {
    console.error('Error fetching theater info:', error.message);
    return null;
  }

  return data;
};
