define([ 'require', 'jquery', 'underscore', 'backbone', 'global/ViewManager'],
function(require, $, _ , Backbone, ViewManager) {
	"use strict"; // Using ECMAScript 5 strict mode during development

	var BSC = {
		routers: [],
		publishedRouters: [],
		publishedViews: [],
		requireJS: require,

		initialize: function() {
			this.initializeViews();
			this.initializeRouters();
		},

		initializeRouters: function() {
			if (this.publishedRouters.length) {
				var modules = ['backbone'].concat(this.publishedRouters);

				this.requireJS(modules, function(Backbone) {
					var routers = _.chain(arguments).toArray(arguments).rest().value();

					_.each(routers, function(Router){
						BSC.routers.push(new Router());
					});

					Backbone.history.start();
				});
			}
		},

		initializeViews: function() {
			if (this.publishedViews.length) {
				var modules = ['backbone'].concat(this.publishedViews);
				this.requireJS(modules, function() {
					var views = _.chain(arguments).toArray(arguments).rest().value();
                    var persistView = [];
                    var index = 0;
					_.each(views, function(View){
						persistView.push(new View());
						ViewManager.getViewManager().addView(persistView[index].identifier ,persistView[index]);
		                index++;
					});
				});
			}
		},

		/**
		 * Publish routers so they can be instantiated.
		 *
		 * @param {Array.<string>} routers
		 */
		publishRouters: function(routers) {
			this.publishedRouters = this.publishedRouters.concat(routers);
		},
		/**
		 * Publish views so they can be instantiated.
		 *
		 * @param {Array.<string>} routers
		 */
		publishViews: function(routers) {
			this.publishedViews = this.publishedViews.concat(routers);
		}
	};

	return BSC;
});

