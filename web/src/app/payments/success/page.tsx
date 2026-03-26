import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import AccessRedirect from 'src/app/_components/AccessRedirect';
import { PaymentSuccessPageProps } from 'src/types/payment/payment-type';
import QrCodeImage from 'src/ui/qrCode/QrCodeImage';
import { formatPhoneNumber } from 'src/utils/formatPhoneNumber';
import { createPaymentServer } from 'src/lib/api/payment/createPaymentServer';
import { getUserPaymentsServer } from 'src/lib/api/payment/fetchUserPaymentServer';
import { fetchReservationsServer } from 'src/lib/api/reservation/fetchReservationServer';
import { fetchQrByReservationServer } from 'src/lib/api/qr_session/fetchQrByReservaitonServer';

export default async function PaymentSuccessPage({ searchParams }: PaymentSuccessPageProps) {
  const getParam = (key: string): string | undefined => {
    const v = searchParams[key];
    if (Array.isArray(v)) return v[0];
    return v ?? undefined;
  };

  const orderId = getParam('orderId');
  const amountStr = getParam('amount');
  const userName = getParam('userName');
  const userPhone = getParam('userPhone');
  const reservationId = getParam('reservationId');
  const paymentKey = getParam('paymentKey');
  const userId = getParam('userId');
  const theaterName = getParam('theaterName');
  const showTime = getParam('showTime');

  if (!orderId || !amountStr || !reservationId || !userId || !paymentKey) {
    return redirect('/');
  }

  const amount = Number(amountStr);
  const headersList = headers();
  const cookie = headersList.get('cookie') ?? '';

  let qrUrl: string | null = null;
  let seatNumberText = '좌석 정보 없음';

  try {
    const payments = await getUserPaymentsServer(userId, { cookie });
    const hasPaymentForReservation = payments.some(
      (p) => p.reservation_id === reservationId && p.status === 'paid',
    );

    if (!hasPaymentForReservation) {
      const pointEarned = Math.floor(amount * 0.01);

      try {
        await createPaymentServer(
          {
            user_id: userId,
            reservation_id: reservationId,
            amount,
            point_earned: pointEarned,
            payment_key: paymentKey,
            payment_method: 'card',
          },
          { cookie },
        );
      } catch (err) {
        console.error('결제 생성 실패:', err);
      }
    }

    const reservations = await fetchReservationsServer({ cookie });
    const target = reservations.find((r) => r.id === reservationId);

    if (target) {
      seatNumberText = target.seat_number.join(', ');
    }

    const qrData = await fetchQrByReservationServer(reservationId, { cookie });

    if (qrData) {
      qrUrl = qrData.qr_url;
    }
  } catch (err) {
    console.error('결제 확인 처리 중 오류:', err);

    if (err instanceof Error) {
      const message = err.message;

      if (message.includes('401') || message.includes('403') || message.includes('404')) {
        return <AccessRedirect />;
      }
    }
  }

  return (
    <div className="min-h-screen bg-black px-6 py-16 text-white flex justify-center">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.85)]">
        <div className="mb-6 border-b border-white/10 pb-4 text-center">
          <p className="text-xs tracking-[0.3em] text-white/40">STAGE101 • ADMISSION</p>
          <h2 className="mt-2 text-xl font-semibold text-[#C9A66B]">
            {theaterName ?? '공연 정보 없음'}
          </h2>
          <p className="mt-1 text-sm text-white/60">{showTime}</p>
        </div>

        <div className="mb-4 flex justify-between text-sm">
          <p className="text-white/70">👤 {userName ?? '이름 없음'}</p>
          <p className="text-white/70">📞 {formatPhoneNumber(userPhone)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg border border-white/10 bg-black/40 p-3">
            <p className="mb-1 text-xs text-white/40">좌석</p>
            <p className="text-base font-semibold text-[#C9A66B]">{seatNumberText}</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/40 p-3">
            <p className="mb-1 text-xs text-white/40">결제 금액</p>
            <p className="text-base font-semibold text-white">{amount.toLocaleString()}원</p>
          </div>

          <div className="col-span-2 break-words rounded-lg border border-white/10 bg-black/40 p-3">
            <p className="mb-1 text-xs text-white/40">주문 번호</p>
            <p className="font-mono text-[13px] text-white/70">{orderId}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <p className="mb-3 text-xs tracking-widest text-white/50">ADMISSION QR</p>

          {qrUrl ? (
            <div className="rounded-xl bg-white p-3 shadow-lg">
              <QrCodeImage value={qrUrl} size={140} />
            </div>
          ) : (
            <p className="text-white/40">QR 코드 생성 중...</p>
          )}

          <p className="mt-4 text-center text-xs leading-relaxed text-white/40">
            공연장 입장 시
            <br />
            본 QR 코드를 제시해 주세요
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-[#C9A66B] px-6 py-3 text-black font-semibold shadow-[0_10px_30px_rgba(201,166,107,0.25)] transition hover:brightness-110"
          >
            홈으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}
