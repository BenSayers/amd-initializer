define(['jquery', 'skate', 'amdInitializer/require'], function ($, skate, require) {
    var defaultOptions = {
        watchDom: true
    };

    var amdInitializerFactory = function (userOptions) {
        var moduleLoadedCallbacks = $.Callbacks();

        var initializeModule = function () {
            var moduleInitialized = new $.Deferred();
            var $target = $(this);
            var data = $target.data();

            if ($target.attr('data-module-loaded') === 'true') {
                moduleInitialized.resolve(data.moduleName);
                return moduleInitialized.promise();
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

                return moduleInitialized.resolve(data.moduleName);
            });

            return moduleInitialized.promise();
        };

        var options = $.extend({}, defaultOptions, userOptions);
        var skateComponent;
        if (options.watchDom) {
             skateComponent = skate(options.selector, function (element) {
                initializeModule.apply(element);
            });
        } else {
            skateComponent = {
                destroy: $.noop
            };
        }

        var modulesLoadedPromises = $('body').find(options.selector).map(initializeModule).toArray();

        return {
            initialModulesLoaded: $.when.apply($, modulesLoadedPromises).promise(),
            onModuleLoaded: function (callback) {
                moduleLoadedCallbacks.add(callback);
            },
            unload: function () {
                skateComponent.destroy();
            }
        };
    };

    return {
        load: function (options) {
            return amdInitializerFactory(options);
        }
    };
});