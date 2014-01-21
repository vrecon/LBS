define([ 
    'jquery', 
    'underscore', 
    'backbone', 
    'text!../templates/baseTemplate.html'  
], function($, _, Backbone, baseTemplate) {
    'use strict'; // Using ECMAScript 5 strict mode during development

    /**
     * Helper object.
     * @name Helper
     * @namespace
     */
    var Helper = {

        cssTransitionCheck : "WebKitTransitionEvent" in window,

        baseTemplate: _.template(baseTemplate),

        body: $('body'),

        activePageClass: 'active-page',
        
        
        
        
        /**
         * @name Helper#silentGo
         * @function
         * Change the window.location.hash value. Additional arguments are added as subpath of hash e.g.
         * @example <code>silentGo('foo', 'bar')</code> will change the hash to <code>/foo/bar</code> .
         * @name Helper#silentGo
         * @function
         * 
         * @param {String} hash the hash to change window.location.hash to
         */
        silentGo : function(hash) {
            for ( var o = [], m = 1, w = arguments.length; m < w; m++) {
                o.push(arguments[m]);
            }
            hash.match(/#/) || (hash = '#' + hash);
            if (o.length) {
                hash += '/' + o.join('/');
            }
            window.location.hash = hash;

        },


        /**
         * Change the window.location.hash value. Additional arguments are added as subpath of hash e.g.
         * @name Helper#go
         * @function
         * @example <code>go('foo', 'bar')</code> will change the hash to <code>/foo/bar</code> .
         * @name Helper#go
         * @function
         * 
         * @param {String} hash the hash to change window.location.hash to
         */
        go : function(hash) {
            for ( var o = [], m = 1, w = arguments.length; m < w; m++) {
                o.push(arguments[m]);
            }
            Helper.silentGo.apply(Helper, arguments);
        },

         /**
         * Get the root of a hash.
         *
         * @param {!String} path
         * @returns {String}
         */
        getRootPath : function(path) {
            var result = path;
            if (path.match(/\//)) {
                result = path.split(/\//)[0];
            }
            return result;
        },

        /**
         * Check if a hash is the current active page.
         *
         * @param {!String} path
         * @returns {boolean}
         */
        isPageActive : function(path) {
            path = this.getRootPath(path).replace(/#/, "");
            if (this.activePage) {
                return this.activePage.attr("id") === path;
            }
        },

        showPage : function(path, callback, navigate) {
            var wrappedCallback = function() {
                if (callback && typeof (callback) === "function") {
                    callback.call(this);
                }
            };

            if (this.isPageActive(path)) {
                wrappedCallback();
            }
            else {
                var rootPath = this.getRootPath(path).replace(/#/, "");

                this.initializePage(path);
                this.changePage(path, null, wrappedCallback, navigate);
            }
        },

                /**
         * Adds a 'page' to the DOM if needed.
         *
         * @private
         * @param {!String} path
         */
        initializePage : function(path) {
            var rootPath = this.getRootPath(path), page = rootPath.replace(/#/, "");

            var app = $("#pages");
            if (!$(rootPath).length) {
                var element = this.baseTemplate({
                    path : page
                });
                app.append(element);
            }
        },

        /**
         * Do the actual change of one page to another page.
         *
         * @private
         * @param {!String} path
         * @param {?String} transition
         * @param {function()} callback
         * @param {?Object} options the options for the page change. Can contain: changeHash
         */
        changePage : function(path, transition, callback, options) {
            var self = this, rootPath = this.getRootPath(path), currentPage = this.activePage, page = $(rootPath);


            // TODO if native no transitions
            if(!transition) { transition = this.activePage ? "slide" : false; }

            var callBackWrapper = function() {
                self.activePage = page;
                $("html").removeClass("ui-mobile-rendering");
                if(currentPage) {
                    $('.'+ self.activePageClass).removeClass(self.activePageClass);
                    page.addClass(self.activePageClass);
                }
                if(callback) {callback.call(self);}
            };

            // TODO move to global feature detection
            var transitionCheck = (function() {
                return (window.hasOwnProperty("WebKitTransitionEvent"));
            }());

            if (transitionCheck && transition) {
                this._animateTo(path, page, transition, false, callBackWrapper);
            } else {
                page.addClass(self.activePageClass);
                callBackWrapper();
            }
        },

        animationComplete : function(page, callback) {
            if (this.cssTransitionCheck) {
                return $(page).one("webkitAnimationEnd", callback);
            } else {
                setTimeout(callback, 0);
                return $(this);
            }
        },
        
        transitionComplete : function(selector, callback) {
            if (this.cssTransitionCheck) {
                return $(selector).one("webkitTransitionEnd", callback);
            } else {
                setTimeout(callback, 0);
                return $(this);
            }
        },

        _animateTo : function(path, page, transition, reverse, callBack) {
            var self = this;

            window.scroll(0,0);
            var _animateToPage = function(){
                
                var currentPage = self.activePage,
                    pageBody = self.body;

                if (currentPage.length) {
                    currentPage.addClass(transition + " out " + (reverse ? "reverse" : ""));
                }
                pageBody.addClass("transitioning");
                page.addClass(self.activePageClass + " " + transition + " in " + (reverse ? "reverse" : ""));

                self.animationComplete(page, function() {
                    window.scroll(0,0);
                    page.removeClass(transition + " in out reverse ");
                    currentPage.removeClass(self.activePageClass + " " + transition + " in out reverse ");
                    pageBody.removeClass("transitioning");
                    
                if(callBack) {callBack.call(page);}
                });


            };
            
            _animateToPage();
 
        },

        /**
         * Creates an object containing information about the App Host.
         * @name Helper#getAppHost
         * @function
         * @parameter protocol
         * @return {Object} Application Host Object
         * */
        getAppHost : function() {
            var location = window.location, port = parseInt(location.port, 10);
            if (isNaN(port) || port <= 0) {
                port = null;
            }

            return {
                protocol : location.protocol,
                host : location.hostname,
                port : port
            };
        },
        /**
         * Creates an random 4 digit number
         * @return {Number} S4
         */
        S4: function S4() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        },
        /** creates an unique GUID
         * @name Helper#guid
         * @function
         * @return {String} GUID String
         * */
        guid: function guid() {
            return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
        },
        /**
         * Append content to a specific location in the DOM.
         * @name Helper#setPageContent
         * @function
         * @param {String} selector
         * @param {jQuery} content
         */
        setPageContent : function(selector, content) {
            $(selector).html('');
            $(selector).append(content);
        },

        /**
         * The application wide Pub/Sub channel. Using this will ensure all Backbone extended classes can subscribe to
         * events in the channel. Other modules having access to the channel can also listen to events.
         * @name Helper#pubsub
         * @field
         * @private
         * @lends {Backbone.Events} Backbone.Events
         */
        pubsub : _.extend(/**@lends Backbone.Events*/{}, Backbone.Events),

        storeLastRetrievedHash : function(fragment) {
            console.log('STORRING HASH ' + fragment);
            localStorage.setItem('last-retrieved-hash', fragment);
        },
        loadingFirstPage : function() {
            console.log('loadingFirstPage true' );
            localStorage.setItem('firstPageLoading', true);
        },
        isLoadingFirstPage : function() {
            console.log('isLoadingFirstPage' + (localStorage.getItem('firstPageLoading') !== 'false'));
            return localStorage.getItem('firstPageLoading') !== 'false';
        },
        
        
    };

    return Helper;
});