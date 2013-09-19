 JQuery XColor plugin color picker
 Angular js

 How to
 Add color filters
 `<li title="{{color.name}} - {{color.rgb}}" ng-repeat="color in colorGroup.colors | filter:hf" class="color-box"`

 Toggle On/Off colornames
 <pre>
  <input id="toggle-name" type="checkbox" ng-model="nameChecked"/>
				           <label style="color:white" for="toggle-name">Show Names</label>
					   <div ng-repeat="colorGroup in htmlColors">
                                           <h4 style="color:white">{{colorGroup.groupname}}</h4>
                                             <ul class="list-unstyled">
how create items based on repeat index
                                              <li title="{{color.name}} - {{color.rgb}}" ng-repeat="color in colorGroup.colors | filter:hf" class="color-box"
                                                style="background-color:{{color.rgb}};color:{{color.fontColor}};">
                                              <span ng-show="nameChecked">{{color.name}}</span><span ng-show="!nameChecked">A</span><br /><span style="font-size:0.85em">{{color.hex}}</span>
                                              </li>
                                             </ul>
                                           </div>
 </pre>
 Hide empty fields 
 
 creating rgb for WebSafe Colors
 function hexToRgbString(hex) {
   var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
   var tmp = {
       r: parseInt(result[1], 16),
       g: parseInt(result[2], 16),
       b: parseInt(result[3], 16)
   } ;
   return 'rgb('+tmp.r+','+tmp.g+','+tmp.b+')';
}

Adding color picker
http://www.virtuosoft.eu/code/jquery-colorpickersliders/

