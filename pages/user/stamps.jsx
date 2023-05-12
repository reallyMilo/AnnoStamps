import Grid from "@/components/Grid";
import Layout from "@/components/Layout";
import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";

export async function getServerSideProps(context) {
  // Check if user is authenticated
  const session = await getSession(context);

  // If not, redirect to the homepage
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Get all stamps from the authenticated user
  const stamps = await prisma.stamp.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: "desc" },
  });

  // Pass the data to the Stamps component
  return {
    props: {
      stamps: JSON.parse(JSON.stringify(stamps)),
    },
  };
}

const Stamps = ({ stamps = [] }) => {
  return (
    <Layout>
      <h1 className="container mx-auto max-w-7xl text-xl font-bold text-gray-800 px-5 mt-12">
        Your listings
      </h1>

      <div className="container mx-auto max-w-7xl py-12 px-5">
        <Grid stamps={stamps} />
      </div>
    </Layout>
  );
};

export default Stamps;
