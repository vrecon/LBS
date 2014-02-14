define([ 
    'jquery', 
    'underscore', 
    'backbone', 
], function($, _, Backbone) {
    'use strict'; // Using ECMAScript 5 strict mode during development

    /**
     * Helper object.
     * @name Helper
     * @namespace
     */
    var PushHelper = {
 

 
 showAlert : function(message, title) {
  if(navigator.notification) {
   navigator.notification.alert(message, null, title, 'Close');
   navigator.notification.vibrate(1000);
  }else{
   alert(title ? (title + ": " + message) : message);
  }
 },
 
 addCallback : function(key, callback) {
  if(window.callbacks === undefined) {
   window.callbacks = {};
  }
  window.callbacks[key] = callback;
 },
 
 addNotification : function(notificationTxt) {
  console.log('notification added to DOM');
  var el = document.getElementById('notification');
  el.innerHTML += notificationTxt;
 },
 
 registrationSuccessHandler : function(token) {
  console.log('successful registration with a return token: ' + token);
     console.log('device token = ' + token);
                 var sendInfo = { "token": token,"device":"IOS"};

  
                 $.ajax({
                    type: "POST",
                    url: "http://107.20.81.173:3011/pushid",
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify(sendInfo),
                    success: processSuccess,
                    error: processError
                });
                
            function processSuccess(data, status, req) {
                if (status == "success"){
                   console.log("success");
                }
          
              }

            function processError(data, status, req) {
                console.log(req.responseText + " " + status);
            }  
        
  this.addCallback('PushHelper.notificationHandler', PushHelper.notificationHandler);
 },
 
 registrationFailedHandler : function(error) {
  this.showAlert(error, "Error");
 },
 
 notificationHandler : function(evt) {
  console.log("received a notification: " + evt.alert);
  navigator.notification.beep(3);
  if(evt.alert) {
   this.addNotification(evt.alert);
  }
  if(evt.prop){
   this.addNotification(" received a special property: " + evt.prop);
  }
 },

 
registerAndroid : function(){
	var self = this;

	 window.PushHelper = this;
	 window.plugins.pushNotification.register(
         successHandler,
         errorHandler, {
             "senderID":"118540777579",
             "ecb":"PushHelper.onNotificationGCM"
         });
	 
     function successHandler (token) {
       		 self.addCallback('PushHelper.onNotificationGCM', self.onNotificationGCM);
    	 }
     
     function errorHandler (error) {
         alert('error = ' + error);
     }
	

},

// Android
onNotificationGCM : function(e) {

    switch( e.event )
    {
        case 'registered':
            if ( e.regid.length > 0 )
            {
                
            	var sendInfo = { "token": e.regid,"device":"android"};

                
                $.ajax({
                   type: "POST",
                   url: "http://107.20.81.173:3011/pushid",
                   contentType: "application/json",
                   dataType: "json",
                   data: JSON.stringify(sendInfo),
                   success: console.log("success"),
                   error: console.log("error")
               });
                
            }
            break;
            
        case 'message': 
 
        	 alert(e.message);
            
            break;
            
        case 'error':
        	alert("GCM error");
            break;
            
        default:
        	alert("Unknown event was triggered");
            break;
    }
},



registerIOS : function() {
 window.plugins.pushNotification.register(self.registrationSuccessHandler,
                           self.registrationFailedHandler, {
                           "badge":"true",
                           "sound":"true",
                           "alert":"true",
                           "ecb":"PushHelper.notificationHandler"
                           });
},
 
    };

    return PushHelper;
});