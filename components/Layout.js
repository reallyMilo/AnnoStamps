import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
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
        </footer>
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

export default Layout;
