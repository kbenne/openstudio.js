module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    copy: {
      main: {
        files: [
          {src: 'main.js', dest: 'dist/'},
          {src: 'package.json', dest: 'dist/'},
          {expand: true, src: 'render/**', dest: 'dist/'},
          {expand: true, src: 'services/**', dest: 'dist/'}
        ]
      },
    }
  });

  grunt.registerTask('default', ['package']);
  grunt.registerTask('package', ['copy','package:electron']);
  grunt.registerTask('package:electron', function() {
    var packager = require('electron-packager');
    var opts = {
      dir: 'dist/',
      out: './dist',
      name: 'OpenStudio',
      platform: 'darwin',
      arch: 'x64',
      version: '0.28.2',
      overwrite: true
    };
    packager(opts, this.async())
  } );

  grunt.loadNpmTasks('grunt-contrib-copy');
};

