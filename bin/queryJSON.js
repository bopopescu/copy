#!/usr/bin/env node
var citiesArray = require('./../cities.json');
var mongoose = require('mongoose');
mongoose.connect('mongodb://refugee:usingtech4good@ds147711.mlab.com:47711/unhcr-project');
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

module.exports.getJSONString = function(cityNumber) {
  CityObject.findOne({"name": citiesArray[cityNumber].city}, function(err, city) {
    var headerString = "Month\tNegative\tNeutral\tPositive\n";
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
      //currMonthObj.total = total;
      monthsInfoArr.push(currMonthObj);
    }
    mongoose.disconnect();
    console.log(JSON.stringify(monthsInfoArr));
    return JSON.stringify(monthsInfoArr);
  }); 
}
