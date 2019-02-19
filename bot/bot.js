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

const Discord = require('discord.js');
const client = new Discord.Client();
const MessageHandler = require("./commands/messagehandler/message.handler");

const greetingAttachment = new Discord.Attachment("bobEsponjaBoaNoite.png");

client.on('ready', () => {
  console.log(`Connected as ${client.user.tag}`);

  client.user.setActivity("MegaFunk", {
    type: "LISTENING"
  });

  const generalChannel = client.channels.get("536255450719584268");
  generalChannel.send("SAVEIRO REBAIxADA");

  generalChannel.send(greetingAttachment);

  console.log("TO LIVE");
})


client.on('guildMemberAdd', (member) => {
  member.channel.send(member.toString());
  member.channel.send(greetingAttachment);
})


client.on('message', async (message) => {
  if (message.author === client.user) return;
  let splitMessage = message.content.split(" ");
  const command = splitMessage[0];
  const arg = splitMessage[1];

  MessageHandler.handleMessages(command, arg, message);
});

client.login(process.env.BOT_TOKEN);