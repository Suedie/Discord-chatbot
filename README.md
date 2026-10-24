# Discord-chatbot
An attempt to create a discord chatbot

Uses transformers.js to create a discord chatbot, automatically downloads a model from hugging face (the model can be swapped out by swapping the url). Currently works, however this code first approach has constraints, since the bot itself and the model running in the same process it's not possible to host the model on one machine and the bot on another, and restarting either requires restarting both. A better approach would be to to host the model separately on something like ollama and have the discord bot be a separate process that queries the ollama server. This was mostly an exercise to learn. 

# Installation instructions

Requires discord.js, transformers.js and dotenv packages to run. npm init -y should install them automatically.

To run, first create a discord bot and invite it to your server. Give it permissions to view channels, send messages and read message history, then generate a token and create and .env file with "BOT_TOKEN=your-token". Then run with node src\index.js.

The first run will download the model, so be prepared that first run takes longer.