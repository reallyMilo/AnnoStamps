import Grid from "@/components/Grid";
import Layout from "@/components/Layout";
import { PrismaClient } from "@prisma/client";
import Image from "next/image";
const prisma = new PrismaClient();
export async function getServerSideProps() {
  // Get all stamps
  const stamps = await prisma.stamp.findMany({
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
    include: {
      user: {
        select: {
          nickname: true,
        },
      },
    },
  });
  // Pass the data to the Home page
  return {
    props: {
      stamps: JSON.parse(JSON.stringify(stamps)),
    },
  };
}

export default function Home({ stamps = [] }) {
  return (
    <Layout>
      <div className="bg-[#606221]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-20 container mx-auto">
          <div className="text-white py-12 md:py-24 px-5">
            <h1 className="text-4xl md:text-5xl font-bold">
              Stamps for Anno 1800
            </h1>
            <h2 className="text-xl md:text-4xl">Find your next layout</h2>
          </div>
          <div className="relative w-full max-w-[615px] h-[300px] md:h-auto">
            <Image
              src="/header.jpg"
              alt=""
              fill
              priority
              sizes="(max-width: 320px) 100vw"
              style={{
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto max-w-7xl py-12 px-5">
        <Grid stamps={stamps} />
      </div>
    </Layout>
  );
}
