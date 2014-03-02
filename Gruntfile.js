module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('bower.json'),
        karma: {
            options: {
                browsers: ['PhantomJS'],
                files: [
                    'src/require.config.js',
                    'test/support/test-runner.js',
                    {pattern: 'src/**/*.js', included: false},
                    {pattern: 'test/**/*.js', included: false},
                    {pattern: 'bower_components/**/*.js', included: false}
                ],
                frameworks: ['requirejs', 'jasmine']
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
                exclude: ['jquery'],
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
            build: {
                files: {
                    src: ['build/amdInitializer.js']
                }
            },
            source: {
                files: {
                    src: ['src/**/*.js', 'test/**/*.js']
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
        push: {
            options: {
                files: ['bower.json'],
                releaseBranch: ['master'],
                commitMessage: 'Release %VERSION%',
                commitFiles: ['-a'],
                tagName: '%VERSION%'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-push-release');

    grunt.registerTask('build', ['jshint:source', 'requirejs:combined', 'requirejs:minified', 'jshint:build'])
    grunt.registerTask('test', ['karma:unit']);
    grunt.registerTask('watch', ['karma:watch']);
    grunt.registerTask('release', function(versionType) {
        versionType = versionType || 'patch';
        grunt.task.run(['push:' + versionType + ':bump-only', 'build', 'test', 'copy:release', 'push::commit-only']);
    });

    grunt.registerTask('default', ['build', 'test']);
};