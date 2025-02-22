export const GobackIcon = ({ size = 30, color = '#232323' }: { size?: number; color?: string }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={color}
    >
      <path d="M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm0,22A10,10,0,1,1,22,12,10.011,10.011,0,0,1,12,22Z" />
      <path d="M18,11H8.414l2.293-2.293A1,1,0,1,0,9.293,7.293l-4,4a1,1,0,0,0,0,1.414l4,4a1,1,0,0,0,1.414-1.414L8.414,13H18a1,1,0,0,0,0-2Z" />
    </svg>
  );
};
