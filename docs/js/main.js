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
		  css = tree.toCSS();
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
	$("#compile").click(function (evt) {
		evt.stopPropagation();
		evt.preventDefault();
		updateCompiledCSS();
	});
	
	//init PreviewToggle
	$("#preview").click(function (evt) {
		evt.stopPropagation();
		evt.preventDefault();
		var $this = $(this);
		var $prev = $this.find("i");
		if($this.hasClass("edit-view")){
			$this.attr("title","Click to Edit Variables");
			$this.html("<i class='icon-edit'></i>Edit");
			$this.removeClass("edit-view");
			$(".edit-view").hide();
			$("#variables").removeClass("col-lg-9 col-lg-offset-3").addClass("col-lg-12");
			$("#colortab").removeClass("hidden-xs hidden-sm affix");
			updateCompiledCSS();
			
		}else{
			$this.attr("title","Click to Compile and Preview stylesheet");
			$this.html("<i class='icon-eye-open'></i>Preview");
			$(".edit-view").show();
			$this.addClass("edit-view");
			$("#variables").removeClass("col-lg-12").addClass("col-lg-9 col-lg-offset-3");
			$("#colortab").addClass("hidden-xs hidden-sm affix");
		}
		
	});

}

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
		var key =  $this.attr("data-var");
		var value =  $this.val();
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

$(function() {

initPreviewToggle();

initDraggable();

initColorPickers();

});

