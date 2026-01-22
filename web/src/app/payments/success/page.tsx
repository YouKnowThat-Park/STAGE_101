import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import QrCodeImage from 'src/ui/qrCode/QrCodeImage';
import { PaymentSuccessPageProps } from 'src/types/payment/payment-type';
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

  // 필수 파라미터 없으면 홈으로
  if (!orderId || !amountStr || !reservationId || !userId || !paymentKey) {
    return redirect('/');
  }

  const amount = Number(amountStr);
  const headersList = headers();
  const cookie = headersList.get('cookie') ?? '';

  let qrUrl: string | null = null;
  let seatNumberText: string = '좌석 정보 없음';

  try {
    // 1) 이 유저의 결제 내역 조회해서, 이미 해당 reservationId 에 대한 결제가 있는지 확인

    const payments = await getUserPaymentsServer(userId, { cookie });
    const hasPaymentForReservation = payments.some(
      (p) => p.reservation_id === reservationId && p.status === 'paid',
    );

    // 2) 아직 결제 row가 없으면 FastAPI로 결제 생성 요청
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
        // 에러 페이지로 redirect 가능
      }
    }

    // 3) 예약 정보에서 좌석/QR 토큰 조회 (이미 예약 생성 시 QR 세션이 생성된다고 가정)
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
    // 필요한 경우 여기서 에러 전용 UI를 보여줄 수도 있음
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16 flex justify-center">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b0b0b] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.85)]">
        {/* 헤더 */}
        <div className="text-center border-b border-white/10 pb-4 mb-6">
          <p className="text-xs tracking-[0.3em] text-white/40">STAGE101 • ADMISSION</p>
          <h2 className="mt-2 text-xl font-semibold text-[#C9A66B]">
            {theaterName ?? '공연 정보 없음'}
          </h2>
          <p className="mt-1 text-sm text-white/60">{showTime}</p>
        </div>

        {/* 유저 정보 */}
        <div className="flex justify-between text-sm mb-4">
          <p className="text-white/70">👤 {userName ?? '이름 없음'}</p>
          <p className="text-white/70">📞 {formatPhoneNumber(userPhone)}</p>
        </div>

        {/* 티켓 정보 */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg bg-black/40 border border-white/10 p-3">
            <p className="text-xs text-white/40 mb-1">좌석</p>
            <p className="text-base font-semibold text-[#C9A66B]">{seatNumberText}</p>
          </div>

          <div className="rounded-lg bg-black/40 border border-white/10 p-3">
            <p className="text-xs text-white/40 mb-1">결제 금액</p>
            <p className="text-base font-semibold text-white">{amount.toLocaleString()}원</p>
          </div>

          <div className="col-span-2 rounded-lg bg-black/40 border border-white/10 p-3 break-words">
            <p className="text-xs text-white/40 mb-1">주문 번호</p>
            <p className="text-[13px] font-mono text-white/70">{orderId}</p>
          </div>
        </div>

        {/* QR */}
        <div className="flex flex-col items-center mt-8">
          <p className="text-xs text-white/50 mb-3 tracking-widest">ADMISSION QR</p>

          {qrUrl ? (
            <div className="rounded-xl bg-white p-3 shadow-lg">
              <QrCodeImage value={qrUrl} size={140} />
            </div>
          ) : (
            <p className="text-white/40">QR 코드 생성 중...</p>
          )}

          <p className="mt-4 text-xs text-white/40 text-center leading-relaxed">
            공연장 입장 시<br />본 QR 코드를 제시해 주세요
          </p>
        </div>

        {/* 액션 */}
        <div className="mt-8 flex justify-center">
          <a
            href="/"
            className="
              inline-flex items-center justify-center
              rounded-xl bg-[#C9A66B]
              px-6 py-3 text-black font-semibold
              shadow-[0_10px_30px_rgba(201,166,107,0.25)]
              hover:brightness-110 transition
            "
          >
            홈으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}
