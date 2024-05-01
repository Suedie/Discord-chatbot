import { TextGenerationPipeline, pipeline } from '@xenova/transformers';
import { Client, IntentsBitField} from 'discord.js';
import dotenv from 'dotenv';

//Loads token from external file
dotenv.config();

let pipe = await pipeline('text-generation', 'Xenova/phi-1_5_dev');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ],
});

//defines a chat template
let chat = [
    { role: "System", content: "I am a honest chatbot." },
  ]

client.on('messageCreate', async function (message) {

    if (message.author.bot) return;

    else if (message.mentions.has(client.user.id)) {

        const text = message.content.replace(/<.*>/, '').trim();

        //Adds the message to the chat template
        chat.push({role: "user", content: text});

        let output = await pipe(chat, 128);

        const index = output[output.length-1].generated_text.length-1;

        console.log(output[output.length-1].generated_text[index].content);

        return message.reply(output[output.length-1].generated_text[index].content);
    } 
    
    else return;

  });

client.login(process.env.BOT_TOKEN);

