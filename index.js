const express = require('express')
const app = express()
const cors = require('cors')
const screenshot = require('url-to-screenshot')
const dotenv = require('dotenv').config()

var whitelist = [
  `http://localhost:${process.env.INCOMING_PORT}`,
  `https://localhost:${process.env.INCOMING_PORT}`,
  `https://${process.env.LIVE_URL}`
];

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error(`Not allowed by CORS - origin: ${origin}`))
    }
  }
}

app.get('/', (req, res)=>{
  res.send(`${process.env.LIVE_URL}`);
})

app.get('/image', cors(corsOptions), (req, res, next)=>{
  let url = req.query.url
  new screenshot(url)
    .sslProtocol('any')
    .width(800)
    .height(600)
    .clip()
    .capture()
    .then(img =>{
      imgdata = img.toString('base64')
      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify({image: imgdata}))
    })
})

var port = process.env.PORT || 5000;

app.listen(port);
console.log("server started " + port);