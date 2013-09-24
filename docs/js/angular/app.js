'use strict';


// Declare app level module which depends on filters, and services
angular.module(
'BootstrapThemePreviewerApp',[
  'BootstrapThemePreviewerApp.filters',
  'BootstrapThemePreviewerApp.services', 
  'BootstrapThemePreviewerApp.directives', 
  'BootstrapThemePreviewerApp.controllers'
]);/*.
  config(
    function($routeProvider) {
      $routeProvider.when(
      '/', {
        templateUrl: 'views/colorView.html', 
        controller: 'ColorPickerCtrl'
      });
      //$routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'ColorPickerCtrl'});
      $routeProvider.otherwise({redirectTo: '/'});
  });
//*/