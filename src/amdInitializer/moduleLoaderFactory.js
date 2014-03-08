define(['jquery', 'amdInitializer/require'], function ($, require) {
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