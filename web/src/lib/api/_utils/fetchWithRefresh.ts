/**
 * 토큰 갱신 로직이 포함된 fetch 래퍼
 * 401 에러 시 자동으로 리프레시 토큰으로 새 액세스 토큰 발급 후 재시도
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

// 리프레시 완료 시 대기 중인 요청들에게 알림
const onRefreshed = () => {
  refreshSubscribers.forEach((callback) => callback(''));
  refreshSubscribers = [];
};

// 리프레시 완료 시 실행할 콜백 등록
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// 리프레시 토큰으로 새 액세스 토큰 발급
export const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE}/users/refresh-token`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) {
      console.error('리프레시 토큰 갱신 실패');
      return false;
    }

    console.log('액세스 토큰 갱신 성공');
    return true;
  } catch (error) {
    console.error('토큰 갱신 중 오류:', error);
    return false;
  }
};

/**
 * fetch with 자동 토큰 갱신
 * 401 에러 시 리프레시 토큰으로 새 액세스 토큰 발급 후 재시도
 */
export const fetchWithRefresh = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  let response = await fetch(url, {
    ...options,
    credentials: 'include',
  });

  // 401 에러 (토큰 만료)
  if (response.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;

      const refreshed = await refreshAccessToken();

      isRefreshing = false;
      onRefreshed();

      if (refreshed) {
        // 토큰 갱신 성공 → 원래 요청 재시도
        response = await fetch(url, {
          ...options,
          credentials: 'include',
        });
      } else {
        // 토큰 갱신 실패 → 로그인 페이지로 리다이렉트
        if (typeof window !== 'undefined') {
          window.location.href = '/sign-in';
        }
      }
    } else {
      // 다른 요청에서 이미 갱신 중 → 갱신 완료 대기 후 재시도
      await new Promise<void>((resolve) => {
        addRefreshSubscriber(() => {
          resolve();
        });
      });

      response = await fetch(url, {
        ...options,
        credentials: 'include',
      });
    }
  }

  return response;
};
