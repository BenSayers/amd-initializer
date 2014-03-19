define([
    'jquery',
    'amdInitializer/moduleLoaderFactory',
    'amdInitializer/domWatcherFactory'
], function ($, moduleLoaderFactory, domWatcherFactory) {
    var defaultOptions = {
        watchDom: true
    };

    var amdInitializerFactory = function (userOptions) {
        var internalOptions = {
            moduleErrorCallbacks: $.Callbacks(),
            moduleLoadedCallbacks: $.Callbacks()
        };
        var options = $.extend({}, defaultOptions, userOptions, internalOptions);
        var moduleLoader = moduleLoaderFactory.create(options);
        var domWatcher = domWatcherFactory.create(options, moduleLoader);
        var modulesLoadedPromises = $('body').find(options.selector).map(moduleLoader.load).toArray();

        return {
            initialModulesLoaded: $.when.apply($, modulesLoadedPromises).promise(),
            onModuleError: function (callback) {
                options.moduleErrorCallbacks.add(callback);
            },
            onModuleLoaded: function (callback) {
                options.moduleLoadedCallbacks.add(callback);
            },
            unload: function () {
                domWatcher.deafen();
            }
        };
    };

    return {
        load: function (options) {
            return amdInitializerFactory(options);
        }
    };
});