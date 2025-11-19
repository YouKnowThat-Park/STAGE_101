import Link from 'next/link';
import React from 'react';
import Stage101Logo from 'src/ui/logo/Stage101Logo';

export default function QrLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center bg-gray-100 min-h-screen">
      <div className="w-full max-w-[450px] bg-black shadow-md">
        <header className="bg-black text-white h-20 flex justify-center items-center px-4">
          <Stage101Logo />
        </header>
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
