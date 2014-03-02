#amd-initializer [![Build Status](https://travis-ci.org/BenSayers/amd-initializer.png?branch=master)](https://travis-ci.org/BenSayers/amd-initializer)
amd-initializer is a small JavaScript library that loads AMD modules based on decorated DOM elements.

This library is under early development and does not yet have a stable api.

##Installing
amd-initializer declares itself as an AMD module. It has dependencies on requirejs and jquery. You need to ensure that the AMD dependency `jquery` will resolve to the jquery library in order for amd-initializer to work.

The following installation options are available:

###Bower

    bower install amd-initialize

###Manual
The files are available from the `/dist` directory in the source.

These files are only generated during a release so it is safe to copy them from the latest commit.

##Usage
To be expanded when the api has stabilised.

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

###Pull requests
Please submit pull requests to the master branch and be sure to write tests covering any changes you make.