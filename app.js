angular.module('feedParser', ['ui.bootstrap','ui.utils','ngRoute','ngAnimate','ngSanitize']);

angular.module('feedParser').config(function($routeProvider) {

    $routeProvider.when('/home', {
      templateUrl: 'partial/home/home.html'
    });
    /* Add New Routes Above */
    $routeProvider.otherwise({redirectTo:'/home'});

});

angular.module('feedParser').run(function($rootScope) {

    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

});
