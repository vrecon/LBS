define([
    'jquery',
    'underscore',
    'backbone',
    'global/Helper',
    'global/BaseView',
    'models/ItemModel',    
    'text!templates/person.html',
], function($, _, Backbone,Helper,BaseView,ItemModel,template) {
    
    var PersonView = BaseView.extend({
        
        template: _.template(template),
        identifier: 'person',
        settings:[],
        events:{
            "touchend #icon_back":"back",
            "touchend .twitter": "twitter",
            "touchend .linkedin":"linkedin",
            "touchend .facebook":"facebook",
            "touchend .phone":"call",
            "touchend .mail":"mail",
            "touchend .sms":"sms",
        },
        
        
        call : function(e){
            e.preventDefault();
            e.stopPropagation();
            document.location.href = 'tel:'+this.model.get("Coach").MobileNr;
        },
        
        mail : function(e){
            e.preventDefault();
            e.stopPropagation();      
            document.location.href = 'mailto:'+this.model.get("Coach").Email;
        },
        
        sms : function(e){
            e.preventDefault();
            e.stopPropagation();      
            var number = this.model.get("Coach").MobileNr;
            var message = "";
            var intent = "INTENT"; //leave empty for sending sms using default intent
            var success = function () { console.log('Message sent successfully'); };
            var error = function (e) { console.log('Message Failed:' + e); };
            sms.send(number, message, intent, success, error);
        },
        
        back : function(e){
            e.preventDefault();
            e.stopPropagation();  
            Helper.go("#maps");
        },    
        
        twitter:function(e){
            e.preventDefault();
            e.stopPropagation();
            var self= this;
            window.clearTimeout(timer);
            
            timer = window.setTimeout(
                function(){
                    var ref = window.open('http://mobile.twitter.com/'+self.model.get("Coach").TwitterID, '_blank', 'location=yes');
                    ref.addEventListener('loadstart', function() {  });
                },450); 
            
        },
        
        linkedin : function(e){
            e.preventDefault();
            e.stopPropagation();
            var self = this;
            window.clearTimeout(timer);
            timer = window.setTimeout(
                function(){
                    var ref = window.open("http://"+self.model.get("Coach").LinkedInID, '_blank', 'location=yes');
                    ref.addEventListener('loadstart', function() {  });
                },450); 
            
        },
        
        facebook : function(e){
            e.preventDefault();
            e.stopPropagation();
            var self = this;
            window.clearTimeout(timer);
            timer = window.setTimeout(
                function(){
                    var ref = window.open("http://"+self.model.get("Coach").FacebookID, '_blank', 'location=yes');
                    ref.addEventListener('loadstart', function() {  });
                },450); 
            
        },
        
        initialize: function () { 
            Helper.setPageContent('#person-content', this.$el);
            this.render();    
        },
        render: function () {
            this.statusBar();
            var self = this;
             var id = self.id;
           
                var selectedPerson = window.localStorage.getItem("selectedPerson"); 
                this.model= new ItemModel(JSON.parse(selectedPerson));

             if(window.localStorage.getItem("device") !== "iPad"){    
                this.setElement($('#person-content'));
            }    
            this.$el.html(this.template({"model":this.model}));
            var height = window.innerHeight ;
            var width = window.innerWidth;
            var ios7height = 0;  
            if( $('body').has("ios") && parseInt(localStorage.getItem("deviceVersion")) >= 7.0){ 
                ios7height = -20;
            }
            
            $('.person').height(height*0.88+ios7height);
            if(window.localStorage.getItem("device") !== "iPad"){
                $('.person').width(width);
            }else{
                $('.person').width("370px");
            }    
            return this;    
        },
        
        
    });           
    return PersonView;
});    