const ytdl = require("ytdl-core");
const fs = require("fs");
const Validator = require("../validation/url.validator");

class MusicPlayer {
  constructor() {
    this.songs = [];
    this.musicHandler = null;
    this.volume = 0.2;
    this.isPlaying = false;
    this.connection = null;
    this.message = null;
  }

  async play(message) {
    if (this.isPlaying) {
      message.reply("Playlist is already being played!");
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
          this.playPlaylist();
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

  skip(message) {
    if (!this.songs[1]) {
      message.reply("Can't skip there's no more songs in the playlist, maybe you're looking for /clear?");
    } else {
      this.musicHandler.end();
    }
  }

  showPlaylist(message) {
    if (!this.songs) {
      message.reply("Playlist is empty, use /add to insert new songs");
    } else {
      this.songs.forEach(song => message.reply(song));
    }
  }

  clear(message) {
    if (!this.songs) {
      message.reply("Playlist is already empty. type /commands to see the available commands");
    } else {
      this.songs = [];
      message.reply("Removed all songs from the playlist");
      this.isPlaying = false;
      this.musicHandler.end();
      this.musicHandler = null;
    }
  }

  playPlaylist() {
    console.log("this.songs", this.songs);

    ytdl([this.songs].toString(), { filter: "audioonly" })
      .pipe(fs.createWriteStream("./bot/musicPlayer/song.mp3"))
      .on("error", error => {
        console.log(error);
      })

    const dirname = __dirname.replace(/\\/g, "/");
    console.log("dirname", dirname);

    setTimeout(async () => {
      this.musicHandler = await this.connection.playFile(`${dirname}/song.mp3`);

      this.musicHandler.setVolume(this.volume)
      this.musicHandler.on("end", () => {

        console.log("song ended");
        this.songs.shift();
        if (this.songs[0] !== undefined) {
          playPlaylist();
        } else {
          this.message.reply("Playlist is empty");
          this.connection.disconnect();
          this.isPlaying = false;
          this.musicHandler = undefined;
        }
      });
    }, 5000);
  }
}

module.exports = new MusicPlayer();