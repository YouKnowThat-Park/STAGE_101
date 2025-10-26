import React from 'react';

const QrLogin = ({ size = 36 }: { size?: number }) => {
  return (
    <svg
      id="Balloon"
      className="qr-icon"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g>
        <path
          fill="#393B3D"
          d="M29,2h-5c-0.553,0-1,0.448-1,1s0.447,1,1,1h4v4c0,0.552,0.447,1,1,1s1-0.448,1-1V3C30,2.448,29.553,2,29,2z"
        />
        <path
          fill="#393B3D"
          d="M3,9c0.552,0,1-0.448,1-1V4h4c0.552,0,1-0.448,1-1S8.552,2,8,2H3C2.448,2,2,2.448,2,3v5C2,8.552,2.448,9,3,9z"
        />
        <path
          fill="#393B3D"
          d="M8,28H4v-4c0-0.553-0.448-1-1-1s-1,0.447-1,1v5c0,0.553,0.448,1,1,1h5c0.552,0,1-0.447,1-1S8.552,28,8,28z"
        />
        <path
          fill="#393B3D"
          d="M29,23c-0.553,0-1,0.447-1,1v4h-4c-0.553,0-1,0.447-1,1s0.447,1,1,1h5c0.553,0,1-0.447,1-1v-5C30,23.447,29.553,23,29,23z"
        />
        <path fill="#E4EDF2" d="M25,15V8c0-0.552-0.447-1-1-1H8C7.448,7,7,7.448,7,8v7H25z" />
        <path fill="#E4EDF2" d="M7,17v7c0,0.553,0.448,1,1,1h16c0.553,0,1-0.447,1-1v-7H7z" />
        <path
          fill="#16F293"
          d="M29,15h-4H7H3c-0.552,0-1,0.448-1,1s0.448,1,1,1h4h18h4c0.553,0,1-0.448,1-1S29.553,15,29,15z"
        />
      </g>
    </svg>
  );
};

export default QrLogin;
