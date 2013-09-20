'use strict';

/* Directives */


var directiveModule = angular.module('BootstrapThemePreviewerApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, element, attrs) {
      elm.text(version);
    };
  }]);
  //scope contains the resolved variable
  //  element.attr('value') vs scope.color.hex
/*
directiveModule.directive('colorPicker', 
     function() {
      return function(scope, element, attrs) {

          element.ColorPickerSliders({
            color: scope.color.hex,
            order: {
                preview:1,
                hsl: 2,
                opacity:3

            }
          });
  //console.log(attrs+" - "+ element.attr('value'));
      };
     }
  );  //*/

directiveModule.directive('colorPicker',
     function() {
       return {
          restrict: 'A',
          // This HTML will replace the directive.
          replace: true,
          transclude: true,
          // The linking function will add behavior to the template
          link: function postLink(scope, element, attrs) {

           element.click( function(){
              var slider = $(this).ColorPickerSliders({
                  color: scope.color.hex,
                  order: {
                      preview:1,
                      hsl: 2,
                      opacity:3
                  } ,
                  onchange: function(container, color) {
                    //update scope variables double bindings
                    //tinycolor object is in color.tiny
                     scope.color.hex = color.tiny.toHexString();
                     scope.color.rgb = color.tiny.toRgbString();
                     //scope.color.name = color.tiny.toName();
                     scope.color.name = $.xcolor.nearestname(color.tiny.toHexString());
                     scope.color.hsl = color.tiny.toHslString();
                     //TODO dynamically update fontcolor
                     //fire DOM updates
                     scope.$digest();
                  }
                });
              //force display
              $(this).trigger("colorpickersliders.showPopup");
            });

            element.blur( function(){
              //hide colorpicker
               $(this).trigger("colorpickersliders.hidePopup");
               //destroy DOM to
               $(this).ColorPickerSliders().empty();
               console.log("blured - "+scope.color.hex);
            });
            //console.log(attrs+" - "+ element.attr('value')+" - "+scope.color.hex);
          }
      };
});  //*/
