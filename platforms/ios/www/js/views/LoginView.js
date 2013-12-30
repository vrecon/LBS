define([
    'jquery',
    'underscore',
    'backbone',
    'global/Helper',
    'global/BaseView',    
    'text!templates/login.html',
    'text!templates/xml/logon.xml',    
    "i18n!nls/settings",
    "models/SettingsModel",
    "models/LoginModel",
"plugins/jquery.xml2json"    
], function($, _, Backbone,Helper,BaseView,template,xmlLogonInfo,settings,SettingsModel,LoginModel) {
    
    var LoginView = BaseView.extend({
        
        template: _.template(template),
        identifier: 'login',
        events:{
            'submit': 'login',
            "change input" :"changed",
            'focus input' : 'focus',
             'blur input':'unfocus',
            'keypress input[type=password]': 'processKey'   
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
            if( $('body').has("ios") && parseInt(localStorage.getItem("deviceVersion")) >= 7.0){ 
                $(".pages").css("margin-top", "20px");
            }    
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
    });           
    return LoginView;
});    