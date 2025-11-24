import { useEffect } from 'react';

export const useHeaderScroll = (
  _scrollRef: React.RefObject<HTMLDivElement>,
  setShowScrollHint: React.Dispatch<React.SetStateAction<boolean>>,
  maxWidth: number = 500,
) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const check = () => {
      if (window.innerWidth <= maxWidth) {
        setShowScrollHint(true); // 500px 이하면 무조건 표시
      } else {
        setShowScrollHint(false); // 넘어가면 숨김
      }
    };

    check(); // 마운트 시 한 번
    window.addEventListener('resize', check); // 리사이즈 때도

    return () => {
      window.removeEventListener('resize', check);
    };
  }, [setShowScrollHint, maxWidth]);
};
