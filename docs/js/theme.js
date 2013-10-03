
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
  var theme = $(this).val();
  console.log(theme);
  var $link = document.getElementById("bootstrap:css");
  var $compiled = $(document.getElementById("compiled:css"));
	
  if( theme === "compiled" && COMPILED_LESS_CSS != null){		
	$compiled.append(COMPILED_LESS_CSS);
	$link.disabled = true;
	
  }else{
	$link.disabled = false;
	$link.href=theme;
	$compiled.empty();
  }
});
//*/