define(['jquery', 'skate'], function ($, skate) {
    var domWatcherFactory = function (options, loader) {
        if (options.watchDom) {
            return skate(options.selector, function () {
                loader.load.apply(this);
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