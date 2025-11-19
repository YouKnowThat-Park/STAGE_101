export interface TheaterResponse {
  id: string;
  name: string;
  start_date: string;
  end_date: string | null;
  main_img: string;
  type: string;
}

export interface TheaterProps {
  theaterId: string;
  onDateTimeSelect: (date: Date, time: string) => void;
}
