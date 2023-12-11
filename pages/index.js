import { useEffect, useState, useRef, useContext } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { NFTContext } from '../context/NFTContext';
import { Banner, CreatorCard, NFTCard } from '../components';
import img from '../assets';
import { makeid } from '../Utils/makeid';

const Home = () => {
  const [hideButtons, setHideButtons] = useState(false);
  const [nfts, setNfts] = useState([]);
  const { fetchNFTs } = useContext(NFTContext);
  const parentRef = useRef(null);
  const scrollRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    fetchNFTs().then((items) => {
      setNfts(items);
    });
  }, []);

  const handelScroll = (direction) => {
    const { current } = scrollRef;
    const scrollCount = window.innerWidth > 1800 ? 270 : 210;
    if (direction === 'left') {
      current.scrollLeft -= scrollCount;
    } else {
      current.scrollLeft += scrollCount;
    }
  };
  const isScrollable = () => {
    const { current } = scrollRef;
    const { current: parent } = parentRef;

    if (current?.scrollWidth >= parent?.offsetWidth) {
      setHideButtons(false);
    } else {
      setHideButtons(true);
    }
  };
  useEffect(() => {
    isScrollable();
    window.addEventListener('resize', isScrollable);
    return () => {
      window.removeEventListener('resize', isScrollable);
    };
  });

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-full minmd:w-4/5">
        <Banner parentStyles="justify-start mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl" childStyles="md:text-4xl sm:text-2xl xs:text-xl text-left" name="Discover, Collect and Sell extraordinary NFTs" />
        <div>
          <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 sm:ml-0">Best Creators</h1>
          <div className="relative flex-1 max-w-full flex mt-3" ref={parentRef}>
            <div className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none" ref={scrollRef}>
              {[6, 7, 8, 9, 10].map((i) => (
                <CreatorCard key={`creator-${i}`} rank={i} creatorImage={img[`creator${i}`]} creatorName={`0x${makeid(3)}...${makeid(4)}`} creatorETHs={10 - i * 0.5} />
              ))}
              {!hideButtons && (
                <>
                  <div
                    onClick={() => {
                      handelScroll('left');
                    }}
                    className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 left-0 cursor-pointer"
                  >
                    <Image src={img.left} layout="fill" objectFit="contain" alt="leftarrow" className={theme === 'light' ? 'filter invert' : undefined} />
                  </div>
                  <div
                    onClick={() => {
                      handelScroll('right');
                    }}
                    className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 right-0 cursor-pointer"
                  >
                    <Image src={img.right} layout="fill" objectFit="contain" alt="rightarrow" className={theme === 'light' ? 'filter invert' : undefined} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mt-10">
          <div className="flexBetween mx-4 xs:mx-0 minlg:mx-8 sm:flex-col sm:items-start">
            <h1 className="flex-1 font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4">Hot Bids</h1>
            <div>searchbar</div>
          </div>
          <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
            {nfts.map((nft) => (
              <NFTCard key={nft.tokenId} nft={nft} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
