module.exports = function (grunt) {
    var customKarmaLaunchers = {
        sauceLabsWindowsChrome: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Windows 8.1'
        },
        sauceLabsWindowsFirefox: {
            base: 'SauceLabs',
            browserName: 'firefox',
            platform: 'Windows 8.1'
        },
        sauceLabsWindowsIE11: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '11',
            platform: 'Windows 7'
        },
        sauceLabsWindowsIE10: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '10',
            platform: 'Windows 7'
        },
        sauceLabsMacFirefox: {
            base: 'SauceLabs',
            browserName: 'firefox',
            platform: 'OS X 10.9'
        },
        sauceLabsMacChrome: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'OS X 10.9'
        },
        sauceLabsMacSafari: {
            base: 'SauceLabs',
            browserName: 'safari',
            platform: 'OS X 10.9'
        }
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('bower.json'),
        karma: {
            options: {
                configFile: 'test/support/karma.config.js',
                customLaunchers: customKarmaLaunchers,
                sauceLabs: {
                    testName: 'amd-initializer tests',
                    startConnect: true
                }
            },
            debug: {
                browsers: ['Chrome']
            },
            watch: {
                autoWatch: true
            },
            unit: {
                browsers: [grunt.option('browser') || 'PhantomJS'],
                singleRun: true
            },
            windows: {
                browsers: ['sauceLabsWindowsChrome', 'sauceLabsWindowsFirefox', 'sauceLabsWindowsIE11', 'sauceLabsWindowsIE10'],
                reporters: ['dots', 'saucelabs'],
                singleRun: true
            },
            mac: {
                browsers: ['sauceLabsMacFirefox', 'sauceLabsMacChrome', 'sauceLabsMacSafari'],
                reporters: ['dots', 'saucelabs'],
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
    grunt.registerTask('ci', ['build', 'test', 'karma:windows', 'karma:mac']);

    grunt.registerTask('default', ['build', 'test']);
};