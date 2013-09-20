 # JQuery XColor plugin color picker
 Angular js

 ## How to
 * Add color filters
 `<li title="{{color.name}} - {{color.rgb}}" ng-repeat="color in colorGroup.colors | filter:hf" class="color-box"`

* Toggle On/Off colornames

 <pre><code>
  <input id="toggle-name" type="checkbox" ng-model="nameChecked"/>
				           <label style="color:white" for="toggle-name">Show Names</label>
					   <div ng-repeat="colorGroup in htmlColors">
                                           <h4 style="color:white">{{colorGroup.groupname}}</h4>
                                             <ul class="list-unstyled">
* how create items based on repeat index
                                              <li title="{{color.name}} - {{color.rgb}}" ng-repeat="color in colorGroup.colors | filter:hf" class="color-box"
                                                style="background-color:{{color.rgb}};color:{{color.fontColor}};">
                                              <span ng-show="nameChecked">{{color.name}}</span><span ng-show="!nameChecked">A</span><br /><span style="font-size:0.85em">{{color.hex}}</span>
                                              </li>
                                             </ul>
                                        </div>
 </code> </pre>
 Hide empty fields 
 
 creating rgb for WebSafe Colors
 <pre><code>
 function hexToRgbString(hex) {
   var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
   var tmp = {
       r: parseInt(result[1], 16),
       g: parseInt(result[2], 16),
       b: parseInt(result[3], 16)
   } ;
   return 'rgb('+tmp.r+','+tmp.g+','+tmp.b+')';
}
</code> </pre>
* Adding color picker
http://www.virtuosoft.eu/code/jquery-colorpickersliders/
https://github.com/bgrins/TinyColor
Created a directive to encapsulate JQuery Object creation

 <pre><code>
directiveModule.directive('colorPicker',
     function() {
      return function(scope, element, attrs) {
          element.ColorPickerSliders({
            order: {
                hsl: 1
            }
          });
      };
     }
  );
</code> </pre>

use scope to lookupfor resolved variable in link functions

wire onchange to background values
https://github.com/bgrins/TinyColor
  <pre><code>
 onchange: function(container, color) {
                    //update scope variables double bindings
                    //tinycolor object is in color.tiny
                     scope.color.hex = color.tiny.toHexString();
                     scope.color.rgb = color.tiny.toRgbString();
                     scope.color.name = color.tiny.toName();
                     scope.color.name = $.xColor(color.tiny.toHexString()).getName();
                     //fires DOM updates
                     scope.$digest();
                  }
</code> </pre>

color manipulation library
http://www.xarg.org/project/jquery-color-plugin-xcolor/#meth_darken


# AngularJs notes
http://docs.angularjs.org/guide/
<pre><code>
//Method 1 implicit injectors
angular.module('BootstrapThemePreviewerApp.controllers', []).
  controller('ColorPickerCtrl', function($scope) {
    $scope.htmlColors = HTML_COLORS;
    $scope.webSafeColors = [WEB_SAFE_COLORS];
  })
  .controller('MyCtrl2', function() {

  });
</code> </pre>
 equivalent to 
 
<pre><code>
 angular.module('BootstrapThemePreviewerApp.controllers', []).
  controller('ColorPickerCtrl', ['$scope',function($scope) {
    $scope.htmlColors = HTML_COLORS;
    $scope.webSafeColors = [WEB_SAFE_COLORS];
  }])
  .controller('MyCtrl2', [[],function() {

  }]);
</code> </pre>

JSDoc


