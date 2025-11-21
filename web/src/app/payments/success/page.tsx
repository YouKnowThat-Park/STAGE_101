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
    <div className="flex justify-center items-center py-14">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-6 relative">
        <div className="text-center border-b pb-4">
          <h2 className="text-xl font-bold text-black">{theaterName ?? '공연명 정보 없음'}</h2>
          <p className="text-sm text-gray-500">{showTime ?? ''}</p>
        </div>

        <div className="flex justify-between text-sm text-gray-800">
          <p>
            <span className="text-purple-500">👤</span> {userName ?? '이름 없음'}
          </p>
          <p>
            <span className="text-red-500">📞</span> {formatPhoneNumber(userPhone)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mt-2">
          <div className="bg-gray-100 p-3 rounded-lg shadow-inner">
            <p className="text-gray-500 text-xs mb-1">좌석</p>
            <p className="text-base font-semibold text-indigo-600">{seatNumberText}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-lg shadow-inner">
            <p className="text-gray-500 text-xs mb-1">결제 금액</p>
            <p className="text-base font-semibold text-blue-500">{amount.toLocaleString()}원</p>
          </div>
          <div className="col-span-2 bg-gray-100 p-3 rounded-lg shadow-inner break-words">
            <p className="text-gray-500 text-xs mb-1">주문 번호</p>
            <p className="text-[13px] font-mono text-gray-700">{orderId}</p>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          {qrUrl ? (
            <QrCodeImage value={qrUrl} size={100} />
          ) : (
            <p className="text-gray-400">QR 코드 생성 중...</p>
          )}
        </div>

        <div className="text-center mt-6">
          <a href="/" className="inline-block text-sm text-blue-600 font-medium hover:underline">
            홈으로 이동
          </a>
        </div>
      </div>
    </div>
  );
}
