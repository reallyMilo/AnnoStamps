import { ArrowUpIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import Image from "next/image";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const StampUpload = ({
  label = "Stamp File",
  initialImage = null,
  accept = "",
  sizeLimit = 2 * 1024 * 1024, // 2MB
  onChangePicture = () => null,
}) => {
  const pictureRef = useRef();

  const [stamp, setStamp] = useState(initialImage);
  const [updatingPicture, setUpdatingPicture] = useState(false);
  const [pictureError, setPictureError] = useState(null);

  const handleOnChangePicture = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    const fileName = file?.name?.split(".")?.[0] ?? "New file";

    reader.addEventListener(
      "load",
      async function () {
        try {
          setStamp({ src: reader.result, alt: fileName });
          if (typeof onChangePicture === "function") {
            await onChangePicture(reader.result);
          }
        } catch (err) {
          toast.error("Unable to update stamp");
        } finally {
          setUpdatingPicture(false);
        }
      },
      false
    );

    if (file) {
      if (file.size <= sizeLimit) {
        setUpdatingPicture(true);
        setPictureError("");
        reader.readAsDataURL(file);
      } else {
        setPictureError("File size is exceeds 2MB.");
      }
    }
  };

  const handleOnClickPicture = () => {
    if (pictureRef.current) {
      pictureRef.current.click();
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <p className="py-1 font-bold">{label}</p>
      <button
        disabled={updatingPicture}
        onClick={handleOnClickPicture}
        className={classNames(
          "relative aspect-w-16 aspect-h-9 overflow-hidden rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition group focus:outline-none ali border-2 border-dashed border-gray-300",
          stamp?.src
            ? "hover:opacity-50 disabled:hover:opacity-100"
            : "border-2 border-dashed hover:border-gray-400 focus:border-gray-400 disabled:hover:border-gray-200"
        )}
      >
        {stamp?.src ? (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="green"
              className="w-24 h-24"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        ) : null}

        <div className="flex items-center justify-center">
          {!stamp?.src ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="shrink-0 rounded-full p-2 bg-gray-200 group-hover:scale-110 group-focus:scale-110 transition">
                <ArrowUpIcon className="w-4 h-4 text-gray-500 transition" />
              </div>
              <span className="text-xs font-semibold text-gray-500 transition">
                {updatingPicture ? "Uploading..." : "Upload"}
              </span>
            </div>
          ) : null}
          <input
            ref={pictureRef}
            type="file"
            accept={accept}
            onChange={handleOnChangePicture}
            className="hidden"
          />
        </div>
      </button>

      {pictureError ? (
        <span className="text-red-600 text-sm">{pictureError}</span>
      ) : null}
    </div>
  );
};

StampUpload.propTypes = {
  label: PropTypes.string,
  initialImage: PropTypes.shape({
    src: PropTypes.string,
    alt: PropTypes.string,
  }),
  objectFit: PropTypes.string,
  accept: PropTypes.string,
  sizeLimit: PropTypes.number,
  onChangePicture: PropTypes.func,
};

export default StampUpload;
