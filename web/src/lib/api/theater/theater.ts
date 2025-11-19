export const fetchTheaterData = async (theaterType: string) => {
  const res = await fetch(`http://localhost:8000/theaters/by-type/${theaterType}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || '극장 정보를 불러오지 못했습니다.');
  }

  return res.json();
};
