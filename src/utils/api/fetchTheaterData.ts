import { browserSupabase } from '@/supabase/supabase-client';

export const fetchTheaterData = async (theaterId: string) => {
  const supabase = browserSupabase();

  const { data, error } = await supabase
    .from('theaters')
    .select(
      'id, name, description, price, show_time, total_time, created_at, image_url, video_url, status, type, day_of_week, screening_date, main_img',
    )
    .eq('type', theaterId)
    .single();

  if (error) {
    console.error('Error fetching theater info:', error.message);
    return null;
  }

  return data;
};
