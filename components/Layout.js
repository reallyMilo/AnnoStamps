import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import PropTypes from "prop-types";
import Navigation from "./Navigation";

const Layout = ({ children = null }) => {
  return (
    <>
      <Head>
        <title>Anno 1800 Stamps | Stamp Sharing</title>
        <meta
          name="description"
          content="A community site for uploading and sharing stamps for Anno 1800"
        ></meta>
        <meta name="og:title" content="Anno 1800 Stamps | Stamp Sharing" />
        <meta
          name="og:description"
          content="A community site for uploading and sharing stamps for Anno 1800"
        />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F0F3F4]">
        <header className="h-20 w-full shadow-md relative z-20 bg-[#222939]">
          <div className="h-full container mx-auto">
            <div className="h-full px-4 flex justify-between items-center space-x-4">
              <Navigation />
            </div>
          </div>
        </header>

        <main className="w-full mx-auto bg-[#F0F3F4] bg-opacity-95 s min-h-full relative z-10 mb-20">
          {typeof children === "function" ? children(openModal) : children}
        </main>
        <footer className="py-6  bg-[#222939] mt-auto">
          <div className="container mx-auto px-5 flex items-center justify-between">
            <p className="text-white text-sm font-bold">Anno Stamps</p>

            <div className="px-5 flex space-x-5 items-center">
              <a href="https://www.buymeacoffee.com/miloK" target="_blank">
                <Image
                  src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png"
                  alt="Buy Me A Coffee"
                  width={140}
                  height={60}
                />
              </a>
              <Script
                type="text/javascript"
                src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js"
                data-name="bmc-button"
                data-slug="miloK"
                data-color="#5F7FFF"
                data-emoji=""
                data-font="Cookie"
                data-text="Buy me a coffee"
                data-outline-color="#000000"
                data-font-color="#ffffff"
                data-coffee-color="#FFDD00"
                defer
              ></Script>
              <Link href="https://discord.gg/73hfP54qXe" target="_blank">
                <Image
                  src="/discord.svg"
                  alt="Google"
                  width={32}
                  height={32}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
              </Link>
              <Link
                href="https://github.com/reallyMilo/AnnoStamps"
                target="_blank"
              >
                <Image
                  src="/github-mark.svg"
                  width="24"
                  height="24"
                  alt="Github"
                />
              </Link>
            </div>
          </div>
          {/* <script
            data-name="BMC-Widget"
            data-cfasync="false"
            src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
            data-id="miloK"
            data-description="Support me on Buy me a coffee!"
            data-message="Thanks for helping support Anno Stamps!"
            data-color="#5F7FFF"
            data-position="Right"
            data-x_margin="18"
            data-y_margin="18"
            defer
          ></script> */}
        </footer>
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

export default Layout;
