define([
    'jquery',
    'underscore',
    'backbone',
    'global/Helper',
    'models/ItemModel',    
    'text!templates/person.html',
], function($, _, Backbone,Helper,ItemModel,template) {
    
    var PersonView = Backbone.View.extend({
        
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
            document.location.href = 'tel:'+this.model.get('MobileNr');
        },
        
        mail : function(e){
            e.preventDefault();
            e.stopPropagation();      
            document.location.href = 'mailto:'+this.model.get('Email');
        },
 
        sms : function(e){
            e.preventDefault();
            e.stopPropagation();      
            document.location.href = 'mailto:'+this.model.get('Email');
        },
        
        back : function(){
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
            var self = this;
            var worklocations = window.localStorage.getItem("worklocations");
            if(worklocations){
                var person = _.filter(JSON.parse(worklocations),function(location){
                    return location.ID == self.id;
                });    
                this.model= new ItemModel(_.first(person));
            }else{
                this.model= new ItemModel();
            }
            if(window.localStorage.getItem("device") !== "iPad"){
                this.setElement($('#person-content'));
            }    
            this.$el.html(this.template({"model":this.model}));
            var height = window.innerHeight ;
            var width = window.innerWidth;
            $('.person').height(height*0.88);
            $('.person').width(width);
            return this;    
        },
        
        
    });           
    return PersonView;
});    