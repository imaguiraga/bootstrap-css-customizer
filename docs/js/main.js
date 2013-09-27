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
var LESS_VARIABLES = {};
var LESS_VARIABLES_REF = {};

function updateLESSVariables(key, value){
	if( key !== undefined){
		LESS_VARIABLES [key].value = value; 
		console.log("{"+key + "} = [ "+value+" ]");
	}
	
	
}

function addLESSVariablesRef(key,value){
	/*
	darken(@link-color, 15%)
	(@popover-arrow-width 1)
	@brand-primary
	(@popover-arrow-width 1) 
	//*/
	var pattern =/@(\D*)\s?/gm;
	//pattern =/@(\D*)(?=[,|\s]?)/gm;
	//find reference
	var result = value.replace(","," ").trim().match(pattern);
	if(result){
		var reference = result[0];
		if( typeof reference === "string"){
			reference = reference.trim();
			console.log("{"+key+ "} -> {"+reference+"}");
			if(typeof LESS_VARIABLES_REF[reference] === "undefined"){
				LESS_VARIABLES_REF[reference] = [];	
			}
			
			if(LESS_VARIABLES_REF[reference].length){
				LESS_VARIABLES_REF[reference].push(key);
			}
		}
	}

}

$(function() {
//    $( document ).tooltip();

$("input:text.form-control")
	.filter("[data-var]")
	.each( function(i,elt){
	
		var $this = $(elt);
		var key = $this.attr("data-var");
		var value = $this.val().length > 0 ? $this.val():$this.attr("placeholder");
		$this.val(value);
		$this.attr({
			"id" : key
		});
		//console.log(this.attributes["data-var"].value);
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
			//$this.val(colorHex);
			
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
			
			/*
			if (color.cielch.l < 60) {
                $(this).css("color", "white");
            }
            else {
                $(this).css("color", "black");
            }
			//*/
			$this.trigger("colorpickersliders.updateColor",newVal);
			//update variables
			var key = $this.attr("data-var");
			updateLESSVariables(key, colorHex);
						
        }
		
    });

});

