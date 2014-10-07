angular.module('feedParser').directive('kjParse', ['$http', '$interval', '$q', function($http, $interval, $q) {

	var parseRSS = function(url) {
		return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
	};

	var parseEntry = function(el) {
		return {
			title     : el.title,
			content   : el.content || el.description,
			read      : false,
			date      : el.publishedDate || el.pubDate,
			link      : el.link,
			shortLink : hostname(el.link)
		};
	};

	var hostname = function () {
		var a = document.createElement('a');
		return function (url) {
			a.href = url;
			return a.hostname;
		};
	};

	var updateModel = function(url) {
		return $q(function(resolve, reject){
			parseRSS(url)
			.then(function(data) {
				if (data == null) {
					reject();
				}

				var entries = _.map(data.data.responseData.feed.entries, function(el) {
					return parseEntry(el);
				});

				resolve(entries);
			});
		});
	};

	return {
		restrict: 'E',
		replace: true,
		scope: {
			feeds: '='
		},
		templateUrl: 'directive/kj-parse/kj-parse.html',
		link: function(scope, element, attrs, fn) {
			scope.$watch('feeds', function(value){
				if (value && value.length > 0) {
					scope.articles = [];
					_.each(value, function(url){
						updateModel(url).then(function(articles) {
							scope.articles = scope.articles.concat(articles);
						});
					});
					scope.articles = _.shuffle(scope.articles);
				}
			});
		}
	};
}]);
