import { HeaderScrollProps } from 'src/types/common/common-type';

const HeaderScroll = ({
  topClass = '',
  rightClass = 'right-0',
  bottomClass = '',
}: HeaderScrollProps) => {
  return (
    <div
      className={`
            pointer-events-none
            absolute ${topClass} ${rightClass} ${bottomClass}
            items-center pr-2
            bg-gradient-to-l from-black/80 to-transparent`}
    >
      <span className="text-[#C9A66B] text-lg animate-pulse">ㅡ→</span>
    </div>
  );
};

export default HeaderScroll;
