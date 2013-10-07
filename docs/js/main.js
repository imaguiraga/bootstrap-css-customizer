 var cw = '/*!\n * Bootstrap v3.0.0\n *\n * Copyright 2013 Twitter, Inc\n * Licensed under the Apache License v2.0\n * http://www.apache.org/licenses/LICENSE-2.0\n *\n * Designed and built with all the love in the world @twitter by @mdo and @fat.\n */\n\n';

 var THEMES = {};
 
 //load initial data
  function loadThemes(url) {
  
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json'
    })
    .done(function(result) {
      var data = result;
	  /*
      if (data.js) {
        $('#plugin-section input').each(function () {
          $(this).prop('checked', ~$.inArray(this.value, data.js));
        })
      }
      if (data.css) {
        $('#less-section input').each(function () {
          $(this).prop('checked', ~$.inArray(this.value, data.css));
        })
      }//*/
      if (data.themes) {
        for (var i in data.themes) {
			var theme = data.themes[i];
			THEMES[theme.name.toLowerCase()] = theme;
        }
      }
    })
    .fail(function(jqXHR, textStatus) {
      console.error(textStatus);
    })
  }


/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
};

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

function ColorLuminance(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}

function hexToRgbString(hex) {
   var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
   var tmp = {
       r: parseInt(result[1], 16),
       g: parseInt(result[2], 16),
       b: parseInt(result[3], 16)
   };
   return 'rgb('+tmp.r+','+tmp.g+','+tmp.b+')';
}

function rgb2hex(rgb) {
	rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	function hex(x) {
		return ("0" + parseInt(x).toString(16)).slice(-2);
	}
	return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

//update less variables
var COMPILED_LESS_CSS = null;
var LESS_VARIABLES = {};
var LESS_VARIABLES_REF = {};
var parser = new less.Parser(new less.tree.parseEnv(less));

function addLESSVariablesRef(key,value){
	if( typeof key === "undefined"){
		return;
	}
	
	key = getVariableKey(key); 
	
	/*
	darken(@link-color, 15%)
	(@popover-arrow-width 1)
	@brand-primary
	(@popover-arrow-width 1) 
	//*/
	var pattern =/@(\D*)\s?/gm;
	pattern =/@([a-zA-Z0-9\-])*/gm;
	//find reference
	var result = value.replace(","," ").trim().match(pattern);
	if(result){
		var reference = result[0];
		if( typeof reference === "string"){
			reference = getVariableKey(reference.trim());

			console.log("{"+key+ "} -> {"+reference+"}");
			if(typeof LESS_VARIABLES_REF[reference] === "undefined"){
				LESS_VARIABLES_REF[reference] = [];	
			}
			
			LESS_VARIABLES_REF[reference].push({'key' : key, 'value' :value});
		}
	}

}

function updateLESSVariables(key, value){	
    var variables = null;//variables that changed
	if( typeof key !== "undefined"){
		if(key.charAt(0) === "@" && value != null){	
			variables = {};
			variables[key] = value;
		}
		key = getVariableKey(key);
		LESS_VARIABLES [key].value = value; 
		
		console.log("{"+key + "} = [ "+value+" ]");
		
	}else{
		return;
	}
	
    var stack = [{'key':key,'value':value}];
		
    while(stack.length > 0){
		var current = stack.shift();
		//find references and update their values 
		var id = "#"+current.key;
		var $source = $(id);
		var ref = LESS_VARIABLES_REF[current.key];
		var regex = /\{(.*)\}/;
		regex =/background-color:(.*);color:(.*);?/;
		
		for(var i in ref){
			var target = ref[i];
			var depKey = target.key;
			id = "#"+depKey;
			var $target = $(id);
			
			var fontColor = $source.css("color");
			var backgroundColor = $source.css("background-color");
						
			//no need to compute the value for direct assignment
			//@link-color
			if(target.value.charAt(0) === "@"){
				$target.css({
					"background-color": backgroundColor,
					"color": fontColor
				});
				 								
			}else{
				//generate CSS and parse it for content
				var $css = "@"+current.key+":"+current.value+"; #"+target.key+" {background-color:"+target.value+";color:"+fontColor+";}";
				parser.parse($css, function (err, tree) {
					if (err) { return console.error(err) ;}
					var rule = tree.toCSS({'compress':true}).match(regex);
					if(rule.length == 3){
						fontColor = "white";
						backgroundColor = rule[1];
						//determine fontcolor
						if($.xcolor.readable("white",backgroundColor)){
							fontColor = "white";
						} else {
							fontColor = "black";
						}
								
						$target.css({
							"background-color": backgroundColor,
							"color": fontColor
						});
					}
				});//*/
			}
			
			//check if there are dependencies
			var deps = LESS_VARIABLES_REF[depKey];
			if( (typeof deps) !== "undefined" && deps.length > 0){
				//put newly computed value on the stack
				stack.push({'key':depKey,'value':backgroundColor});
				console.log("next = "+depKey);
			}
		
		}
	}
	//refresh less variables
	if(variables != null){
		if((typeof less) !== "undefined"){
			//less.modifyVars(variables);
		}
	}
	
}

function collectLESSVariables(){
	//add default variables
	var variables = ["@import 'less/bootstrap/variables.less'"];
    //override default variables
	$("input:text.form-control")
		.filter("[data-var]")
		.each( function(i,elt){	
			var $this = $(elt);
			var id = $this.attr("id");
			variables.push("@"+id+": "+$this.val()+"");
		});
	//add import sections
	variables.push("@import 'less/bootstrap/mixins.less'");

	// Reset
	variables.push("@import 'less/bootstrap/normalize.less'");
	variables.push("@import 'less/bootstrap/print.less'");

	// Core CSS
	variables.push("@import 'less/bootstrap/scaffolding.less'");
	variables.push("@import 'less/bootstrap/type.less'");
	variables.push("@import 'less/bootstrap/code.less'");
	variables.push("@import 'less/bootstrap/grid.less'");
	variables.push("@import 'less/bootstrap/tables.less'");
	variables.push("@import 'less/bootstrap/forms.less'");
	variables.push("@import 'less/bootstrap/buttons.less'");

	// Components
	variables.push("@import 'less/bootstrap/component-animations.less'");
	variables.push("@import 'less/bootstrap/glyphicons.less'");
	variables.push("@import 'less/bootstrap/dropdowns.less'");
	variables.push("@import 'less/bootstrap/button-groups.less'");
	variables.push("@import 'less/bootstrap/input-groups.less'");
	variables.push("@import 'less/bootstrap/navs.less'");
	variables.push("@import 'less/bootstrap/navbar.less'");
	variables.push("@import 'less/bootstrap/breadcrumbs.less'");
	variables.push("@import 'less/bootstrap/pagination.less'");
	variables.push("@import 'less/bootstrap/pager.less'");
	variables.push("@import 'less/bootstrap/labels.less'");
	variables.push("@import 'less/bootstrap/badges.less'");
	variables.push("@import 'less/bootstrap/jumbotron.less'");
	variables.push("@import 'less/bootstrap/thumbnails.less'");
	variables.push("@import 'less/bootstrap/alerts.less'");
	variables.push("@import 'less/bootstrap/progress-bars.less'");
	variables.push("@import 'less/bootstrap/media.less'");
	variables.push("@import 'less/bootstrap/list-group.less'");
	variables.push("@import 'less/bootstrap/panels.less'");
	variables.push("@import 'less/bootstrap/wells.less'");
	variables.push("@import 'less/bootstrap/close.less'");

	// Components w/ JavaScript
	variables.push("@import 'less/bootstrap/modals.less'");
	variables.push("@import 'less/bootstrap/tooltip.less'");
	variables.push("@import 'less/bootstrap/popovers.less'");
	variables.push("@import 'less/bootstrap/carousel.less'");

	// Utility classes
	variables.push("@import 'less/bootstrap/utilities.less'");
	variables.push("@import 'less/bootstrap/responsive-utilities.less'");
	//variables.push("@import 'less/bootstrap/theme.less'");

	return variables.join(";\n")+";";
}

function compileCSS(){
	var startTime, endTime;
    startTime = endTime = new(Date);
	var css = null;
	var lessInput = collectLESSVariables();
	var parser = new(less.Parser);

	parser.parse(lessInput, function (err, tree) {
		if (err) { 
			//console.log(lessInput);
			return console.error(err);
		}
		try{
		  css = {
			'bootstrap.css':cw + tree.toCSS(),
			'bootstrap.min.css':cw + tree.toCSS({ compress: true })
		  };
		} catch(e){
		  console.error(e);
		}		
		
	});
	console.log("css compiled in "+ (new(Date) - endTime) + "ms");
	return css;
}

function updateCompiledCSS(){
	COMPILED_LESS_CSS = compileCSS();
	if(COMPILED_LESS_CSS != null){
		$("#theme-selector").trigger("change","compiled");
		//disable default CSS
		//activate alternate CSS
	}	
}

function getVariableKey(key){
	if(key.charAt(0) === "@"){
		return key.slice(1); 
	}else{
		return key;
	}
}

function initDraggable(){

	$(".icon-resize-full").next("input").click(function (evt){
		evt.stopPropagation();
		$(this).attr('checked',true);
		$(".color-picker").each( function(i,elt){
			var $this = $(this);
			$this.addClass("color-box-full");
			$this.removeClass("color-box-small");
		});
	});
	
	$(".icon-resize-small").next("input").click(function (evt){
		evt.stopPropagation();
		$(this).attr('checked',true);
		$(".color-picker").each( function(i,elt){
			var $this = $(this);
			$this.addClass("color-box-small");
			$this.removeClass("color-box-full");
		});
	});


//make parent element draggable
  $(".color-picker").draggable({ revert: "valid",cursor: "move" ,opacity: 0.9, helper: "clone",revertDuration: 50,zIndex: 6000 });
	/* Disable Color picker for now
	.focusin( function(){
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

			if (color.cielch.l < 60) {
				scope.color.fontColor = "white";
			}
			else {
				scope.color.fontColor = "black";
			}
			 //fire DOM updates
			 scope.$digest();
		  }
		});
	  //force display
	  $(this).trigger("colorpickersliders.showPopup");
	});
//*/
}

function initPreviewToggle(){
	$("#btn-compile").click(function (evt) {
		evt.stopPropagation();
		evt.preventDefault();
		updateCompiledCSS();
	});
	
	//init PreviewToggle
	$("#btn-preview").click(function (evt) {
		evt.stopPropagation();
		evt.preventDefault();
		var $this = $(this);
		var $prev = $this.find("i");
		if($this.hasClass("edit-view")){
			$this.attr("title","Click to Edit Variables");
			$this.html("<i class='icon-spinner icon-spin'></i>Edit");
			
			$this.removeClass("edit-view");
			$(".edit-view").hide();
			$("#variables").removeClass("col-lg-9 col-lg-offset-3").addClass("col-lg-12");
			$("#colortab").removeClass("hidden-xs hidden-sm affix");
			updateCompiledCSS();
			$this.html("<i class='icon-edit'></i>Edit");
			
		}else{
			$this.attr("title","Click to Compile and Preview stylesheet");
			$this.html("<i class='icon-spinner icon-spin'></i>Preview");
			
			$(".edit-view").show();
			$this.addClass("edit-view");
			$("#variables").removeClass("col-lg-12").addClass("col-lg-9 col-lg-offset-3");
			$("#colortab").addClass("hidden-xs hidden-sm affix");
			$this.html("<i class='icon-eye-open'></i>Preview");
		}
		
	});

}

function generateZip(css,less) {
	if (!css ) return;

	var zip = new JSZip();

	if (css) {
	  var cssFolder = zip.folder('css');
	  for (var fileName in css) {
		cssFolder.file(fileName, css[fileName]);
	  }
	}
	if (less) {
	  var lessFolder = zip.folder('less');
	  for (var fileName in less) {
		lessFolder.file(fileName, less[fileName]);
	  }
	}

	var content = zip.generate({type:"blob"});
	return content;
};
  
   
function initColorPickers(){
$("input:text.form-control")
	.filter("[data-var]")
	.each( function(i,elt){
	
		var $this = $(elt);
		//remove @ from key
		var key = getVariableKey($this.attr("id"));

		var value = $this.val().length > 0 ? $this.val():$this.attr("placeholder");
		$this.val(value);

		console.log(i+" - {"+key + "} = [ "+value+" ]");
		LESS_VARIABLES [key] = {'default':value,'value':value };
		//contains @
		if(value && value.indexOf("@") >= 0){
			addLESSVariablesRef(key,value);
		}
		
	})
	.filter(".color-input")
	.each( function(i,elt){
	
		var $this = $(elt);
		$this.before("<i class='icon-bullseye'></i>");
		var key = $this.attr("data-var");
		var value = $this.val();
		$this.attr({
			"data-color-format" : "hex",			
		});
		$this.css('background-color',value);

	})	
	.ColorPickerSliders({
        order: {
            preview:1,
            hsl: 2,
            opacity:3
        } ,
        onchange: function(container, color) {
			var $this = $(this);
          //update scope variables double bindings
          //tinycolor object is in color.tiny
           var colorHex = color.tiny.toHexString();
           var colorRgb = color.tiny.toRgbString();

           var colorName = $.xcolor.nearestname(colorHex);

           //dynamically update fontcolor
            var fontColor = "black";

			if (color.cielch.l < 60) {
                fontColor = "white";
            }
            else {
                fontColor = "black";
            }
			
			var $input = $(this.connectedinput);
			$this.css("color", fontColor);
			var key = $input.attr("data-var");
			updateLESSVariables(key, colorHex);
	
        }
		
    })
	.droppable({
        drop: function( event, ui ) {
          var newVal = ui.draggable.css('background-color');
		  var colorHex = rgb2hex(newVal);
		  var $this = $(this);
		  $this.val(colorHex);
 
		   var fontColor = "white";
		   
           if($.xcolor.readable("white",newVal)){
                fontColor = "white";
            } else {
                fontColor = "black";
            }
			
			$this.css( {'background-color' :colorHex, 'color' : fontColor} );
			//*/

			$this.trigger("colorpickersliders.updateColor",newVal);
			//update variables
			var key = $this.attr("data-var");
			updateLESSVariables(key, colorHex);
						
        }
		
    });

}


function tooltipInit(){
	// tooltip demo
    $("[data-toggle=tooltip]").tooltip();

    // popover demo
    $("[data-toggle=popover]").popover();

    // carousel demo
    $('.bs-docs-carousel-example').carousel();
}


function initDownlaodButton(){
  var $downloadBtn = $('#btn-download');

  $downloadBtn.on('click', function (e) {
    e.preventDefault();
    $downloadBtn.attr('disabled', 'disabled');
	$downloadBtn.html("<i class='icon-spinner icon-spin'></i>Download");
    var zip = generateZip(compileCSS(),null);
	saveAs(zip, "bootstrap.zip");
	$downloadBtn.removeAttr('disabled');
	$downloadBtn.html("<i class='icon-download-alt'></i>Download");
  });
}
$(function() {

	initDownlaodButton();

	initPreviewToggle();

	initDraggable();

	initColorPickers();

	tooltipInit();
	
	//display after download is complete
	loadThemes("less/bootstrap-default.json");
	loadThemes("less/bootswatch.json");
	//loadThemes("http://api.bootswatch.com/3/");
	$("#loading").remove();
	$("#content").css("visibility","visible");
});

/**
*
*  Javascript color conversion
*  http://www.webtoolkit.info/
*
**/
 
function HSV(h, s, v) {
	if (h <= 0) { h = 0; }
	if (s <= 0) { s = 0; }
	if (v <= 0) { v = 0; }
 
	if (h > 360) { h = 360; }
	if (s > 100) { s = 100; }
	if (v > 100) { v = 100; }
 
	this.h = h;
	this.s = s;
	this.v = v;
}
 
function RGB(r, g, b) {
	if (r <= 0) { r = 0; }
	if (g <= 0) { g = 0; }
	if (b <= 0) { b = 0; }
 
	if (r > 255) { r = 255; }
	if (g > 255) { g = 255; }
	if (b > 255) { b = 255; }
 
	this.r = r;
	this.g = g;
	this.b = b;
}
 
function CMYK(c, m, y, k) {
	if (c <= 0) { c = 0; }
	if (m <= 0) { m = 0; }
	if (y <= 0) { y = 0; }
	if (k <= 0) { k = 0; }
 
	if (c > 100) { c = 100; }
	if (m > 100) { m = 100; }
	if (y > 100) { y = 100; }
	if (k > 100) { k = 100; }
 
	this.c = c;
	this.m = m;
	this.y = y;
	this.k = k;
}
 
var ColorConverter = {
 
	_RGBtoHSV : function  (RGB) {
		var result = new HSV(0, 0, 0);
 
		r = RGB.r / 255;
		g = RGB.g / 255;
		b = RGB.b / 255;
 
		var minVal = Math.min(r, g, b);
		var maxVal = Math.max(r, g, b);
		var delta = maxVal - minVal;
 
		result.v = maxVal;
 
		if (delta == 0) {
			result.h = 0;
			result.s = 0;
		} else {
			result.s = delta / maxVal;
			var del_R = (((maxVal - r) / 6) + (delta / 2)) / delta;
			var del_G = (((maxVal - g) / 6) + (delta / 2)) / delta;
			var del_B = (((maxVal - b) / 6) + (delta / 2)) / delta;
 
			if (r == maxVal) { result.h = del_B - del_G; }
			else if (g == maxVal) { result.h = (1 / 3) + del_R - del_B; }
			else if (b == maxVal) { result.h = (2 / 3) + del_G - del_R; }
 
			if (result.h < 0) { result.h += 1; }
			if (result.h > 1) { result.h -= 1; }
		}
 
		result.h = Math.round(result.h * 360);
		result.s = Math.round(result.s * 100);
		result.v = Math.round(result.v * 100);
 
		return result;
	},
 
	_HSVtoRGB : function  (HSV) {
		var result = new RGB(0, 0, 0);
 
		var h = HSV.h / 360;
		var s = HSV.s / 100;
		var v = HSV.v / 100;
 
		if (s == 0) {
			result.r = v * 255;
			result.g = v * 255;
			result.v = v * 255;
		} else {
			var_h = h * 6;
			var_i = Math.floor(var_h);
			var_1 = v * (1 - s);
			var_2 = v * (1 - s * (var_h - var_i));
			var_3 = v * (1 - s * (1 - (var_h - var_i)));
 
			if (var_i == 0) {var_r = v; var_g = var_3; var_b = var_1}
			else if (var_i == 1) {var_r = var_2; var_g = v; var_b = var_1}
			else if (var_i == 2) {var_r = var_1; var_g = v; var_b = var_3}
			else if (var_i == 3) {var_r = var_1; var_g = var_2; var_b = v}
			else if (var_i == 4) {var_r = var_3; var_g = var_1; var_b = v}
			else {var_r = v; var_g = var_1; var_b = var_2};
 
			result.r = var_r * 255;
			result.g = var_g * 255;
			result.b = var_b * 255;
 
			result.r = Math.round(result.r);
			result.g = Math.round(result.g);
			result.b = Math.round(result.b);
		}
 
		return result;
	},
 
	_CMYKtoRGB : function (CMYK){
		var result = new RGB(0, 0, 0);
 
		c = CMYK.c / 100;
		m = CMYK.m / 100;
		y = CMYK.y / 100;
		k = CMYK.k / 100;
 
		result.r = 1 - Math.min( 1, c * ( 1 - k ) + k );
		result.g = 1 - Math.min( 1, m * ( 1 - k ) + k );
		result.b = 1 - Math.min( 1, y * ( 1 - k ) + k );
 
		result.r = Math.round( result.r * 255 );
		result.g = Math.round( result.g * 255 );
		result.b = Math.round( result.b * 255 );
 
		return result;
	},
 
	_RGBtoCMYK : function (RGB){
		var result = new CMYK(0, 0, 0, 0);
 
		r = RGB.r / 255;
		g = RGB.g / 255;
		b = RGB.b / 255;
 
		result.k = Math.min( 1 - r, 1 - g, 1 - b );
		result.c = ( 1 - r - result.k ) / ( 1 - result.k );
		result.m = ( 1 - g - result.k ) / ( 1 - result.k );
		result.y = ( 1 - b - result.k ) / ( 1 - result.k );
 
		result.c = Math.round( result.c * 100 );
		result.m = Math.round( result.m * 100 );
		result.y = Math.round( result.y * 100 );
		result.k = Math.round( result.k * 100 );
 
		return result;
	},
 
	toRGB : function (o) {
		if (o instanceof RGB) { return o; }
		if (o instanceof HSV) {	return this._HSVtoRGB(o); }
		if (o instanceof CMYK) { return this._CMYKtoRGB(o); }
	},
 
	toHSV : function (o) {
		if (o instanceof HSV) { return o; }
		if (o instanceof RGB) { return this._RGBtoHSV(o); }
		if (o instanceof CMYK) { return this._RGBtoHSV(this._CMYKtoRGB(o)); }
	},
 
	toCMYK : function (o) {
		if (o instanceof CMYK) { return o; }
		if (o instanceof RGB) { return this._RGBtoCMYK(o); }
		if (o instanceof HSV) { return this._RGBtoCMYK(this._HSVtoRGB(o)); }
	}
 
}