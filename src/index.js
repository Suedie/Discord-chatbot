import { AutoModelForCausalLM, AutoTokenizer } from '@huggingface/transformers';
import { Client, IntentsBitField} from 'discord.js';
import dotenv from 'dotenv';

//used to load token from external file
dotenv.config();


//link to language model from hugging face
// https://huggingface.co/models?pipeline_tag=text-generation&library=transformers.js
const source = 'onnx-community/Qwen2.5-0.5B-Instruct-abliterated-ONNX';

const tokenizer = await AutoTokenizer.from_pretrained(source);
//q8 keeps the download at ~0.5 GB (default fp32 is ~2 GB) and is fast on cpu
const model = await AutoModelForCausalLM.from_pretrained(source, { dtype: 'q8' });

//GuildMembers is a privileged intent the bot doesn't need, requesting it without enabling it in the developer portal makes login fail
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ],
});

//List of chat messages, model should hook from here and add responses
const systemPrompt = { role: "system", content: "You are an honest chatbot." };
let chat = [];

//Keep only the most recent messages so the prompt doesn't grow forever
const MAX_HISTORY = 20;

client.on('messageCreate', async function (message) {

    if (message.author.bot) return;

    if (!message.mentions.has(client.user.id)) return;

    try {
        //Removes the bot @ mentions from the discord message (non-greedy, so other text with <> survives)
        const text = message.content.replace(/<@!?\d+>/g, '').trim();
        if (!text) return;

        //Adds the message to the messages list
        chat.push({role: "user", content: text});
        chat = chat.slice(-MAX_HISTORY);

        await message.channel.sendTyping();

        //Uses default chat template
        //Generation prompt adds a "assistant" JSON object to the list of messages and the model will generate the content as its response
        //return_dict gives { input_ids, attention_mask } tensors, which is what generate expects
        const inputs = tokenizer.apply_chat_template([systemPrompt, ...chat], {add_generation_prompt: true, return_dict: true});

        //generate takes a single options object, and its default max_length of 20 is shorter than the prompt,
        //so max_new_tokens is needed or it returns without generating anything
        const outputs = await model.generate({
            ...inputs,
            max_new_tokens: 256,
            do_sample: true,
            temperature: 0.7,
            top_p: 0.9,
        });

        //outputs contains the prompt followed by the response, so cut the prompt off before decoding
        const promptLength = inputs.input_ids.dims.at(-1);
        const reply = tokenizer.batch_decode(outputs.slice(null, [promptLength, null]), {skip_special_tokens: true})[0].trim();

        chat.push({role: "assistant", content: reply});

        //Discord rejects empty messages and messages over 2000 characters
        return message.reply(reply.slice(0, 2000) || "...");
    } catch (error) {
        console.error(error);
        return message.reply("Sorry, something went wrong generating a response.").catch(() => {});
    }

  });

client.once('clientReady', () => console.log(`Logged in as ${client.user.tag}`));

client.login(process.env.BOT_TOKEN);
