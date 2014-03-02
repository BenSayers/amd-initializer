define(['jquery'], function ($) {
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
        initialize: function (options) {
            var modulesLoadedPromises = $('body').find(options.selector).map(initializeModule).toArray();
            return $.when.apply($, modulesLoadedPromises).promise();
        }
    };
});