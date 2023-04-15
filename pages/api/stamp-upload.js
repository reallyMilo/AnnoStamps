import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import { nanoid } from "nanoid";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req, res) {
  // Upload image to Supabase
  if (req.method === "POST") {
    let { stamp } = req.body;

    if (!stamp) {
      return res.status(500).json({ message: "No image provided" });
    }

    try {
      const contentType = stamp.match(
        /data:application(\/)octet-stream;base64/
      )?.[1];
      const base64FileData = stamp.split("base64,")?.[1];

      if (!contentType || !base64FileData) {
        return res.status(500).json({ message: "Stamp data not valid" });
      }

      // Upload image
      const fileName = nanoid();
      const ext = contentType.split("/")[1];
      const path = `${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from(process.env.SUPABASE_STAMPS)
        .upload(path, decode(base64FileData), {
          upsert: true,
        });

      if (uploadError) {
        throw new Error("Unable to upload image to storage");
      }

      // Construct public URL
      const url = `${process.env.SUPABASE_URL.replace(
        ".co",
        ".in"
      )}/storage/v1/object/public/${process.env.SUPABASE_STAMPS}/${data.path}`;

      return res.status(200).json({ url });
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
