const fetchQnaData = async () => {
  const res = await fetch('/api/qna');
  if (!res.ok) {
    throw new Error('Failed to fetch reviews');
  }
  return res.json();
};

export default fetchQnaData;
