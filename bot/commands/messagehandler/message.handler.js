const MusicPlayer = require("../../musicPlayer/music.player");

class MessageHandler {
  constructor() {
    this.greetings = ['FALA MEU CONSAGRADO', 'FALA BOCA DE GUDANG', 'FALA CAMPEAO', 'FALA CHEFE', 'FALA MEMO JOGADOR', 'BOA NOITE FILHO DA PUTA',
      'TAO BOCA DE SERROTE', 'BOA NOITE PRINCESA', 'BOA NOITE CARALHO', 'OOGA BOOGA', 'BOA NOITE CAMPEAO', 'LOUCO DE POTENAY'
    ];
  }

  async handleMessages(command, arg, message) {
    switch (command) {
      case '/join':
        if (!message.guild) return;

        if (message.member.voiceChannel) {
          await message.member.voiceChannel.join();
          const index = Math.floor(Math.random() * greetings.length);
          message.reply(this.greetings[index]);
        }
        break;

      case '/play':
        MusicPlayer.play(message);
        break;

      case '/add':
        MusicPlayer.add(message, arg);
        break;

      case '/volume':
        MusicPlayer.setVolume(message, arg);
        break;

      case '/pause':
        MusicPlayer.pause(message);
        break;

      case '/resume':
        MusicPlayer.resume(message);
        break;

      case '/skip':
        MusicPlayer.skip(message);
        break;

      case '/showplaylist':
        MusicPlayer.showPlaylist(message);
        break;

      case '/clear':
        MusicPlayer.clear(message);
        break;

      case '/commands':
        message.reply("\n\
          [!] /add --- adds a song to the playlist\n\
          [!] /join --- brings bot to your channel\n\
          [!] /play --- starts the playlist\n\
          [!] /skip --- skips the current song\n\
          [!] /volume --- changes the volume of the song\n\
          [!] /pause --- pauses the song\n\
          [!] /resume --- unpauses the song\n\
          [!] /showplaylist --- lists the songs in the playlist\n\
          [!] /clear --- removes every song from the playlist\n");
        break;

      default:
        if (command.startsWith('/')) {
          message.reply("type /commands to see the available commands");
        }
        break;
    }
  }

}

module.exports = new MessageHandler();
