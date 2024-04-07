require('dotenv').config();
const { Client, IntentsBitField, GuildChannelManager, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const CharacterAI = require("node_characterai");
const characterAI = new CharacterAI();
const {Mutex} = require("async-mutex")
let chat;

const mutex = new Mutex();

(async () => {
    await characterAI.authenticateWithToken("cc10db4577d948cb7014cd177d9a844afa340050")
    chat = await characterAI.createOrContinueChat("k7W5R8gqjviVS_tpIEhC5CSdDwa81VE--CkT-NsjQ9k");
})();


const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

client.on('ready', function(c){
    console.log(`${c.user.tag} is ready for operation!!`);
});

async function sendMessage(message) {
    return await mutex.runExclusive(async () => {
      let response = await chat.sendAndAwaitResponse(message, true)  
      return response.text
    });
  }

client.on('messageCreate', async function(message){

    if(message.author.bot){
        return;
    }

    if(message.channel.type === "DM"){
        let airesponse = await sendMessage(message.content)

        message.author.send(airesponse)
    } else if(message.channel.id === "1226608517188812810"){
        let airesponse = await sendMessage(message.content)

        message.channel.send(airesponse)
    }
})

client.on('interactionCreate', function(interaction){
    if(interaction.commandName === "8ball"){
        let ballresponses = [
            "definitely",
            "definitely not",
            "nah",
            "yes",
            "ye",
            "nope",
            "what",
            "reply hazy",
            "no",
            "doubt it",
        ]

        let chosenresponse = Math.floor(Math.random() * ballresponses.length)
        interaction.reply(ballresponses[chosenresponse])
    }
})

client.login(process.env.TOKEN);