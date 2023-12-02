import React, { useEffect, useState } from 'react';
import { NFTStorage, File } from 'nft.storage';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';
import config from '../config.json';
import { MarketAddress, MarketAddressesABI } from './constants';

export const NFTContext = React.createContext();

const NFT_STORAGE_TOKEN = config['NFT.storage_API'];
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

const fetchContract = (signerOrProvider) => new ethers.Contract(MarketAddress, MarketAddressesABI, signerOrProvider);

export const NFTProvider = ({ children }) => {
  // using childern we can access all the elements inside the  <NFTProcider>
  const [currentAccount, setCurrentAccount] = useState('');
  const nftCurrency = 'ETH';

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return alert('Please install MetaMask');

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log('No accounts found');
    }
  };

  const createSale = async (url, formInputPrice, isReselling, id) => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const price = ethers.utils.parseUnits(formInputPrice, 'ether');
    const contract = fetchContract(signer);
    const listingPrice = await contract.getListingPrice();
    const transaction = await contract.createTokens(url, price, { value: listingPrice.toString() });

    await transaction.wait();

    console.log(contract);
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setCurrentAccount(accounts[0]);

    window.location.reload();
  };

  const uploadToIPFS = async (file) => {
    try {
      // Create a File object with the image buffer
      const imageFile = new File([file], 'image/*', { type: 'image/*' });

      // Upload the image to NFT.storage
      const result = await client.storeBlob(imageFile);

      // The IPFS hash of the uploaded image
      const ipfsHash = result.cid;

      console.log(ipfsHash);

      // The URL of the uploaded image
      const imageUrl = `https://gateway.ipfs.io/ipfs/${result}/`;

      return imageUrl;
    } catch (error) {
      console.log('Error uploading image to NFT.storage:', error);
    }
  };

  const CreateNFT = async (formInput, fileUrl, router) => {
    const { name, description, price } = formInput;

    if (!name || !description || !price || !fileUrl) return;
    const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data);
    const imageBlob = new File([imageBuffer], { type: 'image/png' });

    try {
      const result = await client.store({ name, description, image: imageBlob });

      const Url = `https://gateway.ipfs.io/ipfs/${result.ipnft}/`;
      console.log(`NFTMetadataURL:${Url}`);

      await createSale(Url, price);
      router.push('/');
    } catch (error) {
      console.log('Error uploading image to NFT.storage:', error);
    }
  };

  const fetchNFTs = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);
    const data = await contract.fetchMarketitems();

    try {
      const items = await Promise.all(
        data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
          const tokenURI = await contract.tokenURI(tokenId);
          console.log(`TokenId:${tokenId}`);
          console.log(`tokenURI:${tokenURI}`);

          // Fetch metadata JSON from IPFS
          const response = await axios.get(`${tokenURI}/metadata.json`);

          // Extract relevant information
          const { name, description, image } = response.data;

          const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether');
          const stringImageURI = image.toString().split('//');
          const formattedImageURI = stringImageURI[1];
          const imageURI = `https://gateway.ipfs.io/ipfs/${formattedImageURI}`;

          return {
            price,
            tokenId: tokenId.toNumber(),
            seller,
            owner,
            image: imageURI,
            name,
            description,
            tokenURI,
          };
        }),
      );
      return items;
    } catch (err) {
      console.log(err);
    }
  };

  return <NFTContext.Provider value={{ nftCurrency, connectWallet, currentAccount, uploadToIPFS, CreateNFT, fetchNFTs }}>{children}</NFTContext.Provider>;
};
