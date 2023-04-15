import Input from "@/components/Input";
import Layout from "@/components/Layout";
import { prisma } from "@/lib/prisma";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { Form, Formik } from "formik";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import * as Yup from "yup";
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

  // Get info of the authenticated user
  const singleUser = await prisma.user.findFirst({
    where: { email: session.user.email },
  });

  // Pass the data to the Account component
  return {
    props: {
      user: JSON.parse(JSON.stringify(singleUser)),
      session,
    },
  };
}
const Account = (props) => {
  const router = useRouter();
  const handleSumbit = async (values) => {
    let toastId;
    try {
      toastId = toast.loading("Saving...");
      const { data } = await axios.post("/api/username/", { values });
      if (data.nickname) {
        toast.success("Successfully saved", { id: toastId });
        router.push("/account");
      } else {
        toast.error("An error occured, pleas try again later.", {
          id: toastId,
        });
      }
    } catch (e) {
      if (e.response.data.message === "P2002") {
        toast.error("Username not available!", { id: toastId });
      } else {
        toast.error("An error occured, pleas try again later.", {
          id: toastId,
        });
      }
    }
  };

  return (
    <>
      <Layout>
        <div className="container mx-auto py-12 px-5">
          <h1 className="text-xl font-bold mb-5">Account Details</h1>
          <section className="grid grid-cols-1 md:grid-cols-2 space-x-10">
            <div className="">
              <ul>
                {props.user.name && (
                  <li className="pb-5">
                    <p className="font-bold mb-2">Name</p>
                    <input
                      className="w-full shadow-sm rounded-md py-2 pl-4 truncate border focus:outline-none focus:ring-4 focus:ring-opacity-20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      type="text"
                      value={props.user.name}
                      disabled
                    />
                  </li>
                )}

                <li className="pb-5">
                  <p className="font-bold mb-2">Email</p>
                  <input
                    className="w-full shadow-sm rounded-md py-2 pl-4 truncate border focus:outline-none focus:ring-4 focus:ring-opacity-20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    type="text"
                    value={props.user.email}
                    disabled
                  />
                </li>
              </ul>
            </div>

            <div>
              {props.user.nickname ? (
                <>
                  <p className="font-bold mb-2">Username</p>
                  <input
                    className="w-full shadow-sm rounded-md py-2 pl-4 truncate border focus:outline-none focus:ring-4 focus:ring-opacity-20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    type="text"
                    value={props.user.nickname}
                    disabled
                  />
                </>
              ) : (
                <Formik
                  initialValues={{
                    userName: "",
                  }}
                  validationSchema={Yup.object().shape({
                    userName: Yup.string().max(50).trim().required("Required"),
                  })}
                  onSubmit={handleSumbit}
                >
                  {({ isSubmitting, isValid }) => (
                    <Form>
                      <p className="font-bold mb-2">Username</p>
                      <Input
                        name="userName"
                        type="text"
                        placeholder={
                          props.user.nickname
                            ? props.user.nickname
                            : "Sir Archibald Blake"
                        }
                      />
                      <p className="py-2 text-sm text-slate-400">
                        You can set a username that will be displayed with your
                        uploaded stamps.
                        <br />
                        <span className="text-red-600 font-bold flex items-center space-x-6 mt-1">
                          <ExclamationCircleIcon className="w-6 h-6 inline-block mr-2" />
                          Usernames cannot be changed!
                        </span>
                      </p>
                      <button
                        type="submit"
                        disabled={!isValid}
                        className="bg-yellow-600 text-white py-2 px-6 rounded-md focus:outline-none focus:ring-4 focus:ring-rose-600 focus:ring-opacity-50 hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-yellow-700 mt-5"
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </button>
                    </Form>
                  )}
                </Formik>
              )}
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
};
export default Account;
