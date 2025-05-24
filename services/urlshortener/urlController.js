const Url = require('./urlModel');
const shortid = require('shortid');
const { generateRandomString } = require('./utils/urlShortner.helper');
exports.shortenUrl = async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) return res.status(400).json({ error: 'Original URL is required' });

  const shortCode = generateRandomString();
  const newUrl = new Url({ originalUrl, shortCode });
  try {
    await newUrl.save();
    res.json({ shortUrl: `http://localhost:3000/api/v1/${shortCode}` });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.redirectUrl = async (req, res) => {
  const { code } = req.params;
  try {
    const url = await Url.findOne({ shortCode: code });
    if (url) return res.redirect(url.originalUrl);
    res.status(404).json({ error: 'URL not found' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
