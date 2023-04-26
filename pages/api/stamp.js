import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  // Check if user is authenticated
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  // Create new stamp
  if (req.method === "POST") {
    try {
      const {
        stampScreenshot,
        stampFile,
        stampTitle,
        stampDescription,
        stampCategory,
        stampRegion,
        stampModded,
      } = req.body;

      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      const stamp = await prisma.stamp.create({
        data: {
          userId: user.id,
          game: "Anno1800",
          title: stampTitle,
          description: stampDescription,
          category: stampCategory,
          region: stampRegion,
          screenshot: stampScreenshot,
          stamp: stampFile,
          modded: stampModded === "TRUE" ? true : false,
        },
      });
      res.status(200).json(stamp);
    } catch (e) {
      res.status(500).json({ message: "Something went wrong" });
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
