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

      hideSplash: function(){
         if(navigator && navigator.splashscreen){
           navigator.splashscreen.hide();
         }
      },

      showSplash: function(){
         if(navigator && navigator.splashscreen){
           navigator.splashscreen.show();
         }
      },

      toggleMenu: function(){
        if($('#pages').hasClass('open')){
          this.closeMenu();
        } else {
          this.openMenu();
        }
      },
      openMenu: function(){

        $('#pages').addClass('open');
        var body = $('body');
        window.scroll(0,0);

        $('body > .container').css('position', 'relative');
        $('#testo-menu').addClass('current');

        $('.pages').css('height', window.innerHeight).css('width', window.innerWidth);
        $('.page').css('height', window.innerHeight).css('width', window.innerWidth);
        body.addClass('aside').css('height', window.innerHeight).css('width', window.innerWidth);
        this.isMenuOpen = true;
        this.hideKeyboard();

        var $div = $(document.createElement('div'));
        $div.addClass('page-shader');

        $('.pages').prepend($div);
        $div.css('background','rgba(0,0,0,.4)');
      },
      closeMenu: function(callback){
        var body = $('body');
        if (body.hasClass('aside')) {
          body.removeClass('aside');
          body.css('height', '').css('width', '');
          $('#pages').removeClass('open');
          
          $('.pages .page-shader').remove();

          var afterTransition = function(callback){
            $('.pages').css('height', '').css('width', '');
            $('.page').css('height', '').css('width', '');
            
            $('#testo-menu').removeClass('current');
            $('body > .container').css('position', 'static');
                      if(callback){callback.call()}
          };
          
          Helper.transitionComplete($('#pages'), function() {
            afterTransition(callback);
          });

          this.isMenuOpen = false;
        }
      },
      hideKeyboard: function() {
        document.activeElement.blur();
        $("input").blur();
      },

      openExternalLinks: function(){
        this.$('a.external').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var targetURL = $(this).attr("href");

            window.open(targetURL, "_system");
        });
      }
    });

	return BaseView;
});