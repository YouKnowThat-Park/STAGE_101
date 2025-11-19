import React from 'react';
import QRCode from 'react-qr-code';
import { QrCodeImageProps } from 'src/types/qr-session/qr-session-type';

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
