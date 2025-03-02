export const getValidImageUrl = (image_url: string | string[]) => {
  try {
    if (Array.isArray(image_url)) {
      image_url = image_url[0]; // ✅ 배열이면 첫 번째 값 사용
    }
    return JSON.parse(image_url); // ✅ `\"https://...\"` 같은 형식이면 변환
  } catch (error) {
    console.error('📌 이미지 URL 파싱 오류:', error);
    return image_url.toString().replace(/^"+|"+$/g, ''); // ✅ JSON 파싱 실패 시 앞뒤 따옴표 제거
  }
};
