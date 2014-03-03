#amd-initializer [![Build Status](https://travis-ci.org/BenSayers/amd-initializer.png?branch=master)](https://travis-ci.org/BenSayers/amd-initializer)
amd-initializer is a small JavaScript library that loads AMD modules based on decorated DOM elements.

This library is under early development and does not yet have a stable api.

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

__data-module-name__

This is the amd module name of the module you would like loaded.

__data-param-one, data-param-two__

These are parameters that will be passed to the amd module.

###AMD Modules
Declare an AMD module matching the name put into the html.

    define('path/to/amd/module', function () {
        return {
            load: function ($target, params) {
                //do stuff
            }
        }
    });

The module must return an object with a `load` function on it that accepts a `$target` and `params`.

__$target__

Is a jQuery object pointing to the dom element the module was loaded on. Append any html and other behaviour to this element.

__params__

All the other data attributes except data-module-name will be passed as a JavaScript object. The attributes are converted to a JavaScript object using [jQuery.data](http://api.jquery.com/data/#data-html5).

###Starting amd-initializer
amdInitializer needs to be loaded onto the page and told to start looking at the dom for modules.

    require(['amdInitializer'], function(initializer) {
        initializer.load('.module');
    });

amd-initializer declares itself as an AMD module called `amdInitializer`.

The string passed to `load` is a css selector of the dom elements that are decorated with module names and parameters.

When first called amd-initializer will search the page for matching dom elements and load any modules it finds. If dom elements are added to the page after load is called they will automatically be discovered.

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