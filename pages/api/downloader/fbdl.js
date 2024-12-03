import axios from "axios"
import cheerio from "cheerio"

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }
  const { url } = req.query
  if (!url) {
    return res.status(400).json({ error: q.msg.qUrl })
  }
  const result = await fsaver(url)
  if (result.status === "error") {
    return res.status(500).json(result)
  }
  res.status(200).json(result)
}

const fsaver = {
    download: async (urls) => {
        const url = `https://fsaver.net/download/?url=${urls}`;
        const headers = {
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
            "sec-ch-ua": '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"'
        };
        try {
            const response = await axios.get(url, { headers });
            const html = response.data;
            const data = await fsaver.getData(html); // Memastikan getData menunggu hasil
            return data;
        } catch (error) {
            console.error("Error:", error.response ? error.response.data : error.message);
            return { success: false, message: error.message };
        }
    },
    getData: async (content) => {
        try {
            const baseUrl = 'https://fsaver.net';
            const $ = cheerio.load(content);
            const videoSrc = $('.video__item').attr('src');
            const videoPoster = $('.video__item').attr('poster');
            const name = $('.download__item__user_info div').first().text().trim();
            const profilePicture = baseUrl + $('.download__item__profile_pic img').attr('src');
            
            const result = {
                video: baseUrl + videoSrc,
                thumbnail: baseUrl + videoPoster,
                userInfo: {
                    name,
                    profilePicture,
                },
            };
            return result;
        } catch (error) {
            console.error("Error:", error.response ? error.response.data : error.message);
            return { success: false, message: error.message };
        }
    }
};