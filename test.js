var less = require("./docs/assets/js/less.js");
var css = ".class { width: (1 + 1) }";
console.log("start");
try {
    var parser = new less.Parser({
        paths: ['http://bootswatch.com/amelia/variables.less', 'http://bootswatch.com/amelia/bootswatch.less'],
        optimization: 0,
        filename: 'bootstrap.css'
    }).parse(css, function (err, tree) {
        if (err) {
            console.log('<strong>Ruh roh!</strong> Could not parse less files.' + err);
        }
        result = {
            'bootstrap.css': tree.toCSS(),
            'bootstrap.min.css': tree.toCSS({
                compress: true
            })
        };
		console.log(result);
    })
} catch (err) {
    console.log('<strong>Ruh roh!</strong> Could not parse less files.' + err);
}

var color = (new (less.tree.Color)("333333"));console.log(color.toCSS());
var color = (new (less.tree.Color)("333333"));console.log(less.tree.functions.darken(color,{value:10}).toCSS());

var names = [];
for( var n in less.tree.functions){
	names.push(n);
}
names.sort();
for( var n in names){
	console.log(names[n]);
}

%
_isa
_math
abs
acos
alpha
argb
asin
atan
average
blue
ceil
color
contrast
convert
cos
darken
data-uri
desaturate
difference
e
escape
exclusion
extract
fade
fadein
fadeout
floor
green
greyscale
hardlight
hsl
hsla
hsv
hsva
hsvhue
hsvsaturation
hsvvalue
hue
iscolor
isem
iskeyword
isnumber
ispercentage
ispixel
isstring
isunit
isurl
lighten
lightness
luma
mix
mod
multiply
negation
overlay
percentage
pi
pow
red
rgb
rgba
round
saturate
saturation
screen
shade
sin
softlight
spin
sqrt
tan
tint
unit
undefined