import type { NextApiRequest, NextApiResponse } from "next";
const axios = require("axios");

// https://api.dictionaryapi.dev/api/v2/entries/en/${word}

type Data = {
  data: object;
};

type Error = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>,
) {
  const { word } = req.query;
  const options = {
    method: "GET",
    url: `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
  };
  const response = await axios.request(options);

  const data = response.data[0];
  console.log(data.meanings.length);

  if (data.meanings.length > 0 && data) {
    res.status(200).json({ data });
  } else {
    res.status(404).json({ message: "Data not found" });
  }
}
