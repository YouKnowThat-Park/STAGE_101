const fetchReviews = async () => {
  const res = await fetch('/api/reviews');
  if (!res.ok) {
    throw new Error('Failed to fetch reviews');
  }

  const data = await res.json();
  console.log('🚀 가져온 리뷰 데이터:', data); // users 정보가 포함되었는지 확인!
  return data;
};

export default fetchReviews;
