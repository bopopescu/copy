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
//var queryJSON = require('./bin/queryJSON.js')
var app = express();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));

app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});


////

var citiesArray = require('./bin/../cities.json');
var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
// Retrieve

var monthSchema = new mongoose.Schema({
  month: String,
  numberPositive: Number,
  numberNegative: Number,
  numberNeutral: Number
});

var citySchema = new mongoose.Schema ({
  monthsInfo: [monthSchema],
  name: String,
  latitude: Number,
  longitude: Number
});

var CityObject = mongoose.model('CityObject', citySchema);

var MonthObject = mongoose.model('MonthObject', monthSchema);

citiesArray = citiesArray.splice(0, 100);

////

app.get('/data/:filereq', function (req, res) {
    var reqfile = req.params.filereq;
    var cityNumber = reqfile.slice(0, -5);
    res.type('json');

    console.log(cityNumber);
    mongoose.connect('mongodb://refugee:usingtech4good@ds147711.mlab.com:47711/unhcr-project');
    CityObject.findOne({"name": citiesArray[cityNumber].city}, function(err, city) {
            var monthsInfoArr = [];
            var monthsInfo = city.monthsInfo;
            for (var i = 0; i < monthsInfo.length; i++) {
            var total = monthsInfo[i].numberNegative +
                monthsInfo[i].numberNeutral +
                monthsInfo[i].numberPositive;
            var currMonthObj = {};
            currMonthObj.month = monthsInfo[i].month;
            currMonthObj.ratioNegative = monthsInfo[i].numberNegative / total;
            currMonthObj.ratioPositive = monthsInfo[i].numberPositive / total;
            currMonthObj.ratioNeutral = monthsInfo[i].numberNeutral / total;
            currMonthObj.total = total;
            monthsInfoArr.push(currMonthObj);
        }
        mongoose.disconnect();
        console.log(JSON.stringify(monthsInfoArr));
        res.send(JSON.stringify(monthsInfoArr));
    }); 
});

var portNumber = process.env.PORT || 3000;
console.log("the port number is ");
console.log(portNumber);
var server = app.listen(portNumber, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});

