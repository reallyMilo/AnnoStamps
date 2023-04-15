import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  ArrowLeftIcon,
  HomeIcon,
  PlusIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import AuthModal from "./AuthModal";

const menuItems = [
  {
    label: "My Account",
    icon: UserIcon,
    href: "/account",
  },
  {
    label: "My stamps",
    icon: HomeIcon,
    href: "/user/stamps",
  },
  {
    label: "Add new stamp",
    icon: PlusIcon,
    href: "/create",
  },
  // {
  //   label: "Favorites",
  //   icon: HeartIcon,
  //   href: "/favorites",
  // },
  {
    label: "Logout",
    icon: ArrowLeftIcon,
    onClick: signOut,
  },
];

const Layout = ({ children = null }) => {
  const router = useRouter();

  const { data: session, status } = useSession();
  const user = session?.user;
  const isLoadingUser = status === "loading";

  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      <Head>
        <title>Anno 1800 Stamps | Stamp Sharing</title>
        <meta
          name="description"
          content="A community site for uploading and sharing stamps for Anno 1800"
        ></meta>
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F0F3F4]">
        <header className="h-20 w-full shadow-md relative z-20 bg-[#222939]">
          <div className="h-full container mx-auto">
            <div className="h-full px-4 flex justify-between items-center space-x-4">
              <div className="flex space-x-6">
                <Link href="/" className="flex items-center space-x-1">
                  <Image
                    src="/anno-stamps-logo.svg"
                    width="160"
                    height="60"
                    alt="Anno Stamps"
                    priority
                    as="svg"
                    style={{
                      width: "auto",
                      maxWidth: "160px",
                      height: "auto",
                    }}
                  />
                </Link>
                <div className="flex items-center space-x-4 text-sm font-bold">
                  <Link
                    href="/"
                    className="text-white block hover:bg-amber-800 transition px-3 py-1 rounded-md"
                  >
                    All Stamps
                  </Link>
                  <button
                    onClick={() => {
                      session?.user ? router.push("/create") : openModal();
                    }}
                    className="hidden sm:block text-white hover:bg-amber-800 transition px-3 py-1 rounded-md text-sm font-bold"
                  >
                    Add a stamp
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {isLoadingUser ? (
                  <div className="h-8 w-[75px] bg-gray-200 animate-pulse rounded-md" />
                ) : user ? (
                  <Menu as="div" className="relative z-50">
                    <Menu.Button className="flex items-center space-x-px group">
                      <div className="shrink-0 flex items-center justify-center rounded-full overflow-hidden relative bg-gray-200 w-9 h-9">
                        {user?.image ? (
                          <Image
                            src={user?.image}
                            alt={user?.name || "Avatar"}
                            fill
                            sizes="100vw"
                          />
                        ) : (
                          <UserIcon className="text-gray-400 w-6 h-6" />
                        )}
                      </div>
                      <ChevronDownIcon className="w-5 h-5 shrink-0 text-white group-hover:text-white" />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 w-72 overflow-hidden mt-1 divide-y divide-gray-100 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="flex items-center space-x-2 py-4 px-4 mb-2">
                          <div className="shrink-0 flex items-center justify-center rounded-full overflow-hidden relative bg-gray-200 w-9 h-9">
                            {user?.image ? (
                              <Image
                                src={user?.image}
                                alt={user?.name || "Avatar"}
                                fill
                                sizes="100vw"
                              />
                            ) : (
                              <UserIcon className="text-gray-400 w-6 h-6" />
                            )}
                          </div>
                          <div className="flex flex-col truncate">
                            <span>{user?.name}</span>
                            <span className="text-sm text-gray-500">
                              {user?.email}
                            </span>
                          </div>
                        </div>

                        <div className="py-2">
                          {menuItems.map(
                            ({ label, href, onClick, icon: Icon }) => (
                              <div
                                key={label}
                                className="px-2 last:border-t last:pt-2 last:mt-2"
                              >
                                <Menu.Item>
                                  {href ? (
                                    <Link
                                      href={href}
                                      className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100"
                                    >
                                      <Icon className="w-5 h-5 shrink-0 text-gray-500" />
                                      <span>{label}</span>
                                    </Link>
                                  ) : (
                                    <button
                                      className="w-full flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100"
                                      onClick={onClick}
                                    >
                                      <Icon className="w-5 h-5 shrink-0 text-gray-500" />
                                      <span>{label}</span>
                                    </button>
                                  )}
                                </Menu.Item>
                              </div>
                            )
                          )}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <button
                    type="button"
                    onClick={openModal}
                    className="ml-4 px-4 py-2 rounded-md bg-[#6DD3C0] hover:bg-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500 focus:ring-opacity-50 text-[#222939] text-sm font-bold transition"
                  >
                    SIGN UP / LOG IN
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="w-full mx-auto bg-[#F0F3F4] bg-opacity-95 s min-h-full relative z-10">
          {typeof children === "function" ? children(openModal) : children}
        </main>

        <AuthModal show={showModal} onClose={closeModal} />
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

export default Layout;
