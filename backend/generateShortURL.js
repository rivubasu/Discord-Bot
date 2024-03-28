const URL = require("./url.model");
const shortid = require("shortid");

async function generateShortURL(url) {
  // Check if a record already exists for the given redirect URL
  const existingURL = await URL.findOne({ redirectURL: url });

  if (existingURL) {
    //console.log("short url already exists", existingURL);
    // If a record already exists, return the existing short ID
    return {
      shortId: existingURL.shortId,
    };
  } else {
    const newShortId = shortid();

    try {
      await URL.create({
        shortId: newShortId,
        redirectURL: url,
        visitHistory: [],
      });
      //console.log(newShortId);
      return {
        shortId: newShortId,
      };
    } catch (error) {
      console.log("Error in GenerateShortURL function", error.message);
    }
  }
}

module.exports = generateShortURL;
