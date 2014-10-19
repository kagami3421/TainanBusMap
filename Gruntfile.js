module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist: {
                files: {
                    'build/CommonVariable.min.js': ['src/CommonVariable.js'],
                    'build/TainanBus.min.js': ['src/TainanBus.js'],
                    'build/TainanBusDiv.min.js': ['src/TainanBusDiv.js'],
                    'build/TainanBusRender.min.js': ['src/TainanBusRender.js']
                }
            }
        },
        processhtml: {
            options: {
                process: true
            },
            dist: {
                files: {
                    'index.html': ['src/index_src.html'],
                    'DivTest.html': ['src/DivTest_src.html']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-processhtml');

    grunt.registerTask('default', ['uglify']);

    grunt.registerTask('build_html', ['processhtml']);
};
