define([
  'backbone',
  'global/ViewManager'
  ],

function(Backbone, ViewManager) {

  var BaseRouter = Backbone.Router.extend({
      viewManager: ViewManager.getViewManager()
  });

  return BaseRouter;

});