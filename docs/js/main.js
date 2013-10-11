 var cw = '/*!\n * Bootstrap v3.0.0\n *\n * Copyright 2013 Twitter, Inc\n * Licensed under the Apache License v2.0\n * http://www.apache.org/licenses/LICENSE-2.0\n *\n * Designed and built with all the love in the world @twitter by @mdo and @fat.\n */\n\n';


var THEMES = {};
var CURRENT_THEME = null;
var COMPILED_LESS_CSS = null;
var LESS_VARIABLES = {};
var LESS_VARIABLES_REF = {};
var parser = new less.Parser(new less.tree.parseEnv(less));
var DEBUG = false;

 var COMMON_LESS = {"less": 
	[
		"less/bootstrap/mixins.less",

		"less/bootstrap/normalize.less",
		"less/bootstrap/print.less",

		"less/bootstrap/scaffolding.less",
		"less/bootstrap/type.less",
		"less/bootstrap/code.less",
		"less/bootstrap/grid.less",
		"less/bootstrap/tables.less",
		"less/bootstrap/forms.less",
		"less/bootstrap/buttons.less",

		"less/bootstrap/component-animations.less",
		"less/bootstrap/glyphicons.less",
		"less/bootstrap/dropdowns.less",
		"less/bootstrap/button-groups.less",
		"less/bootstrap/input-groups.less",
		"less/bootstrap/navs.less",
		"less/bootstrap/navbar.less",
		"less/bootstrap/breadcrumbs.less",
		"less/bootstrap/pagination.less",
		"less/bootstrap/pager.less",
		"less/bootstrap/labels.less",
		"less/bootstrap/badges.less",
		"less/bootstrap/jumbotron.less",
		"less/bootstrap/thumbnails.less",
		"less/bootstrap/alerts.less",
		"less/bootstrap/progress-bars.less",
		"less/bootstrap/media.less",
		"less/bootstrap/list-group.less",
		"less/bootstrap/panels.less",
		"less/bootstrap/wells.less",
		"less/bootstrap/close.less",

		"less/bootstrap/modals.less",
		"less/bootstrap/tooltip.less",
		"less/bootstrap/popovers.less",
		"less/bootstrap/carousel.less",

		"less/bootstrap/utilities.less",
		"less/bootstrap/responsive-utilities.less"

	],
	"lessVariables": ["less/bootstrap/variables.less"]
};
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
			//adding new properties
			/*
			,
			"compiled" : true,
            "lessVariables": "less/bootstrap/variables.less",
			"compiledLessVariables": null,
			"compiledCssMin": null
			//*/
			//urls are overrides
			//theme not already initialized
			if(!THEMES[theme.name.toLowerCase()]){
				if($.isArray(theme.lessVariables)){
					theme.lessVariables = COMMON_LESS.lessVariables.concat(theme.lessVariables);
				}else{
					theme.lessVariables = COMMON_LESS.lessVariables.concat([theme.lessVariables]);
				}
				if($.isArray(theme.less)){
					theme.less = theme.less.concat(COMMON_LESS.less);
				}else{
					theme.less = [theme.less].concat(COMMON_LESS.less);
				}
				theme.compiled = false;
				theme.compiledCssMin = null;
				theme.compiledLessVariables = null;
				THEMES[theme.name.toLowerCase()] = theme;
			}
        }
      }
    })
    .fail(function(jqXHR, textStatus) {
      console.error(textStatus);
    })
  }

//update less variables


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
	pattern =/@([a-zA-Z0-9\-])*[^;,\)]/gm;
	//find reference
	var result = value.replace(","," ").trim().match(pattern);
	if(result){
		var reference = result[0];
		if( typeof reference === "string"){
			reference = getVariableKey(reference.trim());
			if(DEBUG){
				console.log("{"+key+ "} -> {"+reference+"}");
			}
			if(typeof LESS_VARIABLES_REF[reference] === "undefined"){
				LESS_VARIABLES_REF[reference] = [];	
			}
			
			LESS_VARIABLES_REF[reference].push({'key' : key, 'value' :value});
		}
	}

}

function updateLESSVariables(key, value){	
	var startTime = new(Date);
    var variables = null;//variables that changed
	if( typeof key !== "undefined"){
		if(key.charAt(0) === "@" && value != null){	
			variables = {};
			variables[key] = value;
		}
		key = getVariableKey(key);
		LESS_VARIABLES [key].value = value; 
		if(DEBUG){
			console.log("{"+key + "} = [ "+value+" ]");
		}
		
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
		//console.log("1.-> updateLESSVariables "+ current.key+" - "+JSON.stringify(ref));
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
					var startTime1 = new(Date);
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
					//console.log("parseLESSVariables "+ id+" - "+ (new(Date) - startTime1) + "ms");
				});//*/
			}
			
			//check if there are dependencies
			var deps = LESS_VARIABLES_REF[depKey];
			if( (typeof deps) !== "undefined" && deps.length > 0){
				//put newly computed value on the stack
				stack.push({'key':depKey,'value':backgroundColor});
				if(DEBUG){
					console.log("next = "+depKey);
				}
			}
		
		}
	}
	//console.log("2.-> updateLESSVariables "+ key+" - t="+ (new(Date) - startTime) + "ms");
	//refresh less variables
	if(variables != null){
		if((typeof less) !== "undefined"){
			//less.modifyVars(variables);
		}
	}
	
}

function collectLESSVariables(theme){
	//add default variables
	var variables = [];//["@import 'less/bootstrap/variables.less'"];
	var lessVariables = theme.lessVariables;
	var less = theme.less;
	if($.isArray(lessVariables)){
		for(var i=0;i<lessVariables.length;i++){
			variables.push("@import '"+lessVariables[i]+"'");
		}
	}else{
		variables.push("@import '"+lessVariables+"'");
	}
    //override default variables
	$("input:text.form-control")
		.filter("[data-var]")
		.each( function(i,elt){	
			var $this = $(elt);
			var id = $this.attr("id");
			variables.push("@"+id+": "+$this.val()+"");
		});
	//add import sections
	if($.isArray(less)){
		for(var i=0;i<less.length;i++){
			variables.push("@import '"+less[i]+"'");
		}
	}else{
		variables.push("@import '"+less+"'");
	}
	/*
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
//*/
	return variables.join(";\n")+";";
}

function compileCSS(){
	var startTime, endTime;
    startTime = endTime = new(Date);
	var css = null;
	var lessInput = collectLESSVariables(CURRENT_THEME);
	var parser = new(less.Parser);

	parser.parse(lessInput, function (err, tree) {
		if (err) { 
			//console.log(lessInput);
			return console.error(err);
		}
		try{
		  css = {
			'bootstrap.css':cw + tree.toCSS(),
			'bootstrap.min.css':cw + tree.toCSS({ compress: true }),
			'variables': lessInput
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
	//TODO clone  compiled from currently slected theme
		var theme= THEMES['compiled'];
		theme.less = CURRENT_THEME.less;
		theme.lessVariables = CURRENT_THEME.lessVariables;
		theme.compiled = true;
		theme.compiledLessVariables = COMPILED_LESS_CSS.variables; 
		theme.compiledCssMin = COMPILED_LESS_CSS['bootstrap.min.css'];

		//disable default CSS
		//store in localstorage
		window.localStorage.setItem('compiled', JSON.stringify(theme));
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
		var $this = $(this);
		$this.html("<i class='icon-spinner icon-spin'></i>Compile");
		updateCompiledCSS();
		$this.html("<i class='icon-gear'></i>Compile");
		$("#theme-selector").val("compiled").trigger("change");
		//$("#theme-selector").val("compiled");
	});
	
	//init PreviewToggle
	$("#btn-preview").click(function (evt) {
		evt.stopPropagation();
		evt.preventDefault();
		var $this = $(this);
		var $prev = $this.find("i");
		if($this.hasClass("edit-view")){//setting Preview mode
			$this.attr("title","Click to Edit Variables");
			$this.html("<i class='icon-spinner icon-spin'></i>Edit");
			
			$this.removeClass("edit-view");
			$(".edit-view").hide();
			$("#variables").removeClass("col-lg-9 col-lg-offset-3").addClass("col-lg-12");
			$("#colortab").removeClass("hidden-xs hidden-sm affix");
			//updateCompiledCSS();
			$this.html("<i class='icon-edit'></i>Edit");
			$("#content").removeClass("theme-edit");
			
		}else{//setting edit mode
			$this.attr("title","Click to Compile and Preview stylesheet");
			$this.html("<i class='icon-spinner icon-spin'></i>Preview");
			
			$(".edit-view").show();
			$this.addClass("edit-view");
			$("#variables").removeClass("col-lg-12").addClass("col-lg-9 col-lg-offset-3");
			$("#colortab").addClass("hidden-xs hidden-sm affix");
			$this.html("<i class='icon-eye-open'></i>Preview");
			//use theme edit to keep a consistent edit UI
			$("#content").addClass("theme-edit");
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
		if(DEBUG){
			console.log(i+" - {"+key + "} = [ "+value+" ]");
		}
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
	
		$this.ColorPickerSliders({
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
				if(DEBUG){
					console.log("onchange - updateLESSVariables "+ key);
				}
				updateLESSVariables(key, colorHex);
		
			}
			
		})
		.droppable({
			drop: function( event, ui ) {
			  event.stopPropagation();
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

			}
			
		});
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


function initDownloadButton(){
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

  function loadThemeVariables(theme) {
	var startTime = new(Date) ;
    var variables = {};
	if(theme.compiled){
	//load from theme.compiledLessVariables less content
		var pattern =/([^@]+):([^;]+)/gm;
		var result = theme.compiledLessVariables.match(pattern);
		for( var j in result){
			var values = result[j].toString().split(":");
			var key = values[0].trim();
			var value = values[1].replace(/\/\/.+/gm,"").trim();
			
			if(typeof variables === "object"){
				if(DEBUG){
					console.log(j+" - "+key+" = "+value);
				}
				variables[key] = value;
			}
		}
	}else{
		var urls = theme.lessVariables;
		if(!$.isArray(theme.lessVariables)){
			urls = [urls];
		}
	//loop through all the links
		for(var i in urls){
			var url = urls[i];
			loadLESSVariables(url,variables);
		}
		
	}
	console.log("loadThemeVariables "+ (new(Date) - startTime) + "ms");
	return variables;
  }
 
function loadLESSVariables(url,variables){
	var pattern =/([^@]+):([^;]+)/gm;
	pattern =/([^@]+):([^;]+)/gm;
	
	//var deferredReady = $.Deferred();
	$.ajax({
		  cache: true,
		  url: url,
		  async : false,
		  type: 'GET',
		  dataType: 'text'
		})
		.done(function(data) {
		//convert @var :value; to "@var" : "value";
			var startTime = new(Date);
			var result = data.match(pattern);
			for( var j in result){
				var values = result[j].toString().split(":");
				var key = values[0].trim();
				var value = values[1].replace(/\/\/.+/gm,"").trim();
				
				if(typeof variables === "object"){
					if(DEBUG){
						console.log(j+" - "+key+" = "+value);
					}
					variables[key] = value;
				}
			}
			//deferredReady.resolve(variables);
			console.log("loadLESSVariables "+ (new(Date) - startTime) + "ms");
		})
		.fail(function(jqXHR, textStatus) {
		  console.error(textStatus);
		});
	//return deferredReady.promise();
} 

var $dataVar = $("input:text.form-control").filter("[data-var]");
function populateLESSVariables(theme){
  var variables = loadThemeVariables(theme);
  var startTime = new(Date);
/*$("input:text.form-control")
	.filter("[data-var]")//*/
	$dataVar.each(function(i,elt){
		var $this = $(elt);
		var id = $this.attr("id");
		if(id && variables[id]){
			$this.val(variables[id]);
		}
	  //}).each(function(i,elt){
			//var $this = $(elt);
			if($this.hasClass("color-input")){
				var newVal = $this.val();
				var colorHex = newVal;
				if(newVal == null){
					return;
				}
				try{
					if(newVal.charAt(0) === '#'){
					
						var fontColor = "white";
				   
						if($.xcolor.readable("white",newVal)){
							fontColor = "white";
						} else {
							fontColor = "black";
						}
						
						$this.css( {'background-color' :colorHex, 'color' : fontColor} );
						//*/

						$this.trigger("colorpickersliders.updateColor",newVal);
						//update variables if not color-input since onchange colorpickerwill do so
						//var key = $this.attr("data-var");
						//updateLESSVariables(key, colorHex);
					
					}else{
						if(DEBUG){
							console.log($this.attr('id')+" = "+newVal);
						}
					}
					if(newVal.charAt(0) !== '#'){
						//colorHex = rgb2hex(newVal);
					}
				}catch(err){
					console.error($this.attr('id')+" = "+newVal+" - "+err.message);
				}
				
			}
	  });
	  
	  console.log("populateLESSVariables "+ (new(Date) - startTime) + "ms");
}

//update theme when selection changes
$("#theme-selector").change(function(evt){ 
	evt.stopPropagation();
	var selection = $(this).val();
	if(DEBUG){
		console.log(selection);
	}
	var $link = document.getElementById("bootstrap:css");
	var $compiled = $(document.getElementById("compiled:css"));
	
	//$("#loading").show();
	$("#content").css("visibility","hidden");	
	CURRENT_THEME = THEMES[selection];

	if( CURRENT_THEME != null && CURRENT_THEME.compiled == true){		  
		$compiled.append(CURRENT_THEME.compiledCssMin);
		$link.disabled = true;
		
	}else{
		$link.href = CURRENT_THEME.cssMin;
		$compiled.empty();
		$link.disabled = false;

	}
	populateLESSVariables(CURRENT_THEME);
	//$("#loading").hide();
	$("#content").css("visibility","visible");	
});
//*/

$(function() {
	//load stored compiled theme from cache
	if (window.localStorage.getItem('compiled')) {
		var theme = JSON.parse(window.localStorage.getItem('compiled'))
		THEMES['compiled'] = theme;
	}
	
	initDownloadButton();

	initPreviewToggle();

	initDraggable();

	initColorPickers();

	tooltipInit();
	
	//display after download is complete
	loadThemes("less/bootstrap-default.json");
	loadThemes("less/bootswatch.json");
	CURRENT_THEME = THEMES['default'];
	
	//loadThemes("http://api.bootswatch.com/3/");
	$("#loading").hide();
	$("#content").css("visibility","visible");
});
