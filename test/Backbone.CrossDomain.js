$(document).ready(function() {

    var Library = Backbone.Collection.extend({
        url : function() { return '/library'; }
    });
    var library;

    var attrs = {
        title  : "The Tempest",
        author : "Bill Shakespeare",
        length : 123
    };

    module('Backbone.CrossDomain', _.extend(new Environment, {

        setup : function() {
            Environment.prototype.setup.apply(this, arguments);
            library = new Library;
            library.create(attrs, {wait: false});
        },

        teardown: function() {
            Environment.prototype.teardown.apply(this, arguments);
            Backbone.emulateHTTP = false;
        }
    }));

    test("initialize", function() {
        var xdm = new Backbone.Model();
        ok(xdm instanceof Backbone.Model, 'Backbone.Model created');
    });

    test("urlError", 2, function() {
        var model = new Backbone.Model();
        raises(function() {
            model.fetch();
        });
        model.fetch({url: '/one/two'});
        equal(this.ajaxSettings.url, '/one/two');
    });

    test("#1052 - `options` is optional.", 0, function() {
        var model = new Backbone.Model();
        model.url = '/test';
        Backbone.sync('create', model);
    });

    test("Backbone.ajax", 1, function() {
        Backbone.ajax = function(settings){
            strictEqual(settings.url, '/test');
        };
        var model = new Backbone.Model();
        model.url = '/test';
        Backbone.sync('create', model);
    });

    test("Call provided error callback on error.", 1, function() {
        var model = new Backbone.Model;
        model.url = '/test';
        Backbone.sync('read', model, {
            error: function() { ok(true); }
        });
        this.ajaxSettings.error();
    });

    test('Use Backbone.emulateHTTP as default.', 2, function() {
        var model = new Backbone.Model;
        model.url = '/test';

        Backbone.emulateHTTP = true;
        model.sync('create', model);
        strictEqual(this.ajaxSettings.emulateHTTP, true);

        Backbone.emulateHTTP = false;
        model.sync('create', model);
        strictEqual(this.ajaxSettings.emulateHTTP, false);
    });

    test('Use Backbone.emulateJSON as default.', 2, function() {
        var model = new Backbone.Model;
        model.url = '/test';

        Backbone.emulateJSON = true;
        model.sync('create', model);
        strictEqual(this.ajaxSettings.emulateJSON, true);

        Backbone.emulateJSON = false;
        model.sync('create', model);
        strictEqual(this.ajaxSettings.emulateJSON, false);
    });

    // Perform these tests only for IE
    if (window.XDomainRequest) {

        // Make sure non-cross domain requests work fine and as normal
        test("Backbone.ajax", 1, function() {
            Backbone.ajax = function(settings){
                strictEqual(settings.url, '/test');
            };
            var model = new Backbone.Model();
            model.url = '/test';
            Backbone.sync('create', model);
        });

        test("Call provided error callback on error.", 1, function() {
            var model = new Backbone.Model;
            model.url = '/test';
            Backbone.sync('read', model, {
                error: function() { ok(true); }
            });
            this.ajaxSettings.error();
        });

        test('Use Backbone.emulateHTTP as default.', 2, function() {
            var model = new Backbone.Model;
            model.url = '/test';

            Backbone.emulateHTTP = true;
            model.sync('create', model);
            strictEqual(this.ajaxSettings.emulateHTTP, true);

            Backbone.emulateHTTP = false;
            model.sync('create', model);
            strictEqual(this.ajaxSettings.emulateHTTP, false);
        });

        test('Use Backbone.emulateJSON as default.', 2, function() {
            var model = new Backbone.Model;
            model.url = '/test';

            Backbone.emulateJSON = true;
            model.sync('create', model);
            strictEqual(this.ajaxSettings.emulateJSON, true);

            Backbone.emulateJSON = false;
            model.sync('create', model);
            strictEqual(this.ajaxSettings.emulateJSON, false);
        });

        test("#1756 - Call user provided beforeSend function.", 4, function() {
            Backbone.emulateHTTP = true;
            var model = new Backbone.Model;
            model.url = '/test';
            var xhr = {
                setRequestHeader: function(header, value) {
                    strictEqual(header, 'X-HTTP-Method-Override');
                    strictEqual(value, 'DELETE');
                }
            };
            model.sync('delete', model, {
                beforeSend: function(_xhr) {
                    ok(_xhr === xhr);
                    return false;
                }
            });
            strictEqual(this.ajaxSettings.beforeSend(xhr), false);
        });

        // Make sure cross domain requests to DELETE, PATCH, and PUT fail with emulateHTTP off
        test("Try Forbidden requests with emulateHTTP on.", 3, function() {
            Backbone.emulateHTTP = true;
            var model = new Backbone.Model;
            model.url = 'http://example.com/test';

            model.sync('delete', model);
            strictEqual(this.ajaxSettings.emulateHTTP,
                        true,
                       "CrossDomain Sync appropriately allowed DELETE with emulateHTTP on");

            model.sync('patch', model);
            strictEqual(this.ajaxSettings.emulateHTTP,
                        true,
                       "CrossDomain Sync appropriately allowed PATCH with emulateHTTP on");

            model.sync('update', model);
            strictEqual(this.ajaxSettings.emulateHTTP,
                        true,
                       "CrossDomain Sync appropriately allowed PUT with emulateHTTP on");
        }); 

        // Make sure cross domain requests to DELETE, PATCH, and PUT work with emulateHTTP on
        test("Try Forbidden requests with emulateHTTP off.", 3, function() {
            Backbone.emulateHTTP = false;
            var model = new Backbone.Model;
            model.url = 'http://example.com/test';

            try {
                // This should fail and throw an exception.
                model.sync('delete', model);
            } catch (x) {
              strictEqual(x.message,
                          "Backbone.CrossDomain cannot use PUT, PATCH, DELETE with XDomainRequest (IE) and emulateHTTP=false",
                          "CrossDomain Sync appropriately denied DELETE request with emulateHTTP off on IE.");
            }

            try {
                // This should fail and throw an exception.
                model.sync('patch', model);
            } catch (x) {
                strictEqual(x.message,
                            "Backbone.CrossDomain cannot use PUT, PATCH, DELETE with XDomainRequest (IE) and emulateHTTP=false",
                            "CrossDomain Sync appropriately denied PATCH request with emulateHTTP off on IE.");
            }

            try {
                // This should fail and throw an exception.
                model.sync('update', model);
            } catch (x) {
                strictEqual(x.message,
                            "Backbone.CrossDomain cannot use PUT, PATCH, DELETE with XDomainRequest (IE) and emulateHTTP=false",
                            "CrossDomain Sync appropriately denied PUT request with emulateHTTP off on IE.");
            }
        });

        test("Test out different combos of protocols", 2, function() {
            Backbone.emulateHTTP = false;
            var model = new Backbone.Model;
            model.url = 'https://example.com/test';

            try {
                // This should fail and throw an exception.
                model.sync('read', model);
            } catch (x) {
              strictEqual(x.message,
                          "Backbone.CrossDomain only works for same protocol requests (HTTP -> HTTP, HTTPS -> HTTPS) cannot mix.",
                          "CrossDomain Sync appropriately threw error when met with mixed protocols on IE.");
            }

            model.url = '//example.com/test';

            model.sync('read', model);
            ok(model, "Model read worked without a protocol specified and no errors thrown.");
        });

    }
    else {
        test("#1756 - Call user provided beforeSend function.", 4, function() {
        Backbone.emulateHTTP = true;
        var model = new Backbone.Model;
        model.url = '/test';
        var xhr = {
            setRequestHeader: function(header, value) {
                strictEqual(header, 'X-HTTP-Method-Override');
                strictEqual(value, 'DELETE');
            }
        };
        model.sync('delete', model, {
            beforeSend: function(_xhr) {
                ok(_xhr === xhr);
                return false;
            }
        });
        strictEqual(this.ajaxSettings.beforeSend(xhr), false);
    }); 
    }
});
