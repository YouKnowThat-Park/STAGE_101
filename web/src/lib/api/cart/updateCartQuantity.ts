const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const updateCartQuantity = async (data: {
  user_id: string;
  shop_id: string;
  quantity: number;
}) => {
  const res = await fetch(`${API_BASE}/cart/`);
};
