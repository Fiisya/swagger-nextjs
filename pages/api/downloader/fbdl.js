import axios from "axios";
import cheerio from "cheerio";

const fsaver = async (urls) => {
  const baseUrl = process.env.FSAVER_BASE_URL || "https://fsaver.net";
  const url = `${baseUrl}/download/?url=${encodeURIComponent(urls)}`;
  const headers = {
    "Upgrade-Insecure-Requests": "1",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "sec-ch-ua": '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
  };

  try {
    const response = await axios.get(url, { headers });

    if (!response.data) {
      throw new Error("No HTML content received");
    }

    const html = response.data;
    const $ = cheerio.load(html);

    const videoSrc = $(".video__item").attr("src");
    const videoPoster = $(".video__item").attr("poster");
    const name = $(".download__item__user_info div").first().text().trim();
    const profilePicture = $(".download__item__profile_pic img").attr("src");

    if (!videoSrc || !videoPoster || !profilePicture) {
      throw new Error("Unable to extract required data");
    }

    return {
      success: true,
      data: {
        video: baseUrl + videoSrc,
        thumbnail: baseUrl + videoPoster,
        userInfo: {
          name,
          profilePicture: baseUrl + profilePicture,
        },
      },
    };
  } catch (error) {
    console.error("Error in fsaver:", error.message);
    return { success: false, message: error.message };
  }
};
