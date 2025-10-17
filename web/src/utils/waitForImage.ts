export const waitForImage = async (url: string, retries = 5, delay = 1500): Promise<string> => {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, { method: 'HEAD' });

    if (response.ok) {
      return url; // ✅ 이미지가 정상적으로 로드됨
    }

    console.warn(`⚠️ 이미지 확인 실패 (${response.status}), ${delay}ms 후 재시도`);
    await new Promise((resolve) => setTimeout(resolve, delay)); // ⏳ 일정 시간 대기 후 재시도
  }

  throw new Error(`❌ 이미지 로드 실패: ${url}`);
};
