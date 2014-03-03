define(['squire', 'jquery'], function (Squire, $) {
    describe('amdInitializer', function () {
        var amdInitializer;
        var modulesLoadedPromise;
        var module1;
        var module2;

        beforeEach(function (done) {
            var injector = new Squire();

            module1 = jasmine.createSpyObj('module1', ['load']);
            module2 = jasmine.createSpyObj('module2', ['load']);
            var require = function () {
                injector.require.apply(injector, arguments);
            };
            var mocks = {
                'amdInitializer/require': require,
                'path/to/module1': module1,
                'path/to/module2': module2
            };

            injector.mock(mocks);
            injector.require(['amdInitializer'], function (loadedAmdInitializer) {
                amdInitializer = loadedAmdInitializer;
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

        it('should call load on the loaded module', function (done) {
            var $target = insertIntoDom('<div class="module" data-module-name="path/to/module1"></div>');
            invokeLoad('.module');

            modulesLoadedPromise.then(function () {
                expect(module1.load).toHaveBeenCalled();
                var loadArgs = module1.load.calls.mostRecent().args;
                expect(loadArgs[0][0]).toBe($target.find('.module')[0], 'the element passed to the module');
                expect(loadArgs[1]).toEqual({}, 'the parameters passed to the module');
                done();
            });
        });

        it('should pass parameters indicated by the markup to the loaded module', function (done) {
            insertIntoDom('<div class="module" data-module-name="path/to/module1" data-parameter-one="param-1" data-parameter-two="param2"></div>');
            invokeLoad('.module');

            modulesLoadedPromise.then(function () {
                expect(module1.load).toHaveBeenCalledWith(jasmine.any(Object), {
                    parameterOne: 'param-1',
                    parameterTwo: 'param2'
                });
                done();
            });
        });

        it('should load multiple modules', function (done) {
            insertIntoDom('<div class="module" data-module-name="path/to/module1"></div><div class="module" data-module-name="path/to/module2"></div>');
            invokeLoad('.module');

            modulesLoadedPromise.then(function () {
                expect(module1.load).toHaveBeenCalled();
                expect(module2.load).toHaveBeenCalled();
                done();
            });
        });

        it('should continue loading other modules if the first one throws an exception', function (done) {
            insertIntoDom('<div class="module" data-module-name="path/to/module1"></div><div class="module" data-module-name="path/to/module2"></div>');
            module1.load.and.throwError('module1 failed to load');
            invokeLoad('.module');

            modulesLoadedPromise.then(function () {
                expect(module1.load).toHaveBeenCalled();
                expect(module2.load).toHaveBeenCalled();
                done();
            });
        });

        it('should load a module whose markup is added after initialize has been invoked', function (done) {
            var $target = insertIntoDom('');
            invokeLoad('.module');
            $target.append('<div class="module" data-module-name="path/to/module1"></div>');

            modulesLoadedPromise.then(function (api) {
                api.onModuleLoaded(function () {
                    expect(module1.load.calls.count()).toBe(1, 'the number of times module1.load gets called');
                    done();
                });
            });
        });
    });
});