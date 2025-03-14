import React from 'react';

const KakaoLogin = ({ size = 36 }: { size?: number }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 135.46666 135.46667"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <circle cx="67.73333" cy="67.73333" r="67.73333" fill="#ffe227" />
        <path
          d="M 67.594373,28.816763 A 42.191248,33.485241 0 0 0 25.542208,62.301837 42.191248,33.485241 0 0 0 44.655432,90.333198 c -1.925815,6.013156 -4.736875,15.417782 -3.717475,16.247782 1.083839,0.88245 12.715951,-6.914279 19.147596,-11.348434 a 42.191248,33.485241 0 0 0 7.647776,0.555096 42.191248,33.485241 0 0 0 42.191121,-33.485805 42.191248,33.485241 0 0 0 -42.191121,-33.485074 42.191248,33.485241 0 0 0 -0.13895,0 z"
          fill="#1a1a1a"
        />
      </g>
    </svg>
  );
};

export default KakaoLogin;
