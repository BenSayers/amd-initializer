#amd-initializer [![Build Status](https://travis-ci.org/BenSayers/amd-initializer.png?branch=master)](https://travis-ci.org/BenSayers/amd-initializer)
amd-initializer is a small JavaScript library that loads AMD modules based on decorated DOM elements.

This library is under early development and does not yet have a stable api.

##Browser Support
The following browsers are supported:

- IE10, IE11
- Firefox latest (Mac and Windows)
- Chrome latest (Mac and Windows)
- Safari latest (Mac)

Browser support is ensured by running this projects tests on each supported browser.

##Installing
amd-initializer declares itself as an AMD module. It has dependencies on any AMD loader, jquery and a library called skate. You need to ensure that the AMD dependencies `jquery` and `skate` will resolve in order for amd-initializer to work.

The following installation options are available:

###Bower

    bower install amd-initialize

###Manual
The files are available from the `/dist` directory in the source.

These files are only generated during a release so it is safe to copy them from the latest commit.

##Usage
To be expanded when the api has stabilised.

###HTML
Put dom elements on the page that can be uniquely identified with a css selector

    <div class="module" data-module-name="path/to/amd/module" data-param-one="value-1" data-param-two="value-1"></div>

where

- `data-module-name`: This is the amd module name of the module you would like loaded.
- `data-param-one`, `data-param-two`: These are parameters that will be passed to the amd module.

###AMD Modules
Declare an AMD module matching the name put into the html.

    define('path/to/amd/module', function () {
        return {
            load: function ($target, params) {
                //do stuff
            }
        }
    });

The module must return an object with a `load` function on it. The function will be passed the following parameters (in order):

- `$target`: A jQuery object pointing to the dom element the module was loaded on. Append any html and other behaviour to this element.
- `params` - All the other data attributes except data-module-name will be passed as a JavaScript object. The attributes are converted to a JavaScript object using [jQuery.data](http://api.jquery.com/data/#data-html5).

###Starting
amd-initializer needs to be loaded onto the page and told to start looking at the dom for modules.

    require(['amdInitializer'], function(initializer) {
        initializer.load({ selector: '.module' });
    });

amd-initializer declares itself as an AMD module called `amdInitializer`. When `load` is first called the page will be searched for matching dom elements and modules found will be loaded immediately. By default if matching dom elements are added to the page after load is called they will automatically be discovered and the modules loaded.

The object passed to the `load` function supports the following options:

- `selector`: A css selector pointing to the dom elements that are decorated with module names and parameters. This option is required.
- `watchDom`: If set to `true` the dom will be watched for elements added that match the `selector` and the module that element points to will be loaded. If set to `false` the dom will not be watched. The default value is `true`.

###After Starting
Once amd-initializer has been started it can be useful to know what it is doing. There are several ways this information is exposed.

    require(['amdInitializer'], function(initializer) {
        var api = initializer.load({ selector: '.module' });

        api.initialModulesLoaded.then(function () {
            console.log('all the initial modules on the page have been loaded');
        });

        api.onModuleLoaded(function (module) {
            console.log(module.name + ' was just loaded');
        });

        api.onModuleError(function (error) {
            console.log('the following error occurred: ' + error.exception.message);
        });
    });

`initializer.load` returns an object with the following properties:

- `initialModulesLoaded`: This is a [jQuery Promise](http://api.jquery.com/Types/#Promise) that will be resolved when all the dom elements matching the `selector` are found and `load` has been called. This promise is resolved even if some modules throw exceptions when loaded.
- `onModuleLoaded`: This is a function that accepts a callback as the first argument. The callback will be invoked once for each module that is loaded after `module.load` has finished executing. The callback will be passed a module object containing the following properties:
    - `name`: The name of the module that was loaded.
- `onModuleError`: This is a function that accepts a callback as the first argument. The callback will be invoked when a call to `module.load` throws an exception. The callback will be passed an error object containing the following properties:
    - `exception`: The exception object passed to the catch block of the try/catch surrounding the call to `module.load`.

##Contributing

###Development dependencies
The following is required in order to work on this code base:

- nodejs 0.10
- npm 1.4
- bower 1.2
- grunt-cli 0.1

###Setting up a development environment
Clone the repository and then run the following:

    npm install
    bower install

Confirm everything has been installed correctly by running the build and tests:

    grunt

###Development cycle
The tests can be re-run automatically if either the production or test code is changed:

    grunt watch

Browser debugging tools can be used to debug the tests:

    grunt karma:debug

A Chrome browser will automatically open. Click on the `debug` button at the top right. Each time you refresh this debug page the tests will run.

###Pull requests
Please submit pull requests to the master branch and be sure to write tests covering any changes you make.