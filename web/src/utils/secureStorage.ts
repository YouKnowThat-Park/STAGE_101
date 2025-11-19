import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_ZUSTAND_SECRET || 'dev-secret-key';

export const encryptString = (plainText: string): string => {
  return CryptoJS.AES.encrypt(plainText, SECRET_KEY).toString();
};

export const decryptString = (cipherText: string): string => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf16);
};
