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
        cssmin: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            add_banner: {
                files: {
                    'build/Tbus.min.css': ['src/TBus.css'],
                    'build/TDivbus.min.css': ['src/TDivBus.css']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['uglify','cssmin']);
};
