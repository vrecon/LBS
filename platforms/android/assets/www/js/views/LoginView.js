define([
    'jquery',
    'underscore',
    'backbone',
    'global/Helper',
    'global/PushHelper',
    'global/BaseView',    
    'text!templates/login.html',
    'text!templates/xml/logon.xml',    
    "i18n!nls/settings",
    "models/SettingsModel",
    "models/LoginModel",
"plugins/jquery.xml2json"    
], function($, _, Backbone,Helper,PushHelper,BaseView,template,xmlLogonInfo,settings,SettingsModel,LoginModel) {
    
    var LoginView = BaseView.extend({
        
        template: _.template(template),
        identifier: 'login',
        events:{
            'submit': 'login',
            "change input" :"changed",
            'focus input' : 'focus',
             'blur input':'unfocus',
            'keypress input[type=password]': 'processKey',
            'touchstart #register':"register"
        },
        
        
        register : function(e){
          e.preventDefault();
            e.stopPropagation();
            var self = this;
            window.clearTimeout(timer);
            timer = window.setTimeout(
                function(){
                    var ref = window.open("http://www.sportindebuurt.nl/contact/registreren/" , '_blank', 'location=yes');
                    ref.addEventListener('loadstart', function() {  });
                },450); 

        },    
        
        changed:function(evt) {
            var changed = evt.currentTarget;
            var value = $(evt.currentTarget).val();
            var obj = {};
            obj[changed.id] = value;
            this.model.set(obj);
        },  
        login:function (event) {
            $(".password").blur();
             var self = this;
            var createXML = function() {
               
                return _.template(xmlLogonInfo, {
                    username : self.model.get("username"),
                    password :self.model.get("password")
                });
            };
            var soapRequest = createXML(); 
              var wsUrl = "http://bsc-api.viperonline.nl/secureservices/export.asmx?op=AuthenticateUserExtended";
             $.ajax({
                    type: "POST",
                    url: wsUrl,
                    contentType: "text/xml",
                    dataType: "xml",
                    data: soapRequest,
                    success: processSuccess,
                    error: processError
                });
            
              function processSuccess(data, status, req) {
                if (status == "success"){
                    window.localStorage.setItem("token",$(req.responseText).find("Token").text());
                    json = $.xml2json(data);
                 var currentUser =json.Body.AuthenticateUserExtendedResponse.AuthenticateUserExtendedResult.CurrentUser;
                  window.localStorage.setItem("currentUser",JSON.stringify(currentUser));  
                    
                    if(window.localStorage.getItem("token")!= "Invalid Username or Password"){   
                      // self.registerPushNotification();
                       PushHelper.register();
                        Helper.go("#toplevel");
                    }else{
                    self.render();
                    }    
                }
          
              }

            function processError(data, status, req) {
                alert(req.responseText + " " + status);
            }  
        
        },
        initialize: function () {
            this.setUserSettings();    
            Helper.setPageContent('#login-content', this.$el);   
            this.render();        
        },
        focus: function(e){
            e.preventDefault();
            e.stopPropagation();
            $('.logo').hide();
            
        },
        unfocus: function(e){
            e.preventDefault();
            e.stopPropagation();
     $('.logo').show();
            
        },
        
        processKey: function(e) { 
            if (e.keyCode != 13) return;
            this.login();
        },
        render: function () {
             this.statusBar();
            this.model = new LoginModel();
            this.setElement($('#login-content'));
            var token = window.localStorage.getItem("token");
            this.renderedView = this.template({"token":token,"model":this.model});
            this.$el.html(this.renderedView);
            return this.renderedView;    
        },
        
        setUserSettings : function(){
            var model = new SettingsModel(settings);        
            window.localStorage.setItem("settings",JSON.stringify(model));  
        },
        
        
        
        
        
        
        
        
        
        
         registerPushNotification : function(){
            var pushNotification = window.plugins.pushNotification;
            if ( $("body").hasClass('android'))
            {
                
                
                pushNotification.register(
                    successHandler,
                    errorHandler, {
                        "senderID":"replace_with_sender_id",
                        "ecb":"onNotificationGCM"
                    });
            }
            else
            {
                pushNotification.register(
                    tokenHandler,
                    errorHandler, 
                    {
                        "badge":"true",
                        "sound":"true",
                        "alert":"true",
                        "ecb": "onNotificationAPN",
                    });
                
                     // handle APNS notifications for iOS
            function onNotificationAPN(e) {
                if (e.alert) {
                     $("#app-status-ul").append('<li>push-notification: ' + e.alert + '</li>');
                     navigator.notification.alert(e.alert);
                }
                    
                if (e.sound) {
                    var snd = new Media(e.sound);
                    snd.play();
                }
                
                if (e.badge) {
                    pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
                }
            }
            }
            function successHandler (result) {
                alert('result = ' + result);
            }
            function errorHandler (error) {
                alert('error = ' + error);
            }
            function tokenHandler (result) {
                // Your iOS push server needs to know the token before it can push to this device
                // here is where you might want to send it the token for later use.
               
       console.log("klaar");
            }
            
           
            
            // Android
            function onNotificationGCM(e) {
                $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');
                
                switch( e.event )
                {
                    case 'registered':
                        if ( e.regid.length > 0 )
                        {
                            $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
                            // Your GCM push server needs to know the regID before it can push to this device
                            // here is where you might want to send it the regID for later use.
                            console.log("regID = " + e.regid);
                        }
                        break;
                        
                    case 'message':
                        // if this flag is set, this notification happened while we were in the foreground.
                        // you might want to play a sound to get the user's attention, throw up a dialog, etc.
                        if ( e.foreground )
                        {
                            $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');
                            
                            // if the notification contains a soundname, play it.
                            var my_media = new Media("/android_asset/www/"+e.soundname);
                            my_media.play();
                        }
                        else
                        {  // otherwise we were launched because the user touched a notification in the notification tray.
                            if ( e.coldstart )
                            {
                                $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
                            }
                            else
                            {
                                $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                            }
                        }
                        
                        $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
                        $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
                        break;
                        
                    case 'error':
                        $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
                        break;
                        
                    default:
                        $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
                        break;
                }
            }
            
            
            
        },    
    });           
    return LoginView;
});    