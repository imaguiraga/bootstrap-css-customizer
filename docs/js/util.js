
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
 
/**
 * [ColorConverter description]
 * @type {Object}
 */
var ColorConverter = {
 
 	/**
 	 * [_RGBtoHSV description]
 	 * @param  {[type]} RGB [description]
 	 * @return {[type]}     [description]
 	 */
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
 	/**
 	 * [_HSVtoRGB description]
 	 * @param  {[type]} HSV [description]
 	 * @return {[type]}     [description]
 	 */
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
 	/**
 	 * [_CMYKtoRGB description]
 	 * @param  {[type]} CMYK [description]
 	 * @return {[type]}      [description]
 	 */
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
 	/**
 	 * [_RGBtoCMYK description]
 	 * @param  {[type]} RGB [description]
 	 * @return {[type]}     [description]
 	 */
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
 	/**
 	 * [toRGB description]
 	 * @param  {[type]} o [description]
 	 * @return {[type]}   [description]
 	 */
	toRGB : function (o) {
		if (o instanceof RGB) { return o; }
		if (o instanceof HSV) {	return this._HSVtoRGB(o); }
		if (o instanceof CMYK) { return this._CMYKtoRGB(o); }
	},
 	/**
 	 * [toHSV description]
 	 * @param  {[type]} o [description]
 	 * @return {[type]}   [description]
 	 */
	toHSV : function (o) {
		if (o instanceof HSV) { return o; }
		if (o instanceof RGB) { return this._RGBtoHSV(o); }
		if (o instanceof CMYK) { return this._RGBtoHSV(this._CMYKtoRGB(o)); }
	},
 	/**
 	 * [toCMYK description]
 	 * @param  {[type]} o [description]
 	 * @return {[type]}   [description]
 	 */
	toCMYK : function (o) {
		if (o instanceof CMYK) { return o; }
		if (o instanceof RGB) { return this._RGBtoCMYK(o); }
		if (o instanceof HSV) { return this._RGBtoCMYK(this._HSVtoRGB(o)); }
	}
 
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

/**
 * [ColorLuminance description]
 * @param {[type]} hex [description]
 * @param {[type]} lum [description]
 */
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

/**
 * [hexToRgbString description]
 * @param  {[type]} hex [description]
 * @return {[type]}     [description]
 */
function hexToRgbString(hex) {
   var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
   var tmp = {
       r: parseInt(result[1], 16),
       g: parseInt(result[2], 16),
       b: parseInt(result[3], 16)
   };
   return 'rgb('+tmp.r+','+tmp.g+','+tmp.b+')';
}

/**
 * [rgb2hex description]
 * @param  {[type]} rgb [description]
 * @return {[type]}     [description]
 */
function rgb2hex(rgb) {
	rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	function hex(x) {
		return ("0" + parseInt(x).toString(16)).slice(-2);
	}
	return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

/**
 * [switch_style description]
 * @param  {[type]} css_title [description]
 * @return {[type]}           [description]
 */
function switch_style ( css_title ){
// You may use this script on your site free of charge provided
// you do not remove this notice or the URL below. Script from
// http://www.thesitewizard.com/javascripts/change-style-sheets.shtml
  var i, link_tag ;
  for (i = 0, link_tag = document.getElementsByTagName("link") ; i < link_tag.length ; i++ ) {
    if ((link_tag[i].rel.indexOf( "stylesheet" ) != -1) &&  link_tag[i].title) {
      link_tag[i].disabled = true ;
      if (link_tag[i].title == css_title) {
        link_tag[i].disabled = false ;
      }
    }
    //set_cookie( style_cookie_name, css_title,  style_cookie_duration );
  }
}
