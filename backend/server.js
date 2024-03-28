const express = require("express");
const dotenv = require("dotenv");
const { Client, GatewayIntentBits } = require("discord.js");
const connectToMongoDB = require("./connnectToMongoDB");
const URL = require("./url.model");
const generateShortURL = require("./generateShortURL");
const redirectController = require("./redirectController");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.get("/", (req, res) => {
  res.send("I am Alive");
});

//redirecting to original url
app.get("/:shortId", redirectController);

//on getting a message from  discord server
client.on("messageCreate", async (message) => {
  //console.log(message);
  if (message.author.bot) return;

  //if the message starts with short handle it
  if (message.content.startsWith("short")) {
    const url = message.content.split("short")[1].trim();

    try {
      //calling the generateShortURL function to get the short url
      const { shortId } = await generateShortURL(url);
      //console.log("ShortURL", shortId);

      return message.reply({
        content: `Shortened URL: http://localhost:5000/${shortId}`,
      });
    } catch (error) {
      console.error("Error generating short URL:", error.message);
      return message.reply("An error occurred while generating the short URL.");
    }
  }

  //if message starts with analyse handle it
  if (message.content.startsWith("analyse")) {
    let shortId;
    if (message.content.startsWith("analyse http://localhost:5000/")) {
      shortId = message.content
        .split("analyse http://localhost:5000/")[1]
        .trim();
      //console.log(shortId);
    } else if (message.content.startsWith("analysehttp://localhost:5000/")) {
      shortId = message.content
        .split("analysehttp://localhost:5000/")[1]
        .trim();
      //console.log(shortId);
    } else {
      shortId = message.content.split("analyse")[1].trim();
      //console.log(shortId);
    }

    const urlData = await URL.findOne({ shortId });
    if (!urlData) {
      return message.reply(`No data found for ${shortId}`);
    }
    const totalClicks = urlData.visitHistory.length;

    return message.reply({
      content: `Total number of clicks are ${totalClicks}`,
    });
  }

  //normal message
  message.reply({
    content:
      "Hello from BOT, Enter your url in the format 'short url' to get a shorter version!",
  });
});

client.login(process.env.TOKEN);

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server Running on port ${PORT}`);
});
