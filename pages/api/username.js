import { prisma } from "@/lib/prisma";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  // Check if user is authenticated
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  // update nickname
  if (req.method === "POST") {
    try {
      const nickName = req.body.values.userName;
      const updateUser = await prisma.user.update({
        where: { email: session.user.email },
        data: {
          nickname: nickName,
        },
      });
      res.status(200).json(updateUser);
    } catch (e) {
      if (e.code === "P2002") {
        res.status(500).json({ message: "P2002" });
      } else {
        res.status(500).json({ message: "An error occured" });
      }
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
