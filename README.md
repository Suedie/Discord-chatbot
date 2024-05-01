# Discord-chatbot
An attempt to create a discord chatbot that integrates the phi-1.5 model

Uses transformers.js but it currently does not work. When given a list of messages it does not generate a response. 
An alternative solution would be to host the language model in a browser using something like oobabooga and let the discord bot query it for responses.
I am no longer working on this.

Requires discord.js, transformers.js and dotenv packages to run.

To run, use npm init -y, install all required packages with npm -i "package name" and create .env file with the bot token in it. Then run with node src\index.js .