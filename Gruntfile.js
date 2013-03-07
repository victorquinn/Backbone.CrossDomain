module.exports = function(grunt) {
  grunt.initConfig({
    qunit: {
      all: ['test/index.html']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-qunit');

  grunt.registerTask('default', ['qunit']);
};
