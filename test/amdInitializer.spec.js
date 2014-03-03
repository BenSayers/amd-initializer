define(['squire', 'jquery'], function (Squire, $) {
    describe('amdInitializer', function () {
        var amdInitializer;
        var modulesLoadedPromise;
        var require;
        var module;

        beforeEach(function (done) {
            spyOn(window, 'require');
            window.require;
            require = window.require;
            var injector = new Squire();

            injector.require(['amdInitializer'], function (loadedAmdInitializer) {
                amdInitializer = loadedAmdInitializer;
                done();
            });
        });

        afterEach(function (done) {
            modulesLoadedPromise.then(function (api) {
                api.unload();
                done();
            });
        });
        
        var insertIntoDom = function (markup) {
            setFixtures('<div class="target">' + markup + '</div>');
            return $('.target');
        };

        var invokeLoad = function (selector) {
            modulesLoadedPromise = amdInitializer.load({ selector: selector });
        };

        var loadModules = function () {
            module = jasmine.createSpyObj('module', ['load']);
            $.each(require.calls.allArgs(), function (index, args) {
                var callback = args[1];
                callback(module);
            });
        };

        it('should load the module indicated by the markup', function () {
            insertIntoDom('<div class="module" data-module-name="path/to/module"></div>');
            invokeLoad('.module');
            loadModules();

            expect(require.calls.count()).toBe(1);
            expect(require).toHaveBeenCalledWith(['path/to/module'], jasmine.any(Function));
        });

        it('should call load on the loaded module', function () {
            var $target = insertIntoDom('<div class="module" data-module-name="path/to/module"></div>');
            invokeLoad('.module');
            loadModules();

            expect(module.load).toHaveBeenCalled();
            var loadArgs = module.load.calls.mostRecent().args;
            expect(loadArgs[0][0]).toBe($target.find('.module')[0], 'the element passed to the module');
            expect(loadArgs[1]).toEqual({}, 'the parameters passed to the module');
        });

        it('should pass parameters indicated by the markup to the loaded module', function () {
            insertIntoDom('<div class="module" data-module-name="path/to/module" data-parameter-one="param-1" data-parameter-two="param2"></div>');
            invokeLoad('.module');
            loadModules();

            expect(module.load).toHaveBeenCalledWith(jasmine.any(Object), {
                parameterOne: 'param-1',
                parameterTwo: 'param2'
            });
        });

        it('should load multiple modules', function () {
            insertIntoDom('<div class="module" data-module-name="path/to/module1"></div><div class="module" data-module-name="path/to/module2"></div>');
            invokeLoad('.module');
            loadModules();

            expect(require.calls.count()).toBe(2);
            expect(require).toHaveBeenCalledWith(['path/to/module1'], jasmine.any(Function));
            expect(require).toHaveBeenCalledWith(['path/to/module2'], jasmine.any(Function));
        });

        it('should return a pending promise to the modules loading', function () {
            insertIntoDom('<div class="module" data-module-name="path/to/module1"></div><div class="module" data-module-name="path/to/module2"></div>');
            invokeLoad('.module');

            expect(modulesLoadedPromise.state()).toBe('pending');
            loadModules();
        });

        it('should resolve the promise once the modules have loaded', function () {
            insertIntoDom('<div class="module" data-module-name="path/to/module1"></div><div class="module" data-module-name="path/to/module2"></div>');
            invokeLoad('.module');
            loadModules();

            expect(modulesLoadedPromise.state()).toBe('resolved');
        });

        it('should continue loading other modules if the first one throws an exception', function () {
            insertIntoDom('<div class="module" data-module-name="path/to/module1"></div><div class="module" data-module-name="path/to/module2"></div>');
            invokeLoad('.module');
            var module1 = jasmine.createSpyObj('module1', ['load']);
            module1.load.and.throwError('module1 failed to load');
            var callback1 = require.calls.argsFor(0)[1];
            callback1(module1);
            var module2 = jasmine.createSpyObj('module2', ['load']);
            var callback2 = require.calls.argsFor(1)[1];
            callback2(module2);

            expect(module1.load).toHaveBeenCalled();
            expect(module2.load).toHaveBeenCalled();
        });

        it('should resolve the promise even if one of the modules thrown an exception', function () {
            insertIntoDom('<div class="module" data-module-name="path/to/module1"></div><div class="module" data-module-name="path/to/module2"></div>');
            invokeLoad('.module');
            var module1 = jasmine.createSpyObj('module1', ['load']);
            module1.load.and.throwError('module1 failed to load');
            var callback1 = require.calls.argsFor(0)[1];
            callback1(module1);
            var module2 = jasmine.createSpyObj('module2', ['load']);
            var callback2 = require.calls.argsFor(1)[1];
            callback2(module2);

            expect(modulesLoadedPromise.state()).toBe('resolved');
        });
        
        it('should load a module whose markup is added after initialize has been invoked', function (done) {
            var $target = insertIntoDom('');
            invokeLoad('.module');
            $target.append('<div class="module" data-module-name="path/to/module"></div>');

            modulesLoadedPromise.then(function (api) {
                api.onModuleLoaded(function (module) {
                    expect(require.calls.count()).toBe(1, 'require should be called');
                    expect(require).toHaveBeenCalledWith(['path/to/module'], jasmine.any(Function));
                    done();
                });
            });
        });
    });
});