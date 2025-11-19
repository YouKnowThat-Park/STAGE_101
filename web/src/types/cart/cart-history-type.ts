export interface CartHistoryItem {
  id: string;
  payment_key: string;
  name?: string;
  image_url?: string;
  quantity: number;
  total_price: number;
}

export interface CartSuccessProps {
  params: { id: string };
}
