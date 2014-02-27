(function () {
    var tests = [];
    var file;
    for (file in window.__karma__.files) {
        if (window.__karma__.files.hasOwnProperty(file)) {
            if (/spec\.js$/.test(file)) {
                tests.push(file);
            }
        }
    }

    require.config({
        baseUrl: '/base/src',
        paths: {
            'test': '../test',
            'jquery': '../bower_components/jquery/dist/jquery',
            'squire': '../bower_components/squire/src/Squire'
        }
    });

    return require(tests, function () {
        return window.__karma__.start();
    });
})();