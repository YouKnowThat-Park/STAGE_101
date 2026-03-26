'use client';

import { useEffect, useRef } from 'react';

const AccessRedirect = () => {
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (redirectedRef.current) {
      return;
    }

    redirectedRef.current = true;
    window.alert('비정상적인 접근이 확인되었습니다.');
    window.location.replace('/');
  }, []);

  return null;
};

export default AccessRedirect;
