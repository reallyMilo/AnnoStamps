import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  if (req.method === "POST") {
    try {
      const usersArary = req.body.users;
      const id = req.body.stampId;
      const updateStampVotes = await prisma.stamp.update({
        where: { id: id },
        data: {
          likes: { users: usersArary },
        },
      });
      res.status(200).json(updateStampVotes);
    } catch (e) {
      res.status(500).json({ message: "An error occured" });
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader("Allow", ["POST"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
