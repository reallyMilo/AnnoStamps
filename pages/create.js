import Layout from "@/components/Layout";
import ListingForm from "@/components/ListingForm";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

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

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const userNickName = user.nickname;

  return {
    props: { userNickName },
  };
}

const Create = (props) => {
  const addStamp = (data) => {
    return axios.post("/api/stamp", data);
  };
  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-12 px-5">
        <h1 className="text-xl font-medium text-gray-800">Upload a stamp</h1>
        <p className="text-gray-500">
          Fill out the form below to upload your stamp.
        </p>
        <div className="mt-8">
          <ListingForm
            buttonText="Add stamp"
            redirectPath="/"
            session={props.userNickName}
            onSubmit={addStamp}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Create;
