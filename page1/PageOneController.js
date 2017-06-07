'use strict';
var dataExplore = angular.module('dataExplore', ['ngRoute', 'ngResource']);

dataExplore.controller('DataExploreController', ['$scope', '$routeParams', '$resource',
    function ($scope, $routeParams, $resource) {
      var svg = d3.select("svg");
      var  margin = {top: 20, right: 20, bottom: 30, left: 60};
      var width = +svg.attr("width") - margin.left - margin.right;
      var height = +svg.attr("height") - margin.top - margin.bottom;
      var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var x = d3.scaleBand()
        .rangeRound([0, width - 100])
        .paddingInner(0.05)
        .align(0.1);

      var y = d3.scaleLinear()
        .rangeRound([height, 0]);

      var z = d3.scaleOrdinal()
        .range(["#C91616", "#F7E840", "#00840D"]);
        //.range([d3.rgb(248, 105, 107), d3.rgb(255, 255, 128), d3.rgb(0, 176, 80)]);

      var formatPercent = d3.format(".0%");

      function getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
      }

      function unfade(element) {
        var op = 0;  // initial opacity
        element.style.display = 'block';
        var timer = setInterval(function () {
          if (op >= 1){
            clearInterval(timer);
          }
          element.style.opacity = op;
          element.style.filter = 'alpha(opacity=' + op * 100 + ")";
          op += op * 0.1;
        }, 10);
      }

      var index = getURLParameter('city');
      console.log("Printing index");
      console.log(index);

      $.getJSON("/data/" + index + ".json", console.log).done( function (data) {
        var recent = data[data.length - 1];
        document.getElementById("tweet-sentiment").innerHTML = "Sentiment (from -1 to +1): " +
          (recent.ratioPositive > recent.ratioNegative ? "+" : "") +
          ((recent.ratioNegative + recent.ratioPositive != 0) ? 
          2 * recent.ratioPositive / (recent.ratioNegative + recent.ratioPositive) - 1 : 
          0).toFixed(4);
        document.getElementById("tweet-num").innerHTML = "Captured tweets this month: " + recent.total;
        document.getElementById("tweet-pol").innerHTML = "Polarization: " + (1 - recent.ratioNeutral).toFixed(2) * 100 + "%";
      });
      $.getJSON("/cities.json", console.log).done( function (cityData) {
         try {
           document.getElementById("head").innerHTML = "EXPLORE: data for " + cityData[parseInt(index)].city + ", " + cityData[parseInt(index)].state;
         } catch (Exception) {
           document.getElementById("head").innerHTML = "EXPLORE: failed to retrieve data";
           return;
         }
         var cit = cityData[parseInt(index)];
         console.log(cit);
         document.getElementById("growth").innerHTML = "Population growth from 2000 to 2013: " + cit.growth_from_2000_to_2013;
         document.getElementById("latitude").innerHTML = "Latitude: " + cit.latitude;
         document.getElementById("longitude").innerHTML = "Longitude: " + cit.longitude;
         document.getElementById("population").innerHTML = "Population: " + cit.population;
         document.getElementById("rank").innerHTML = "Population rank: " + cit.rank;
         document.getElementById("cstate").innerHTML = "State: " + cit.state;
         var t;
         d3.json("/data/" + index + ".json", function(error, data) {
           if (error) throw error;
           console.log(JSON.stringify(data));




           var keys = ["ratioNegative", 'ratioNeutral', 'ratioPositive'];



           
           //data.sort(function(a, b) { return b.total - a.total; });
           x.domain(data.map(function(d) { return d.month; }));
           y.domain([0, d3.max(data, function(d) { return 1; })]).nice();
           z.domain(keys);
           
           g.append("g")
                .selectAll("g")
                .data(d3.stack().keys(keys)(data))
                .enter().append("g")
                .attr("fill", function(d) { return z(d.key); })
                .selectAll("rect")
                .data(function(d) { return d; })
                .enter().append("rect")
                .attr("x", function(d) { return x(d.data.month); })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .attr("width", x.bandwidth());

           g.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

           g.append("g")
                .attr("class", "axis")
                .call(d3.axisLeft(y).ticks(null, ".0%"))
                //.attr("tickFormat", formatPercent)
                .append("text")
                .attr("x", 2)
                .attr("y", y(y.ticks().pop()) + 0.5)
                .attr("dy", "0.32em")
                .attr("fill", "#000")
                .attr("font-weight", "bold")
                .attr("text-anchor", "start");
           var legend = g.append("g")
                .attr("font-family", "sans-serif")
                .attr("font-size", 10)
                .attr("text-anchor", "end")
                .selectAll("g")
                .data(keys.slice().reverse())
                .enter().append("g")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

           legend.append("rect")
                .attr("x", width - 19)
                .attr("width", 19)
                .attr("height", 19)
                .attr("fill", z);

           legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9.5)
                .attr("dy", "0.32em")
                .text(function(d) { return d; });
        });
    });  
  }]);
