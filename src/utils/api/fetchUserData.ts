// utils/api/fetchUserData.ts
export interface UserData {
  id: string;
  name: string;
  phone: string;
  point: number | null;
}

// 서버에서 유저 데이터를 가져오는 함수
const fetchUserData = async (id: string): Promise<UserData> => {
  const response = await fetch(`/api/user?id=${id}`);
  if (!response.ok) {
    throw new Error('유저 데이터를 불러오는데 실패했습니다.');
  }
  const result = await response.json();

  // ✅ 필요한 데이터만 반환
  return {
    id: result.id,
    name: result.name,
    phone: result.phone,
    point: result.point,
  };
};

export default fetchUserData;
