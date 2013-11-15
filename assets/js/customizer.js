window.onload = function () { // wait for load in a dumb way because B-0
  var cw = '/*!\n * Bootstrap v3.0.0\n *\n * Copyright 2013 Twitter, Inc\n * Licensed under the Apache License v2.0\n * http://www.apache.org/licenses/LICENSE-2.0\n *\n * Designed and built with all the love in the world @twitter by @mdo and @fat.\n */\n\n'

  function getCustomizerData() {
    var vars = {};

	//creates array with values of inputs
    var data = {
      vars: vars,	  
      css: $('#less-section input:checked').map(function () { return this.value }).toArray(),
      js:  $('#plugin-section input:checked').map(function () { return this.value }).toArray()
    };

    if ($.isEmptyObject(data.vars) && !data.css.length && !data.js.length) return;

    return data;
  }
//load initial data
  function parseUrl() {
  
    $.ajax({
      url: 'https://api.github.com/gists/' + id,
      type: 'GET',
      dataType: 'json'
    })
    .success(function(result) {
      var data = JSON.parse(result.files['config.json'].content);
      if (data.js) {
        $('#plugin-section input').each(function () {
          $(this).prop('checked', ~$.inArray(this.value, data.js));
        })
      }
      if (data.css) {
	  //set checked property to is value is in Array
        $('#less-section input').each(function () {
          $(this).prop('checked', ~$.inArray(this.value, data.css));
        })
      }
      if (data.vars) {
        for (var i in data.vars) {
          $('input[data-var="' + i + '"]').val(data.vars[i]);
        }
      }
    })
    .error(function(err) {
      console.error(err);
    })
  }

  function generateZip(css,complete) {
    if (!css ) return;

    var zip = new JSZip();

    if (css) {
      var cssFolder = zip.folder('css');
      for (var fileName in css) {
        cssFolder.file(fileName, css[fileName]);
      }
    }

    var content = zip.generate({type:"blob"});

    complete(content);
  }

  var inputsComponent = $('#less-section input');
  var inputsPlugin    = $('#plugin-section input');
  var inputsVariables = $('#less-variables-section input');

  $('#less-section .toggle').on('click', function (e) {
    e.preventDefault();
    inputsComponent.prop('checked', !inputsComponent.is(':checked'));
  })

  $('#plugin-section .toggle').on('click', function (e) {
    e.preventDefault();
    inputsPlugin.prop('checked', !inputsPlugin.is(':checked'));
  })

  $('#less-variables-section .toggle').on('click', function (e) {
    e.preventDefault();
    inputsVariables.val('');
  })

  var $compileBtn = $('#btn-compile')
  var $downloadBtn = $('#btn-download')
/*
  $downloadBtn.on('click', function (e) {
    e.preventDefault()

    $downloadBtn.attr('disabled', 'disabled')

    generateZip(generateCSS(), function (blob) { 
      saveAs(blob, "bootstrap.zip");
	  $downloadBtn.removeAttr('disabled');
    })
  })
//*/
 // parseUrl()
}
