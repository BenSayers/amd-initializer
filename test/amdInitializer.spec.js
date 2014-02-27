define(['squire'], function (Squire) {
    describe('amdInitializer', function () {
        var async = new AsyncSpec(this);
        var amdInitializer;
        var require;

        async.beforeEach(function (done) {
            require = jasmine.createSpy('require');
            var injector = new Squire();
            injector.mock({'utilities/require': Squire.Helpers.returns(require)});
            injector.require(['amdInitializer'], function (loadedAmdInitializer) {
                amdInitializer = loadedAmdInitializer;
                done();
            });
        });

        it('should load the module indicated by the markup', function () {
            var $target = $('<div><div class="module" data-module-name="path/to/module"></div></div>');
            amdInitializer.load($target);

            expect(require.callCount).toBe(1);
            expect(require).toHaveBeenCalledWith(['path/to/module'], jasmine.any(Function));
        });

        it('should call load on the loaded module', function () {
            var $target = $('<div><div class="module" data-module-name="path/to/module"></div></div>');
            amdInitializer.load($target);
            var module = jasmine.createSpyObj('module', ['load']);
            var callback = require.mostRecentCall.args[1];
            callback(module);

            expect(module.load).toHaveBeenCalled();
            var loadArgs = module.load.mostRecentCall.args;
            expect(loadArgs[0][0]).toBe($target.find('.module')[0], 'the $target passed to the module');
            expect(loadArgs[1]).toEqual({}, 'the parameters passed to the module');
        });

        it('should pass parameters indicated by the markup to the loaded module', function () {
            var $target = $('<div><div class="module" data-module-name="path/to/module" data-parameter-one="param-1" data-parameter-two="param2"></div></div>');
            amdInitializer.load($target);
            var module = jasmine.createSpyObj('module', ['load']);
            var callback = require.mostRecentCall.args[1];
            callback(module);

            expect(module.load).toHaveBeenCalledWith(jasmine.any(Object), {
                parameterOne: 'param-1',
                parameterTwo: 'param2'
            });
        });

        it('should load multiple modules', function () {
            var $target = $('<div><div class="module" data-module-name="path/to/module1"></div><div class="module" data-module-name="path/to/module2"></div></div>');
            amdInitializer.load($target);

            expect(require.callCount).toBe(2);
            expect(require).toHaveBeenCalledWith(['path/to/module1'], jasmine.any(Function));
            expect(require).toHaveBeenCalledWith(['path/to/module2'], jasmine.any(Function));
        });

        it('should return a pending promise to the modules loading', function () {
            var $target = $('<div><div class="module" data-module-name="path/to/module1"></div><div class="module" data-module-name="path/to/module2"></div></div>');
            var modulesLoaded = amdInitializer.load($target);

            expect(modulesLoaded.state()).toBe('pending');
        });

        it('should resolve the promise once the modules have loaded', function () {
            var $target = $('<div><div class="module" data-module-name="path/to/module1"></div><div class="module" data-module-name="path/to/module2"></div></div>');
            var modulesLoaded = amdInitializer.load($target);
            var module = jasmine.createSpyObj('module', ['load']);
            var callbackForModule1 = require.argsForCall[0][1];
            var callbackForModule2 = require.argsForCall[1][1];
            callbackForModule1(module);
            callbackForModule2(module);

            expect(modulesLoaded.state()).toBe('resolved');
        });

        it('should continue loading other modules if the first one throws an exception', function () {
            var $target = $('<div><div class="module" data-module-name="path/to/module1"></div><div class="module" data-module-name="path/to/module2"></div></div>');
            amdInitializer.load($target);
            var module1 = jasmine.createSpyObj('module1', ['load']);
            module1.load.andThrow('module1 failed to load');
            var callback1 = require.calls[0].args[1];
            callback1(module1);
            var module2 = jasmine.createSpyObj('module2', ['load']);
            var callback2 = require.calls[1].args[1];
            callback2(module2);

            expect(module1.load).toHaveBeenCalled();
            expect(module2.load).toHaveBeenCalled();
        });

        it('should resolve the promise even if one of the modules thrown an exception', function () {
            var $target = $('<div><div class="module" data-module-name="path/to/module1"></div><div class="module" data-module-name="path/to/module2"></div></div>');
            var modulesLoaded = amdInitializer.load($target);
            var module1 = jasmine.createSpyObj('module1', ['load']);
            module1.load.andThrow('module1 failed to load');
            var callback1 = require.calls[0].args[1];
            callback1(module1);
            var module2 = jasmine.createSpyObj('module2', ['load']);
            var callback2 = require.calls[1].args[1];
            callback2(module2);

            expect(modulesLoaded.state()).toBe('resolved');
        });
    });
});