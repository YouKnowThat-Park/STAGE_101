export type CartHistoryStatus = 'pending' | 'completed' | 'canceled';

export interface CartHistoryItem {
  id: string;
  payment_key: string;
  total_price: number;
  quantity: number;
  status: CartHistoryStatus;
  image_url?: string;
  name?: string;
  cart_id?: string;
  cart_item_ids: string[];
  created_at: string;
}

export interface CartSuccessProps {
  params: { id: string };
}

export interface GoodsChartItem {
  name: string;
  value: number;
  id: string;
  [key: string]: string | number;
}
