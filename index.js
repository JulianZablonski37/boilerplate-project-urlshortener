
import dotenv from 'dotenv';
import express from 'express';
import { nanoid } from 'nanoid';
import Url from './urls.js';
import cors from 'cors';
const app = express();
import connectDB from './db.js';

app.use(express.json());
app.use(express.urlencoded({extended: true})); 
  
// Basic Configuration
const port = process.env.PORT || 3000;

connectDB()

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


const isValidUrl = urlString=> {
  var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
  '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
return !!urlPattern.test(urlString);
}


app.get('/api/shorturl/:url', async function(req,res){
    console.log(req.params.url)
    try{
      let url = await Url.findOne({ shortUrl:Number(req.params.url) });
      if (isValidUrl(url.origUrl)){
        console.log(url.origUrl)
        res.writeHead(302, {
          'Location': url.origUrl
        });
        res.end();
      }
      else{
        console.log(url)
      }
    }
    catch (err) {
      console.log(err);
      res.status(500).json('Server Error');
    }
});

// // Short URL Generator
app.post('/api/shorturl', async (req, res) => {
  console.log(req.body)
  var origUrls  = req.body.url;
  if (origUrls==='')origUrls = "https://www.freecodecamp.org/";
  if (isValidUrl(origUrls)) {
    try {
      let url = await Url.findOne({ origUrl:origUrls });
      if (url) {
        res.json({
        'orginal_url':url.origUrl,
        'short_url':url.shortUrl
      });
      } else {
        const shortUrl = await Url.collection.count()+1 ;

        url = new Url({
          'origUrl':origUrls,
          'shortUrl':shortUrl,
        });
        
        await url.save();
        res.json({
          'orginal_url':origUrls,
          'short_url':shortUrl
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json('Server Error');
    }
  } else {
    res.json({
        'error': 'invalid url' 
    });
  }
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
