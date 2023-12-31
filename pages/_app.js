import Script from 'next/script';
import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import { NFTProvider } from '../context/NFTContext';

import { Navbar, Footer } from '../components';

const MyApp = ({ Component, pageProps }) => (
  <NFTProvider>
    <ThemeProvider attribute="class">
      <div className="dark:bg-nft-dark bg-white min-h-screen">
        <Navbar />

        <div className="pt-65">
          <Component {...pageProps} />
        </div>

        <Footer />
      </div>
      <Script src="https://kit.fontawesome.com/6415f1e928.js" crossOrigin="anonymous" />
    </ThemeProvider>
  </NFTProvider>
);
export default MyApp;
