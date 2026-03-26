import { BannerImage } from 'src/types/common/common-type';
import HomeHeroClient from './HomeHeroClient';

interface NowShowingSectionProps {
  images: BannerImage[];
}

const NowShowingSection = ({ images }: NowShowingSectionProps) => {
  return <HomeHeroClient images={images} />;
};

export default NowShowingSection;
