// -----------------------------------------
// Backbone Multi-router
// Enables multiple independent routers which
// each match one or more routes.
//
// Author:  Tim Griesser
// License: MIT
// -----------------------------------------
(function(Backbone, _) {

  Backbone.history.handlers = {};

  var Router = Backbone.Router;
  Backbone.Router = Backbone.Router.extend({
    constructor: function() {
      this.cid = _.uniqueId('c');
      Router.apply(this, arguments);
    }
  });

  Backbone.Router.prototype.route = function() {
    Backbone.history.cid = this.cid;
    Router.prototype.route.apply(this, arguments);
    Backbone.history.cid = null;
    return this;
  };

  Backbone.history.route =  function(route, callback) {
    if (!this.cid) throw new Error('The history route method must be called from the router.');
    (this.handlers[this.cid] || (this.handlers[this.cid] = [])).unshift({route: route, callback: callback});
  };

  Backbone.history.loadUrl = function(fragmentOverride) {
    var fragment = this.fragment = this.getFragment(fragmentOverride);
    return _.any(_.map(this.handlers, function(handlers) {
      return _.any(handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
    }));
  };

})(this.Backbone, this._);
