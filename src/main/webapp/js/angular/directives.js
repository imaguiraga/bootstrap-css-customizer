'use strict';

/* Directives */


angular.module('BootstrapThemePreviewerApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);
