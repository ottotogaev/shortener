const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');

const app = express();

mongoose.connect('mongodb://localhost/urlShortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));


// Get data
app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render('index', {shortUrls: shortUrls});
}); 

// POST input data 
app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({full: req.body.fullUrl});
  res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if(shortUrl == null) return res.sendStatus(404);
  
  // shortUrl
  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

app.listen(PORT, () => {
  console.log('App listening on port '+PORT+'!');
});