import Layout from "@/components/Layout";
import { prisma } from "@/lib/prisma";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const Listedstamp = (stamp = null) => {
  const router = useRouter();
  const { data: session } = useSession();

  const button = useRef();

  const [isOwner, setIsOwner] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [stampFile, setStampFile] = useState();
  const [downloadCount, setDownloadCount] = useState(stamp?.downloads);
  console.log(stamp);

  useEffect(() => {
    (async () => {
      if (session?.user) {
        try {
          const owner = await axios.get(`/api/stamp/${stamp.id}/owner`);
          setIsOwner(owner?.id === session.user.id);
        } catch (e) {
          setIsOwner(false);
        }
      }
    })();
  }, [session?.user, stamp.id]);

  const deletestamp = async () => {
    let toastId;
    try {
      toastId = toast.loading("Deleting...");
      setDeleting(true);
      // Delete stamp from DB
      await axios.delete(`/api/stamps/${stamp.id}`);
      // Redirect user
      toast.success("Successfully deleted", { id: toastId });
      router.push("/stamps");
    } catch (e) {
      toast.error("Unable to delete stamp", { id: toastId });
      setDeleting(false);
    }
  };

  const incrementDownladsCount = () => {
    axios.post("/api/downloads", { stamp: stamp.id });
    setDownloadCount((prevDownloadCount) => prevDownloadCount + 1);
  };

  return (
    <Layout>
      <div className="max-w-screen-lg mx-auto py-12 px-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-4 space-y-4 mx-5">
          {isOwner ? (
            <div className="flex items-center space-x-2">
              {/* <button
                type="button"
                disabled={deleting}
                onClick={() => router.push(`/stamps/${stamp.id}/edit`)}
                className="px-4 py-1 border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition rounded-md disabled:text-gray-800 disabled:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Edit
              </button> */}

              {/* <button
                type="button"
                disabled={deleting}
                onClick={deletestamp}
                className="rounded-md border border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white focus:outline-none transition disabled:bg-rose-500 disabled:text-white disabled:opacity-50 disabled:cursor-not-allowed px-4 py-1"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button> */}
            </div>
          ) : null}
        </div>

        <div className="mt-6 relative aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg shadow-md overflow-hidden mx-5">
          {stamp?.screenshot ? (
            <Image
              src={stamp.screenshot}
              alt={stamp.title}
              fill
              sizes="100vw"
              style={{
                objectFit: "cover",
              }}
            />
          ) : null}
        </div>
        <h1 className="text-2xl font-semibold truncate mt-6 mx-5">
          {stamp?.title ?? ""}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mx-5 pb-10">
          <div>
            <ol className="items-center text-gray-500 mt-4 mb-2">
              <li>
                <span className="font-bold">Category:</span>{" "}
                {stamp.category ?? ""}
              </li>
              <li>
                <span className="font-bold">Region:</span> {stamp.region ?? ""}
              </li>
            </ol>
            <a
              href={`${stamp?.stamp}?download=${stamp?.title}`}
              className="bg-[#6DD3C0] py-2 px-4 rounded-md mt-5 inline-block font-bold"
              onClick={incrementDownladsCount}
            >
              <ArrowDownTrayIcon className="w-6 h-6 inline-block mr-2" />
              Download Stamp
            </a>
            <p className="text-sm flex gap-1 items-center cursor-default pt-3">
              Total Downloads:
              <span className="text-sm flex gap-1 items-center cursor-default">
                {downloadCount}
              </span>
            </p>
          </div>
          <div>
            <p className="text-lg break-words">{stamp.description ?? ""}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticPaths() {
  // Get all stamps IDs from the database
  const stamps = await prisma.stamp.findMany({
    select: { id: true },
  });

  return {
    paths: stamps.map((stamp) => ({
      params: { id: stamp.id },
    })),
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  // Get the current stamp from the database
  const stamp = await prisma.stamp.findUnique({
    where: { id: params.id },
  });

  if (stamp) {
    return {
      props: JSON.parse(JSON.stringify(stamp)),
    };
  }

  // return {
  //   notFound: true,
  // };

  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
}

export default Listedstamp;
