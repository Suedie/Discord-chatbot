import { AutoModel, AutoModelForCausalLM, AutoTokenizer, pipeline } from '@xenova/transformers';
import { Client, IntentsBitField} from 'discord.js';
import dotenv from 'dotenv';

//used to load token from external file
dotenv.config();


//link to language model from hugging face
// https://huggingface.co/models?pipeline_tag=text-generation&library=transformers.js
const source = 'Xenova/phi-1_5_dev';

const tokenizer = await AutoTokenizer.from_pretrained(source);
const model = await AutoModelForCausalLM.from_pretrained(source);

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ],
});

//List of chat messages, model should hook from here and add responses
let chat = [
    { role: "system", content: "You are an honest chatbot." },
]

client.on('messageCreate', async function (message) {

    if (message.author.bot) return;

    else if (message.mentions.has(client.user.id)) {

        //Removes the username @ from the discord message
        const text = message.content.replace(/<.*>/, '').trim();

        //Adds the message to the messages list
        chat.push({role: "user", content: text});

        //Uses default chat template
        //Generation prompt adds a "assistant" JSON object to the list of messages and the model will generate the content as its response
        const tokenized_chat = tokenizer.apply_chat_template(chat, {add_generation_prompt: true, tokenize: true, return_tensor: "np"});

        //await resolves the promise object returned from generate
        //should generate a response but for some reason does nothing
        let outputs = await model.generate(tokenized_chat);

        let reply = tokenizer.decode(outputs[0], {skip_special_tokens: true});

        return message.reply(reply);
    } 
    
    else return;

  });

client.login(process.env.BOT_TOKEN);

