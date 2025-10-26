const fetchReviews = async () => {
  const res = await fetch('/api/reviews');
  if (!res.ok) {
    throw new Error('Failed to fetch reviews');
  }

  const data = await res.json();
  return data;
};

export default fetchReviews;
