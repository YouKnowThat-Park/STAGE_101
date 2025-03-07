import Image from 'next/image';
import React from 'react';

interface MusicalAProps {
  name: string;
  description: string;
  price: number;
  show_time: string;
  main_img: string;
}

const MusicalA = ({ name, description, price, show_time, main_img }: MusicalAProps) => {
  return (
    <div>
      <Image src={main_img} alt="영화 포스터" width={400} height={600} />
      <p>{description}</p>
      <p>가격: {price.toLocaleString()}원</p>
      <p>상영 시간: {show_time}</p>
    </div>
  );
};

export default MusicalA;
