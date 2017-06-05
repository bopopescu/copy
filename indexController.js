var homeApp = angular.module('homeApp', ['ngRoute', 'ngMaterial', 'ngResource']);


homeApp.controller('HomeController', ['$scope', '$resource', '$routeParams',
function ($scope, $resource, $routeParams) {
	$scope.main = {};

	function main() {
		var times_clicked = 0; 

		var map = new L.Map('map', {
zoomControl: true,
center: [40, -100],
zoom: 4
		});



		L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
attribution: 'Stamen'
		}).addTo(map);
		//https://kimngo.carto.com/api/v2/viz/ea83745e-3596-11e7-bddb-0e3ebc282e83/viz.json


		
		
		cartodb.createLayer(map, 'https://kimngo.carto.com/api/v2/viz/ea83745e-3596-11e7-bddb-0e3ebc282e83/viz.json')
		.addTo(map)
		.on('done', function(layer) {
			layer.setOpacity(0.4);
			layer.setInteraction(true);
			layer.on('featureOver', function(e, latlng, pos, data) {
				cartodb.log.log(e, latlng, pos, data);
			});
		}).on('error', function() {
			cartodb.log.log("some error occurred");
		});
		
		cartodb.createLayer(map, 'https://kimngo.carto.com/api/v2/viz/e0f2f51a-239c-11e7-81a1-0ecd1babdde5/viz.json')
		.addTo(map)
		.on('done', function(layer) {
			cdb.vis.Vis.addInfowindow(map, layer.getSubLayer(1), ['geoid10']);
			layer.setOpacity(0.4);
			layer.setInteraction(true);
			layer.on('featureOver', function(e, latlng, pos, data) {
				cartodb.log.log(e, latlng, pos, data);
			});
			$('button').on('click', function() {
				if (times_clicked%2 == 0) layer.hide();
				else layer.show();
				times_clicked++;
			});
		}).on('error', function() {
			cartodb.log.log("some error occurred");
		});
		
		cartodb.createLayer(map, 'https://kimngo.carto.com/api/v2/viz/135c2bfb-2c35-415d-ae26-97285000a2c0/viz.json')
		.addTo(map)
		.on('done', function(layer) {
			layer.setInteraction(true);
			layer.on('featureOver', function(e, latlng, pos, data) {
				cartodb.log.log(e, latlng, pos, data);
			});
		}).on('error', function() {
			cartodb.log.log("some error occurred");
		});


		

	}
	// you could use $(window).load(main);

	window.onload = main;
}]);
