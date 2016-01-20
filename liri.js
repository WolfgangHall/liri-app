var twitKeys = require('../keys.js');
var fs = require('fs');
var request = require('request');
var Twitter = require('twitter');
var spotify = require('spotify');



var params = process.argv.slice(2);
var action = params[0];
var value = params[1]; 



switch(action){
  case 'my-tweets':
  catchTweets();
  break;

  case 'spotify-this-song':
  if(value){
    catchSpotify(value);
  } else {
    catchSpotify("What is my age again");
  }  
  break;

  case 'movie-this':
  if(value){
    catchOmdb(value);
  } else {
    catchOmdb("Mr.Nobody");
  }  
  break;

  case 'do-what-it-says':
  dowhatitsays();
  break;
}


function dowhatitsays() {
  fs.readFile("random.txt", "utf8", function(error,data) {

    var dataArr = data.split(',');

    console.log(dataArr);

     var dwisAction = dataArr[0];
     var dwisVal  = dataArr[1];

    if (dwisAction === 'spotify-this-song') {
      catchSpotify (dwisVal);
    } else if (dwisAction === 'movie-this') {
      catchOmdb (dwisVal)
    } else if (dwisAction === 'my-tweets') {
      catchTweets();
    }

  }); 
};


function catchTweets () {
  var client = new Twitter (twitKeys.twitKeys);

  client.get('statuses/user_timeline', {screen_name: 'wolfgang_hall'}, function (error, data, response){
    for (var i = 0; i < data.length; i++) {
      var tweetData = data[i].text + "\r\n" + data[i].created_at;
      console.log(tweetData);


      fs.appendFile("log.txt", tweetData  + "\r\n" + "\r\n", function(err) {
        if(err) {
          return console.log(err);
        }
      });
    };
  });
};



function catchSpotify() {

  spotify.search({ type: 'track', query: value }, function(err, data) {
    if ( err ) {
      console.log('Error occurred: ' + err);
      return;
    }
    
    var musicInfo = data.tracks.items[0];
    
    musicData = "Artist: " + musicInfo.artists[0].name + "\r\n" + 
    "Album Name: " + musicInfo.album.name + "\r\n" + 
    "Song Name: " + musicInfo.name + "\r\n";
    console.log(musicData);
    
    fs.appendFile("log.txt", musicData  + "\r\n" + "\r\n", function(err) {
      if(err) {
        return console.log(err);
      }
    });

  });

}




function catchOmdb (value) {
  var movieUrl = 'http://www.omdbapi.com/?t='+ value +'&y=&plot=short&r=json&tomatoes=true';
  request(movieUrl, function (error, response, body) {

    if (!error && response.statusCode == 200) {

      var dataJSON = JSON.parse(body);

      movieData = "Title: " + dataJSON.Title + "\r\n" +
      "Year: " + dataJSON.Year + "\r\n" +
      "IMDB Rating: " + dataJSON.imdbRating + "\r\n" +
      "Country: " + dataJSON.Country + "\r\n" +
      "Language: " + dataJSON.Language + "\r\n" +
      "Plot: " + dataJSON.Plot + "\r\n" +
      "Actors: " + dataJSON.Actors + "\r\n" +
      'Tomato Rating: ' + dataJSON.tomatoRating + "\r\n" +
      'Tomato URL: ' + dataJSON.tomatoURL + "\r\n";
      console.log(movieData); 
    }

    fs.appendFile("log.txt", movieData + "\r\n" + "\r\n", function(err) {
      if(err) {
        return console.log(err);
      }
    });
  });

}