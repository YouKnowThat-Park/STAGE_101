export const formatPhoneNumber = (phone: string | null | undefined) => {
  if (!phone) return '정보 없음';

  const digits = phone.replace(/\D/g, '');
  return digits.length === 11
    ? `${digits.slice(0, 3)}-${digits.slice(3, 4)}**-${digits.slice(7, 9)}**`
    : '유효하지 않은 번호';
};
