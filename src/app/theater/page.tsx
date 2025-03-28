import Image from 'next/image';

export default function TheaterPage() {
  return (
    <div className="relative h-[700px]  text-white">
      {/* ✅ 배경 이미지 */}
      <div className="absolute inset-0 bg-[url('/lesmiserables.jpg')] bg-cover bg-center opacity-20 md:bg-none"></div>

      {/* ✅ 메인 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center py-20">
        <h1 className="text-4xl font-bold mb-12">🎭 공연 예정 중인 작품</h1>

        {/* ✅ 공연 리스트 (그리드) */}
        <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-12">
          {/* 🎟️ 레미제라블 카드 */}
          <div className="relative w-[300px] h-[450px] bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:scale-105">
            <Image
              src="/lesmiserables.jpg"
              alt="레 미제라블"
              width={300}
              height={450}
              className="absolute w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-4">
              <p>9월 10일</p>
              <h2 className="text-lg font-bold">Les Miserables</h2>
              <p className="text-sm text-gray-300 mt-2">
                혁명과 자유를 향한 감동적인 이야기. 감성을 자극하는 명곡과 함께!
              </p>
              <button className="mt-4 bg-red-600 px-4 py-2 text-sm rounded hover:bg-red-700">
                9월 2일 Open
              </button>
            </div>
          </div>

          {/* 🎟️ 나는 내일, 어제의 너와 만난다 카드 */}
          <div className="relative w-[300px] h-[450px] bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:scale-105">
            <Image
              src="/tomorrow.webp"
              alt="나는 내일, 어제의 너와 만난다"
              width={300}
              height={450}
              className="absolute w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-4">
              <p>9월 11일</p>
              <h2 className="text-lg font-bold">나는 내일, 어제의 너와 만난다</h2>
              <p className="text-sm text-gray-300 mt-2">
                시간이 엇갈리는 두 남녀의 운명적인 사랑 이야기.
              </p>
              <button className="mt-4 bg-red-600 px-4 py-2 text-sm rounded hover:bg-red-700">
                9월 3일 Open
              </button>
            </div>
          </div>

          {/* 🎟️ 먼데이키즈 서울의 꿈 카드 */}
          <div className="relative w-[300px] h-[450px] bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:scale-105">
            <Image
              src="/mondaykiz.jpg"
              alt="먼데이키즈 서울의 꿈"
              width={300}
              height={450}
              className="absolute w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-4">
              <p>10월 10일</p>
              <h2 className="text-lg font-bold">먼데이키즈 서울의 꿈</h2>
              <p className="text-sm text-gray-300 mt-2">
                감성을 자극하는 명곡과 함께하는 특별한 밤!
              </p>
              <button className="mt-4 bg-red-600 px-4 py-2 text-sm rounded hover:bg-red-700">
                10월 2일 Open
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
