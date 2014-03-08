define(['jquery', 'skate', 'amdInitializer/moduleLoaderFactory', 'amdInitializer/domWatcherFactory'], function ($, skate, moduleLoaderFactory, domWatcherFactory) {
    var defaultOptions = {
        watchDom: true
    };

    var amdInitializerFactory = function (userOptions) {
        var options = $.extend({}, defaultOptions, userOptions);
        var moduleLoadedCallbacks = $.Callbacks();
        var moduleLoader = moduleLoaderFactory.create(options, moduleLoadedCallbacks);
        var domWatcher = domWatcherFactory.create(options, moduleLoader);
        var modulesLoadedPromises = $('body').find(options.selector).map(moduleLoader.load).toArray();

        return {
            initialModulesLoaded: $.when.apply($, modulesLoadedPromises).promise(),
            onModuleLoaded: function (callback) {
                moduleLoadedCallbacks.add(callback);
            },
            unload: function () {
                domWatcher.destroy();
            }
        };
    };

    return {
        load: function (options) {
            return amdInitializerFactory(options);
        }
    };
});