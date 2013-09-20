'use strict';


/** Color Item */
function ColorItem(fontColor,name,hex,rgb,hsl,hsv){
  this.fontColor = fontColor;
  this.name = name;
  this.hex = hex;
  this.rgb = rgb;
  this.hsl = hsl;
  this.hsv = hsv;
};

var HTML_COLORS = [
{ groupname:'Pink colors', colors :[
new ColorItem('black','Pink','#FFC0CB','rgb(255,192,203)'),
new ColorItem('black','LightPink','#FFB6C1','rgb(255,182,193)'),
new ColorItem('white','HotPink','#FF69B4','rgb(255,105,180)'),
new ColorItem('white','DeepPink','#FF1493','rgb(255,20,147)'),
new ColorItem('white','PaleVioletRed','#DB7093','rgb(219,112,147)'),
new ColorItem('white','MediumVioletRed','#C71585','rgb(199,21,133)')
]} , { groupname:'Red colors', colors :[
new ColorItem('black','LightSalmon','#FFA07A','rgb(255,160,122)'),
new ColorItem('black','Salmon','#FA8072','rgb(250,128,114)'),
new ColorItem('black','DarkSalmon','#E9967A','rgb(233,150,122)'),
new ColorItem('black','LightCoral','#F08080','rgb(240,128,128)'),
new ColorItem('white','IndianRed','#CD5C5C','rgb(205,92,92)'),
new ColorItem('white','Crimson','#DC143C','rgb(220,20,60)'),
new ColorItem('white','FireBrick','#B22222','rgb(178,34,34)'),
new ColorItem('white','DarkRed','#8B0000','rgb(139,0,0)'),
new ColorItem('white','Red','#FF0000','rgb(255,0,0)')
]} , { groupname:'Orange colors', colors :[
new ColorItem('white','OrangeRed','#FF4500','rgb(255,69,0)'),
new ColorItem('white','Tomato','#FF6347','rgb(255,99,71)'),
new ColorItem('white','Coral','#FF7F50','rgb(255,127,80)'),
new ColorItem('white','DarkOrange','#FF8C00','rgb(255,140,0)'),
new ColorItem('white','Orange','#FFA500','rgb(255,165,0)'),
new ColorItem('black','Gold','#FFD700','rgb(255,215,0)')
]} , { groupname:'Yellow colors', colors :[
new ColorItem('black','Yellow','#FFFF00','rgb(255,255,0)'),
new ColorItem('black','LightYellow','#FFFFE0','rgb(255,255,224)'),
new ColorItem('black','LemonChiffon','#FFFACD','rgb(255,250,205)'),
new ColorItem('black','LightGoldenrodYellow','#FAFAD2','rgb(250,250,210)'),
new ColorItem('black','PapayaWhip','#FFEFD5','rgb(255,239,213)'),
new ColorItem('black','Moccasin','#FFE4B5','rgb(255,228,181)'),
new ColorItem('black','PeachPuff','#FFDAB9','rgb(255,218,185)'),
new ColorItem('black','PaleGoldenrod','#EEE8AA','rgb(238,232,170)'),
new ColorItem('black','Khaki','#F0E68C','rgb(240,230,140)'),
new ColorItem('black','DarkKhaki','#BDB76B','rgb(189,183,107)')
]} , { groupname:'Brown colors', colors :[
new ColorItem('black','Cornsilk','#FFF8DC','rgb(255,248,220)'),
new ColorItem('black','BlanchedAlmond','#FFEBCD','rgb(255,235,205)'),
new ColorItem('black','Bisque','#FFE4C4','rgb(255,228,196)'),
new ColorItem('black','NavajoWhite','#FFDEAD','rgb(255,222,173)'),
new ColorItem('black','Wheat','#F5DEB3','rgb(245,222,179)'),
new ColorItem('black','BurlyWood','#DEB887','rgb(222,184,135)'),
new ColorItem('black','Tan','#D2B48C','rgb(210,180,140)'),
new ColorItem('black','RosyBrown','#BC8F8F','rgb(188,143,143)'),
new ColorItem('black','SandyBrown','#F4A460','rgb(244,164,96)'),
new ColorItem('black','Goldenrod','#DAA520','rgb(218,165,32)'),
new ColorItem('white','DarkGoldenrod','#B8860B','rgb(184,134,11)'),
new ColorItem('white','Peru','#CD853F','rgb(205,133,63)'),
new ColorItem('white','Chocolate','#D2691E','rgb(210,105,30)'),
new ColorItem('white','SaddleBrown','#8B4513','rgb(139,69,19)'),
new ColorItem('white','Sienna','#A0522D','rgb(160,82,45)'),
new ColorItem('white','Brown','#A52A2A','rgb(165,42,42)'),
new ColorItem('white','Maroon','#800000','rgb(128,0,0)')
]} , { groupname:'Green colors', colors :[
new ColorItem('white','DarkOliveGreen','#556B2F','rgb(85,107,47)'),
new ColorItem('white','Olive','#808000','rgb(128,128,0)'),
new ColorItem('white','OliveDrab','#6B8E23','rgb(107,142,35)'),
new ColorItem('black','YellowGreen','#9ACD32','rgb(154,205,50)'),
new ColorItem('black','LimeGreen','#32CD32','rgb(50,205,50)'),
new ColorItem('black','Lime','#00FF00','rgb(0,255,0)'),
new ColorItem('black','LawnGreen','#7CFC00','rgb(124,252,0)'),
new ColorItem('black','Chartreuse','#7FFF00','rgb(127,255,0)'),
new ColorItem('black','GreenYellow','#ADFF2F','rgb(173,255,47)'),
new ColorItem('black','SpringGreen','#00FF7F','rgb(0,255,127)'),
new ColorItem('black','MediumSpringGreen','#00FA9A','rgb(0,250,154)'),
new ColorItem('black','LightGreen','#90EE90','rgb(144,238,144)'),
new ColorItem('black','PaleGreen','#98FB98','rgb(152,251,152)'),
new ColorItem('black','DarkSeaGreen','#8FBC8F','rgb(143,188,143)'),
new ColorItem('white','MediumSeaGreen','#3CB371','rgb(60,179,113)'),
new ColorItem('white','SeaGreen','#2E8B57','rgb(46,139,87)'),
new ColorItem('white','ForestGreen','#228B22','rgb(34,139,34)'),
new ColorItem('white','Green','#008000','rgb(0,128,0)'),
new ColorItem('white','DarkGreen','#006400','rgb(0,100,0)')
]} , { groupname:'Cyan colors', colors :[
new ColorItem('black','MediumAquamarine','#66CDAA','rgb(102,205,170)'),
new ColorItem('black','Aqua','#00FFFF','rgb(0,255,255)'),
new ColorItem('black','Cyan','#00FFFF','rgb(0,255,255)'),
new ColorItem('black','LightCyan','#E0FFFF','rgb(224,255,255)'),
new ColorItem('black','PaleTurquoise','#AFEEEE','rgb(175,238,238)'),
new ColorItem('black','Aquamarine','#7FFFD4','rgb(127,255,212)'),
new ColorItem('black','Turquoise','#40E0D0','rgb(64,224,208)'),
new ColorItem('black','MediumTurquoise','#48D1CC','rgb(72,209,204)'),
new ColorItem('white','DarkTurquoise','#00CED1','rgb(0,206,209)'),
new ColorItem('white','LightSeaGreen','#20B2AA','rgb(32,178,170)'),
new ColorItem('white','CadetBlue','#5F9EA0','rgb(95,158,160)'),
new ColorItem('white','DarkCyan','#008B8B','rgb(0,139,139)'),
new ColorItem('white','Teal','#008080','rgb(0,128,128)')
]} , { groupname:'Blue colors', colors :[
new ColorItem('black','LightSteelBlue','#B0C4DE','rgb(176,196,222)'),
new ColorItem('black','PowderBlue','#B0E0E6','rgb(176,224,230)'),
new ColorItem('black','LightBlue','#ADD8E6','rgb(173,216,230)'),
new ColorItem('black','SkyBlue','#87CEEB','rgb(135,206,235)'),
new ColorItem('black','LightSkyBlue','#87CEFA','rgb(135,206,250)'),
new ColorItem('white','DeepSkyBlue','#00BFFF','rgb(0,191,255)'),
new ColorItem('white','DodgerBlue','#1E90FF','rgb(30,144,255)'),
new ColorItem('white','CornflowerBlue','#6495ED','rgb(100,149,237)'),
new ColorItem('white','SteelBlue','#4682B4','rgb(70,130,180)'),
new ColorItem('white','RoyalBlue','#4169E1','rgb(65,105,225)'),
new ColorItem('white','Blue','#0000FF','rgb(0,0,255)'),
new ColorItem('white','MediumBlue','#0000CD','rgb(0,0,205)'),
new ColorItem('white','DarkBlue','#00008B','rgb(0,0,139)'),
new ColorItem('white','Navy','#000080','rgb(0,0,128)'),
new ColorItem('white','MidnightBlue','#191970','rgb(25,25,112)')
]} , { groupname:'Purple colors', colors :[
new ColorItem('black','Lavender','#E6E6FA','rgb(230,230,250)'),
new ColorItem('black','Thistle','#D8BFD8','rgb(216,191,216)'),
new ColorItem('black','Plum','#DDA0DD','rgb(221,160,221)'),
new ColorItem('black','Violet','#EE82EE','rgb(238,130,238)'),
new ColorItem('black','Orchid','#DA70D6','rgb(218,112,214)'),
new ColorItem('white','Fuchsia','#FF00FF','rgb(255,0,255)'),
new ColorItem('white','Magenta','#FF00FF','rgb(255,0,255)'),
new ColorItem('white','MediumOrchid','#BA55D3','rgb(186,85,211)'),
new ColorItem('white','MediumPurple','#9370DB','rgb(147,112,219)'),
new ColorItem('white','BlueViolet','#8A2BE2','rgb(138,43,226)'),
new ColorItem('white','DarkViolet','#9400D3','rgb(148,0,211)'),
new ColorItem('white','DarkOrchid','#9932CC','rgb(153,50,204)'),
new ColorItem('white','DarkMagenta','#8B008B','rgb(139,0,139)'),
new ColorItem('white','Purple','#800080','rgb(128,0,128)'),
new ColorItem('white','Indigo','#4B0082','rgb(75,0,130)'),
new ColorItem('white','DarkSlateBlue','#483D8B','rgb(72,61,139)'),
new ColorItem('white','SlateBlue','#6A5ACD','rgb(106,90,205)'),
new ColorItem('white','MediumSlateBlue','#7B68EE','rgb(123,104,238)')
]} , { groupname:'White colors', colors :[
new ColorItem('black','White','#FFFFFF','rgb(255,255,255)'),
new ColorItem('black','Snow','#FFFAFA','rgb(255,250,250)'),
new ColorItem('black','Honeydew','#F0FFF0','rgb(240,255,240)'),
new ColorItem('black','MintCream','#F5FFFA','rgb(245,255,250)'),
new ColorItem('black','Azure','#F0FFFF','rgb(240,255,255)'),
new ColorItem('black','AliceBlue','#F0F8FF','rgb(240,248,255)'),
new ColorItem('black','GhostWhite','#F8F8FF','rgb(248,248,255)'),
new ColorItem('black','WhiteSmoke','#F5F5F5','rgb(245,245,245)'),
new ColorItem('black','Seashell','#FFF5EE','rgb(255,245,238)'),
new ColorItem('black','Beige','#F5F5DC','rgb(245,245,220)'),
new ColorItem('black','OldLace','#FDF5E6','rgb(253,245,230)'),
new ColorItem('black','FloralWhite','#FFFAF0','rgb(255,250,240)'),
new ColorItem('black','Ivory','#FFFFF0','rgb(255,255,240)'),
new ColorItem('black','AntiqueWhite','#FAEBD7','rgb(250,235,215)'),
new ColorItem('black','Linen','#FAF0E6','rgb(250,240,230)'),
new ColorItem('black','LavenderBlush','#FFF0F5','rgb(255,240,245)'),
new ColorItem('black','MistyRose','#FFE4E1','rgb(255,228,225)')
]} , { groupname:'Gray/Grey/Black colors', colors :[
new ColorItem('black','Gainsboro','#DCDCDC','rgb(220,220,220)'),
new ColorItem('black','LightGray','#D3D3D3','rgb(211,211,211)'),
new ColorItem('black','Silver','#C0C0C0','rgb(192,192,192)'),
new ColorItem('black','DarkGray','#A9A9A9','rgb(169,169,169)'),
new ColorItem('black','Gray','#808080','rgb(128,128,128)'),
new ColorItem('white','DimGray','#696969','rgb(105,105,105)'),
new ColorItem('white','LightSlateGray','#778899','rgb(119,136,153)'),
new ColorItem('white','SlateGray','#708090','rgb(112,128,144)'),
new ColorItem('white','DarkSlateGray','#2F4F4F','rgb(47,79,79)'),
new ColorItem('white','Black','#000000','rgb(0,0,0)')
]}
  ];

var WEB_SAFE_COLORS_RGB = [
  "000000","330000","660000","990000","CC0000","FF0000",
  "000033","330033","660033","990033","CC0033","FF0033",
  "000066","330066","660066","990066","CC0066","FF0066",
  "000099","330099","660099","990099","CC0099","FF0099",
  "0000CC","3300CC","6600CC","9900CC","CC00CC","FF00CC",
  "0000FF","3300FF","6600FF","9900FF","CC00FF","FF00FF",
  "003300","333300","663300","993300","CC3300","FF3300",
  "003333","333333","663333","993333","CC3333","FF3333",
  "003366","333366","663366","993366","CC3366","FF3366",
  "003399","333399","663399","993399","CC3399","FF3399",
  "0033CC","3333CC","6633CC","9933CC","CC33CC","FF33CC",
  "0033FF","3333FF","6633FF","9933FF","CC33FF","FF33FF",
  "006600","336600","666600","996600","CC6600","FF6600",
  "006633","336633","666633","996633","CC6633","FF6633",
  "006666","336666","666666","996666","CC6666","FF6666",
  "006699","336699","666699","996699","CC6699","FF6699",
  "0066CC","3366CC","6666CC","9966CC","CC66CC","FF66CC",
  "0066FF","3366FF","6666FF","9966FF","CC66FF","FF66FF",
  "009900","339900","669900","999900","CC9900","FF9900",
  "009933","339933","669933","999933","CC9933","FF9933",
  "009966","339966","669966","999966","CC9966","FF9966",
  "009999","339999","669999","999999","CC9999","FF9999",
  "0099CC","3399CC","6699CC","9999CC","CC99CC","FF99CC",
  "0099FF","3399FF","6699FF","9999FF","CC99FF","FF99FF",
  "00CC00","33CC00","66CC00","99CC00","CCCC00","FFCC00",
  "00CC33","33CC33","66CC33","99CC33","CCCC33","FFCC33",
  "00CC66","33CC66","66CC66","99CC66","CCCC66","FFCC66",
  "00CC99","33CC99","66CC99","99CC99","CCCC99","FFCC99",
  "00CCCC","33CCCC","66CCCC","99CCCC","CCCCCC","FFCCCC",
  "00CCFF","33CCFF","66CCFF","99CCFF","CCCCFF","FFCCFF",
  "00FF00","33FF00","66FF00","99FF00","CCFF00","FFFF00",
  "00FF33","33FF33","66FF33","99FF33","CCFF33","FFFF33",
  "00FF66","33FF66","66FF66","99FF66","CCFF66","FFFF66",
  "00FF99","33FF99","66FF99","99FF99","CCFF99","FFFF99",
  "00FFCC","33FFCC","66FFCC","99FFCC","CCFFCC","FFFFCC",
  "00FFFF","33FFFF","66FFFF","99FFFF","CCFFFF","FFFFFF"
];

var WEB_SAFE_COLORS = { groupname:'Colors', colors:[]};
  //dynamically compute web safe colors
  var fontColor = 'white';
  for(var i=0;i< WEB_SAFE_COLORS_RGB.length;i++){
    if( i === 143){
      fontColor = 'black';
    }
        var hex = '#'+WEB_SAFE_COLORS_RGB[i];
        WEB_SAFE_COLORS.colors.push (
                 new ColorItem(fontColor,$.xcolor.nearestname(hex),hex,hexToRgbString(hex))
        );
  } ;


/** Angular Controllers */
//Method 1 implicit injectors
angular.module('BootstrapThemePreviewerApp.controllers', []).
  controller('ColorPickerCtrl', function($scope) {
    $scope.htmlColors = HTML_COLORS;
    $scope.webSafeColors = [WEB_SAFE_COLORS];
  })
  .controller('MyCtrl2', function() {

  });

//Method 2 explicit injectors Array
/*
angular.module('BootstrapThemePreviewerApp.controllers', []).
  controller('ColorPickerCtrl', ['$scope',function($scope) {
    $scope.htmlColors = HTML_COLORS;
    $scope.webSafeColors = [WEB_SAFE_COLORS];
  }])
  .controller('MyCtrl2', [[],function() {

  }]);
  //*/