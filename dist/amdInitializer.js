/*! amdInitializer v0.0.9 | (c) 2014 Ben Sayers | Released under the MIT licence */
define('amdInitializer/require',['require'], function (require) {
    return require;
});
define('amdInitializer/moduleLoaderFactory',['jquery', 'amdInitializer/require'], function ($, require) {
    var moduleLoaderFactory = function (options, moduleLoadedCallbacks) {
        return {
            load: function () {
                var moduleLoaded = new $.Deferred();
                var $target = $(this);
                var data = $target.data();

                if ($target.attr('data-module-loaded') === 'true') {
                    moduleLoaded.resolve(data.moduleName);
                    return moduleLoaded.promise();
                }

                $target.attr('data-module-loaded', 'true');

                require([data.moduleName], function (module) {
                    var copyOfData = $.extend({}, data);
                    delete copyOfData.moduleName;

                    try {
                        module.load($target, copyOfData);
                    } catch (error) {

                    }

                    moduleLoadedCallbacks.fire({name: data.moduleName});

                    return moduleLoaded.resolve(data.moduleName);
                });

                return moduleLoaded.promise();
            }
        };
    };

    return {
        create: function (options, moduleLoadedCallbacks) {
            return moduleLoaderFactory(options, moduleLoadedCallbacks);
        }
    };
});
define('amdInitializer/domWatcherFactory',['skate'], function (skate) {
    var domWatcherFactory = function (options, loader) {
        if (options.watchDom) {
            return skate(options.selector, function (element) {
                loader.load.apply(element);
            });
        }

        return{
            destroy: $.noop
        };
    };

    return {
        create: function (options, loader) {
            return domWatcherFactory(options, loader);
        }
    };
});
define('amdInitializer',['jquery', 'skate', 'amdInitializer/moduleLoaderFactory', 'amdInitializer/domWatcherFactory'], function ($, skate, moduleLoaderFactory, domWatcherFactory) {
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
