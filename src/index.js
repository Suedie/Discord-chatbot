import { TextGenerationPipeline, pipeline } from '@xenova/transformers';
import { Client, IntentsBitField} from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const pipe = await pipeline('text-generation', 'Xenova/tamillama_tiny_30m');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ],
});


let messages = [
    {
        role: "system",
        content: "You are a direct and honest chatbot.",
    },
]

const chat = [
    { role: "user", content: "Hello, how are you?" },
    { role: "assistant", content: "I'm doing great. How can I help you today?" },
    { role: "user", content: "I'd like to show off how chat templating works!" },
]

client.on('messageCreate', async function (message) {
    if (message.author.bot) return;
    else if (message.mentions.has(client.user.id)) {

        const text = message.content.replace(/<.*>/, '').trim();

        messages.push({role: "user", content: text});

        const output = await pipe(messages, 128);

        const index = output[output.length-1].generated_text.length-1;

        console.log(output[output.length-1].generated_text[index].content);

        return message.reply(output[output.length-1].generated_text[index].content);
    } else return;
  });

client.login(process.env.BOT_TOKEN);

