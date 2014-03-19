define(['jquery', 'skate'], function ($, skate) {
    var domWatcherFactory = function (options, loader) {
        if (options.watchDom) {
            return skate(options.selector, function (element) {
                loader.load.apply(element);
            });
        }

        return{
            deafen: $.noop
        };
    };

    return {
        create: function (options, loader) {
            return domWatcherFactory(options, loader);
        }
    };
});