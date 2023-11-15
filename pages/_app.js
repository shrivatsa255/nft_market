import Script from 'next/script';
import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';

import { Navbar, Footer } from '../components';

const MyApp = ({ Component, pageProps }) => (
  <ThemeProvider attribute="class">
    <div className="dark:bg-nft-dark bg-rose-100 min-h-screen">
      <Navbar />

      <div className="pt-65">
        <Component {...pageProps} />
      </div>

      <Footer />
    </div>
    <Script src="https://kit.fontawesome.com/6415f1e928.js" crossOrigin="anonymous" />
  </ThemeProvider>
);
export default MyApp;
