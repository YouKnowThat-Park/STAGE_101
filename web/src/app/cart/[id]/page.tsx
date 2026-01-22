import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import Image from 'next/image';
import CartSuccessRedirect from '../_components/CartSuccessRedirect';
import HomeCountdownText from '../_components/HomeCountdownText';
import { CartHistoryItem, CartSuccessProps } from 'src/types/cart/cart-history-type';
import { fetchCartHistoryByIdServer } from 'src/lib/api/cart_history/fetchCartHistoryByIdServer';
import { fetchCartHistoriesByPaymentKeyServer } from 'src/lib/api/cart_history/fetchCartHistoriesByPaymentKeyServer';

export default async function CartSuccessPage({ params }: CartSuccessProps) {
  //  SSR에서 인증 쿠키를 전달해야 /by-payment가 내 소유만 조회됨
  const headersList = headers();
  const cookie = headersList.get('cookie') ?? '';

  let one: CartHistoryItem;
  let items: CartHistoryItem[];

  try {
    // 1) 단건 조회 → payment_key 확보
    one = await fetchCartHistoryByIdServer(params.id, { cookie });

    // 2) 같은 payment_key의 전체 히스토리 조회
    items = await fetchCartHistoriesByPaymentKeyServer(one.payment_key, { cookie });
  } catch (err) {
    console.error('장바구니 결제 성공 페이지 데이터 조회 실패:', err);
    return notFound();
  }

  const totalQty = items.reduce((s, i) => s + (i.quantity ?? 0), 0);
  const totalPrice = items.reduce((s, i) => s + (i.total_price ?? 0), 0);
  const displayOrderNo = `STG-${one.payment_key.slice(0, 8).toUpperCase()}-${one.payment_key
    .slice(-4)
    .toUpperCase()}`;
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* 배경(무대 조명 + 그리드) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,166,107,0.16),rgba(0,0,0,0)_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.06),rgba(0,0,0,0)_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 py-16 sm:py-20">
        {/* 상단 헤더 */}
        <div className="flex flex-col gap-3 text-center">
          <p className="text-sm tracking-[0.25em] text-white/60">STAGE101 • CHECKOUT</p>
          <h1 className="text-3xl sm:text-4xl font-semibold">
            결제가 <span className="text-[#C9A66B]">완료</span>되었습니다
          </h1>
          <p className="text-sm text-white/70">
            무대의 여운을 담아두었어요. 아래에서 구매 내역을 확인하세요.
          </p>
        </div>

        {/* 메인 카드 */}
        <div
          className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8
                     shadow-[0_18px_70px_rgba(0,0,0,0.55)]"
        >
          {/* 체크 아이콘 라인 */}

          {/* 주문 요약 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-white/60">주문번호</p>
            <p className="mt-2 font-mono text-sm sm:text-base text-[#C9A66B] break-all">
              {displayOrderNo}
            </p>

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-white/70">
              <span>총 수량 {totalQty}</span>
              <span className="hidden sm:inline text-white/30">•</span>
              <span className="text-[#C9A66B] font-semibold">
                {totalPrice.toLocaleString()} Point
              </span>
            </div>
          </div>

          {/* 구분선 */}
          <div className="my-8 h-px bg-white/10" />

          {/* 구매 목록 */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">구매한 항목</h2>
            <span className="text-xs text-white/50">결제 성공 내역</span>
          </div>

          <ul className="mt-4 flex flex-col gap-3">
            {items.map((it) => (
              <li
                key={it.id}
                className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/30 p-4
                           hover:bg-white/[0.06] transition"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                  {it.image_url ? (
                    <Image
                      src={it.image_url}
                      alt={it.name ?? '상품'}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    <div className="h-full w-full" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{it.name ?? '상품'}</p>
                  <p className="mt-1 text-sm text-white/60">
                    수량 {it.quantity ?? 0} • {(it.total_price ?? 0).toLocaleString()}P
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-white/50">합계</p>
                  <p className="text-sm font-semibold text-[#C9A66B]">
                    {(it.total_price ?? 0).toLocaleString()}P
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* 하단 액션 */}
          <div className="mt-8">
            <HomeCountdownText />
            <CartSuccessRedirect />
          </div>

          <p className="mt-4 text-center text-xs text-white/40">
            STAGE101은 포트폴리오 목적의 데모 서비스입니다.
          </p>
        </div>
      </div>
    </div>
  );
}
