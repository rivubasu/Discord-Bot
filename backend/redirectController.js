const URL = require("./url.model");

const redirectController = async (req, res) => {
  const shortId = req.params.shortId;
  //console.log(shortId);
  try {
    const urlData = await URL.findOneAndUpdate(
      {
        shortId,
      },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      }
    );
    res.redirect(urlData.redirectURL);
    if (!urlData) {
      return res.status(404).json({ message: "No data found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = redirectController;
