define([
  'global/Helper'
  ],

function(Helper) {

  /**
  * Menu Router
  */
	var ViewManager = (function () {
      var instance;
      var viewMap = {};

      function init() {
        function _store(name, view){
            viewMap[name] = view;
            return viewMap[name];
        }

        return {
          addView: function (name, view) {
            var storedView = viewMap[name];
            if(!storedView){
              storedView = _store(name, view);
            }
            
            return storedView;
          },
          getView: function (name) {
            var view = viewMap[name];
            if(!view){
              return null;
            }
            return view;
          },
          deleteView: function(name){
            var view = viewMap[name];
            view.$el[0].innerHTML = "";
            delete viewMap[name];
          },
          getViewMappings: viewMap
        };

      };

      return {
        getViewManager: function () {
          if ( !instance ) {
            instance = init();
          }

          return instance;
        }

      };

    })();

	return ViewManager;
});