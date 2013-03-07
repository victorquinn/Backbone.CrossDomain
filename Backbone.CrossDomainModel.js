// Backbone.CrossDomainModel 0.1.0
//
// (c) 2013 Victor Quinn
// Licensed under the MIT license.

(function (root, factory) {
   if (typeof define === "function" && define.amd) {
      // AMD. Register as an anonymous module.
      define(["underscore","backbone"], function(_, Backbone) {
        // Use global variables if the locals are undefined.
        return factory(_ || root._, Backbone || root.Backbone);
      });
   } else {
      // RequireJS isn't being used. Assume underscore and backbone are loaded in <script> tags
      factory(_, Backbone);
   }
}(this, function(_, Backbone) {

    Backbone.CrossDomainModel = Backbone.Model.extend({
        sync : function (method, model, options) {
            if (window.XDomainRequest) {
                // Backbone.sync (rewritten to use XDomainRequest object
                // -------------

                // Map from CRUD to HTTP for our default `Backbone.sync` implementation.

                var methodMap = {
                    'create': 'POST',
                    'update': 'PUT',
                    'patch':  'PATCH',
                    'delete': 'DELETE',
                    'read':   'GET'
                };

                // Override this function to change the manner in which Backbone persists
                // models to the server. You will be passed the type of request, and the
                // model in question. By default, makes a RESTful Ajax request
                // to the model's `url()`. Some possible customizations could be:
                //
                // * Use `setTimeout` to batch rapid-fire updates into a single request.
                // * Send up the models as XML instead of JSON.
                // * Persist models via WebSockets instead of Ajax.
                //
                // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
                // as `POST`, with a `_method` parameter containing the true HTTP method,
                // as well as all requests with the body as `application/x-www-form-urlencoded`
                // instead of `application/json` with the model in a param named `model`.
                // Useful when interfacing with server-side languages like **PHP** that make
                // it difficult to read the body of `PUT` requests.

                var type = methodMap[method];

                // XDomainRequest only works with POST. So DELETE/PUT/PATCH can't work here.

                // Default options, unless specified.
                _.defaults(options || (options = {}), {
                    emulateHTTP: Backbone.emulateHTTP,
                    emulateJSON: Backbone.emulateJSON
                });

                // Default JSON-request options.
                var params = {type: type, dataType: 'json'};

                // Ensure that we have a URL.
                if (!options.url) {
                    params.url = _.result(model, 'url') || urlError();
                }

                // Ensure that we have the appropriate request data.
                if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
                    params.contentType = 'application/json';
                    params.data = JSON.stringify(options.attrs || model.toJSON(options));
                }

                // For older servers, emulate JSON by encoding the request into an HTML-form.
                if (options.emulateJSON) {
                    params.contentType = 'application/x-www-form-urlencoded';
                    params.data = params.data ? {model: params.data} : {};
                }

                // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
                // And an `X-HTTP-Method-Override` header.
                if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
                    params.type = 'POST';
                    if (options.emulateJSON) params.data._method = type;
                    var beforeSend = options.beforeSend;
                    options.beforeSend = function(xhr) {
                        xhr.setRequestHeader('X-HTTP-Method-Override', type);
                        if (beforeSend) return beforeSend.apply(this, arguments);
                    };
                }

                // Don't process data on a non-GET request.
                if (params.type !== 'GET' && !options.emulateJSON) {
                    params.processData = false;
                }

                // Make the request, allowing the user to override any Ajax options.
                var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
                model.trigger('request', model, xhr, options);
                return xhr;

            }
            else {
                return Backbone.Model.prototype.sync.call(this, method, model, options);
            }
        }
    });
    return Backbone;
}));
