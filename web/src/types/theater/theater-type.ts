export interface TheaterResponse {
  id: string;
  name: string;
  start_date: string;
  end_date: string | null;
  main_img: string;
  type: string;
}

export interface TheaterDetailResponse extends TheaterResponse {
  description: string;
  show_time: string;
  total_time: number;
  price: number;
}

export interface TheaterProps {
  theaterId: string;
  onDateTimeSelect: (date: Date, time: string) => void;
}

export type TheaterId = 'musicalA' | 'musicalB' | 'musicalC' | 'cinemaA' | 'cinemaB' | 'cinemaC';

export interface TheaterListStats {
  total: number;
  by_type: Record<string, number>;
  now_showing: number;
}

export interface TheaterListResponse {
  items: TheaterResponse[];
  stats?: TheaterListStats | null;
}

export interface TheaterListParams {
  type?: string;
  status?: boolean;
  limit?: number;
  offset?: number;
  include_stats?: boolean;
}

export interface HomeClientPageProps {
  initialData: TheaterListResponse;
}
