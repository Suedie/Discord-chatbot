import { pipeline } from "@xenova/transformers";
import { Client, IntentsBitField} from "discord.js";
import dotenv from "dotenv";

dotenv.config();

let pipe = await pipeline("text-generation", "microsoft/phi-1_5");

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

