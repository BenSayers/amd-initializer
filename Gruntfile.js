module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        karma: {
            options: {
                files: [
                    'test/support/test-runner.js',
                    {pattern: 'src/**/*.js', included: false},
                    {pattern: 'test/**/*.js', included: false},
                    {pattern: 'bower_components/**/*.js', included: false}
                ],
                frameworks: ['requirejs', 'jasmine']
            },
            unit: {
                browsers: ['PhantomJS'],
                singleRun: true
            },
            debug: {
                browsers: ['Chrome']
            }
        }
    });

    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('test', ['karma:unit']);
    grunt.registerTask('default', ['test']);
};