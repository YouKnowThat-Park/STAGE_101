import React from 'react';
import QRCode from 'react-qr-code';

export interface QrCodeImageProps {
  value: string | null;
  size?: number;
}

const QrCodeImage = ({ value, size }: QrCodeImageProps) => {
  if (!value) {
    return null;
  }
  return (
    <div>
      <QRCode value={value} size={size} />
    </div>
  );
};

export default QrCodeImage;
