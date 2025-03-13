import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full h-[400px] bg-white shadow-md rounded-lg p-6">
        <p>Welcome to Home!</p>
      </div>
      <div className="flex gap-10">
        <Link href={'/reviews'}>
          <div className=" h-[400px] bg-white shadow-md rounded-lg mt-20">
            <p>방명록 남기러 가기</p>
          </div>
        </Link>
        <div>
          <p>안녕하신가</p>
        </div>
      </div>
    </div>
  );
}
