import { TextGenerationPipeline, pipeline } from '@xenova/transformers';
import { Client, IntentsBitField} from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

let pipe = await pipeline('text-generation', 'Xenova/phi-1_5_dev');
//const pipe = new TextGenerationPipeline('microsoft/phi-1_5');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ],
});

client.on('messageCreate', function (message) {
    if (message.author.bot) return;
    else if (message.mentions.has(client.user.id)) {
        const text = message.content.replace(/<.*>/, '').trim();
        const output = pipe._call(text);
        return message.reply(text);
    } else return;
  });

client.login(process.env.BOT_TOKEN);

