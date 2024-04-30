const { pipeline } = require("@xenova/transformers");
import { pipeline } from "@xenova/transformers";
require("dotenv").config();

let pipe = await pipeline("text-generation", model="microsoft/phi-1_5");

const { Client, IntentsBitField} = require("discord.js");

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ],
});

client.on("messageCreate", function (message) {
    if (message.author.bot) return;

    const userQuery = message.content;
    const generatedText = pipe._call(prompt);
    return message.reply(generatedText);
  });

client.login(process.env.BOT_TOKEN);

