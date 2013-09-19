'use strict';

/* Directives */


var directiveModule = angular.module('BootstrapThemePreviewerApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, element, attrs) {
      elm.text(version);
    };
  }]);

directiveModule.directive('colorPicker', 
     function() {
      return function(scope, element, attrs) {
           /*
          element.ColorPickerSliders({
            color: attrs['value'],
            order: {
                preview:1,
                hsl: 2,
                opacity:3

            }
          }); //*/
  //console.log(attrs+" - "+ element.attr('value'));
      };
     }
  );
/*
return {
      restrict: 'A',
      // This HTML will replace the zippy directive.
      replace: true,
      transclude: true,
      // The linking function will add behavior to the template
      link: function(scope, element, attrs) {
        element.ColorPickerSliders({
          order: {
              hsl: 1
          }
        })
      }
};  //*/
