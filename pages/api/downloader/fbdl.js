import axios from 'axios';
import cheerio from 'cheerio';

const fsaver = async (urls) => {
  // same implementation as before
};

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Parameter \'url\' is required.' });
  }

  const result = await fsaver(url);

  if (result.success) {
    return res.status(200).json(result.data);
  } else {
    return res.status(400).json({ error: result.message });
  }
}
