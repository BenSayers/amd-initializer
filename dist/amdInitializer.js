/*! amdInitializer v0.0.7 | (c) 2014 Ben Sayers | Released under the MIT licence */
define('amdInitializer/require',['require'], function (require) {
    return require;
});
define('amdInitializer',['jquery', 'skate', 'amdInitializer/require'], function ($, skate, require) {
    var initializeModule = function () {
        var moduleInitialized = new $.Deferred();
        var $target = $(this);
        var data = $(this).data();

        require([data.moduleName], function (module) {
            var copyOfData = $.extend({}, data);
            delete copyOfData.moduleName;

            try {
                module.load($target, copyOfData);
            } catch (error) {

            }

            return moduleInitialized.resolve();
        });

        return moduleInitialized.promise();
    };

    return {
        load: function (options) {
            var moduleLoadedCallbacks = $.Callbacks();
            skate(options.selector, function (element) {
                initializeModule.apply(element).then(function () {
                    moduleLoadedCallbacks.fire();
                });
            });

            var createApi = function () {
                return {
                    onModuleLoaded: function (callback) {
                        moduleLoadedCallbacks.add(callback);
                    }
                };
            };

            var modulesLoadedPromises = $('body').find(options.selector).map(initializeModule).toArray();
            return $.when.apply($, modulesLoadedPromises).then(createApi).promise();
        }
    };
});
