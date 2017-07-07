(function () {
    'use strict';

    var app = angular.module('tracker', [
        'tracker.config',
        'ngMaterial',
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'ngAnimate'
    ]);

    app.config(function ($provide, $mdThemingProvider, $locationProvider, $routeProvider) {
        // Fix sourcemaps
        // @url https://github.com/angular/angular.js/issues/5217#issuecomment-50993513
        $provide.decorator('$exceptionHandler', function ($delegate) {
            return function (exception, cause) {
                $delegate(exception, cause);
                setTimeout(function() {
                    throw exception;
                });
            };
        });

        $routeProvider
            .when('/', {
                controller: 'mainController',
                templateUrl: 'modules/components/main/mainTemplate.html'
            })
            .otherwise({
                redirectTo: '/'
            });

        $mdThemingProvider.theme('default').primaryPalette('grey').accentPalette('blue').dark();
        $mdThemingProvider.theme('success-toast');
        $mdThemingProvider.theme('fail-toast');
        $mdThemingProvider.theme('warn-toast');
        $mdThemingProvider.theme('info-toast');

        $locationProvider.html5Mode(true);
    })
    .value('ColorScheme', window.ColorScheme)
    .value('groups', window.groups)
    .value('Line', window.Line)
    .value('orbitDisplay', window.orbitDisplay)
    .value('$', window.$)
    .value('satSet', window.satSet)
    .value('XMLHttpRequest', window.XMLHttpRequest)
    .value('searchBox', window.searchBox)
    .value('sun', window.sun)
    .value('vec4', window.vec4)
    .value('mat4', window.mat4)
    .value('vec3', window.vec3)
    .value('mat3', window.mat3)
    .value('Spinner', window.Spinner)
    .value('gl', window.gl);

    app.run(function($rootScope, $http, $compile, $mdToast, $window, $location, trackerConfig) {
        // set a global scope param for the <title> element
        $rootScope.pageTitle = trackerConfig.title;


    });
})();
