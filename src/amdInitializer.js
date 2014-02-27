define(['utilities/require', 'jquery'], function (require, $) {
    var loadModule = function () {
        var moduleLoaded = new $.Deferred();
        var $target = $(this);
        var data = $(this).data();

        require([data.moduleName], function (module) {
            var copyOfData = $.extend({}, data);
            delete copyOfData.moduleName;

            try {
                module.load($target, copyOfData);
            } catch (error) {

            }

            return moduleLoaded.resolve();
        });

        return moduleLoaded.promise();
    };

    return {
        load: function ($container) {
            var modulesLoadedPromises = $container.find('.module').map(loadModule).toArray();
            return $.when.apply($, modulesLoadedPromises).promise();
        }
    };
});