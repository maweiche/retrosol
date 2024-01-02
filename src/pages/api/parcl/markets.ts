// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const axios = require('axios');

type Data = {
  name: string
}


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  const state_abbreviation = req.query.state
  const options = {
    method: 'GET',
    url: `https://api.realestate.parcllabs.com/v1/place/markets?state_abbreviation=${state_abbreviation}`,
    headers: {
      accept: 'application/json',
      Authorization: process.env.NEXT_PUBLIC_PARCL_KEY
    }
  };
    axios.request(options).then(function (response) {
        console.log(response.data);
        res.status(200).json(response.data)
    }).catch(function (error) {
        console.error(error);
    });
}
