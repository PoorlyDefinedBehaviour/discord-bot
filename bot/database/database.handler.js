/**
 * Send JSON on POST request with axios
 * const fakeData = [ { fake: 'data' } ];
  const url = 'http://192.168.90.251:8764/common/dotLogController/sendLog';
  axios.post(url, {
  topic: 'topic',
  logs: fakeData, // look ma, no JSON.stringify()!
});
 */

require("dotenv").config();
const axios = require("axios");

class DatabaseHandler {
  static create(document) {
    return axios.post(process.env.CREATE_ROUTE, document);
  }

  static read(id) {
    return axios.get(process.env.READ_ROUTE, id);
  }

  static update(id, data) {
    return axios.patch(`${process.env.UPDATE_ROUTE}${id}`, data);
  }

  static delete(id) {
    return axios.delete(process.env.DELETE_ROUTE, id);
  }
}

module.exports = DatabaseHandler;