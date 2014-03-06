define(['jquery', 'skate', 'amdInitializer/require'], function ($, skate, require) {
    var amdInitializerFactory = function (selector) {
        var moduleLoadedCallbacks = $.Callbacks();
        var initialModules = (function () {
            var createInitialModule = function (element) {
                return {
                    deferred: $.Deferred(),
                    element: element
                };
            };

            return $.map(document.querySelectorAll(selector), createInitialModule);
        })();

        var markInitialModuleAsLoaded = function (element, moduleName) {
            var matchesElement = function (promise) {
                return promise.element === element;
            };

            var resolveDeferred = function (index, module) {
                module.deferred.resolve(moduleName);
            };

            var modules = $.grep(initialModules, matchesElement);
            $.each(modules, resolveDeferred);
        };

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

        var skateComponent = skate(selector, function (element) {
            initializeModule.apply(element).then(function (moduleName) {
                markInitialModuleAsLoaded(element, moduleName);
            });
        });

        var initialModulesHaveLoaded = $.map(initialModules, function (data) {
            return data.deferred.promise();
        });
        return {
            initialModulesLoaded: $.when.apply($, initialModulesHaveLoaded).promise(),
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
            return amdInitializerFactory(options.selector);
        }
    };
});