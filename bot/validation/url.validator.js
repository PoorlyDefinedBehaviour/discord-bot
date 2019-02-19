const ytdl = require("ytdl-core");

class Validator {
  static isURLValid(url) {
    if (!url) {
      return false;
    }

    if (!ytdl.validateURL(url)) {
      return false;
    }

    return true;
  }
}

module.exports = Validator;