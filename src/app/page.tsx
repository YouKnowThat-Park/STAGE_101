import Link from 'next/link';
import HomeQna from './home/HomeQna';
import HomeReviews from './home/HomeReviews';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      {' '}
      {/* 전체 중앙 정렬 */}
      <div className="w-full max-w-[1100px] h-[400px] bg-white shadow-md rounded-lg p-6">
        <p>Welcome to Home!</p>
      </div>
      <div className="flex justify-center gap-10 mt-20 w-full max-w-[1100px]">
        {/* 리뷰 전체보기 */}
        <div>
          <div className="h-[400px] bg-white shadow-md rounded-lg flex flex-col items-center ">
            <Link href={'/reviews'} className="flex-1">
              <p className="ml-[330px] text-sm border-b  border-black">리뷰 전체 보기</p>
            </Link>
            <HomeReviews />
          </div>
        </div>

        {/* QnA 섹션 */}
        <div className="h-[400px] bg-white shadow-md rounded-lg flex-1 flex flex-col items-center ">
          <Link href={'/home/HomeQna'}>
            <h2 className="w-full text-center mt-3">전체 보기</h2>
          </Link>
          <HomeQna />
        </div>
      </div>
    </div>
  );
}
