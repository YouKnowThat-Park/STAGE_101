import React from 'react';
import FloatingActionButton from './_components/FloatingActionButton';

export default function TheaterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen  text-white">
      <main className="max-w-screen-lg mx-auto ">
        <FloatingActionButton />
        {children}
      </main>
    </div>
  );
}
