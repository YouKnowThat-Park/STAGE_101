'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { initializeUserStore } from 'src/store/userStore';
import { ProvidersProps } from 'src/types/auth/auth-type';

const Providers = ({ children, initialUser }: ProvidersProps) => {
  const [queryClient] = useState(() => new QueryClient());
  const initializedRef = useRef(false);

  // 첫 클라이언트 렌더에서 한 번만 zustand에 서버 유저 주입
  if (!initializedRef.current) {
    initializeUserStore(initialUser);
    initializedRef.current = true;
  }

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default Providers;
