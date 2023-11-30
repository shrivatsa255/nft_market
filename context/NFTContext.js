import React, { useEffect, useState } from 'react';
import { NFTStorage, File } from 'nft.storage';
import web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';
import { create as ipfsCreateClient } from 'ipfs-http-client';
import config from '../config.json';
import { MarketAddress, MarketAddressesABI } from './constents';

export const NFTContext = React.createContext();

const NFT_STORAGE_TOKEN = config['NFT.storage_API'];
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

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
      const imageFile = new File([file], 'image.png', { type: 'image/png' });

      // Upload the image to NFT.storage
      const result = await client.storeBlob(imageFile);

      // The IPFS hash of the uploaded image
      const ipfsHash = result.cid;

      console.log(ipfsHash);

      // The URL of the uploaded image
      const imageUrl = `https://gateway.ipfs.io/ipfs/${result}/`;

      return imageUrl;
    } catch (error) {
      console.error('Error uploading image to NFT.storage:', error);
      throw error;
    }
  };

  return <NFTContext.Provider value={{ nftCurrency, connectWallet, currentAccount, uploadToIPFS }}>{children}</NFTContext.Provider>;
};
