/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        yml: grunt.file.readYAML ("_config.yml"),
        // Task configuration.
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                }
            },
            gruntfile: {
                src: "Gruntfile.js"
            },
            lib_test: {
                src: ["lib/**/*.js", "test/**/*.js"]
            }
        },
        qunit: {
            files: ["test/**/*.html"]
        },
        watch: {
            gruntfile: {
                files: "<%= jshint.gruntfile.src %>",
                tasks: ["jshint:gruntfile"]
            },
            lib_test: {
                files: "<%= jshint.lib_test.src %>",
                tasks: ["jshint:lib_test", "qunit"]
            },
            jekyll_docs: {
                files: "<%= yml.source %>",
                tasks: ["jekyll:build"]
            }
        },
        jekyll: {
            options: {
                serve: false
            },
            build: {
                serve: false,
                tasks: ["typescript"]
            }
            /*,
            serve: {
                serve: true
            }*/
        },
        typescript: {
            base: {
                src: ["<%= yml.source %>/**/*.ts"],
               // dest: "where/you/want/your/js/files",
                options: {
                    //module: "amd", //or commonjs
                    //target: "es5", //or es3
                    //base_path: "path/to/typescript/files",
                    sourcemap: true,
                    fullSourceMapPath: true,
                    declaration: true,
                    comments: false
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-typescript");
    grunt.loadNpmTasks("grunt-jekyll");

    // Default task.
    //grunt.registerTask("default", ["jshint", "qunit", "jekyll:build"]);
    grunt.registerTask("default", ["typescript","jekyll:build"]);

};