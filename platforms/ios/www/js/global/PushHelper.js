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
                 var sendInfo = { "token": token};

  
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
 
register : function() {
var self= this;
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