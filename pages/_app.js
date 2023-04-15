import { SessionProvider } from "next-auth/react";
import Script from "next/script";
import { Toaster } from "react-hot-toast";

import "../styles/globals.css";
function StampsApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-9KT01SRSVX"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          
          window.dataLayer = window.dataLayer || [];
          
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-9KT01SRSVX');
        `}
      </Script>
      <SessionProvider session={session}>
        <Component {...pageProps} className="font-sans" />
      </SessionProvider>

      <Toaster />
    </>
  );
}

export default StampsApp;
