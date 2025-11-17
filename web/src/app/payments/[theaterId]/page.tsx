import ClientPaymentsPage from '../[Seats]/ClientPaymentsPage';

export default async function PaymentsPage({ params }: { params: { theaterId: string } }) {
  if (!params.theaterId) {
    throw new Error('🚨 theaterId가 없습니다! URL을 확인하세요.');
  }

  // ✅ 특정 좌석이 아닌 전체 예매 정보를 불러오도록 구성 가능
  return <ClientPaymentsPage theaterType={params.theaterId} initialSeats={[]} />;
}
