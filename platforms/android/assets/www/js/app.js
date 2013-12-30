// Filename: app.js
define([
  'jquery', 
  'underscore', 
  'backbone',
  'router',
  'BSC'           // Request router.js
], function($, _, Backbone, Router,BSC){

    
	// Provide a global location to place configuration settings and module
	// creation.
	var app = {
		// The root path to run the application.
		root: "/",
		init: function(){
			(function(){
                timer=null;
              
                    var uaindex = navigator.userAgent.indexOf( 'OS ');
					if(new RegExp("iPhone").test(navigator.userAgent)){ 
						$('body').addClass('ios');
                        window.localStorage.setItem("device","iPhone");
                        window.localStorage.setItem("deviceVersion",navigator.userAgent.substr( uaindex + 3, 3 ).replace( '_', '.' ));
					}
                    if( new RegExp("iPad").test(navigator.userAgent)){
                        $('body').addClass('ios');
                        window.localStorage.setItem("device","iPad");
                       window.localStorage.setItem("deviceVersion",navigator.userAgent.substr( uaindex + 3, 3 ).replace( '_', '.' ));
					}

					if(new RegExp("Android").test(navigator.userAgent)){
						$('body').addClass('android');
						if (window.devicePixelRatio == 1.5) {
							$('body').addClass('hdpi');
						} else if (window.devicePixelRatio == 0.75) {
							$('body').addClass('ldpi');
						}
						if(new RegExp("HTC").test(navigator.userAgent)){
							$('body').addClass('htc');
							//selection border thingy
							$('#app-header button').addClass('no-focus');
						}
						
						if(new RegExp("Samsung").test(navigator.userAgent)){
							$('body').addClass('samsung');
						}

						if(new RegExp("4.").test(navigator.userAgent)){
							$('body').addClass('android4');
						}
						else if(new RegExp("2.").test(navigator.userAgent)){
							$('body').addClass('android2');
						}
					}
				}());

	//		if($('body').hasClass('deviceready')){
					this._publishViews();
           //    } else {
				/**
				* initialize the App only when deviceready event was fired. 
				* Thus ensuring all cordova stuuf was loaded properly
				*/
		//	this._bindEvents();
		//}
		},

		/** Bind Event Listeners
		 * Bind any events that are required on startup. Common events are:
		 * `load`, `deviceready`, `offline`, and `online`.
		 * @private
		 */ 
		 _bindEvents: function() {     
			document.addEventListener('deviceready', this._onDeviceReady, false);
			document.addEventListener('resume', this._onResume, false);
			document.addEventListener('pause', this._onResign, false);
		},

		/**
		 * deviceready Event Handler
		 * The scope of `this` is the event. In order to call the `receivedEvent`
		 * function, we must explicitly call `app.receivedEvent(...);`
		 * @private
		 */ 
		 _onDeviceReady: function() {
			app.receivedEvent('deviceready');
        
		},

		/**
		 * deviceready Event Handler
		 * The scope of `this` is the event. In order to call the `receivedEvent`
		 * function, we must explicitly call `app.receivedEvent(...);`
		 * @private
		 */ 
		 _onResume: function() {
			app.receivedEvent('resume');
		},

		/**
		 * deviceready Event Handler
		 * The scope of `this` is the event. In order to call the `receivedEvent`
		 * function, we must explicitly call `app.receivedEvent(...);`
		 * @private
		 */ 
		 _onResign: function() {
			app.receivedEvent('resign');
		},

		/** 
		 * Update DOM on a Received Event
		 * Cordova initialized. Start initialize of the application
		 */
		 receivedEvent: function(id) {
			switch (id) {
				case 'deviceready':
				$('body').addClass('deviceready');
				this.init();
				break;
				case 'resume':
				//implement
				break;
				case 'resign':
				//implement
				break;
				default:
				break;
			}
		},


		/** @private */
		_publishViews: function() {
			/**
			 * Load packages required for the app and initialize ROB.
			 * NOTE! doubly registered as r.js looks at the actual string to build the compiled-main.js
			 */
			 require([
                 
                 //router 
                 'router',
                 
				//views
				 'views/TopLevelView',
                 'views/SubLevelView',
                 'views/LoginView',
                  'views/MapsView',
                 'views/PersonView',


				], function(){

                   BSC.publishRouters([
                   'router'
                   ]);
                    
					BSC.publishViews([
                        'views/TopLevelView',
                         'views/SubLevelView',
						'views/LoginView',
                        'views/MapsView',
                         'views/PersonView',
						]);

					BSC.initialize();
				});
		 },
	 };

	

	// Mix Backbone.Events, modules, and layout management into the app object.
	return _.extend(app, {
		// Create a custom object with a nested Views object.
		module: function(additionalProps) {
			return _.extend({ Views: {} }, additionalProps);
		}
	}, Backbone.Events);

});
