

'use strict';

angular.module('crimespaceAngularApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'google-maps',
  'ngAutocomplete'
]) // FRONT-END ROUTES:
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      }).when('/about', {
        templateUrl: 'partials/about'
        // COntroller
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  });