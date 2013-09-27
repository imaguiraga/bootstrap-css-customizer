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
http://en.wikipedia.org/wiki/Web_colors
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

use scope to lookup for resolved variable in link functions

wire onchange to background values
https://github.com/bgrins/TinyColor
  <pre><code>
 onchange: function(container, color) {
                    //update scope variables double bindings
                    //tinycolor object is in color.tiny
                     scope.color.hex = color.tiny.toHexString();
                     scope.color.rgb = color.tiny.toRgbString();
                     //scope.color.name = color.tiny.toName();
                     scope.color.name = $.xcolor.nearestname(color.tiny.toHexString());
                     scope.color.hsl = color.tiny.toHslString();
                     //dynamically update fontcolor
                     //dynamically update fontcolor
                     if($.xcolor.readable("black",scope.color.hex)){
                         scope.color.fontColor = "black";
                     } else {
                         scope.color.fontColor = "white";
                     }
                     //fires DOM updates
                     //scope.$digest();
                     scope.$apply();
                  }
</code> </pre>
bound scope varivales are updatated automatically
unbound field can be updated using scope$watch(scope variable/expression)(template->DOM) or attrs.$observe(DOM attribute name)(DOM -> Template)

color manipulation library
http://www.xarg.org/project/jquery-color-plugin-xcolor/#meth_darken

Created tab for Colors Group
<ul class="nav nav-tabs" id="colorTab">
  <li class="active"><a href="#htmlColors" data-toggle="tab">HTML Colors</a></li>
  <li><a href="#webSafeColors" data-toggle="tab">Web-Safe Colors</a></li>
</ul>

<div class="tab-content">
  <div class="tab-pane active" id="htmlColors">...</div>
  <div class="tab-pane" id="webSafeColors">...</div>
</div>

Add Drag and Drop Capability
http://jqueryui.com/droppable/


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

Need tools to compile static html tempalets into html file
replace all angularjs inclusion with jekyll templates
restrict dyanmic directive to dynami c data
npm
http://jekyllrb.com/docs/home/
https://npmjs.org/package/node-jekyll

syntax highlighting
static html; templating

Grunt
http://gruntjs.com/

http://wiki.shopify.com/Liquid#No_Liquid_Zone:_the_raw_tag conflicts with angular

jQuery plugins

(function( $ ) {
    //constructor
    $.fn.showLinkLocation = function(options ) {
 
        return this.filter( "a" ).append(function() {
            //function content
            return " (" + this.href + ")";
        
        });
 
    };
 
})( jQuery );



(function( $ ) {
 
    $.fn.showLinkLocation = function(options ) {
 
        return this.filter( "a" ).each(function() {

            $( this ).append( " (" + $( this ).attr( "href" ) + ")" );

        });
 
    };
 
})( jQuery );
 
 // Usage example:
 $( "a" ).showLinkLocation();




(function( $ ) {
 
    $.fn.plugin =  function( options ) {

        var defaults = {
           ....
        };
     
        var settings = $.extend( true, {}, defaults, options );
     
        return this.each(function() {

            // Plugin code would go here...
            $(this);
        
        });

    };
 
})( jQuery );


http://learn.jquery.com/

Undocumented less functions
https://github.com/less/less.js/blob/master/dist/less-1.4.2.js

var color = (new (less.tree.Color)("333333"));
console.log(color.toCSS());
var color = (new (less.tree.Color)("333333"));
console.log(less.tree.functions.darken(color,{value:10}/*amount*/).toCSS());