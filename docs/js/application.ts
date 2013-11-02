/// <reference path='typescript/jquery/jquery.d.ts'/>
/// <reference path='typescript/jquery/jquery.noty.d.ts'/>
/// <reference path='typescript/less.d.ts'/>
/**
 * [Controller description]
 */
//declare var $: any;
//declare var jQuery: any;

class Controller{
   
   /**
	* [_CW bootstrap copyright]
	* @type {String}
	*/
    static _CW : string = '/*!\n * Bootstrap v3.0.0\n *\n * Copyright 2013 Twitter, Inc\n * Licensed under the Apache License v2.0\n * http://www.apache.org/licenses/LICENSE-2.0\n *\n * Designed and built with all the love in the world @twitter by @mdo and @fat.\n */\n\n';

	/**
	 * [_THEMES description]
	 * @type {Object}
	 */
	private _THEMES : any;
	/**
	 * [_CURRENT_THEME description]
	 * @type {Object}
	 */
	private _CURRENT_THEME : any;
	/**
	 * [_COMPILED_LESS_CSS description]
	 * @type {Object}
	 */
	private _COMPILED_LESS_CSS : any;
	/**
	 * [_LESS_VARIABLES description]
	 * @type {Object}
	 */
	private _LESS_VARIABLES : any;

	/**
	 * [_parser description]
	 * @type {less.Parser}
	 */
	private _parser : any;//new less.Parser(new less.tree.parseEnv(less));

	/**
	 * [_CORE_LESS description]
	 * @type {Object}
	 */
	static _CORE_LESS : any  = {
		"lessCore": 	[
		   /*
			"bootstrap/mixins.less",

			"bootstrap/normalize.less",
			"bootstrap/print.less",

			"bootstrap/scaffolding.less",
			"bootstrap/type.less",
			"bootstrap/code.less",
			"bootstrap/grid.less",
			"bootstrap/tables.less",
			"bootstrap/forms.less",
			"bootstrap/buttons.less",

			"bootstrap/component-animations.less",
			"bootstrap/glyphicons.less",
			"bootstrap/dropdowns.less",
			"bootstrap/button-groups.less",
			"bootstrap/input-groups.less",
			"bootstrap/navs.less",
			"bootstrap/navbar.less",
			"bootstrap/breadcrumbs.less",
			"bootstrap/pagination.less",
			"bootstrap/pager.less",
			"bootstrap/labels.less",
			"bootstrap/badges.less",
			"bootstrap/jumbotron.less",
			"bootstrap/thumbnails.less",
			"bootstrap/alerts.less",
			"bootstrap/progress-bars.less",
			"bootstrap/media.less",
			"bootstrap/list-group.less",
			"bootstrap/panels.less",
			"bootstrap/wells.less",
			"bootstrap/close.less",

			"bootstrap/modals.less",
			"bootstrap/tooltip.less",
			"bootstrap/popovers.less",
			"bootstrap/carousel.less",

			"bootstrap/utilities.less",
			"bootstrap/responsive-utilities.less",
			//*/
			"bootstrap/bootstrap-ibr.less"
			//,"bootstrap/theme-gradients-ibr.less"
		
			],
			"lessVariables": ["bootstrap/variables.less"]
		};

	/**
	 * [_THEME_LESS description]
	 * @type {Object}
	 */

	static _THEME_LESS :any = {
				"lessCore": [
				/*
				"bootstrap/mixins.less",        
				//*/
				"bootstrap/theme-ibr.less"
				],
				"lessVariables": ["bootstrap/variables.less"]
			};
			
	constructor(){
	/**
	* [_THEMES description]
	* @type {Object}
	*/
		this._THEMES = {};
	/**
	* [_CURRENT_THEME description]
	* @type {Object}
	*/
		this._CURRENT_THEME = null;
	/**
	* [_COMPILED_LESS_CSS description]
	* @type {Object}
	*/
	   this._COMPILED_LESS_CSS = null;
	
	/**
	* [_LESS_VARIABLES description]
	* @type {Object}
	*/
		this._LESS_VARIABLES = {};

	/**
	* [_parser description]
	* @type {less.Parser}
	*/
		this._parser = new less.Parser();//new less.Parser(new less.tree.parseEnv(less));

	}

	 /**
	  * [getThemes description]
	  * @return {Object} [description]
	  */
	 getThemes() {
		return this._THEMES;
	 }

	  /**
	   * [getTheme description]
	   * @param  {String} key [description]
	   * @return {Object}    [description]
	   */
	 getTheme(key: string) {
		return this._THEMES[key];
	 }

	 /**
	  * [loadThemes description]
	  * @param  {String} url
	  * @return {Void}
	  */
	loadThemes(url: string) {

		var /*@{Controller}*/ controller = this;
		return $.ajax({
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
						"compiled" : true,
						"lessVariables": "bootstrap/variables.less",
						"compiledLessVariables": null,
						"compiledCssMin": null
					//*/
					//urls are overrides
					//theme not already initialized
					if(!controller._THEMES[theme.name.toLowerCase()]){
					//add custom variables after core ones
						if($.isArray(theme.lessVariables)){
							theme.lessVariables = Controller._CORE_LESS.lessVariables.concat(theme.lessVariables);
						}else{
							theme.lessVariables = Controller._CORE_LESS.lessVariables.concat([theme.lessVariables]);
						}
						
						if($.isArray(theme.less)){
							theme.less = theme.less.concat(Controller._CORE_LESS.lessCore);
						}else{
							theme.less = [theme.less].concat(Controller._CORE_LESS.lessCore);
						}
						theme.compiled = false;
						theme.compiledCssMin = null;
						theme.compiledGradientsCssMin = null;
						theme.compiledLessVariables = null;
						controller._THEMES[theme.name.toLowerCase()] = theme;
					}
				}
			  }
		})
		.fail(function(jqXHR, textStatus) {
			console.error(textStatus);
		});
	  }

	//update less variables

	/**
	 * [updateLESSVariablesRef description]
	 * @param  {String} key
	 * @param  {String} value
	 * @param  {Object} $input
	 * @return {Void}
	 */
	updateLESSVariablesRef(key: string,value: string,$input: any){
		if( typeof key === "undefined"){
			return;
		}

		key = this.getVariableKey(key); 
			
		/*
		darken(@link-color, 15%)
		(@popover-arrow-width 1)
		@brand-primary
		(@popover-arrow-width 1) 
		//*/
		/** @type {RegExp} [description] */
		var pattern = /@([a-zA-Z0-9\-])*[^;,\)]/gm;
		//find reference
		var result = value.replace(","," ").trim().match(pattern);
		if(result){
			var reference = result[0];
			if( typeof reference === "string"){
				reference = this.getVariableKey(reference.trim());
				if(_DEBUG){
					console.log("{"+key+ "} -> {"+reference+"}");
				}

                if(typeof this._LESS_VARIABLES[reference] === "undefined"){
					this._LESS_VARIABLES[reference] = {};	
				}
				if(typeof this._LESS_VARIABLES[reference].links === "undefined"){
					this._LESS_VARIABLES[reference].links = [];	
				}
				var ref = $input.data("ref");
				//remove old reference
				if((typeof ref !== "undefined") && (ref !== reference)){
					var arr = this._LESS_VARIABLES[ref].links;
					if($.isArray(arr)){
						var len = arr.length;
						//find position
						for(var i = 0;i < len; i++){
							if(arr[i].key === key){						
								arr.splice(i,1);
								if(_DEBUG){
									console.log("ref from {"+ref+ "} -> {"+reference+"}");
								}
								break;
							}
						}

					}
				}
				//add new reference //update formula link
				this._LESS_VARIABLES[reference].links.push({'key' : key, 'value' :value});
				$input.data("ref",reference);
			}
		}

	}
    
	/**
	 * [updateLESSVariables description]
	 * @param  {String} key   [description]
	 * @param  {String} value [description]
	 * @return {Void}       [description]
	 */
	updateLESSVariables(key: string, value: string){	
	/** @type {Date} [description] */
		var startTime = new Date();
		var variables = null;//variables that changed
		if( typeof key !== "undefined"){
			if(key.charAt(0) === "@" && value != null){	
				variables = {};
				variables[key] = value;
			}
			key = this.getVariableKey(key);
			//update variables registry
			this._LESS_VARIABLES[key].value = value; 
			if(_DEBUG){
				console.log("{"+key + "} = [ "+value+" ]");
			}
			
		}else{
			return;
		}
		if(_DEBUG){
			console.log("start {"+key + "} = [ "+value+" ] - "+ (new(Date) - startTime) + "ms");
		}
		/** @type {Array} [description] */
		var stack = [{'key':key,'value':value}];

		while(stack.length > 0){
			var current = stack.shift();
			//find references and update their values 
			var id = "#"+current.key;
			var $source = $(id);
			var links = this._LESS_VARIABLES[current.key].links;
			var regex = /background-color:(.*);color:(.*);?/;
			
			//console.log("1.-> updateLESSVariables "+ current.key+" - "+JSON.stringify(ref));
			var startTime2 = new(Date);
			for(var i in links){
				var target = links[i];
                //skip empty links
                if(target.value == null){
                    continue;
                }
                
				var depKey = target.key;
				id = "#"+depKey;
				var $target = $(id);
				
				var fontColor = $source.css("color");
				var backgroundColor = $source.css("background-color");
							
				//no need to compute the value for direct assignment
				//@link-color
				if(target.value.charAt(0) === "@"){
				    var startTime1 = new(Date);
					$target.css({
						"background-color": backgroundColor,
						"color": fontColor
					});
                    $target.data("computed-value",backgroundColor);
					if(_DEBUG){console.log("@1. -> parseLESSVariables "+ id+" - "+ (new(Date) - startTime1) + "ms"); }	
                    
				}else{
					//generate CSS and parse it for content
					var $css = "@"+current.key+":"+current.value+"; #"+target.key+" {background-color:"+target.value+";color:"+fontColor+";}";//$target.val()/*
					this._parser.parse($css, function (err, tree) {
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
							if(_DEBUG){console.log("1.0 -> parseLESSVariables "+ id+" - "+ (new(Date) - startTime1) + "ms");}		
							$target.css({
								"background-color": backgroundColor,
								"color": fontColor
							});
                            $target.data("computed-value",backgroundColor);
							
						}
						if(_DEBUG){console.log("1. -> parseLESSVariables "+ id+" - "+ (new(Date) - startTime1) + "ms");}
					});//*/
				}
				
				//check if there are dependencies
				var deps = this._LESS_VARIABLES[depKey].links;
				if( (typeof deps) !== "undefined" && deps.length > 0){
					//put newly computed value on the stack
					stack.push({'key':depKey,'value':backgroundColor});
					if(_DEBUG){
						console.log("next = "+depKey);
					}
				}
			
			}
			if(_DEBUG){console.log("end-1. -> updateLESSVariables "+ key+" - t="+ (new(Date) - startTime2) + "ms");}
		}
		if(_DEBUG){console.log("end-2. -> updateLESSVariables "+ key+" - t="+ (new(Date) - startTime) + "ms");}
	
	}
    
	/**
	 * [compileCSS description]
	 * @return {Object} [description]
	 */
	compileCSS(){
		var startTime, endTime;
		startTime = endTime = new(Date);
		var css = null;
		var lessInput = Application.collectLESSVariables(this._CURRENT_THEME);
		var controller = this;
		var _parser = new (less.Parser)();
		_parser.parse(lessInput.core, function (err, tree) {
			if (err) { 
				console.log(lessInput.core);
				Application.generateNote(err,'error');
				return console.error(err);
			}
			try{
				  css = {
					'bootstrap.css':Controller._CW + tree.toCSS(),
					'bootstrap.min.css':Controller._CW + tree.toCSS({ compress: true }),
					'variables.less': lessInput.core,

				  };
			} catch(e){
			 	console.log(lessInput.core);
				Application.generateNote(e.name + ": " + e.message,'error');
				console.error(e);
			}		
			
		});
		
		var endTime= new(Date);
		var msg  = "css compiled in "+ (endTime - startTime) + "ms";
		console.log(msg);
		Application.generateNote(msg,'success');
		_parser = new (less.Parser)();
		_parser.parse(lessInput.theme, function (err, tree) {
			if (err) { 
				console.log(lessInput.theme);	
				Application.generateNote(err,'error');				
				return console.error(err);
			}
			try{
				css['bootstrap-theme.css'] =  Controller._CW + tree.toCSS();
				css['bootstrap-theme.min.css'] =  Controller._CW + tree.toCSS({ compress: true });
			} catch(e){
				console.log(lessInput.theme);
				Application.generateNote(e.name + ": " + e.message,'error');
				console.error(e);
			}		
			
		});
		 msg  = "theme gradients css compiled in "+ (new(Date) - endTime) + "ms";
		console.log(msg);
		Application.generateNote(msg,'success');
		return css;
	}

	/**
	 * [updateCompiledCSS description]
	 * @return {Void} [description]
	 */
	updateCompiledCSS(template){	
		var  theme = null;
		this._COMPILED_LESS_CSS = this.compileCSS();

		if(this._COMPILED_LESS_CSS != null){
		//clone compiled from currently selected theme
			theme = this._THEMES['compiled'];
			theme.less = template.less;
			theme.lessVariables = template.lessVariables;
			theme.compiled = true;
			theme.compiledLessVariables = this._COMPILED_LESS_CSS['variables.less'] || {}; 
			theme.compiledCssMin = this._COMPILED_LESS_CSS['bootstrap.min.css'];
			theme.compiledGradientsCssMin = this._COMPILED_LESS_CSS['bootstrap-theme.min.css'];

		}	
		return theme;
	}

	/**
	 * [getVariableKey description]
	 * @param  {String} key [description]
	 * @return {String}     [description]
	 */
	getVariableKey(key: string){
		if(key.charAt(0) === "@"){
			return key.slice(1); 
		}else{
			return key;
		}
	}

	/**
	 * [generateZip description]
	 * @param  {[Object]} css  [description]
	 * @param  {[Object]} less [description]
	 * @return {Object}      [description]
	 */
	generateZip(css: any,less: any) {
		if (!css ){
			return;
		}

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
	}
	  
	/**
	 * [setVariable description]
	 * @param {String} key   [description]
	 * @param {String} value [description]
	 */
	setVariable(key: string, value: string){
		this._LESS_VARIABLES[key] = {'default':value,'value':value };
	}
    
	/**
	 * [loadThemeVariables description]
	 * @param  {Object} theme [description]
	 * @return {Object}       [description]
	 */
	loadThemeVariables(theme: any) {
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
					if(_DEBUG){
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
				this.loadLESSVariables(url,variables);
			}
			
		}
		console.log("loadThemeVariables "+ (new(Date) - startTime) + "ms");
		return variables;
	  }

	/**
	 * [loadLESSVariables description]
	 * @param  {String} url       [description]
	 * @param  {Object} variables [description]
	 * @return {Void}           [description]
	 */
	loadLESSVariables(url: string,variables: any){
		var pattern = /([^@]+):([^;]+)/gm;
		
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
					if(_DEBUG){
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

	/**
	 * [populateLESSVariables description]
	 * @param  {Object} theme [description]
	 * @return {[type]}       [description]
	 */
	populateLESSVariables(theme: any){
		  var variables = this.loadThemeVariables(theme);
		  //reset the new references for all loaded variables

		  var startTime = new(Date);
		  var controller = this;

		$lessVariablesInput.each(function(i,elt){
			var $this = $(elt);
			var id = $this.attr("id");
			var value = variables[id];
			if(id && value){
                //clear variables cache on reload
                controller._LESS_VARIABLES[id].links = [];
                controller._LESS_VARIABLES[id].value = value;
                controller._LESS_VARIABLES[id].$element = $this;
                controller._LESS_VARIABLES[id].type = "text";
				controller.updateLESSVariablesRef(id,value,$this);
			}
            
		}).each(function(i,elt){//*/
			var startTime1 = new(Date);
			var $this = $(elt);
			var id = $this.attr("id");
			var value = variables[id];
            var newVal = value;
                               
            if(id && value){
				$this.val(value);
                /*
                controller._LESS_VARIABLES[id].links = [];
                controller._LESS_VARIABLES[id].value = value;
				controller.updateLESSVariablesRef(id,value,$this);//*/
            }
            	            
            if($this.hasClass("color-input")){
				
				var colorHex = newVal;
                controller._LESS_VARIABLES[id].type = "color";
				
                if(newVal == null){
					return;
				}
				try{
					if(newVal.charAt(0) === '#' && newVal.indexOf("@") === -1){	
						Application.updateLESSVariables(controller,$this,newVal);

					}else{
						if(_DEBUG){
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
			var time = (new(Date) - startTime1);
			if(time > 0){
				if(_DEBUG){console.log(id+" - pop "+ time + "ms");}
			}
		  });
		  
		  console.log("populateLESSVariables "+ (new(Date) - startTime) + "ms");
	}

	/**
	 * [setCurrentTheme description]
	 * @param {String} key [description]
	 */
	setCurrentTheme(key: string){
		this._CURRENT_THEME = this._THEMES[key];
		return this._CURRENT_THEME;
	}

	/**
	 * [getCurrentTheme description]
	 * @return {Object} [description]
	 */
	getCurrentTheme(){
		return this._CURRENT_THEME;
	}

	/**
	 * [setTheme description]
	 * @param {String} key   [description]
	 * @param {Object} theme [description]
	 */
	setTheme(key: string,theme: any){
		this._THEMES[key] = theme;
	}

}

var _DEBUG = false;
/**
 * [$lessVariablesInput description]
 * @type {List<Input>}
 */
var $lessVariablesInput = $("input:text.form-control").filter("[data-var]");

class Application{

	/**
	 * [collectLESSVariables description]
	 * @param  {Object} theme [description]
	 * @return {String}       [description]
	 */
	static collectLESSVariables(theme: Object){
		var startTime, endTime;
		startTime = endTime = new(Date);
		//add default variables
		var variables = [];
		var checked = {  
			css: $('#less-section input:checked').map(function () { return this.value }).toArray()
		};

		if (!checked.css.length){
			return;
		}	
		
		var lessVariables = theme.lessVariables;//variables.less
		var less = theme.less;
		//update less variables
		if(lessVariables){
			if($.isArray(lessVariables)){
				for(var i=0;i<lessVariables.length;i++){
					variables.push("@import '"+lessVariables[i]+"'");
				}
			}else{
				variables.push("@import '"+lessVariables+"'");
			}
		}
		//override default variables with input fields values
		$lessVariablesInput.each( function(i,elt){	
				var $this = $(elt);
				var id = $this.attr("id");
				variables.push("@"+id+": "+$this.val()+"");
			});
			
		var themeVariables = variables.slice();
		//add import sections
		if($.isArray(less)){
			for(var i=0;i<less.length;i++){
				variables.push("@import '"+less[i]+"'");
			}
		}else{
			variables.push("@import '"+less+"'");
		}
		
		//add import sections for theme
		var themeLess = Controller._THEME_LESS.lessCore;
		if($.isArray(themeLess)){
			for(var i=0;i<themeLess.length;i++){
				themeVariables.push("@import '"+themeLess[i]+"'");
			}
		}else{
			themeVariables.push("@import '"+themeLess+"'");
		}

		return {
			"core":variables.join(";\n")+";",
			"theme":themeVariables.join(";\n")+";"
		};
	}


	/**
	 * [initDraggable description]
	 * @param  {Controller} controller [description]
	 * @return {Void}            [description]
	 */
	static initDraggable(/*@type {Controller}*/ controller: Controller){

		$(".icon-resize-full").next("input").click(function (evt){
			evt.stopPropagation();
			//$(this).attr('checked',true);
			$(".color-picker").each( function(i,elt){
				var $this = $(this);
				$this.addClass("color-box-full");
				$this.removeClass("color-box-small");
			});
		});
		
		$(".icon-resize-small").next("input").click(function (evt){
			evt.stopPropagation();
			//$(this).attr('checked',true);
			$(".color-picker").each( function(i,elt){
				var $this = $(this);
				$this.addClass("color-box-small");
				$this.removeClass("color-box-full");
			});
			
		});

		//make parent element draggable
		  $(".color-picker").draggable({ revert: "valid",cursor: "move" ,opacity: 0.9, helper: "clone",revertDuration: 50,zIndex: 6000 });

	}

	/**
	 * [initPreviewToggle description]
	 * @param  {Controller} controller [description]
	 * @return {Void}            [description]
	 */
	static initPreviewToggle(/*@type {Controller}*/ controller: Controller){
		$("#btn-compile").click(function (/*@type {Event}*/ evt) {
			evt.stopPropagation();
			evt.preventDefault();
			var $this = $(this);
			$this.html("<i class='icon-fixed-width icon-spinner icon-spin'></i>Compile CSS");
			//todo cause issue after first compilation
			var theme = controller.setCurrentTheme($("#template-selector").val());
			controller.updateCompiledCSS(theme);
			
			theme = controller.setCurrentTheme("compiled");
			
			window.localStorage.setItem('compiled', JSON.stringify(theme));
			$this.html("<i class='icon-fixed-width icon-gear'></i>Compile CSS");
			
			Application.updateCSS(theme);
			$("#template-selector").val("compiled");
			$("#gradients-check").closest("label").removeClass("disabled");

		});
		
		//init PreviewToggle
		$("#btn-preview").click(function (/*@type {Event}*/ evt) {
			evt.stopPropagation();
			evt.preventDefault();
			var $this = $(this);
			var $prev = $this.find("i");
			if($this.hasClass("edit-view")){//setting Preview mode
				$this.attr("title","Click to Edit Variables");
				$this.html("<i class='icon-fixed-width icon-spinner icon-spin'></i>Edit CSS");
				
				$this.removeClass("edit-view");
				$(".edit-view").hide();
				$("#variables").removeClass("col-lg-10 col-lg-offset-2").addClass("col-lg-12");
				$("#colortab").removeClass("hidden-xs hidden-sm affix");

				$this.html("<i class='icon-fixed-width icon-edit'></i>Edit CSS");
				$("#content").removeClass("theme-edit");
				
			}else{//setting edit mode
				$this.attr("title","Click to Compile and Preview stylesheet");
				$this.html("<i class='icon-fixed-width icon-spinner icon-spin'></i>Preview CSS");
				
				$(".edit-view").show();
				$this.addClass("edit-view");
				$("#variables").removeClass("col-lg-12").addClass("col-lg-10 col-lg-offset-2");
				$("#colortab").addClass("hidden-xs hidden-sm affix");
				$this.html("<i class='icon-fixed-width icon-eye-open'></i>Preview CSS");
				//use theme edit to keep a consistent edit UI
				$("#content").addClass("theme-edit");
			}
			
		});

	}


	/**
	 * [initColorPickers description]
	 * @param  {Controller} controller [description]
	 * @return {Void}            [description]
	 */
	static initColorPickers(/*@type {Controller}*/ controller: Controller){
		$lessVariablesInput.each( function(i,elt){		
			var $this = $(elt);
			//remove @ from key
			var key = controller.getVariableKey($this.attr("id"));

			var value = $this.val().length > 0 ? $this.val():$this.attr("placeholder");
			$this.val(value);
			
			if(_DEBUG){
				console.log(i+" - {"+key + "} = [ "+value+" ]");
			}
			controller.setVariable(key,{'default':value,'value':value });
			//contains @
			if(value && value.indexOf("@") >= 0){
				controller.updateLESSVariablesRef(key,value,$this);
			}
			
			if($this.hasClass("color-input")){
				var $this = $(elt);
				$this.before("<i class='icon-bullseye'></i><br />");
				var key = $this.attr("data-var");
				var value = $this.val();
				$this.attr({
					"data-color-format" : "hex",			
				});
				//$this.css('background-color',value);
			    $this.css({
                    "background-color":value,
                    "display": "inline-block"
                });
				$this.ColorPickerSliders({
					order: {
						preview:1,
						hsl: 2,
						opacity:3
					} ,
					onchange: function(container, color) {
						var startTime1 = new(Date);
						var $this = $(this);
						  //update scope variables double bindings
						  //tinycolor object is in color.tiny
						 var colorHex = color.tiny.toHexString();

						var $input = $(this.connectedinput);
						var key = $input.attr("data-var");
						//slow process
						//var colorName = $.xcolor.nearestname(colorHex);
						if(_DEBUG){
							console.log(key+" 0.c - change "+ (new(Date) - startTime1) + "ms");
						}
					   //dynamically update fontcolor
						var fontColor = "black";

						if (color.cielch.l < 60) {
							fontColor = "white";
						}
						else {
							fontColor = "black";
						}
						
						$this.css("color", fontColor);
						
						if(_DEBUG){
							console.log("onchange - updateLESSVariables "+ key);
							console.log(key+" 1.c - change "+ (new(Date) - startTime1) + "ms");
						}
                         $this.data("computed-value",colorHex);
						controller.updateLESSVariables(key, colorHex);
				
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
						$this.trigger("colorpickersliders.updateColor",newVal);

					}
					
				});
			}
		});	

	}

	/**
	 * [initColorPickersV2 description]
	 * @param  {Controller} controller [description]
	 * @return {Void}            [description]
	 */
	static initColorPickersV2(/*@type {Controller}*/ controller: Controller){
		$lessVariablesInput.each( function(i,elt){		
			var $this = $(elt);
			//remove @ from key
			var key = controller.getVariableKey($this.attr("id"));

			var value = $this.val().length > 0 ? $this.val():$this.attr("placeholder");
			$this.val(value);
			
			if(_DEBUG){
				console.log(i+" - {"+key + "} = [ "+value+" ]");
			}
			controller.setVariable(key,{'default':value,'value':value });
			//contains @
			if(value && value.indexOf("@") >= 0){
				controller.updateLESSVariablesRef(key,value,$this);
			}
			
			if($this.hasClass("color-input")){
				var $this = $(elt);
				$this.before("<i class='icon-bullseye'></i>");
				var key = $this.attr("data-var");
				var value = $this.val();
				$this.attr({
					"data-color-format" : "hex",			
				});
				$this.css('background-color',value);
				
				$this.click(function (evt) {
                    var $input = $(this);
                    var value = $this.val();

                    //disable color pickers input for variables
                    var stop = (value.indexOf("@") > -1);
                    if(stop){
                        evt.stopImmediatePropagation();
                    }
                    
                }).click(function(evt){
					
					$(this).spectrum({
						clickoutFiresChange: true,
						showAlpha: true,
						showInitial: true,
						showInput: true,
						showButtons: false,
						preferredFormat: "hex6",
						move: function(color) {
							var $input = $(this);//.closest("input");							
							var colorHex = color.toHexString();
							$input.val(colorHex);
							Application.updateLESSVariables(controller,$input,colorHex);
						},
						hide: function(color) {
							var $input = $(this);//.closest("input");		
							$input.spectrum("destroy");
						},
						change: function(color) {
							var $input = $(this);
							//update scope variables double bindings
							//tinycolor object is in color
							var colorHex = color.toHexString();
							Application.updateLESSVariables(controller,$input,colorHex);
						}
							
					}).show();
					$this.spectrum("set",$this.val());
					//*/
				}).change(function(evt){
                    var $input = $(this);
                   
                    var value = $input.val();
                    
                    if(value.indexOf("@")>-1){
                        Application.updateLESSVariablesLinks(controller,$input,value);
                        
                    }else{//does not contain variables
                        var color = tinycolor(value);
                        Application.removeLESSVariablesLinks(controller,$input,color.toHexString());
                    
                    }
                    
                });
				
				//set as drop target
				$this.droppable({
					drop: function( event, ui ) {
						event.stopPropagation();
                        var $input = $(this);
						var newVal = ui.draggable.css('background-color');
                        var color = tinycolor(newVal);
						var colorHex = color.toHexString();					  
						$input.val(colorHex);
						Application.updateLESSVariables(controller,$input,colorHex);
					}
					
				});
			}
		});	
		
	}
	
	/**
	 * [updateLESSVariablesLinks description]
	 * @param  {Controller} controller [description]
	 * @param  {Object} $input [description]
     * @param  {String} value [description]
	 * @return {Void}            [description]
	 */
	static updateLESSVariablesLinks(/*@type {Controller}*/ controller: Controller,$input:any, value:string){
		//find parent computed values
        //get "ref" + "computed-value"
        var id = $input.attr("id");
        controller.updateLESSVariablesRef(id,value,$input);
        var ref = $input.data("ref");
        var $ref = $("#"+ref);

        
        var colorHex = $ref.data("computed-value");
        
        if( typeof colorHex === "undefined"){
            var color = tinycolor($ref.css("background-color"));
            colorHex = color.toHexString();
            $ref.data("computed-value",colorHex);
            
        }else{
            var color = tinycolor(colorHex);
            colorHex = color.toHexString();
        }
        
        //trigger refresh from the parent
        Application.updateLESSVariables(controller,$ref,colorHex);
	
	}
    
	/**
	 * [removeLESSVariablesLinks description]
	 * @param  {Controller} controller [description]
	 * @param  {Object} $input [description]
     * @param  {String} value [description]
	 * @return {Void}            [description]
	 */
	static removeLESSVariablesLinks(/*@type {Controller}*/ controller: Controller,$input:any, value:string){
        //get "ref" + "computed-value"
        var id = $input.attr("id");
        var ref = $input.data("ref");
        var $ref = $("#"+ref);
        
        //reference not found
        if(value.indexOf("@"+ref) === -1){
            var links = controller._LESS_VARIABLES[ref].links;
            for(var i in links){
                if(links[i].key === id){
                    links[i].value = null;
                     $input.data("ref",null);
                }
            }
        }

        //trigger refresh from the parent
        Application.updateLESSVariables(controller,$input,value);
	
	}    
    
	/**
	 * [updateLESSVariables description]
	 * @param  {Controller} controller [description]
	 * @param  {Object} $input [description]
	 * @param  {String} colorHex [description]
	 * @return {Void}            [description]
	 */
	static updateLESSVariables(/*@type {Controller}*/ controller: Controller,$input:any,colorHex:string){
		var startTime1 = new(Date);

		var key = $input.attr("data-var");
		//slow process
		if(_DEBUG){
			console.log(key+" 0.c - change "+ (new(Date) - startTime1) + "ms");
		}
		//dynamically update fontcolor
		var fontColor = "black";

		if($.xcolor.readable("white",colorHex)){
			fontColor = "white";
		} else {
			fontColor = "black";
		}

		$input.css( {'background-color' :colorHex, 'color' : fontColor} );
		if(_DEBUG){
			console.log("onchange - updateLESSVariables "+ key);
			console.log(key+" 1.c - change "+ (new(Date) - startTime1) + "ms");
		}	
        //add computed value
        $input.data("computed-value",colorHex);
		controller.updateLESSVariables(key, colorHex);
	
	}	
	/**
	 * [tooltipInit description]
	 * @return {[void]} [description]
	 */
	static tooltipInit(){
		// tooltip demo
		$("[data-toggle=tooltip]").tooltip();

		// popover demo
		$("[data-toggle=popover]").popover();

		// carousel demo
		$('.bs-docs-carousel-example').carousel();
	}

	/**
	 * [initDownloadButton description]
	 * @param  {Controller} controller [description]
	 * @return {Void}            [description]
	 */
	static initDownloadButton(/*@{Controller}*/controller: Controller){
		  var $downloadBtn = $('#btn-download');

		  $downloadBtn.on('click', function (e) {
			e.preventDefault();
			$downloadBtn.attr('disabled', 'disabled');
			$downloadBtn.html("<i class='icon-fixed-width icon-spinner icon-spin'></i>Download CSS");
			var zip = controller.generateZip(controller.compileCSS(),null);
			saveAs(zip, "bootstrap.zip");
			$downloadBtn.removeAttr('disabled');
			$downloadBtn.html("<i class='icon-fixed-width icon-download-alt'></i>Download CSS");
		  });
	}

	/**
	 * [initTemplateSelector description]
	 * @param  {Controller} controller [description]
	 * @return {Void}            [description]
	 */
	static initTemplateSelector(/*@type {Controller}*/controller: Controller){
		//update theme when selection changes
		$("#template-selector").change(function(evt){ 
			//evt.stopPropagation();
			var selection = $(this).val();
			if(_DEBUG){
				console.log(selection);
			}

			//$("#loading").show();
			$("#content").css("visibility","hidden");
			controller.setCurrentTheme(selection);	
			var theme = controller.getCurrentTheme();
			Application.updateCSS(theme);
			controller.populateLESSVariables(theme);
			if(selection  === 'compiled'){
				$("#gradients-check").closest("label").removeClass("disabled");
			}else{
				$("#gradients-check").closest("label").addClass("disabled");
			}
			//$("#loading").hide();
			$("#content").css("visibility","visible");	
		});

	//*/
	}
/**
	 * [initGradientsCheck description]
	 * @param  {Controller} controller [description]
	 * @return {Void}            [description]
	 */
	static initGradientsCheck(/*@type {Controller}*/controller: Controller){
		//update theme when selection changes
		$("#gradients-check").click(function(evt){ 
			evt.stopPropagation();
			var selection = $(this).val();
			if(_DEBUG){
				console.log(selection);
			}

			var theme = controller.getCurrentTheme();
			var checked = $(this).prop('checked');
			if(theme.compiledGradientsCssMin !=null){
				Application.updateGradientsCSS(theme,checked);
			}else{
				$(this).prop('checked',false);
			}
			
		});

	//*/
	}
	/**
	 * [updateCSS description]
	 * @param  {Object} theme [description]
	 * @return {Void}       [description]
	 */
	static updateCSS(theme: Object){

		var $link = document.getElementById("bootstrap:css");
		var $compiled = $(document.getElementById("compiled:css"));
		
		if( theme != null && theme.compiled == true){		  
			$compiled.append(theme.compiledCssMin);
			$link.disabled = true;
			
		}else{
			$link.href = theme.cssMin;
			$compiled.empty();
			$link.disabled = false;
			
		}
	}

	/**
	 * [updateGradientsCSS description]
	 * @param  {Object} theme [description]
	 * @return {Void}       [description]
	 */
	static updateGradientsCSS(theme: Object,checked:boolean){

		var $compiled = $(document.getElementById("gradients:css"));
		
		if( theme != null && checked  == true){		  
			$compiled.append(theme.compiledGradientsCssMin);
			
		}else{
			$compiled.empty();
			
		}
	}
	
          /**
	* Main
	*/
	static main(){
		var /*@type {Controller}*/ controller = new Controller();
		
		//load stored compiled theme from cache
		if (window.localStorage.getItem('compiled')) {
			var theme = JSON.parse(window.localStorage.getItem('compiled'))
			controller.setTheme('compiled',theme);
		}

		Application.initTemplateSelector(controller);
		
		Application.initGradientsCheck(controller);
		
		Application.initDownloadButton(controller);

		Application.initPreviewToggle(controller);

		Application.initDraggable(controller);

		//Application.initColorPickers(controller);
		Application.initColorPickersV2(controller);

		Application.tooltipInit();

		//display after download is complete
		$.when(
			controller.loadThemes("less/bootstrap-default.json"),
			controller.loadThemes("less/bootswatch.json")
		).done(function(){
			controller.setCurrentTheme('default');
		//async load 
			controller.populateLESSVariables(controller.getCurrentTheme());
		});

		$('#color-tab-content').slimScroll({
			height: '85%'
		});

		$("#loading").hide();
		$("#content").css("visibility","visible");	
		$("#template-selector").val("default");//.trigger('change');
		$("#gradients-check").closest("label").addClass("disabled");

	}
	static    generateNote(message,type) {
		var n = noty({
			text: message,
			type: type || 'notification',
			dismissQueue: true,
			layout: 'topCenter',
			theme: 'defaultTheme'
		});
		setTimeout(function(){n.close();},3000);
	}
}

/**
 * [Anonymous startup function]
 * @return {Void} [description]
 */
$(function main() {
	Application.main();
});


/*
$(".basic").click(function(evt){
 
$(this).spectrum({
    clickoutFiresChange: true,
    showAlpha: true,
    showInitial: true,
    showInput: true,
    showButtons: false,
    move: function(color) {
        var $input = $(this).closest("input");
        $input.css("backgroundColor",color.toHexString());
        $input.val(color.toHexString());
    },
    hide: function(color) {
        $(this).closest("input").spectrum("destroy");
    },
    change: function(color) {

    }
    
}).show();
$(this).spectrum().("set",$(this).css("backgroundColor"));
    
});
//*/