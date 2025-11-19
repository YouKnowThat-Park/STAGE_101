export interface QrSessionResponse {
  qr_token: string | null;
}

export interface QrSessionCreatePayload {
  user_id: string;
  theater_id: string;
  reservation_id: string;
}

export interface QrDetailResponse {
  qr_token: string | null;
  theater_id: string;
  theater_name: string;
  main_img: string | null;
  viewed_at: string | null;
  show_time: string | null;
  qr_url: string;
}

export interface QrAdminPageProps {
  params: {
    token: string;
  };
}

export interface QrCodeImageProps {
  value: string | null;
  size?: number;
}
