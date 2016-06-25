module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON( "package.json" ),
        clean: {
            lib: [ "lib/" ]
        },
        npmcopy: {
            folders: {
                files: {
                    'lib': '../app/joos-behavior'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-npmcopy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask( "default", [ "clean", "npmcopy" ] );
};
