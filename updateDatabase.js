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

var async = require('async');
var fs = require('fs');
var Twit = require('twit');

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
mongoose.connect('mongodb://refugee:usingtech4good@ds147711.mlab.com:47711/unhcr-project');

var citySchema = new mongoose.Schema({
  numberPositive: Number,
  numberNegative: Number,
  numberNeutral: Number,
  latitude: Number,
  longitude: Number,
  name: String,
  posts: [String]
});

var CityInfo = mongoose.model('CityInfo', citySchema);

var citiesArray = require('./cities.json');
citiesArray = citiesArray.slice(25, 30);

var getStringifiedDate = function(dateObj) {
  var partialString = dateObj.toISOString();
  return partialString.substr(0, partialString.indexOf('T'));
}

var update = function() {  
  console.log("inside populate function");
  async.each(citiesArray, function(city, callback) {
    var numPositive = 0;
    var numNegative = 0;
    var numNeutral = 0;
    var todayDate = new Date();
    var oldDate = new Date();
    oldDate.setDate(todayDate.getDate() - 1);
    var todayDateString = getStringifiedDate(todayDate);
    var oldDateString = getStringifiedDate(oldDate);
    var queryString = 'refugee since:' + oldDateString + ' until:' + todayDateString; 
    var geocodeString = city.latitude.toString() + "," + city.longitude.toString() + "," + "20mi";
    twitter.get('search/tweets', {q: queryString, lang: 'en', count: 20, geocode: geocodeString}, function(err, data, response) {
      console.log("Got into the Get method");
      async.each(data.statuses, function(status, innerCallback) {
        authorize(function(authClient) {
          var request = {
            project: 'angelic-bond-165518',
            id: 'sentiment-analysis',
            resource: {
              input: {
                csvInstance: [
                  status.text
                ]
              }
            },
            auth: authClient
          };
          prediction.trainedmodels.predict(request, function(err, response) {
            console.log("Got to the predict part");
            if (err) {
              console.log(err);
              return;
            }
            if (response.outputLabel === "neutral") {
              console.log("INcrementing num neutral");
              numNeutral++;
            }
            if (response.outputLabel === "negative") {
              console.log("INcrementing num negative");
              numNegative++;
            }
            if (response.outputLabel === "positive") {
              console.log("INcrementing num positive");
              numPositive++;
            }
            innerCallback();
         });
       });
      }, function (err) {
        if (err) {
          console.log("An error occurred- not updating");
        }
        CityInfo.findOne({"name" : city.city}, function (err, matchingCity) {
          if (err) {
            return;
          } else if (!matchingCity) {
            return;
          } else {
            var updatedNumberPositive = numPositive + matchingCity.numberPositive;
            var updatedNumberNegative = numNegative + matchingCity.numberNegative;
            var updatedNumberNeutral = numNeutral + matchingCity.numberNeutral;
            matchingCity.numberPositive = updatedNumberPositive;
            matchingCity.numberNegative = updatedNumberNegative;
            matchingCity.numberNeutral = updatedNumberNeutral;
            for (var index = 0; index < data.statuses.length; index++) {
              matchingCity.posts.push(data.statuses[index].text);
            }
            matchingCity.save(function(err) {
              if (err) {
                console.log("Unable to update the database entry");
              } else {
                console.log("Database entry updated successfully");
              }
              callback();
            });
          }
        });
     });
  });
}, function(err) {
  if(err) {
    console.log("Issue");
  } else {
    console.log("Database entries updated");
    mongoose.disconnect();
  }

});
}

update();

var google = require('googleapis');
var prediction = google.prediction('v1.6');

function authorize(callback) {
  google.auth.getApplicationDefault(function(err, authClient) {
    if (err) {
      console.log('authentication failed: ', err);
      return;
    }
    if (authClient.createScopedRequired && authClient.createScopedRequired()) {
      var scopes = ['https://www.googleapis.com/auth/cloud-platform'];
      authClient = authClient.createScoped(scopes);
    }
    callback(authClient);
});
}


