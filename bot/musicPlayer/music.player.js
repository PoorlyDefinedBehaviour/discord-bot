const ytdl = require("ytdl-core");
const fs = require("fs");
const Validator = require("../validation/url.validator");
const DatabaseHandler = require("../database/database.handler");

class MusicPlayer {
  constructor() {
    this.songs = [];
    this.dbSongs = [];
    this.musicHandler = null;
    this.volume = 0.2;
    this.isPlaying = false;
    this.connection = null;
    this.message = null;
    this.playlist = "NONE";
  }

  async play(message) {
    if (this.isPlaying) {
      message.reply("A playlist is already being played, use /stop to stop it!");
    } else if (!this.songs) {
      message.reply("Playlist is empty!")
    } else if (!message.member.voiceChannel) {
      message.reply("You need to be in a voice channel for me to play");
    } else {
      await message.member.voiceChannel.join()
        .then(connection => {
          this.connection = connection;
          this.message = message;
          this.isPlaying = !this.isPlaying;
          this.playlist = "LOCAL";
          this.playPlaylist(this.songs);
        })
        .catch(console.log);
    }
  }

  add(message, arg) {
    if (!Validator.isURLValid(arg)) {
      this.message = message;
      message.reply("The URL is invalid!");
    } else {
      this.songs.push(arg);
      message.reply("Song added to the playlist");
    }
  }

  setVolume(message, arg) {
    if (arg === undefined) {
      message.reply("You need to give me a volume between 0 and 1")
    } else if (arg > 1) {
      message.reply("You need to set a volume between 0 and 1");
    } else if (this.musicHandler === null) {
      message.reply("There's no song being played at the moment");
    }

    this.volume = arg < 1.0 ? arg : this.volume;
    this.musicHandler.setVolume(this.volume);
  }

  pause(message) {
    if (!this.isPlaying) {
      message.reply("No song is being played at the moment");
    } else {
      this.musicHandler.pause();
    }
  }

  resume(message) {
    if (!this.isPlaying) {
      message.reply("No song is being played at the moment");
    } else {
      this.musicHandler.resume();
    }
  }

  skip(message, arg) {
    const currentPlaylist = this.playlist === "LOCAL" ? this.songs : this.dbSongs;

    if (currentPlaylist[1] === undefined) {
      message.reply("Can't skip there's no more songs in the playlist, maybe you're looking for /clear or /stop");
    } else {
      const amount = arg || 0;
      if (amount) {
        if (amount > currentPlaylist.length) {
          message.reply(`Can't skip that many, the playlist has ${currentPlaylist.length} songs`);
          return;
        }
        if (currentPlaylist === this.songs) {
          this.songs.splice(0, amount);
        } else {
          this.dbSongs.splice(0, amount);
        }
      }
      this.musicHandler.end();
    }
  }

  showPlaylist(message) {
    if (this.songs.length < 1) {
      message.reply("The local playlist is empty, use /add to add songs to the local playlist");
    } else {
      this.songs.forEach(song => message.reply(song));
    }
  }

  dbShowPlaylist(message) {
    if (this.dbSongs.length < 1) {
      message.reply("The database playlist is empty, use /dbplay to fill the playlist with songs from the database");
    } else {
      this.dbSongs.forEach(song => message.reply(song));
    }
  }

  stop(message) {
    if (this.isPlaying) {
      this.playlist = "NONE";
      this.isPlaying = false;
      if (this.playlist === "LOCAL") {
        this.songs = [];
      } else {
        this.dbSongs = [];
      }
      this.musicHandler.end();
    } else {
      message.reply("No playlist is being played at the moment");
    }
  }

  async playPlaylist(songs) {

    ytdl(songs[0], { filter: "audioonly" })
      .pipe(fs.createWriteStream("./bot/musicPlayer/song.mp3"))
      .on("error", error => {
        console.log(error);
      })

    const dirname = __dirname.replace(/\\/g, "/");

    setTimeout(async () => {
      const { title } = await ytdl.getInfo(songs[0]);
      this.message.channel.send(

        "```CSS\n" + `λ Playing: ${title}` + "```"

      );
      this.musicHandler = await this.connection.playFile(`${dirname}/song.mp3`);

      this.musicHandler.setVolume(this.volume)
      this.musicHandler.on("end", () => {
        if (!this.isPlaying)
          return;

        console.log("song ended");
        songs.shift();
        if (songs[0] !== undefined) {
          this.playPlaylist(songs);
        } else {
          this.message.reply("Playlist is empty");
          this.connection.disconnect();
          this.isPlaying = false;
          this.playlist = "NONE";
          this.musicHandler = null;
        }
      });

      this.musicHandler.on("error", error => {
        console.log("error on musicHandler", error);
      })
    }, 5000);
  }

  async playFromDatabase(message, data) {
    if (this.isPlaying) {
      message.reply("A playlist is already being played");
      return;
    }

    this.dbSongs = data.data.map(object => object.url);

    if (!this.dbSongs) {
      message.reply("The databse is empty");
      return;
    }

    await message.member.voiceChannel.join()
      .then(connection => {
        this.connection = connection;
        this.message = message;
        this.isPlaying = true;
        this.playlist = "DATABASE";
        this.playPlaylist(this.dbSongs);
      })
      .catch(console.log);
  }
}

module.exports = new MusicPlayer();