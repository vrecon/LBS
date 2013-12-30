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
            "touchend .phone":"call",
            "touchend .mail":"mail",
            
        },
        
        
        call : function(e){
            e.preventDefault();
            e.stopPropagation();
            document.location.href = 'tel:+31612345678';
        },
        
        mail : function(e){
            e.preventDefault();
            e.stopPropagation();      
            document.location.href = 'mailto:test@vrecon.nl';
        },
        
        back : function(){
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
        
        initialize: function () { 
            Helper.setPageContent('#person-content', this.$el); 
            this.render();    
        },
        render: function () {
            var self = this;
            if(window.localStorage.getItem("worklocations") && window.localStorage.getItem("worklocations")!= undefined){
                var person = _.filter(JSON.parse(window.localStorage.getItem("worklocations")),function(location){
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
            $('.person').height(height*0.83);
            $('.person').width(width);
            return this;    
        },
        
        
    });           
    return PersonView;
});    