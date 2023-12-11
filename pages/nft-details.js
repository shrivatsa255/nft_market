import { useContext, useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/router';
import { shortenAddress } from '../Utils/shortenAddress';
import { NFTContext } from '../context/NFTContext';
import { NFTCard, Loader, Button, Modal } from '../components';

import img from '../assets';

const nftDetails = () => {
  const { currentAccount, nftCurrency, buyNFT } = useContext(NFTContext);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [nft, setNft] = useState({ image: '', tokenId: '', name: '', owner: '', seller: '', price: '' });

  const PaymentBodyComp = ({ NFT, NFTCurrency }) => (
    <div className="flex flex-col">
      <div className="flexBetween">
        <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">Item</p>
        <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">Subtotal</p>
      </div>

      <div className="flexBetweenStart my-5">
        <div className="flex-1 flexStartCenter">
          <div className="relative w-28 h-28">
            <Image src={NFT.image || img[`nft${NFT.i}`]} layout="fill" objectFit="cover" />
          </div>
          <div className="flexCenterStart flex-col ml-5">
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl">{shortenAddress(NFT.seller)}</p>
            <p className="font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-xl font-normal">{NFT.name}</p>
          </div>
        </div>

        <div>
          <p className="font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-xl font-normal">
            {nft.price} <span className="font-semibold">{NFTCurrency}</span>
          </p>
        </div>
      </div>

      <div className="flexBetween mt-10">
        <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">Total</p>
        <p className="font-poppins dark:text-white text-nft-black-1 text-base minlg:text-xl font-normal">
          {nft.price} <span className="font-semibold">{NFTCurrency}</span>
        </p>
      </div>
    </div>
  );

  const checkOut = async () => {
    await buyNFT(nft);

    setPaymentModal(false);
    setSuccessModal(true);
  };

  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;

    setNft(router.query);
    setIsLoading(false);
  }, [router.isReady]);
  if (isLoading) return <Loader />;
  return (
    <div className="relative flex justify-center md:flex-col min-h-screen">
      <div className="relative flex-1 flexCenter sm:px-4 p-12 border-r md:border-r-0 md:border-b dark:bg-nft-dark bg-white dark:border-nft-black-1 border-nft-gray-1">
        <div className="relative w-557 minmd:w-2/3 minmd:h-2/3 sm:w-full sm:h-300 h-557 shadow-2xl">
          <Image src={nft.image} objectFit="cover" className="rounded-xl shadow-lg" layout="fill" />
        </div>
      </div>
      <div className="flex-1 justify-start sm:px-4 p-12 sm:pb-4">
        <div className="flex flex-row sm:flsex-col">
          <h2 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl minlg:text-3xl">{nft.name}</h2>
        </div>
        <div className="mt-10">
          <p className="font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-base font-normal">Creator</p>
          <div className="flex-row items-center mt-3">
            <div className="relative w-12 h-12 minlg:w-20 minlg:h-20 mr-2">
              <Image src={img.creator1} objectFit="cover" className="rounded-full" />
            </div>
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl minlg:text-3xl">{shortenAddress(nft.seller)}</p>
          </div>
        </div>
        <div className="mt-10 flex flex-col">
          <div className="w-full border-b border-nft-black-1 dark:border-nft-gray-1 flex flex-row">
            <p className="font-poppins dark:text-white text-nft-black-1 text-base minlg:text-base mb-2 font-medium">Details</p>
          </div>
          <div className="mt-3">
            <p className="font-poppins dark:text-white text-nft-black-1 text-base  font-normal">{nft.description}</p>
          </div>
        </div>
        <div className="flex flex-row sm:flex-col mt-10">
          {currentAccount === nft.seller.toLowerCase() ? (
            <p className="font-poppins dark:text-white text-nft-black-1 text-base border rounded-lg dark:bg-nft-black-1 shadow-lg bg-indigo-100 border-nft-gray-1 p-2 font-normal">You Cannot Buy your own NFT</p>
          ) : currentAccount === nft.owner.toLowerCase() ? (
            <Button btnName="List on MarketPlace" classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl" handleClick={() => router.push(`/resell-nft?tokenId=${nft.tokenId}&tokenURI=${nft.tokenURI}`)} />
          ) : (
            <Button btnName={`Buy for ${nft.price} ${nftCurrency}`} classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl" handleClick={() => setPaymentModal(true)} />
          )}
        </div>
      </div>
      {paymentModal && (
        <Modal
          header="Check Out"
          body={<PaymentBodyComp NFT={nft} NFTCurrency={nftCurrency} />}
          footer={(
            <div className="flex flex-row sm:flex-col">
              <Button btnName="CheckOut" classStyles="mr-5 sm:mb-5 sm:mr-0 rounded-xl" handleClick={checkOut} />
              <Button btnName="Cancel" classStyles="mr-5 sm:mr-0 rounded-xl" handleClick={() => setPaymentModal(false)} />
            </div>
          )}
          handleClose={() => setPaymentModal(false)}
        />
      )}
      {successModal && (
        <Modal
          header="Transaction Successful"
          body={(
            <div className="flexCenter flex-col text-center" onClick={() => setSuccessModal(false)}>
              <div className="relative w-52 h-52">
                <Image src={nft.image} objectFit="cover" layout="fill" />
              </div>
              <p className="font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-xl font-normal mt-10">
                You Successfully Purchased <span className="font-semibold">{nft.name}</span> from <span className="font-semibold">{shortenAddress(nft.seller)}</span>
              </p>
            </div>
          )}
          footer={(
            <div className="flex flex-col">
              <Button btnName="Check it out" classStyles="sm:mb-5 sm:mr-0 rounded-xl" handleClick={() => router.push('/my-nfts')} />
            </div>
          )}
          handleClose={() => setPaymentModal(false)}
        />
      )}
    </div>
  );
};

export default nftDetails;
