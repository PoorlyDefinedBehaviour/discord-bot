const ytdl = require("ytdl-core");

class GetVideoInfo {
  static async getInfo(url) {
    if (!ytdl.validateURL(url)) {
      return false;
    }
    const { title } = await ytdl.getInfo(url);

    console.log(title);

    return title;
  }
}

module.exports = GetVideoInfo;