import React from 'react';
import TheaterList from './_components/TheaterList';

export default function TheaterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen  text-white">
      <main className="max-w-screen-lg mx-auto ">
        <TheaterList />
        {children}
      </main>
    </div>
  );
}
