import axios from "axios";
import LZString from "lz-string";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      res.status(200).json({ success: true });
      break;

    case "POST":
      const { artwork } = req.body;

      try {
        const { data } = await axios.get(artwork, {
          responseType: "arraybuffer",
        });
        const album = Buffer.from(data, "binary").toString("base64");

        res.status(200).json({ album: LZString.compress(album) });
      } catch (error) {
        res.status(200).json({ error });
      }

      break;
    default:
      res.status(405).end(); //Method Not Allowed
      break;
  }
}
