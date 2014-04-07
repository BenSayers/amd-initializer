module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('bower.json'),
        karma: {
            options: {
                configFile: 'test/support/karma.config.js'
            },
            debug: {
                browsers: ['Chrome']
            },
            watch: {
                autoWatch: true,
                reporters: ['dots']
            },
            unit: {
                singleRun: true
            }
        },
        requirejs: {
            options: {
                exclude: ['jquery', 'skate'],
                mainConfigFile: 'src/require.config.js',
                name: 'amdInitializer',
                wrap: {
                    start: '/*! amdInitializer v<%= pkg.version %> | (c) 2014 <%= pkg.authors.join(", ") %> | Released under the MIT licence */\n'
                }
            },
            combined: {
                options: {
                    optimize: 'none',
                    out: 'build/amdInitializer.js',
                }
            },
            minified: {
                options: {
                    out: 'build/amdInitializer.min.js'
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            build: {
                files: {
                    src: ['build/amdInitializer.js']
                }
            },
            source: {
                files: {
                    src: ['src/**/*.js', 'test/**/*.js', '!test/support/karma.config.js']
                }
            }
        },
        copy: {
            release: {
                expand: true,
                cwd: 'build/',
                flatten: true,
                src: '*',
                dest: 'dist/'
            }
        },
        bump: {
            options: {
                files: ['bower.json'],
                updateConfigs: ['pkg'],
                commitMessage: 'Release %VERSION%',
                commitFiles: ['-a'],
                tagName: '%VERSION%',
                pushTo: 'origin'
            }
        }
    });

    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('build', ['jshint:source', 'requirejs:combined', 'requirejs:minified', 'jshint:build'])
    grunt.registerTask('test', ['karma:unit']);
    grunt.registerTask('watch', ['karma:watch']);
    grunt.registerTask('release', function(versionType) {
        versionType = versionType || 'patch';
        grunt.task.run(['bump-only:' + versionType, 'build', 'test', 'copy:release', 'bump-commit']);
    });

    grunt.registerTask('default', ['build', 'test']);
};