var Controller = (function () {
    function Controller() {
        /**
        * [_CW bootstrap copyright]
        * @type {String}
        */
        this._CW = '/*!\n * Bootstrap v3.0.0\n *\n * Copyright 2013 Twitter, Inc\n * Licensed under the Apache License v2.0\n * http://www.apache.org/licenses/LICENSE-2.0\n *\n * Designed and built with all the love in the world @twitter by @mdo and @fat.\n */\n\n';

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
        * [_LESS_VARIABLES_REF description]
        * @type {Array}
        */
        this._LESS_VARIABLES_REF = [];

        /**
        * [_parser description]
        * @type {less.Parser}
        */
        this._parser = new less.Parser();

        /**
        * [_COMMON_LESS description]
        * @type {Object}
        */
        this._COMMON_LESS = {
            "less": [
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
                "bootstrap/responsive-utilities.less"
            ],
            "lessVariables": ["bootstrap/variables.less"]
        };
    }
    /**
    * [getThemes description]
    * @return {Object} [description]
    */
    Controller.prototype.getThemes = function () {
        return this._THEMES;
    };

    /**
    * [getTheme description]
    * @param  {String} key [description]
    * @return {Object}    [description]
    */
    Controller.prototype.getTheme = function (key) {
        return this._THEMES[key];
    };

    /**
    * [loadThemes description]
    * @param  {String} url
    * @return {Void}
    */
    Controller.prototype.loadThemes = function (url) {
        var controller = this;
        return $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json'
        }).done(function (result) {
            var data = result;

            if (data.themes) {
                for (var i in data.themes) {
                    var theme = data.themes[i];

                    if (!controller._THEMES[theme.name.toLowerCase()]) {
                        if ($.isArray(theme.lessVariables)) {
                            theme.lessVariables = controller._COMMON_LESS.lessVariables.concat(theme.lessVariables);
                        } else {
                            theme.lessVariables = controller._COMMON_LESS.lessVariables.concat([theme.lessVariables]);
                        }
                        if ($.isArray(theme.less)) {
                            theme.less = theme.less.concat(controller._COMMON_LESS.less);
                        } else {
                            theme.less = [theme.less].concat(controller._COMMON_LESS.less);
                        }
                        theme.compiled = false;
                        theme.compiledCssMin = null;
                        theme.compiledLessVariables = null;
                        controller._THEMES[theme.name.toLowerCase()] = theme;
                    }
                }
            }
        }).fail(function (jqXHR, textStatus) {
            console.error(textStatus);
        });
    };

    //update less variables
    /**
    * [updateLESSVariablesRef description]
    * @param  {String} key
    * @param  {String} value
    * @param  {Object} $input
    * @return {Void}
    */
    Controller.prototype.updateLESSVariablesRef = function (key, value, $input) {
        if (typeof key === "undefined") {
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
        var result = value.replace(",", " ").trim().match(pattern);
        if (result) {
            var reference = result[0];
            if (typeof reference === "string") {
                reference = this.getVariableKey(reference.trim());
                if (_DEBUG) {
                    console.log("{" + key + "} -> {" + reference + "}");
                }
                if (typeof this._LESS_VARIABLES_REF[reference] === "undefined") {
                    this._LESS_VARIABLES_REF[reference] = [];
                }

                var ref = $input.data("ref");

                if ((typeof ref !== "undefined") && (ref !== reference)) {
                    var arr = this._LESS_VARIABLES_REF[ref];
                    if ($.isArray(arr)) {
                        var len = arr.length;

                        for (var i = 0; i < len; i++) {
                            if (arr[i].key === key) {
                                arr.splice(i, 1);
                                if (_DEBUG) {
                                    console.log("ref from {" + ref + "} -> {" + reference + "}");
                                }
                                break;
                            }
                        }
                    }
                }

                //add new reference
                this._LESS_VARIABLES_REF[reference].push({ 'key': key, 'value': value });
                $input.data("ref", reference);
            }
        }
    };

    /**
    * [updateLESSVariables description]
    * @param  {String} key   [description]
    * @param  {String} value [description]
    * @return {Void}       [description]
    */
    Controller.prototype.updateLESSVariables = function (key, value) {
        /** @type {Date} [description] */
        var startTime = new Date();
        var variables = null;
        if (typeof key !== "undefined") {
            if (key.charAt(0) === "@" && value != null) {
                variables = {};
                variables[key] = value;
            }
            key = this.getVariableKey(key);

            //update variables registry
            this._LESS_VARIABLES[key].value = value;
            if (_DEBUG) {
                console.log("{" + key + "} = [ " + value + " ]");
            }
        } else {
            return;
        }
        if (_DEBUG) {
            console.log("start {" + key + "} = [ " + value + " ] - " + (new (Date)() - startTime) + "ms");
        }

        /** @type {Array} [description] */
        var stack = [{ 'key': key, 'value': value }];

        while (stack.length > 0) {
            var current = stack.shift();

            //find references and update their values
            var id = "#" + current.key;
            var $source = $(id);
            var ref = this._LESS_VARIABLES_REF[current.key];
            var regex = /background-color:(.*);color:(.*);?/;

            //console.log("1.-> updateLESSVariables "+ current.key+" - "+JSON.stringify(ref));
            var startTime2 = new (Date)();
            for (var i in ref) {
                var target = ref[i];
                var depKey = target.key;
                id = "#" + depKey;
                var $target = $(id);

                var fontColor = $source.css("color");
                var backgroundColor = $source.css("background-color");

                if (target.value.charAt(0) === "@") {
                    var startTime1 = new (Date)();
                    $target.css({
                        "background-color": backgroundColor,
                        "color": fontColor
                    });
                    if (_DEBUG) {
                        console.log("@1. -> parseLESSVariables " + id + " - " + (new (Date)() - startTime1) + "ms");
                    }
                } else {
                    //generate CSS and parse it for content
                    var $css = "@" + current.key + ":" + current.value + "; #" + target.key + " {background-color:" + target.value + ";color:" + fontColor + ";}";
                    this._parser.parse($css, function (err, tree) {
                        var startTime1 = new (Date)();
                        if (err) {
                            return console.error(err);
                        }
                        var rule = tree.toCSS({ 'compress': true }).match(regex);
                        if (rule.length == 3) {
                            fontColor = "white";
                            backgroundColor = rule[1];

                            if ($.xcolor.readable("white", backgroundColor)) {
                                fontColor = "white";
                            } else {
                                fontColor = "black";
                            }
                            if (_DEBUG) {
                                console.log("1.0 -> parseLESSVariables " + id + " - " + (new (Date)() - startTime1) + "ms");
                            }
                            $target.css({
                                "background-color": backgroundColor,
                                "color": fontColor
                            });
                        }
                        if (_DEBUG) {
                            console.log("1. -> parseLESSVariables " + id + " - " + (new (Date)() - startTime1) + "ms");
                        }
                    });
                }

                //check if there are dependencies
                var deps = this._LESS_VARIABLES_REF[depKey];
                if ((typeof deps) !== "undefined" && deps.length > 0) {
                    //put newly computed value on the stack
                    stack.push({ 'key': depKey, 'value': backgroundColor });
                    if (_DEBUG) {
                        console.log("next = " + depKey);
                    }
                }
            }
            if (_DEBUG) {
                console.log("end-1. -> updateLESSVariables " + key + " - t=" + (new (Date)() - startTime2) + "ms");
            }
        }
        if (_DEBUG) {
            console.log("end-2. -> updateLESSVariables " + key + " - t=" + (new (Date)() - startTime) + "ms");
        }

        if (variables != null) {
            if ((typeof less) !== "undefined") {
                //less.modifyVars(variables);
            }
        }
    };

    /**
    * [compileCSS description]
    * @return {Object} [description]
    */
    Controller.prototype.compileCSS = function () {
        var startTime, endTime;
        startTime = endTime = new (Date)();
        var css = null;
        var lessInput = Application.collectLESSVariables(this._CURRENT_THEME);

        //var this._parser = new(less.Parser);
        var controller = this;

        this._parser.parse(lessInput, function (err, tree) {
            if (err) {
                //console.log(lessInput);
                return console.error(err);
            }
            try  {
                css = {
                    'bootstrap.css': controller._CW + tree.toCSS(),
                    'bootstrap.min.css': controller._CW + tree.toCSS({ compress: true }),
                    'variables.less': lessInput
                };
            } catch (e) {
                console.error(e);
            }
        });
        console.log("css compiled in " + (new (Date)() - endTime) + "ms");
        return css;
    };

    /**
    * [updateCompiledCSS description]
    * @return {Void} [description]
    */
    Controller.prototype.updateCompiledCSS = function () {
        var theme = null;
        this._COMPILED_LESS_CSS = this.compileCSS();

        if (this._COMPILED_LESS_CSS != null) {
            //clone compiled from currently selected theme
            theme = this._THEMES['compiled'];
            theme.less = this._CURRENT_THEME.less;
            theme.lessVariables = this._CURRENT_THEME.lessVariables;
            theme.compiled = true;
            theme.compiledLessVariables = this._COMPILED_LESS_CSS['variables.less'] || {};
            theme.compiledCssMin = this._COMPILED_LESS_CSS['bootstrap.min.css'];
            //disable default CSS
            //store in localstorage
            //activate alternate CSS
        }
    };

    /**
    * [getVariableKey description]
    * @param  {String} key [description]
    * @return {String}     [description]
    */
    Controller.prototype.getVariableKey = function (key) {
        if (key.charAt(0) === "@") {
            return key.slice(1);
        } else {
            return key;
        }
    };

    /**
    * [generateZip description]
    * @param  {[Object]} css  [description]
    * @param  {[Object]} less [description]
    * @return {Object}      [description]
    */
    Controller.prototype.generateZip = function (css, less) {
        if (!css) {
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

        var content = zip.generate({ type: "blob" });
        return content;
    };

    /**
    * [setVariable description]
    * @param {String} key   [description]
    * @param {String} value [description]
    */
    Controller.prototype.setVariable = function (key, value) {
        this._LESS_VARIABLES[key] = { 'default': value, 'value': value };
    };

    /**
    * [loadThemeVariables description]
    * @param  {Object} theme [description]
    * @return {Object}       [description]
    */
    Controller.prototype.loadThemeVariables = function (theme) {
        var startTime = new (Date)();
        var variables = {};
        if (theme.compiled) {
            //load from theme.compiledLessVariables less content
            var pattern = /([^@]+):([^;]+)/gm;
            var result = theme.compiledLessVariables.match(pattern);
            for (var j in result) {
                var values = result[j].toString().split(":");
                var key = values[0].trim();
                var value = values[1].replace(/\/\/.+/gm, "").trim();

                if (typeof variables === "object") {
                    if (_DEBUG) {
                        console.log(j + " - " + key + " = " + value);
                    }
                    variables[key] = value;
                }
            }
        } else {
            var urls = theme.lessVariables;
            if (!$.isArray(theme.lessVariables)) {
                urls = [urls];
            }

            for (var i in urls) {
                var url = urls[i];
                this.loadLESSVariables(url, variables);
            }
        }
        console.log("loadThemeVariables " + (new (Date)() - startTime) + "ms");
        return variables;
    };

    /**
    * [loadLESSVariables description]
    * @param  {String} url       [description]
    * @param  {Object} variables [description]
    * @return {Void}           [description]
    */
    Controller.prototype.loadLESSVariables = function (url, variables) {
        var pattern = /([^@]+):([^;]+)/gm;
        pattern = /([^@]+):([^;]+)/gm;

        //var deferredReady = $.Deferred();
        $.ajax({
            cache: true,
            url: url,
            async: false,
            type: 'GET',
            dataType: 'text'
        }).done(function (data) {
            //convert @var :value; to "@var" : "value";
            var startTime = new (Date)();
            var result = data.match(pattern);
            for (var j in result) {
                var values = result[j].toString().split(":");
                var key = values[0].trim();
                var value = values[1].replace(/\/\/.+/gm, "").trim();

                if (typeof variables === "object") {
                    if (_DEBUG) {
                        console.log(j + " - " + key + " = " + value);
                    }
                    variables[key] = value;
                }
            }

            //deferredReady.resolve(variables);
            console.log("loadLESSVariables " + (new (Date)() - startTime) + "ms");
        }).fail(function (jqXHR, textStatus) {
            console.error(textStatus);
        });
        //return deferredReady.promise();
    };

    /**
    * [populateLESSVariables description]
    * @param  {Object} theme [description]
    * @return {[type]}       [description]
    */
    Controller.prototype.populateLESSVariables = function (theme) {
        var variables = this.loadThemeVariables(theme);

        //reset the new references for all loaded variables
        /*for(var id in variables){
        var value = variables[id];
        var $input = $("#"+id);
        updateLESSVariablesRef(id,value,$input);
        }
        //*/
        //creates bug this._LESS_VARIABLES = variables;
        this._LESS_VARIABLES_REF = {};
        var startTime = new (Date)();
        var controller = this;

        /*$("input:text.form-control")
        .filter("[data-var]")//*/
        $lessVariablesInput.each(function (i, elt) {
            var $this = $(elt);
            var id = $this.attr("id");
            var value = variables[id];
            if (id && value) {
                controller.updateLESSVariablesRef(id, value, $this);
            }
        }).each(function (i, elt) {
            var startTime1 = new (Date)();
            var $this = $(elt);
            var id = $this.attr("id");
            var value = variables[id];

            if ($this.hasClass("color-input")) {
                var newVal = value;
                var colorHex = newVal;
                if (newVal == null) {
                    return;
                }
                try  {
                    if (newVal.charAt(0) === '#') {
                        var fontColor = "white";

                        if ($.xcolor.readable("white", newVal)) {
                            fontColor = "white";
                        } else {
                            fontColor = "black";
                        }

                        $this.css({ 'background-color': colorHex, 'color': fontColor });

                        //*/
                        //onchange colorpicker update variables
                        $this.trigger("colorpickersliders.updateColor", newVal);
                        if (_DEBUG) {
                            console.log(id + " 2.c - pop " + (new (Date)() - startTime1) + "ms");
                        }
                    } else {
                        if (_DEBUG) {
                            console.log($this.attr('id') + " = " + newVal);
                        }
                        $this.val(value);
                    }
                    if (newVal.charAt(0) !== '#') {
                        //colorHex = rgb2hex(newVal);
                    }
                } catch (err) {
                    console.error($this.attr('id') + " = " + newVal + " - " + err.message);
                }
            } else {
                if (id && value) {
                    $this.val(value);
                }
            }
            var time = (new (Date)() - startTime1);
            if (time > 0) {
                if (_DEBUG) {
                    console.log(id + " - pop " + time + "ms");
                }
            }
        });

        console.log("populateLESSVariables " + (new (Date)() - startTime) + "ms");
    };

    /**
    * [setCurrentTheme description]
    * @param {String} key [description]
    */
    Controller.prototype.setCurrentTheme = function (key) {
        this._CURRENT_THEME = this._THEMES[key];
    };

    /**
    * [getCurrentTheme description]
    * @return {Object} [description]
    */
    Controller.prototype.getCurrentTheme = function () {
        return this._CURRENT_THEME;
    };

    /**
    * [setTheme description]
    * @param {String} key   [description]
    * @param {Object} theme [description]
    */
    Controller.prototype.setTheme = function (key, theme) {
        this._THEMES[key] = theme;
    };
    return Controller;
})();

var _DEBUG = false;

/**
* [$lessVariablesInput description]
* @type {List<Input>}
*/
var $lessVariablesInput = $("input:text.form-control").filter("[data-var]");
var Application = (function () {
    function Application() {
    }
    Application.collectLESSVariables = /**
    * [collectLESSVariables description]
    * @param  {Object} theme [description]
    * @return {String}       [description]
    */
    function (theme) {
        var startTime, endTime;
        startTime = endTime = new (Date)();

        //add default variables
        var variables = [];
        var lessVariables = theme.lessVariables;
        var less = theme.less;
        if ($.isArray(lessVariables)) {
            for (var i = 0; i < lessVariables.length; i++) {
                variables.push("@import '" + lessVariables[i] + "'");
            }
        } else {
            variables.push("@import '" + lessVariables + "'");
        }

        //override default variables
        $lessVariablesInput.each(function (i, elt) {
            var $this = $(elt);
            var id = $this.attr("id");
            variables.push("@" + id + ": " + $this.val() + "");
        });

        if ($.isArray(less)) {
            for (var i = 0; i < less.length; i++) {
                variables.push("@import '" + less[i] + "'");
            }
        } else {
            variables.push("@import '" + less + "'");
        }

        return variables.join(";\n") + ";";
    };

    Application.initDraggable = /**
    * [initDraggable description]
    * @param  {Controller} controller [description]
    * @return {Void}            [description]
    */
    function (/*@type {Controller}*/ controller) {
        $(".icon-resize-full").next("input").click(function (evt) {
            evt.stopPropagation();
            $(this).attr('checked', true);
            $(".color-picker").each(function (i, elt) {
                var $this = $(this);
                $this.addClass("color-box-full");
                $this.removeClass("color-box-small");
            });
        });

        $(".icon-resize-small").next("input").click(function (evt) {
            evt.stopPropagation();
            $(this).attr('checked', true);
            $(".color-picker").each(function (i, elt) {
                var $this = $(this);
                $this.addClass("color-box-small");
                $this.removeClass("color-box-full");
            });
        });

        //make parent element draggable
        $(".color-picker").draggable({ revert: "valid", cursor: "move", opacity: 0.9, helper: "clone", revertDuration: 50, zIndex: 6000 });
    };

    Application.initPreviewToggle = /**
    * [initPreviewToggle description]
    * @param  {Controller} controller [description]
    * @return {Void}            [description]
    */
    function (/*@type {Controller}*/ controller) {
        $("#btn-compile").click(function (/*@type {Event}*/ evt) {
            evt.stopPropagation();
            evt.preventDefault();
            var $this = $(this);
            $this.html("<i class='icon-fixed-width icon-spinner icon-spin'></i>Compile");
            controller.setCurrentTheme($("#theme-selector").val());
            controller.updateCompiledCSS();
            var theme = controller.getTheme('compiled');
            window.localStorage.setItem('compiled', JSON.stringify(theme));
            $this.html("<i class='icon-fixed-width icon-gear'></i>Compile");
            $("#theme-selector").val("compiled");
            Application.updateCSS(theme);
        });

        //init PreviewToggle
        $("#btn-preview").click(function (/*@type {Event}*/ evt) {
            evt.stopPropagation();
            evt.preventDefault();
            var $this = $(this);
            var $prev = $this.find("i");
            if ($this.hasClass("edit-view")) {
                $this.attr("title", "Click to Edit Variables");
                $this.html("<i class='icon-fixed-width icon-spinner icon-spin'></i>Edit");

                $this.removeClass("edit-view");
                $(".edit-view").hide();
                $("#variables").removeClass("col-lg-9 col-lg-offset-3").addClass("col-lg-12");
                $("#colortab").removeClass("hidden-xs hidden-sm affix");

                $this.html("<i class='icon-fixed-width icon-edit'></i>Edit");
                $("#content").removeClass("theme-edit");
            } else {
                $this.attr("title", "Click to Compile and Preview stylesheet");
                $this.html("<i class='icon-fixed-width icon-spinner icon-spin'></i>Preview");

                $(".edit-view").show();
                $this.addClass("edit-view");
                $("#variables").removeClass("col-lg-12").addClass("col-lg-9 col-lg-offset-3");
                $("#colortab").addClass("hidden-xs hidden-sm affix");
                $this.html("<i class='icon-fixed-width icon-eye-open'></i>Preview");

                //use theme edit to keep a consistent edit UI
                $("#content").addClass("theme-edit");
            }
        });
    };

    Application.initColorPickers = /**
    * [initColorPickers description]
    * @param  {Controller} controller [description]
    * @return {Void}            [description]
    */
    function (/*@type {Controller}*/ controller) {
        $lessVariablesInput.each(function (i, elt) {
            var $this = $(elt);

            //remove @ from key
            var key = controller.getVariableKey($this.attr("id"));

            var value = $this.val().length > 0 ? $this.val() : $this.attr("placeholder");
            $this.val(value);
            if (_DEBUG) {
                console.log(i + " - {" + key + "} = [ " + value + " ]");
            }
            controller.setVariable(key, { 'default': value, 'value': value });

            if (value && value.indexOf("@") >= 0) {
                controller.updateLESSVariablesRef(key, value, $this);
            }

            if ($this.hasClass("color-input")) {
                var $this = $(elt);
                $this.before("<i class='icon-bullseye'></i>");
                var key = $this.attr("data-var");
                var value = $this.val();
                $this.attr({
                    "data-color-format": "hex"
                });
                $this.css('background-color', value);

                $this.ColorPickerSliders({
                    order: {
                        preview: 1,
                        hsl: 2,
                        opacity: 3
                    },
                    onchange: function (container, color) {
                        var startTime1 = new (Date)();
                        var $this = $(this);

                        //update scope variables double bindings
                        //tinycolor object is in color.tiny
                        var colorHex = color.tiny.toHexString();
                        var colorRgb = color.tiny.toRgbString();

                        var $input = $(this.connectedinput);
                        var key = $input.attr("data-var");

                        if (_DEBUG) {
                            console.log(key + " 0.c - change " + (new (Date)() - startTime1) + "ms");
                        }

                        //dynamically update fontcolor
                        var fontColor = "black";

                        if (color.cielch.l < 60) {
                            fontColor = "white";
                        } else {
                            fontColor = "black";
                        }

                        $this.css("color", fontColor);

                        if (_DEBUG) {
                            console.log("onchange - updateLESSVariables " + key);
                            console.log(key + " 1.c - change " + (new (Date)() - startTime1) + "ms");
                        }

                        controller.updateLESSVariables(key, colorHex);
                    }
                }).droppable({
                    drop: function (event, ui) {
                        event.stopPropagation();
                        var newVal = ui.draggable.css('background-color');
                        var colorHex = rgb2hex(newVal);
                        var $this = $(this);
                        $this.val(colorHex);

                        var fontColor = "white";

                        if ($.xcolor.readable("white", newVal)) {
                            fontColor = "white";
                        } else {
                            fontColor = "black";
                        }

                        $this.css({ 'background-color': colorHex, 'color': fontColor });

                        //*/
                        $this.trigger("colorpickersliders.updateColor", newVal);
                    }
                });
            }
        });
    };

    Application.tooltipInit = /**
    * [tooltipInit description]
    * @return {[void]} [description]
    */
    function () {
        // tooltip demo
        $("[data-toggle=tooltip]").tooltip();

        // popover demo
        $("[data-toggle=popover]").popover();

        // carousel demo
        $('.bs-docs-carousel-example').carousel();
    };

    Application.initDownloadButton = /**
    * [initDownloadButton description]
    * @param  {Controller} controller [description]
    * @return {Void}            [description]
    */
    function (/*@{Controller}*/ controller) {
        var $downloadBtn = $('#btn-download');

        $downloadBtn.on('click', function (e) {
            e.preventDefault();
            $downloadBtn.attr('disabled', 'disabled');
            $downloadBtn.html("<i class='icon-fixed-width icon-spinner icon-spin'></i>Download");
            var zip = controller.generateZip(controller.compileCSS(), null);
            saveAs(zip, "bootstrap.zip");
            $downloadBtn.removeAttr('disabled');
            $downloadBtn.html("<i class='icon-fixed-width icon-download-alt'></i>Download");
        });
    };

    Application.initThemeSelector = /**
    * [initThemeSelector description]
    * @param  {Controller} controller [description]
    * @return {Void}            [description]
    */
    function (/*@type {Controller}*/ controller) {
        //update theme when selection changes
        $("#theme-selector").change(function (evt) {
            //evt.stopPropagation();
            var selection = $(this).val();
            if (_DEBUG) {
                console.log(selection);
            }

            //$("#loading").show();
            $("#content").css("visibility", "hidden");
            controller.setCurrentTheme(selection);
            var theme = controller.getCurrentTheme();
            Application.updateCSS(theme);
            controller.populateLESSVariables(theme);

            //$("#loading").hide();
            $("#content").css("visibility", "visible");
        });
        //*/
    };

    Application.updateCSS = /**
    * [updateCSS description]
    * @param  {Object} theme [description]
    * @return {Void}       [description]
    */
    function (theme) {
        var $link = document.getElementById("bootstrap:css");
        var $compiled = $(document.getElementById("compiled:css"));

        if (theme != null && theme.compiled == true) {
            $compiled.append(theme.compiledCssMin);
            $link.disabled = true;
        } else {
            $link.href = theme.cssMin;
            $compiled.empty();
            $link.disabled = false;
        }
    };

    Application.main = function () {
        var controller = new Controller();

        if (window.localStorage.getItem('compiled')) {
            var theme = JSON.parse(window.localStorage.getItem('compiled'));
            controller.setTheme('compiled', theme);
        }

        Application.initThemeSelector(controller);

        Application.initDownloadButton(controller);

        Application.initPreviewToggle(controller);

        Application.initDraggable(controller);

        Application.initColorPickers(controller);

        Application.tooltipInit();

        //display after download is complete
        $.when(controller.loadThemes("less/bootstrap-default.json"), controller.loadThemes("less/bootswatch.json")).done(function () {
            controller.setCurrentTheme('default');

            //async load
            controller.populateLESSVariables(controller.getCurrentTheme());
        });

        //*/
        $('#color-tab-content').slimScroll({
            height: '600px'
        });

        //loadThemes("http://api.bootswatch.com/3/");
        $("#loading").hide();
        $("#content").css("visibility", "visible");
        $("#theme-selector").val("default");
    };
    return Application;
})();

/**
* [Anonymous startup function]
* @return {Void} [description]
*/
$(function main() {
    Application.main();
});