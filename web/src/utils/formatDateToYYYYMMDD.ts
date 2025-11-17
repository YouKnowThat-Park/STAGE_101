const formatDateToYMD = (date: Date): string => {
  return date.toISOString().split('T')[0]; // "YYYY-MM-DD"
};

export default formatDateToYMD;
