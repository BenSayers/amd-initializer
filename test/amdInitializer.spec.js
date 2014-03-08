define(['squire', 'jquery'], function (Squire, $) {
    describe('amdInitializer', function () {
        var amdInitializer;
        var initializerApi;
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

        afterEach(function () {
            initializerApi.unload();
        });

        var insertIntoDom = function (markup) {
            setFixtures('<div class="target">' + markup + '</div>');
            return $('.target');
        };

        var invokeLoad = function (options) {
            initializerApi = amdInitializer.load(options);
        };

        it('should call load on the loaded module', function (done) {
            var $target = insertIntoDom('<div class="module" data-module-name="path/to/module1"></div>');
            invokeLoad({ selector: '.module' });

            initializerApi.initialModulesLoaded.then(function () {
                expect(module1.load).toHaveBeenCalled();
                var loadArgs = module1.load.calls.mostRecent().args;
                expect(loadArgs[0][0]).toBe($target.find('.module')[0], 'the element passed to the module');
                expect(loadArgs[1]).toEqual({}, 'the parameters passed to the module');
                done();
            });
        });

        it('should pass parameters indicated by the markup to the loaded module', function (done) {
            insertIntoDom('<div class="module" data-module-name="path/to/module1" data-parameter-one="param-1" data-parameter-two="param2"></div>');
            invokeLoad({ selector: '.module' });

            initializerApi.initialModulesLoaded.then(function () {
                expect(module1.load).toHaveBeenCalledWith(jasmine.any(Object), {
                    parameterOne: 'param-1',
                    parameterTwo: 'param2'
                });
                done();
            });
        });

        it('should raise an event when the module has loaded', function (done) {
            insertIntoDom('<div class="module" data-module-name="path/to/module1"></div>');
            invokeLoad({ selector: '.module' });

            initializerApi.onModuleLoaded(function (moduleDetails) {
                expect(moduleDetails.name).toBe('path/to/module1');
                done();
            });
        });

        it('should load multiple modules', function (done) {
            insertIntoDom('<div class="module" data-module-name="path/to/module1"></div><div class="module" data-module-name="path/to/module2"></div>');
            invokeLoad({ selector: '.module' });

            initializerApi.initialModulesLoaded.then(function () {
                expect(module1.load).toHaveBeenCalled();
                expect(module2.load).toHaveBeenCalled();
                done();
            });
        });

        it('should continue loading other modules if the first one throws an exception', function (done) {
            insertIntoDom('<div class="module" data-module-name="path/to/module1"></div><div class="module" data-module-name="path/to/module2"></div>');
            module1.load.and.throwError('module1 failed to load');
            invokeLoad({ selector: '.module' });

            initializerApi.initialModulesLoaded.then(function () {
                expect(module1.load).toHaveBeenCalled();
                expect(module2.load).toHaveBeenCalled();
                done();
            });
        });

        it('should load a module whose markup is added after initialize has been invoked', function (done) {
            var $target = insertIntoDom('');
            invokeLoad({ selector: '.module' });
            $target.append('<div class="module" data-module-name="path/to/module1"></div>');

            initializerApi.onModuleLoaded(function () {
                expect(module1.load.calls.count()).toBe(1, 'the number of times module1.load gets called');
                done();
            });
        });

        it('should mark modules that have been loaded with a data-module-loaded attribute', function (done) {
            var $target = insertIntoDom('<div class="module" data-module-name="path/to/module1"></div>');
            invokeLoad({ selector: '.module' });

            initializerApi.initialModulesLoaded.then(function () {
                expect($target.find('.module')).toHaveAttr('data-module-loaded', 'true');
                done();
            });
        });

        it('should not load modules marked with the data-module-loaded attribute', function (done) {
            insertIntoDom('<div class="module" data-module-name="path/to/module1" data-module-loaded="true"></div>');
            invokeLoad({ selector: '.module' });

            initializerApi.initialModulesLoaded.then(function () {
                expect(module1.load).not.toHaveBeenCalled();
                done();
            });
        });
        
        it('should allow watching the dom to be disabled', function (done) {
            invokeLoad({ selector: '.module', watchDom: false });
            insertIntoDom('<div class="module" data-module-name="path/to/module1"></div>');

            //TODO: Find a way to test this without using setTimeout
            setTimeout(function () {
                expect(module1.load).not.toHaveBeenCalled();
                done();
            }, 100);
        });
    });
});