import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const stampId = req.body.stamp;

      const stamp = await prisma.stamp.findUnique({
        where: { id: stampId },
      });

      const updateStampDownloads = await prisma.stamp.update({
        where: { id: stampId },
        data: {
          downloads: stamp.downloads + 1,
        },
      });
      res.status(200).json(updateStampDownloads);
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
