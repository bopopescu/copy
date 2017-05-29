"use strict";

/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

var express = require('express');
var app = express();
var async = require('async');
var fs = require('fs');
var Twit = require('twit');

/*
var schedule = require('node-schedule');
var nconf = require('nconf');
nconf.file({ file: 'config.json' }).env();
var tweetMethods = require("./tweets/tweets.js");
var twitter = new Twit({
    consumer_key: nconf.get('TWITTER_CONSUMER_KEY'),
    consumer_secret: nconf.get('TWITTER_CONSUMER_SECRET'),
    access_token: nconf.get('TWITTER_ACCESS_TOKEN'),
    access_token_secret: nconf.get('TWITTER_ACCESS_TOKEN_SECRET')
});

// Retrieve
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/refugeeDatabase');

var citySchema = new mongoose.Schema({
  numberPositive: Number,
  numberNegative: Number, 
  numberNeutral: Number,
  name: String
});

var City = mongoose.model('City', citySchema);

var removePromises = [City.remove({})];

Promise.all(removePromises).then(function () {
  City.create({
    numberPositive: 0,
    numberNegative: 0,
    numberNeutral: 0,
    name: 'Athens'
  }, function(err, cityObj) {
    if (err) {
      console.error('Error create user', err);
    } else {
      console.log('Successfully added city');
    } 
  });
});

var citiesArray = require('./cities.json');
citiesArray = citiesArray.slice(0, 100);

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));

var cityNameToLatitude = {};
var cityNameToLongitude = {};
var cityNameToNumTweets = {};
var cityNameToProportionPositive = {};
var cityNameToProportionNegative = {};
var cityNameToProportionNeutral = {};
var createCitiesMapping = function() {
  for (var index = 0; index < citiesArray.length; index++) {
    var cityName = citiesArray[index].city;
    var latitude = citiesArray[index].latitude;
    var longitude = citiesArray[index].longitude;
    cityNameToLatitude[cityName] = latitude;
    cityNameToLongitude[cityName] = longitude;
  }
}

var getStringifiedDate = function(dateObj) {
  var partialString = dateObj.toISOString();
  return partialString.substr(0, partialString.indexOf('T'));
}

var populateNumTweets = schedule.scheduleJob('0 0 0 * * *', function() {
  async.each(citiesArray, function(city, callback) {
    var todayDate = new Date();
    var yesterdayDate = new Date();
    yesterdayDate.setDate(todayDate.getDate() - 1);
    var todayDateString = getStringifiedDate(todayDate);
    var yesterdayDateString = getStringifiedDate(yesterdayDate);
    var queryString = 'refugee since:' + yesterdayDateString + ' until:' + todayDateString; 
    console.log(queryString);
    twitter.get('search/tweets', {q: queryString, lang: 'en', count: 150}, function(err, data, response) {
      cityNameToNumTweets[city.city] = data.statuses.length;
      callback();
    });
  }, function (err) {
    if (err) {
      console.log("Issue");
    } else {
      console.log("done with no issues");
      console.log(cityNameToNumTweets);
    }
  });
});

createCitiesMapping();

app.get('/proportionPositive/:cityName', function(request, response) {
  var cityName = request.params.cityName;
  response.json(cityNameToProportionPositive[cityName]);
});

app.get('/proportionNeutral/:cityName', function(request, response) {
  var cityName = request.params.cityName;
  response.json(cityNameToProportionNeutral[cityName]);
});

app.get('/proportionNegative/:cityName', function(request, response) {
  var cityName = request.params.cityName;
  response.json(cityNameToProportionNegative[cityName]);
});

*/

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));

app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});

var portNumber = process.env.PORT || 3000;
console.log("the port number is ");
console.log(portNumber);
var server = app.listen(portNumber, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});


