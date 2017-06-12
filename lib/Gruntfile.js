module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      files: ['../app/**/*.js'], //location of javascript files
      options: {
        predef: ["document", "console", "$", "$q", "$scope", "firebase", "angular", "canvas"], //allows for predefined things not found in js
        esnext: true, //allows for ES6
        globalstrict: true,
        browserify: true,
        globals: {"angular":true, "app":true} //name value pairs, allows to define global vars used in many files.
      }
    },
    sass: {
        dist: {
            files: {
                "../css/style.css" : "../sass/style.scss"
            }
        }
    },
    copy: { //for bootstrap and jquery - only need to do the first time.
      bootstrap: {
        expand: true,
        cwd: 'node_modules/bootstrap/dist',
        src: ['**'],
        dest: '../dist'
      },
      jquery: {
        expand: true,
        cwd: 'node_modules/jquery/dist',
        src: ['jquery.min.js'],
        dest: '../dist'
      }
    },
    watch: { //automatically watch for changes
      javascripts: {
        files: ['../app/**/*.js'],
        tasks: ['jshint']
      },

        sass: {
            files: ["../sass/**/*.scss"],
            tasks: ["sass"]
        }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', ['jshint', 'sass', 'watch']);
};
