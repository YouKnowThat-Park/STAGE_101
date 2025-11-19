import Link from 'next/link';
import React from 'react';

export default function QrLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center bg-gray-100 min-h-screen">
      <div className="w-full max-w-[450px] bg-white shadow-md">
        <header className="bg-black text-white h-20 flex items-center px-4">
          <Link href="/" className="text-lg font-semibold">
            Layout
          </Link>
        </header>
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
