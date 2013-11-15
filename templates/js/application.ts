/// <reference path='typescript/jquery/jquery.d.ts'/>
/// <reference path='typescript/jquery/jquery.noty.d.ts'/>
/// <reference path='typescript/less.d.ts'/>
/**
 * [Controller description]
 */
//declare var $: any;
//declare var jQuery: any;
//"use strict";
class TemplateSelector{

	private _selector :any;	
	private _controller :Controller;	
	private _selectedTemplate :string;
    
    static 	_TEMPLATE_HTML:string = "<a id='templateId' style='padding-right:4px;' class='user-template' data-link='templateId' href='#'><span>templateName</span>"
		+"<div  class='btn-group pull-right' style='display:inline-block;margin:0px;padding:0px' >"
		+"<button style='padding:2px' type='button' class='btn btn-default btn-template-rename' title='Rename template'><i class='icon-edit-sign'></i></button>"
		+"<button style='padding:2px' type='button' class='btn btn-default btn-template-delete' title='Delete template'><i class='icon-remove'></i></button>"
		+"</div></a>";

	constructor(controller:Controller,selectorId:string){
		_selector = $(selectorId);
		_controller = controller;
		this.initActions();
		_userTemplateList = $("#user-template-list");
	}

	initActions(){
		var _this = this;
		this._selectedTemplate = "default";
		_selector.on("click",".external-template",function(evt){
			console.log(evt.target.localName+" - "+evt.target.textContent);			
			var $target = $(evt.target);
			_this._selectedTemplate = $target.attr("data-link");
			if(_this._selectedTemplate == undefined){
				$target = $target.closest("a");
				_this._selectedTemplate = $target.attr("data-link");
			}
			if(_this._selectedTemplate == undefined){
				return;
			}
			_this.updateDescription($target.text(),_this._selectedTemplate);

		});

		_selector.on("click",".user-template",function(evt){
			console.log(evt.target.localName+" - "+evt.target.textContent);
			var $target = $(evt.target);
			_this._selectedTemplate = $target.attr("data-link");
			if(_this._selectedTemplate == undefined){
				$target = $target.closest("a");
				_this._selectedTemplate = $target.attr("data-link");
			}
			if(_this._selectedTemplate == undefined){
				return;
			}
			_this.updateDescription($target.text(),_this._selectedTemplate);

		});

	}

	updateDescription(text:string,templateId:string){
		var theme = _controller.setCurrentTheme(templateId);
		this.updateCSS(theme);
		if(theme.compiled){
			$("#template-name").text(text);
			$("#btn-template-download").removeClass("disabled");
			$("#btn-template-remove").removeClass("disabled");
			$("#btn-template-link").addClass("disabled");
			$("#btn-template-link").attr("href","#");

		}else{

			$("#template-name").text(text);
			$("#btn-template-download").addClass("disabled");
			$("#btn-template-remove").addClass("disabled");
			$("#btn-template-link").removeClass("disabled");
			$("#btn-template-link").attr("href",theme.preview);
		}
	}

	setUserTemplate(templateId:string){
		var $target = $("#"+templateId);
		this._selectedTemplate = $target.attr("data-link");
		if(this._selectedTemplate == undefined){
			$target = $target.closest("a");
			this._selectedTemplate = $target.attr("data-link");
		}
		if(this._selectedTemplate == undefined){
			return;
		}
		this.updateDescription($target.text(),this._selectedTemplate);
	}

	updateCSS(theme:any){
		if(_DEBUG){
			console.log(theme.name);
		}

		//$("#loading").show();
		$("#content").css("visibility","hidden");

		Application.updateCSS(theme);
		_controller.populateLESSVariables(theme);
		if(theme.compiled != undefined){
			if(theme.compiled){
				$("#gradients-check").closest("label").removeClass("disabled");

			}else{
				$("#gradients-check").closest("label").addClass("disabled");
	            $("#gradients-check").prop('checked',false);
	            Application.updateGradientsCSS(theme,false);
			}
		}
		//$("#loading").hide();
		$("#content").css("visibility","visible");	
	}

	getSelectedTemplate(){
		return this._selectedTemplate;
	}

	/**
	 * [addTemplate description]
	 * @param  {String}     templateId [description]
	 * @param  {String}     templateName [description]
	 * @return {Void}            [description]
	 */
	addTemplate(templateId:string,templateName:string){
        var html = TemplateSelector._TEMPLATE_HTML.replace(/templateId/g,templateId).replace(/templateName/g,templateName);
        var $html = $(html);
		_userTemplateList.append($html);
		Application.initDeleteButton(_controller,$html.find(".btn-template-delete"),this);
		Application.initRenameButton(_controller,$html.find(".btn-template-rename"),this);
	}

	/**
	 * [deleteTemplate description]
	 * @param  {String}     templateId [description]
	 * @return {Void}            [description]
	 */
	deleteTemplate(templateId:string){
		var $source = $("#"+templateId);
    	if($source[0] != undefined){
			$source.remove();
		}
	}

	/**
	 * [renameTemplate description]
	 * @param  {String}     templateId [description]
	 * @param  {String}     newId [description]
	 * @param  {String}     newName [description]
	 * @return {Void}            [description]
	 */
	renameTemplate(templateId:string,newId:string,newName:string){
    	var $source = $("#"+templateId);
    	if($source[0] != undefined){
			var html = TemplateSelector._TEMPLATE_HTML.replace(/templateId/g,newId).replace(/templateName/g,newName);
			var $html = $(html);
			var $elt = $source.replaceWith($html);
			//$elt.remove();
			Application.initDeleteButton(_controller,$html.find(".btn-template-delete"),this);
			Application.initRenameButton(_controller,$html.find(".btn-template-rename"),this);
		}

	}
}

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
						theme.themeId = theme.name.toLowerCase();
						theme.compiled = false;
						theme.compiledCssMin = null;
						theme.compiledGradientsCssMin = null;
						theme.compiledLessVariables = null;
						controller._THEMES[theme.themeId] = theme;
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
				//remove old reference reference has changed
				if(ref != null && (typeof ref !== "undefined") && (ref !== reference)){
                    if(typeof this._LESS_VARIABLES[ref].links !== "undefined"){
                        var arr = this._LESS_VARIABLES[ref].links;
                        if($.isArray(arr)){
                            var len = arr.length;
                            //find position
                            for(var i = 0;i < len; i++){
                                if(arr[i].key === key){
                                    //reomve link
                                    arr.splice(i,1);
                                    if(_DEBUG){
                                        console.log("ref from {"+ref+ "} -> {"+reference+"}");
                                    }
                                    break;
                                }
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
                    Application.updateTooltip($target,backgroundColor);
					if(_DEBUG){console.log("@1. -> parseLESSVariables "+ id+" - "+ (new(Date) - startTime1) + "ms"); }	
                    
				}else{
					//generate CSS and parse it for content
					var $css = "@"+current.key+":"+current.value+"; #"+target.key+" {background-color:"+target.value+";color:"+fontColor+";}";//$target.val()/*
					this._parser.parse($css, function (err, tree) {
						var startTime1 = new(Date);
						if (err) { return console.error(err) ;}
						var rule = tree.toCSS({'compress':true}).match(regex);
						if(rule.length == 3){

							//dynamically update fontcolor
							backgroundColor = rule[1];
							fontColor = Application.getFontColor(backgroundColor);

							if(_DEBUG){console.log("1.0 -> parseLESSVariables "+ id+" - "+ (new(Date) - startTime1) + "ms");}		
							$target.css({
								"background-color": backgroundColor,
								"color": fontColor
							});
                            $target.data("computed-value",backgroundColor);
                            Application.updateTooltip($target,backgroundColor);
							
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

		var templateId = "compiled";
		var description = "Compiled";

		if(template.compiled == true){
			templateId = template.themeId;
			description = template.name;
			theme = template;
		}else{
			theme = {};
		}

		this._COMPILED_LESS_CSS = this.compileCSS();

		if(this._COMPILED_LESS_CSS != null){
		//clone compiled from currently selected theme
            theme.thumbnail = null;
            theme.preview = null;
            theme.css = template.css;
            theme.cssMin = template.cssMin; 
            theme.cssCdn = template.cssCdn; 

			//theme = template;//this._THEMES['compiled'];
			theme.less = template.less;
			theme.lessVariables = template.lessVariables;
			theme.compiled = true;
			theme.compiledLessVariables = this._COMPILED_LESS_CSS['variables.less'] || {}; 
			theme.compiledCssMin = this._COMPILED_LESS_CSS['bootstrap.min.css'];
			theme.compiledGradientsCssMin = this._COMPILED_LESS_CSS['bootstrap-theme.min.css'];
			theme.themeId = templateId;
			theme.name = description;
			theme.description = description;

			this._THEMES[templateId] = theme;

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


	/**
	 * [deleteTheme description]
	 * @param  {String}     themeId [description]
	 * @return {Void}            [description]
	 */
	deleteTheme(themeId:string){
		var themes = {};
		var current = null;
		for(key in this._THEMES){
			if( key !== themeId){
				themes[key] = this._THEMES[key];
				if(current != null){
					current = key;
				}
			}
			this._THEMES[key] = null;
		}
		this._THEMES = null;
		this._THEMES = themes;
		if(current != null){
			this.setCurrentTheme(current);
		}
	}

	/**
	 * [renameTheme description]
	 * @param  {String}     themeId [description]
	 * @param  {String}     newId [description]
	 * @param  {String}     newName [description]
	 * @return {Thme}       newTheme [description]
	 */
	renameTheme(themeId:string,newId:string,newName:string){
		var themes = {};
		var current = null;
		for(key in this._THEMES){
			var theme = this._THEMES[key];
			if( key === themeId){
				theme.themeId = newId;
				theme.name = newName;
				theme.description = newName;
				themes[newId] = theme;
				current = theme;

			}else {
				themes[key] = theme;
				
			}

			this._THEMES[key] = null;
		}
		this._THEMES = null;
		this._THEMES = themes;
		return current;
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
	 * [getFontColor description]
	 * @param  {String} backgroundColor [description]
     * @param  {String} fontColor [description]
	 */
	static getFontColor(backgroundColor){
        var fontColor = "white";
/*
        if ($.xcolor.readable("white", backgroundColor)) {
            fontColor = "white";
        } else {
            fontColor = "black";
        }
//*/
        var color = tinycolor(backgroundColor);
        var cielch = $.fn.ColorPickerSliders.rgb2lch(color.toRgb());
        if (cielch.l > 0 && cielch.l < 60) {
            fontColor = "white";
        } else {
            fontColor = "black";
        }

        if (color.toHexString() === "#000000") {
            fontColor = "white";
            if (color.alpha < 0.5) {
                fontColor = "black";
            }
        }  

        return fontColor;
	}

	/**
	 * [getColorFormat description]
	 * @param  {String} color [description]
     * @param  {String} ColorFormat [description]
	 */
	static getColorFormat(color){
		var name = "hex";
        var value = color.toHexString();

        //alpha need to be rgb
        if(color.alpha <1 || color.format !== "hex"){
            name = "rgb";
            value = color.toRgbString();
        }

		return {
			"name": name, 
			"value": value
		};

	}
    
    /**
	 * [updateTooltip description]
	 * @param  {Object} $input [description]
     * @param  {String} value [description]
	 */
	static updateTooltip($input:any, value:string){
        var color = tinycolor(value); 
        var name = ""+color.toName();
        var tooltip = null;
        if(name === "false"){
            name = "Color";
           //slow name = $.xcolor.nearestname(color.toString());
        }
		
		tooltip = name+" [ "+color.toHexString()+" - "+color.toRgbString()+" - "+color.toHslString()+" ]";
        $input.attr("title",tooltip);
        $input.attr("data-original-title",tooltip);
    }
    
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
        /* TODO
		var checked = {  
			css: $('#less-section input:checked').map(function () { return this.value }).toArray()
		};

		if (!checked.css.length){
			return;
		}	
		//*/
		var lessVariables = theme.lessVariables;
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
		/*
		$(".icon-resize-full").next("input").click(function (evt){
			evt.stopPropagation();
			$(".color-picker").each( function(i,elt){
				var $this = $(this);
				$this.addClass("color-box-full");
				$this.removeClass("color-box-small");
			});
		});
		
		$(".icon-resize-small").next("input").click(function (evt){
			evt.stopPropagation();
			$(".color-picker").each( function(i,elt){
				var $this = $(this);
				$this.addClass("color-box-small");
				$this.removeClass("color-box-full");
			});
			
		});
		//*/
		$("#colorname-check").click(function (evt) {
            evt.stopPropagation();

			if(	$(this).prop('checked') == true){	
				$(".color-picker").each(function (i, elt) {
					var $this = $(this);
					$this.addClass("color-box-full");
					$this.removeClass("color-box-small");
				});
			}else{		
				$(".color-picker").each(function (i, elt) {
					var $this = $(this);
					$this.addClass("color-box-small");
					$this.removeClass("color-box-full");
				});
			}
        });

		//make parent element draggable
		$(".color-picker").each(function(i,elt){
			$(this).find("input.color-box-input").prop("readonly",true);

		 }).draggable({ 
			appendTo : "#colortab",
			revert: "valid", 
			cursor: "move", 
			opacity: 0.9, 
			helper: "clone", 
			revertDuration: 50, 
			zIndex: 6000 			
		});

	}

	/**
	 * [initPreviewToggle description]
	 * @param  {Controller} controller [description]
	 * @param  {TemplateSelector} templateSelector [description]
	 * @return {Void}            [description]
	 */
	static initPreviewToggle(/*@type {Controller}*/ controller: Controller,templateSelector:TemplateSelector){
		$("#btn-compile").click(function (/*@type {Event}*/ evt) {
			evt.stopPropagation();
			evt.preventDefault();
			var $this = $(this);
			$this.html("<i class='icon-fixed-width icon-spinner icon-spin'></i>Compile CSS");
			//todo cause issue after first compilation
			var theme = controller.setCurrentTheme(templateSelector.getSelectedTemplate());
			//newly created themes from external templates

			theme = controller.updateCompiledCSS(theme);
			var templateId = theme.themeId;
			var description = theme.name;

			theme = controller.setCurrentTheme(templateId);
			if(window.localStorage){
				window.localStorage.setItem(templateId, JSON.stringify(theme));
			}

			$this.html("<i class='icon-fixed-width icon-gears'></i>Compile CSS");

			var $template = $("#"+templateId);
			if( $template[0] == undefined){
				templateSelector.addTemplate(templateId,description);
			}

			//TODO Application.updateCSS(theme);
			templateSelector.setUserTemplate(templateId);
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
				$("#variables").removeClass("col-md-10 col-md-offset-2").addClass("col-md-12");
				$("#colortab").removeClass("visible-md visible-lg hidden-xs hidden-sm affix").hide();
				$this.html("<i class='icon-fixed-width icon-edit'></i>Edit CSS");
				$("#content").removeClass("theme-edit");
				
			}else{//setting edit mode
				$this.attr("title","Click to Compile and Preview stylesheet");
				$this.html("<i class='icon-fixed-width icon-spinner icon-spin'></i>Preview CSS");
				
				$(".edit-view").show();
				$this.addClass("edit-view");
				$("#variables").removeClass("col-md-12").addClass("col-md-10 col-md-offset-2");
				$("#colortab").addClass("visible-md visible-lg hidden-xs hidden-sm affix").show();
				$this.html("<i class='icon-fixed-width icon-eye-open'></i>Preview CSS");
				//use theme edit to keep a consistent edit UI
				$("#content").addClass("theme-edit");
			}
			
		});

	}

	/**
	 * [initColorPickersV3 description]
	 * @param  {Controller} controller [description]
	 * @return {Void}            [description]
	 */
	static initColorPickersV3(/*@type {Controller}*/ controller: Controller){
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
			if(value && value.indexOf("@") > -1){
				controller.updateLESSVariablesRef(key,value,$this);
			}
			
			if($this.hasClass("color-input")){
				var $this = $(elt);
				$this.before("<i class='icon-fixed-width icon-tint'></i>");
				var key = $this.attr("data-var");
				var value = $this.val();
                var color = tinycolor(value);
                var format = "hex";
				
                //update color format 
                if(color.ok){
                    format = color.format;
                }
                            
				$this.attr({
					"data-color-format" : format,
                    "data-toggle" : "tooltip",
                    "data-placement" : "top"
				});
				$this.data("color-format",format);
                $this.css('background-color',value);
                
                Application.updateTooltip($this,value);
                
				$this.click(function (evt) {
                    var $input = $(this);
                    var value = $input.val();

                    //disable color pickers input for variables
                    var stop = (value.indexOf("@") > -1 
                                /*|| value === "transparent" */|| value === "inherit" 
                                || (value.charAt(0) !== "#"  && value.indexOf("rgb") !== 0 && value.indexOf("hsl") !== 0)
                               );
                    //try converting entry to color
                    var color = tinycolor(value);
                                           
                    if(/*value === "transparent" ||*/ value === "inherit" || color.ok == false){
                        evt.stopImmediatePropagation();
                    }
                    //update color format 
                    var format = "hex";
                    if(color.ok){                      
                        if(color.format !== "hex"){
                            format = "rgb";
                        }
                        $input.attr("data-color-format",format);
                        $input.data("color-format",format);
                    }
                    
                }).on("blur",function(evt){
                	//delete resources
                	$(this).trigger("colorpickersliders.destroy");

                }).click(function(evt){
                    evt.stopPropagation();
					//create colorpicker on demand
                    var $this = $(this);
					$this.ColorPickerSliders({
                        swatches: false,
						order: {
							preview:1,
							hsl: 2,
							opacity:3
						} ,
						onchange: function(container, color) {
                            var $input = this.connectedinput;
                            
                            var format = Application.getColorFormat(color.tiny);
                            console.log("color="+format.value);
							//update scope variables double bindings
                            Application.updateLESSVariables(controller, $input, format.value);

						}
						
					});
					//display popup
					$this.trigger("colorpickersliders.showPopup");
					
					
				}).change(function(evt){
                    var $input = $(this);
                   
                    var value = $input.val();
                    
                    if(value.indexOf("@")>-1){
                        Application.updateLESSVariablesLinks(controller,$input,value);
                        
                    }else{//does not contain variables
                        var color = tinycolor(value);
                                                                   
                        if(color.ok){
                            var format = Application.getColorFormat(color);
                            Application.removeLESSVariablesLinks(controller,$input,format.value);

                        }else{
                            //reset this value to previous one
                            $input.val($input.data("prev-value"));
                        }
                    
                    }
                    
                });
				
				//set as drop target
				$this.droppable({
					drop: function( event, ui ) {
						event.stopPropagation();
                        var $input = $(this);
						var newVal = ui.draggable.css('background-color');
                        var color = tinycolor(newVal);
                        
                        /*
                        var format = "hex";
                        //HSL are not supported
                        var colorHex = color.toHexString();
                        if(color.format !== "hex"){
                            format = "rgb";
                            colorHex = color.toRgbString();
                        }//*/
                         var format = Application.getColorFormat(color);                  
                        $input.attr("data-color-format",format.name);
                        $input.data("color-format",format.name);
						$input.val(format.value);
						Application.updateLESSVariables(controller,$input,format.value);
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
			if(value && value.indexOf("@") > -1){
				controller.updateLESSVariablesRef(key,value,$this);
			}
			
			if($this.hasClass("color-input")){
				var $this = $(elt);
				$this.before("<i class='icon-fixed-width icon-tint'></i>");
				var key = $this.attr("data-var");
				var value = $this.val();
                
				var color = tinycolor(value);
               //update color format 
                var format = "hex";
                if(color.ok){                      
                    if(color.format !== "hex"){
                        format = "rgb";
                    }
                }
                            
				$this.attr({
					"data-color-format" : format,
                    "data-toggle" : "tooltip",
                    "data-placement" : "top"
				});
                $this.data("color-format",format);    
				$this.css('background-color',value);
 
                Application.updateTooltip($this,value);
                
				$this.click(function (evt) {
                    
                    var $input = $(this);
                    var value = $this.val();

                    //disable color pickers input for variables
                    var stop = (value.indexOf("@") > -1 
                                || value === "transparent" || value === "inherit" 
                                || (value.charAt(0) !== "#"  && value.indexOf("rgb") !== 0 && value.indexOf("hsl") !== 0)
                               );
                    //try converting entry to color
                    var color = tinycolor(value);
                                           
                    if(value === "transparent" || value === "inherit" || color.ok == false){
                        evt.stopImmediatePropagation();
                    }
                    //update color format 
                    var format = "hex";
                    if(color.ok){                      
                        if(color.format !== "hex"){
                            format = "rgb";
                        }
                        $input.attr("data-color-format",format);
                        $input.data("color-format",format);
                    }
                    
                }).click(function(evt){
                    evt.stopPropagation();
					//create colorpicker on demand
					$(this).spectrum({
						clickoutFiresChange: true,
						showAlpha: true,
						showInitial: true,
						showInput: true,
						showButtons: false,
						preferredFormat: "hex6",
						move: function(color) {
							var $input = $(this);	
                            var format = Application.getColorFormat(color);
							$input.val(format.value);
							Application.updateLESSVariables(controller,$input,format.value);
						},
						hide: function(color) {
							var $input = $(this);//.closest("input");		
							$input.spectrum("destroy");
						},
						change: function(color) {
							var $input = $(this);
                            var format = Application.getColorFormat(color);
							Application.updateLESSVariables(controller,$input,format.value);
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
                        if(color.ok){
                            var format = Application.getColorFormat(color);
                            Application.removeLESSVariablesLinks(controller,$input,format.value);

                        }else{
                            //reset this value to previous one
                            $input.val($input.data("prev-value"));
                        }
                    
                    }
                    
                });
				
				//set as drop target
				$this.droppable({
					drop: function( event, ui ) {
						event.stopPropagation();
                        var $input = $(this);
						var newVal = ui.draggable.css('background-color');
                        var color = tinycolor(newVal);

                        var format = Application.getColorFormat(color);
                        $input.attr("data-color-format",format.name);
                        $input.data("color-format",format.name);
						$input.val(format.value);
						Application.updateLESSVariables(controller,$input,format.value);
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
        
        if( typeof colorHex === "undefined" || colorHex == null){
            if($ref.css("background-color") != undefined){
                var color = tinycolor($ref.css("background-color"));
                colorHex = color.toString();
                $ref.data("computed-value",colorHex);
               Application.updateTooltip($ref,colorHex);
            }else{
                colorHex = null;
            }
            
        }else{
            var color = tinycolor(colorHex);
            colorHex = color.toString();
        }
        
        //trigger refresh from the parent
        if(color.ok){
            Application.updateLESSVariables(controller,$ref,colorHex);
        }
	
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
            if( controller._LESS_VARIABLES[ref] != undefined){
                var links = controller._LESS_VARIABLES[ref].links;
                if(links != undefined){
                    for(var i in links){
                        if(links[i].key === id){
                            links[i].value = null;
                            $input.data("ref",null);
                            break;
                        }
                    }
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
        if(colorHex == undefined || colorHex == null){
            return;
        }
        
		var startTime1 = new(Date);

		var key = $input.attr("data-var");
        $input.data("prev-value",$input.val());
		//slow process
		if(_DEBUG){
			console.log(key+" 0.c - change "+ (new(Date) - startTime1) + "ms");
		}
		//dynamically update fontcolor
		       
        var backgroundColor = colorHex;
		var fontColor = Application.getFontColor(backgroundColor);

        //use white color for transparent and inherit  
        
		$input.css( {'background-color' :backgroundColor, 'color' : fontColor} );
		if(_DEBUG){
			console.log("onchange - updateLESSVariables "+ key);
			console.log(key+" 1.c - change "+ (new(Date) - startTime1) + "ms");
		}	
        //add computed value
        $input.data("computed-value",colorHex);
        Application.updateTooltip($input,colorHex);
		controller.updateLESSVariables(key, colorHex);
	
	}	
	/**
	 * [tooltipInit description]
	 * @return {[void]} [description]
	 */
	static tooltipInit(){
		// tooltip demo
		$("[data-toggle=tooltip]").tooltip();
//        $("color-input").tooltip();

		// popover demo
		$("[data-toggle=popover]").popover();

		// carousel demo
		$('.bs-docs-carousel-example').carousel();
	}

	/**
	 * [initDownloadButton description]
	 * @param  {Controller} controller [description]
	 * @param  {String}     ctrlId [description]
	 * @return {Void}            [description]
	 */
	static initDownloadButton(/*@{Controller}*/controller: Controller,ctrlId:string){
		  var $downloadBtn = $(ctrlId);

		  $downloadBtn.on('click', function (e) {
			e.preventDefault();
			$downloadBtn.addClass("disabled");
	
			var zip = controller.generateZip(controller.compileCSS(),null);
			var filename = "bootstrap_"+controller.getCurrentTheme().themeId+".zip";
		
			saveAs(zip, filename);
			$downloadBtn.removeClass("disabled");

		  });
	}

	/**
	 * [initDeleteButton description]
	 * @param  {Controller} controller [description]
	 * @param  {Object}     $deleteBtn [description]
	 * @param  {TemplateSelector} templateSelector [description]
	 * @return {Void}            [description]
	 */
	static initDeleteButton(controller: Controller,$deleteBtn:any,templateSelector:TemplateSelector){

		  $deleteBtn.on('click', function (e) {
			e.preventDefault();
			var $this = $(this);
			var $item = $(this).closest("a");
			if($item !== undefined){				
				var templateId = $item.attr("data-link");
				if(templateId !== undefined){
					$item.addClass("disabled");
					var theme = controller.deleteTheme(templateId);
					templateSelector.deleteTemplate(templateId);
					
					$item.remove();
					//clear stored theme from cache
					if (window.localStorage && window.localStorage.getItem(templateId)) {
						window.localStorage.removeItem(templateId);
					}
				}else{
					$item.removeClass("disabled");
				}
			}
		 });
	}

	/**
	 * [initRenameButton description]
	 * @param  {Controller} controller [description]
	 * @param  {Object}     $renameBtn [description]
	 * @param  {TemplateSelector} templateSelector [description]
	 * @return {Void}            [description]
	 */
	static initRenameButton(controller: Controller,$renameBtn:any,templateSelector:TemplateSelector){

		  $renameBtn.on('click', function (evt) {
		  	//TODO capture new value
			evt.preventDefault();
			evt.stopPropagation();
			console.log(evt.type+" - "+evt.target.localName+" - "+evt.target.textContent);
			var $this = $(this);
			var $item = $(this).closest("a");

			if($item !== undefined){
				
				var $html = $("<input type='text' class='form-control' value='"+$item.text()+"'></input>");
				$item.after($html);

				$html.on("click",function(evt){
					evt.stopPropagation();
					$item.addClass("disabled");

				}).on("blur",function(evt){
					console.log(evt.type+" - "+evt.target.localName+" - "+evt.target.textContent);
					$(this).remove();
					if($item != null){
						$item.show();
						$item.removeClass("disabled");
					}

				}).on("change",function(evt){
					evt.stopPropagation();
					console.log(evt.type+" - "+evt.target.localName+" - "+evt.target.textContent);
					//check new value length
					var newName = $(this).val().trim();
					if(newName.length == 0){
						 $(this).trigger("blur");
						 $item.show();
						 return;
					}

					//normalize newId
					var newId = newName.replace(/\s+/g,"_").toLowerCase();
					
					$item.find("span").text(newName);
			
					var templateId = $item.attr("data-link");
					if( templateId !== undefined){
						var theme = controller.renameTheme(templateId,newId,newName);

						templateSelector.renameTemplate(templateId,newId,newName);
						//replace stored theme in cache
						if (window.localStorage && window.localStorage.getItem(templateId)) {
							window.localStorage.removeItem(templateId);
							window.localStorage.setItem(newId, JSON.stringify(theme));
						}
						$item = null;
					}
					
					$(this).remove();
					if($item != null){
						$item.show();
					}

				}).on("keyUp",function(evt){
					console.log(evt.type+" - "+evt.target.localName+" - "+evt.target.textContent);

				});
				
				$item.hide();
				$html.focus();
				
			}
		  });
	}

	/**
	 * [initTemplateSelector description]
	 * @param  {Controller} controller [description]
	 * @return {TemplateSelector}        templateSelector    [description]
	 */
	static initTemplateSelector(controller: Controller){
		//update theme when selection changes
		$("#template-selector").change(function(evt){ 
			//evt.stopPropagation();
			var selection = $(this).val();
			if(_DEBUG){
				console.log(selection);
			}

			//$("#loading").show();
			$("#content").css("visibility","hidden");
			var theme = controller.setCurrentTheme(selection);	
			Application.updateCSS(theme);
			controller.populateLESSVariables(theme);
			if(theme.compiled){
				$("#gradients-check").closest("label").removeClass("disabled");
			}else{
				$("#gradients-check").closest("label").addClass("disabled");
                $("#gradients-check").prop('checked',false);
                Application.updateGradientsCSS(theme,false);
			}
			//$("#loading").hide();
			$("#content").css("visibility","visible");	
		});

	//*/
	
		var templateSelector = new TemplateSelector(controller,"#template-drop-down");
//var templates = Application.initLocalStorage(controller);
		Application.initDeleteButton(controller,$(".btn-template-delete"),templateSelector);
		Application.initRenameButton(controller,$(".btn-template-rename"),templateSelector);
		Application.initPreviewToggle(controller,templateSelector);

		var templates = Application.initLocalStorage(controller);
		for(var i in templates){
			var template = templates[i];
			templateSelector.addTemplate(template.templateId,template.templateName);
		}

		return templateSelector;
	}
/**
	 * [initGradientsCheck description]
	 * @param  {Controller} controller [description]
	 * @return {Void}            [description]
	 */
	static initGradientsCheck(controller: Controller){
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
			$compiled.html(theme.compiledCssMin);
			$link.disabled = true;
			
		}else{

			$link.href = theme.cssMin;			
			$link.disabled = false;
			$compiled.empty();
			
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
	 * [initSpinner description]
	 * @return {Object}   spinner    [description]
	 */
	static initSpinner(){

		var opts = {
		  lines: 13, // The number of lines to draw
		  length: 20, // The length of each line
		  width: 10, // The line thickness
		  radius: 30, // The radius of the inner circle
		  corners: 1, // Corner roundness (0..1)
		  rotate: 0, // The rotation offset
		  direction: 1, // 1: clockwise, -1: counterclockwise
		  color: '#fff', // #rgb or #rrggbb or array of colors
		  speed: 1, // Rounds per second
		  trail: 60, // Afterglow percentage
		  shadow: false, // Whether to render a shadow
		  hwaccel: false, // Whether to use hardware acceleration
		  className: 'spinner', // The CSS class to assign to the spinner
		  zIndex: 2e9, // The z-index (defaults to 2000000000)
		  top: 'auto', // Top position relative to parent in px
		  left: 'auto' // Left position relative to parent in px
		};
		var target = document.getElementById("spinner");
		var spinner = new Spinner(opts).spin(target);

		return spinner;
	}

	static initLocalStorage(controller:Controller){

		var templates = [];
		//load stored compiled theme from cache
		if (window.localStorage && window.localStorage.length > 0 ) {

			for(var i = 0;i< window.localStorage.length ; i++){
				var templateId = window.localStorage.key(i);
				try{
					var theme = JSON.parse(window.localStorage.getItem(templateId));
					if(theme != undefined && theme.themeId != undefined && theme.name != undefined){
						controller.setTheme(templateId,theme);
						templates.push({"templateId":theme.themeId,"templateName":theme.name});
					}else{
						window.localStorage.removeItem(templateId);
					}
				}catch(e){
					//clear if initialization fails data might be corrupted
					window.localStorage.clear();
				}
			}
		}
		return templates;
	}


    /**
	* Main
	*/
	static main(){

		var controller:Controller = new Controller();

		Application.initGradientsCheck(controller);

		Application.initDownloadButton(controller,"#btn-template-download");

		Application.initDraggable(controller);

		Application.initColorPickersV3(controller);

		Application.tooltipInit();

		//display after download is complete
		$.when(
			controller.loadThemes("less/bootstrap-default.json"),
			controller.loadThemes("less/bootswatch.json")
		).done(function(){
			controller.setCurrentTheme('default');
		//async load 
			controller.populateLESSVariables(controller.getCurrentTheme());
			var templateSelector = Application.initTemplateSelector(controller);
			
		});

		$('#color-tab-content').slimScroll({
			height: '85%'
		});

		$("#loading").hide();

		$("#content").css("visibility","visible");	
		$("#template-selector").val("default");
		$("#gradients-check").closest("label").addClass("disabled");

	}
	static generateNote(message,type) {
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
 (function(){
 
	var spinner = Application.initSpinner();
	$(function main() {
		Application.main();
		spinner.stop();
		if(window.loadtime != undefined){
			window.loadtime = new Date()-window.loadtime;
			console.log("===> window.loadtime = "+window.loadtime);
		}	
	});

})();
