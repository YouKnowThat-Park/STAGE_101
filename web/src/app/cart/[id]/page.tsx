import { notFound } from 'next/navigation';
import { CartHistory } from 'src/types/cart-history-type';
import CartSuccessRedirect from '../_components/CartSuccessRedirect';

export interface CartSuccessProps {
  params: { id: string };
}

export interface CartSuccessHistory {
  payment_key: string;
  name: string;
  total_price: number;
  quantity: number;
}

const CartSuccessPage = async ({ params }: CartSuccessProps) => {
  const res = await fetch(`http://localhost:8000/cart-histories/${params.id}`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!res.ok) {
    return notFound();
  }

  const data: CartHistory = await res.json();

  return (
    <div className="flex flex-col items-center justify-center py-14 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full text-center space-y-6">
        {/* ✅ 이모지 아이콘 */}
        <div className="text-5xl">✅</div>

        <h1 className="text-2xl font-bold text-gray-800">결제가 완료되었습니다!</h1>

        <div className="text-sm text-gray-600">
          <p className="mb-2">
            <span className="font-medium text-gray-800">주문번호:</span>{' '}
            <span className="font-mono text-blue-600 break-all">{data.payment_key}</span>
          </p>
          <p>10초 후 메인 페이지로 자동 이동합니다.</p>
        </div>

        <CartSuccessRedirect />
      </div>
    </div>
  );
};

export default CartSuccessPage;
