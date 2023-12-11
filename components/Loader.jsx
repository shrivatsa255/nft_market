import Image from 'next/image';
import img from '../assets';

const Loader = () => (
  <div className="flexCenter w-full my-4">
    <Image src={img.loader} alt="Loading NFTs..." width={100} objectFit="contain" />
  </div>
);

export default Loader;
