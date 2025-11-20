const DEFAULT_IMAGE = '/default.png';

export const getValidImageUrl = (image_url?: string | null): string => {
  if (!image_url) return DEFAULT_IMAGE;

  try {
    const parsed = JSON.parse(image_url);
    if (typeof parsed === 'string' && parsed.trim() !== '') {
      return parsed;
    }
  } catch {}
  const str = image_url.toString().trim();
  if (!str) return DEFAULT_IMAGE;

  if (str.startsWith('http://') || str.startsWith('https://') || str.startsWith('data:')) {
    return str;
  }

  if (str.startsWith('/')) {
    return str;
  }
  return `/${str}`;
};
