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
        release: {
            options: {
                file: 'bower.json',
                npm: false,
                push: false
            }
        },
        copy: {
            release: {
                files: {expand: true, src: ['build/**'], dest: 'dist/'}
            }
        },
        exec: {
            commitAndPushRelease: {
                cmd: 'git add --all; git commit --amend -C HEAD; git push'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-release');

    grunt.registerTask('build', ['jshint:source', 'requirejs:combined', 'requirejs:minified', 'jshint:build'])
    grunt.registerTask('test', ['karma:unit']);
    grunt.registerTask('watch', ['karma:watch']);
    grunt.registerTask('deploy', ['deploy:patch']);
    grunt.registerTask('deploy:patch', ['build', 'test', 'copy:release', 'release:patch', 'exec:commitAndPushRelease']);
    grunt.registerTask('deploy:minor', ['build', 'test', 'copy:release', 'release:minor', 'exec:commitAndPushRelease']);
    grunt.registerTask('deploy:major', ['build', 'test', 'copy:release', 'release:major', 'exec:commitAndPushRelease']);

    grunt.registerTask('default', ['test']);
};