import type { NextApiRequest, NextApiResponse } from 'next'
const axios = require('axios');

type  Data = {
  singles_data: object
}

type Error = {
  message: string
}

// PARCL_ID = 2899841 # CHARLOTTE MSA area
// PARCL_ID = 2900282 # RALEIGH MSA area


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  const PARCL_ID = req.query.id
  
  console.log('incoming id: ', PARCL_ID)
  let singles_data = [];
  async function get_data() {
    const wanted_vars = [
      'male_single_population',
      'female_single_population',
    ]
    for (let i = 0; i < wanted_vars.length; i++) {
      let variable = wanted_vars[i]
      console.log('variable: ', variable)
      const options = {
        method: 'GET',
        url: `https://api.realestate.parcllabs.com/v1/demographics/${PARCL_ID}/friendly?start_year=2021&end_year=2021&order=desc&variable=${wanted_vars[i]}`,
        headers: {
          accept: 'application/json',
          Authorization: process.env.NEXT_PUBLIC_PARCL_KEY
        }
      };
      const { data } = await axios.request(options);
      singles_data.push({
        [variable]: data.results[variable][0].value
      })
    }
  }
  await get_data()

  if (singles_data !== null) {
    res.status(200).json({singles_data})
  } else {
    res.status(404).json({message: 'Data not found'})
  }
}
