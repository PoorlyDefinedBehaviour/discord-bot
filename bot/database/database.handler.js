require("dotenv").config();
const axios = require("axios");

class DatabaseHandler {
  constructor() {
    this.dbSongs = [];
    this.setDbSongs();
    setInterval(() => {
      this.setDbSongs()
    }, 120000);
  }

  async setDbSongs() {
    const data = await this.read();
    this.dbSongs = data.data.map(object => object.url);
  }

  async create(document) {

    if (this.dbSongs.includes(document.url)) {
      return `${document.title} is already in the database!`;
    }
    await axios.post(process.env.CREATE_ROUTE, document);
    this.dbSongs.push(document.url);
    return `${document.title} added to the database`;
  }

  read(id) {
    const _id = id || {};
    return axios.get(process.env.READ_ROUTE);
  }

  update(id, data) {
    return axios.patch(`${process.env.UPDATE_ROUTE}${id}`, data);
  }

  delete(id) {
    return axios.delete(`${process.env.DELETE_ROUTE}${id}`);
  }
}

module.exports = new DatabaseHandler();