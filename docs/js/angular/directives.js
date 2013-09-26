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


directiveModule.directive('dragSource',
     function factory() {
       return {
          restrict: 'A',
          // This HTML will replace the directive.
          replace: true,
          // The linking function will add behavior to the template
          link: function postLink(scope, element, attrs) {
            //make parent element draggable
            element.draggable({ revert: "valid",helper: "clone",revertDuration: 50,zIndex: 6000 });
          }
       };
});

directiveModule.directive('dropTarget',
     function factory() {
       return {
          restrict: 'A',
          // This HTML will replace the directive.
          replace: true,
          // The linking function will add behavior to the template
          link: function postLink(scope, element, attrs) {
            //make parent element draggable
            element.droppable({
              drop: function( event, ui ) {
                $(this).css('background-color',ui.draggable.css('background-color'));
                  console.log('dropped');
              }
            });
          }
       };
});

directiveModule.directive('colorPicker',
     function factory() {
       return {
          restrict: 'A',
          // This HTML will replace the directive.
          replace: true,
          //transclude: true,
          // The linking function will add behavior to the template
          link: function postLink(scope, element, attrs) {

          //make parent element draggable
          element.draggable({ revert: "valid",cursor: "move" ,opacity: 0.9, helper: "clone",revertDuration: 50,zIndex: 6000 });
          element.focusin( function(){
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
                     //dynamically update fontcolor
                     if($.xcolor.readable("black",scope.color.hex)){
                         scope.color.fontColor = "black";
                      } else {
                         scope.color.fontColor = "white";
                      }

                     //fire DOM updates
                     scope.$digest();
                  }
                });
              //force display
              $(this).trigger("colorpickersliders.showPopup");
            });

            element.blur( function(){
              //hide colorpicker
               //$(this).trigger("colorpickersliders.hidePopup");
               //destroy DOM to
               //var tmp = $(this) ;
               //tmp.ColorPickerSliders().empty();
               console.log("blured - "+scope.color.hex);
            });
            //console.log(attrs+" - "+ element.attr('value')+" - "+scope.color.hex);
          }
      };
});  //*/
