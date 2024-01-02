import type { NextApiRequest, NextApiResponse } from 'next'
const axios = require('axios');

type Data = {
  listings_data: object
}

type Error = {
  message: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | Error>
  ) {
    const market_id= req.query.id
    const options = {
      method: 'GET',
      url: `https://api.realestate.parcllabs.com/v1/listings/${market_id}/current`,
      headers: {
        accept: 'application/json',
        Authorization: process.env.NEXT_PUBLIC_PARCL_KEY
      }
    };
    const { data } = await axios.request(options);

    //   example of data returned
    // {
    //     "parcl_id": 2900187,
    //     "listings": {
    //       "date": "2024-01-02",
    //       "listings_30_day": 39193
    //     }
    //   }
    
    const listings_data = data.listings.listings_30_day

    if (listings_data !== null) {
      res.status(200).json({listings_data})
    } else {
      res.status(404).json({message: 'Data not found'})
    }
  }
  