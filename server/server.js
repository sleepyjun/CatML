const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 8080;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

const fetch = require('node-fetch');
const run = async (src) => {
  let url = "NGROK PUBLIC_URL/?";
  // plz input your public_url/?
  // YOU MUST ADD /? TO END OF URL 
  url += src;
  const response = await fetch(url);
  const json = await response.json();
  
  if(json['cat'] === 'false') return false;

  return true;
}

const Twitter = require('node-tweet-stream');
const twitter = new Twitter({
  consumer_key: "TWITTER API KEY",
  consumer_secret: "TWITTER API KEY",
  token: "TWITTER API KEY",
  token_secret: "TWITTER API KEY"
});

twitter.track('cat');

//twitter.track('고양이');
//twitter.language('ko');

//twitter.track('ねこ');
//twitter.track('ネコ');
//twitter.track('猫');
//twitter.language('ja');

twitter.on('tweet', tweet => {
  if(tweet.extended_entities === undefined) return;
  let medias = tweet.extended_entities.media;

  medias.forEach(media => {
    if(media.type === 'photo') 
    {
      run(media.media_url).then((ret => {
        if(true === ret) 
          io.emit('tweet', media.media_url);
      })).catch((err)=>{console.log(err)})
    }
  });
});

twitter.on('error', err => {
  console.error(err);
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});