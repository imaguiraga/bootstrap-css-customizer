  function loadThemeVariables(theme) {
	
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
				console.log(j+" - "+key+" = "+value);
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
			var result = data.match(pattern);
			for( var j in result){
				var values = result[j].toString().split(":");
				var key = values[0].trim();
				var value = values[1].replace(/\/\/.+/gm,"").trim();
				
				if(typeof variables === "object"){
					console.log(j+" - "+key+" = "+value);
					variables[key] = value;
				}
			}
			//deferredReady.resolve(variables);

		})
		.fail(function(jqXHR, textStatus) {
		  console.error(textStatus);
		});
	//return deferredReady.promise();
} 

function populateLESSVariables(theme){
  var variables = loadThemeVariables(theme);
$("input:text.form-control")
	.filter("[data-var]").each(function(i,elt){
		var $elt = $(elt);
		var id = $elt.attr("id");
		if(id && variables[id]){
			$elt.val(variables[id]);
		}
	  }).each(function(i,elt){
			var $this = $(elt);
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
						//update variables
						var key = $this.attr("data-var");
						updateLESSVariables(key, colorHex);
					
					}else{
						console.log($this.attr('id')+" = "+newVal);
					}
					if(newVal.charAt(0) !== '#'){
						//colorHex = rgb2hex(newVal);
					}
				}catch(err){
					console.error($this.attr('id')+" = "+newVal+" - "+err.message);
				}
				
			}
	  });
}
  
function switch_style ( css_title )
{
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

//update theme when selection changes
$("#theme-selector").change(function(evt){ 
	evt.stopPropagation();
  var selection = $(this).val();
  console.log(selection);
  var $link = document.getElementById("bootstrap:css");
  var $compiled = $(document.getElementById("compiled:css"));
	
	$("#loading").show();
	$("#content").css("visibility","hidden");	
  CURRENT_THEME = THEMES[selection];
 // if( selection === "compiled" && COMPILED_LESS_CSS != null){	
 if( CURRENT_THEME != null && CURRENT_THEME.compiled == true){		  
	$compiled.append(CURRENT_THEME.compiledCssMin);
	$link.disabled = true;
	
  }else{
	$link.disabled = false;
	$link.href = CURRENT_THEME.cssMin;
	$compiled.empty();
	
  }
  populateLESSVariables(CURRENT_THEME);
  $("#loading").hide();
  $("#content").css("visibility","visible");	
});
//*/