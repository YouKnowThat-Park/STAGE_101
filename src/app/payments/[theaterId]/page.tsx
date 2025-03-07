import ClientPaymentsPage from '../_components/ClientPaymentsPage';

export default async function PaymentsPage({ params }: { params: { theaterId: string } }) {
  if (!params.theaterId) {
    throw new Error('🚨 theaterId가 없습니다! URL을 확인하세요.');
  }

  console.log('🎭 theaterId 페이지 진입:', params.theaterId);

  // ✅ 특정 좌석이 아닌 전체 예매 정보를 불러오도록 구성 가능
  return <ClientPaymentsPage theaterId={params.theaterId} initialSeats={[]} />;
}
