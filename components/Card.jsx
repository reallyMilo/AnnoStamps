import {
  CogIcon,
  HandThumbUpIcon,
  HeartIcon,
  HomeIcon,
  SparklesIcon,
  TagIcon,
  UserCircleIcon,
  WrenchIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";

import Image from "next/image";
import Link from "next/link";

import { useState } from "react";
import AuthModal from "./AuthModal";
const Card = ({
  id = "",
  screenshot = "",
  title = "",
  category = "",
  region = "",
  favorite = false,
  modded = "",
  user = "",
  likes,
  isUserAuthenticated,
  userSession,
  downloads,
  onClickFavorite = () => null,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [usersVoted, setUsersVoted] = useState(new Set(likes?.users));
  const [likesCount, setLikesCount] = useState(usersVoted.size);
  const sessionUser = userSession?.user;

  const addToUsersVoted = () => {
    setUsersVoted((prevUsersVoted) => prevUsersVoted.add(sessionUser?.email));
    setLikesCount((prevLikesCount) => prevLikesCount + 1);

    axios.post("/api/likes", { users: Array.from(usersVoted), stampId: id });
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  let icon;
  let categoryColour;

  if (category === "Housing") {
    icon = <HomeIcon className="w-3 h-3" />;
    categoryColour = "bg-[#8B6834]";
  }
  if (category === "Production Chain") {
    icon = <CogIcon className="w-3 h-3" />;
    categoryColour = "bg-[#18806D]";
  }
  if (category === "Farm") {
    icon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-3 h-3"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
        />
      </svg>
    );
    categoryColour = "bg-[#515D8C]";
  }
  if (category === "Cosmetic") {
    icon = <SparklesIcon className="w-3 h-3" />;
    categoryColour = "bg-[#C34E27]";
  }
  if (category === "General") {
    icon = <TagIcon className="w-3 h-3" />;
    categoryColour = "bg-[#D72455]";
  }

  return (
    <>
      <AuthModal show={showModal} onClose={closeModal} />
      <div
        href={`/stamps/${id}`}
        className=" w-full bg-white rounded-lg shadow-md grid grid-flow-row grid-rows-2"
      >
        <div className="relative">
          <div className="bg-gray-200 rounded-tl-lg rounded-tr-lg overflow-hidden aspect-w-16 aspect-h-9">
            {screenshot ? (
              <Link href={`/stamps/${id}`}>
                <Image
                  src={screenshot}
                  alt={title}
                  className="hover:opacity-80 transition"
                  fill
                  sizes="(max-width: 320px) 700px
              (max-width: 768px) 390px,
              (max-width: 1200px) 290px"
                  style={{
                    objectFit: "cover",
                  }}
                />
                {modded && (
                  <span className="absolute flex flex-row items-center top-2 right-2 text-xs bg-[#6DD3C0] text-black px-2 py-1 rounded-full">
                    <WrenchIcon className="w-3 h-3 mr-1" />
                    mods
                  </span>
                )}
              </Link>
            ) : null}
          </div>
          {/* <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            if (typeof onClickFavorite === "function") {
              onClickFavorite(id);
            }
          }}
          className="absolute top-2 right-2"
        >
          <HeartIcon
            className={`w-7 h-7 drop-shadow-lg transition ${
              favorite ? "text-red-500" : "text-white"
            }`}
          />
        </button> */}
        </div>
        <div className="p-4 flex flex-col flex-nowrap">
          <p className="text-[#B11E47] text-sm pb-2">{region}</p>

          <div className="mt-2 w-full text-gray-700 font-semibold leading-tight text-lg">
            <Link href={`/stamps/${id}`}>{title ?? ""}</Link>
          </div>
          {user.nickname && (
            <p className="text-xs py-2 flex items-center gap-1 text-slate-500">
              <UserCircleIcon className="w-4 h-4" />
              {`${user.nickname}`}
            </p>
          )}
          <ol className="mt-auto pt-4 flex flex-row justify-between sapce-y-1 text-gray-500  relative bottom-0">
            <li
              className={`flex gap-1 items-center rounded-full ${categoryColour} w-fit pl-2  pr-3 py-1 text-white text-xs`}
            >
              {icon}
              {category ?? ""}
            </li>

            {isUserAuthenticated === "unauthenticated" ? (
              <li className="text-sm flex gap-1 items-center">
                <HandThumbUpIcon
                  className="w-6 h-6 cursor-pointer"
                  onClick={openModal}
                />
                {likesCount}
              </li>
            ) : usersVoted.has(sessionUser?.email) ? (
              <li className="text-sm flex gap-1 items-center cursor-pointer">
                <HandThumbUpIcon className="w-6 h-6 text-[#6DD3C0]" />
                {likesCount}
              </li>
            ) : (
              <li className="text-sm flex gap-1 items-center cursor-pointer">
                <HandThumbUpIcon
                  className="w-6 h-6"
                  onClick={addToUsersVoted}
                />
                {likesCount}
              </li>
            )}
          </ol>
        </div>
      </div>
    </>
  );
};

export default Card;
