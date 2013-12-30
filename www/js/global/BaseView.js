define([
  'backbone', 
  'global/Helper'
  ],

function(Backbone, Helper) {

  /**
  * Menu Router
  */
	var BaseView = Backbone.View.extend({
      
      initialize: function(){
          
        this.render();
      },

      // Override the render method with a custom syntax.
      render: function() {
      
      },
    statusBar : function(){
        if( $('body').has("ios") && parseInt(localStorage.getItem("deviceVersion")) >= 7.0){ 
                $(".active-page").css("margin-top", "20px");
        } 
    }    
    });

	return BaseView;
});