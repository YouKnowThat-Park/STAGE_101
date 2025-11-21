'use client';
import Image from 'next/image';
import { useQrDetailByToken } from 'src/hooks/qr_session/useQrDetail';
import { QrAdminPageProps } from 'src/types/qr-session/qr-session-type';

const QrCodepage = ({ params }: QrAdminPageProps) => {
  const qrToken = params.token;
  const { data, error, isPending } = useQrDetailByToken(qrToken);

  if (!qrToken) {
    return <div className="text-white">reservationId가 없습니다.</div>;
  }

  if (isPending) return <div className="text-white">로딩중...</div>;
  if (error) return <div className="text-white">에러 발생: {error.message}</div>;
  if (!data) return <div className="text-white">데이터 없음</div>;

  return (
    <>
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="relative w-[300px]">
          <div className="overflow-hidden rounded-lg">
            {data?.main_img && (
              <Image
                src={data.main_img}
                alt="포스터"
                width={500}
                height={500}
                className="w-full h-auto blur-sm brightness-50"
              />
            )}
            <div className="w-full border blur-sm">
              <p className="text-center text-white blur-sm">{data?.theater_name}</p>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/80 text-white text-center text-sm rounded-md px-4 py-3 border">
              🚨 잘못된 접근 시도가 감지되었습니다. 🚨
              <br />
              관리자 전용 페이지에 대한 비정상 접근으로 안전한 페이지로 이동되었습니다.
              <br />
              전용 스캐너를 사용해주세요.
              <br />
              일반 사용자는 접근할 수 없습니다.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QrCodepage;
