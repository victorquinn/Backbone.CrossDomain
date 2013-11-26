# Backbone.CrossDomain

## Overview

This is an extension for Backbone.js with a Sync that adds support for IE 7-9 CORS requests using IE's XDomainRequest Object while maintaining compatibility with non-IE systems.

This is intended as a drop-in replacement for the default Backbone.sync so you should be able to just plop this in and Cross Domain Requests (using CORS) should just magically work on IE.

## Installation

You can manually download/install this library or grab it with npm:

```
npm install backbone-crossdomain
```

## Usage

Include Backbone.CrossDomain after including Backbone.js:

```html
<script type="text/javascript" src="backbone.js"></script>
<script type="text/javascript" src="Backbone.CrossDomain.js"></script>
```

And that's it! Now anything that uses Backbone.sync() internally should work with a cross domain request from IE7/8/9 where they didn't previously. This means model.fetch(), model.save(), model.sync, collection.fetch(), etc.

### Bower
Easy install with Bower.

```
bower install backbone.crossdomain
```

### RequireJS

This library has AMD support for use with RequireJS. This is not necessary to use this library but helpful when building an app with AMD.

Include [RequireJS](http://requirejs.org):

```html
<script type="text/javascript" src="lib/require.js"></script>
```

RequireJS config (with Backbone and Underscore using a shim):
```javascript
require.config({
    paths: {
        jquery: "lib/jquery",
        underscore: "lib/underscore",
        backbone: "lib/backbone",
        crossdomain: "lib/Backbone.CrossDomain"
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});
```

Require crossdomain:
```javascript
require(["underscore", "backbone", "crossdomain"], function(_, Backbone) {
    // Define your models and collections as normal
});
```

Use Backbone as you would normally, this is a drop-in replacement and shouldn't require anything to change.


## License

Licensed under MIT license

Copyright (c) 2013 Victor Quinn

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
