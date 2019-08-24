require("dotenv").config();

var axios = require('axios');
var moment = require('moment');
moment().format();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var fs = require('fs');

var shield = "\n========================================================================\n";

var command = process.argv[2];
var userInput = process.argv.slice(3).join(" ");

function switcher(command, userInput) {
    switch (command) {
        case "concert-this":
            concertThis(userInput);
            break;

        case "spotify-this-song":
            spotifyThis(userInput);
            break;

        case "movie-this":
            movieThis(userInput);
            break;

        case "do-what-it-says":
            doWhatItSays();
            break;
    }
}

function concertThis(userInput) {

    var concertliri = `\nHere are some concerts with the result "${userInput}":\n\n`;
    var artist = userInput;

    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

    axios.get(queryUrl).then(
        function (response) {
            for (var i = 0; i < response.data.length; i++) {
                var datetime = response.data[i].datetime;

                var concertData = [`${i}. Venue: ${response.data[i].venue.name}
                City: ${response.data[i].venue.city}
                Date: ${moment(datetime)}`].join();

                console.log(concertData);
                console.log(shield);

                fs.appendFile("log.txt", concertliri + concertData + "\n" + shield, function (err) {
                    if (err) throw err;
                });
            }
        })
        .catch(function (error) {
            if (error.response) {
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
};

function spotifyThis(userInput) {

    var songliri = `\nHere are some songs with the result "${userInput}":\n\n`;
    var song = userInput;

    spotify
        .search({ type: 'track', query: song })
        .then(function (response) {
            var songs = response.tracks.items;

            for (var i = 0; i < 5; i++) {

                var songData = [`${i}. Artists: ${songs[i].artists[0].name}
                Song: ${songs[i].name}
                Album: ${songs[i].album.name}
                Preview: ${songs[i].preview_url}`].join();

                console.log(songData);
                console.log(shield);

                fs.appendFile("log.txt", songliri + songData + "\n" + shield, function (err) {
                    if (err) throw err;
                });
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

function movieThis(userInput) {

    var movieName = userInput;
    var movieliri = `\nHere is the movie with the result "${userInput}":\n\n`;

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl).then(
        function (response) {
            movieData = [`Title: ${response.data.Title}
            Year: ${response.data.Year}
            IMDB Rating: ${response.data.imdbRating}
            Rotten Tomatoes Rating: ${response.data.Metascore}
            Country: ${response.data.Country}
            Language: ${response.data.Language}
            Plot: ${response.data.Plot}
            Actors: ${response.data.Actors}`].join();

            fs.appendFile("log.txt", movieliri + movieData + "\n" + shield, function (err) {
                if (err) throw err;

                console.log(shield);
                console.log(movieData);
                console.log(shield);
            });
        })
        .catch(function (error) {
            if (error.response) {
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
};

function doWhatItSays() {
    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        var randomArr = data.split(',');
        console.log(randomArr);

        switcher(randomArr[0], randomArr[1]);
    });
}

switcher(command, userInput);