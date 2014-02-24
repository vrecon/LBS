define([
    'jquery',
    'underscore',
    'backbone',
    'global/Helper',
     'global/BaseView',  
    'text!templates/toplevel.html',
    'text!templates/xml/worklocations.xml',    
"plugins/jquery.xml2json"
], function($, _, Backbone,Helper,BaseView,template,xmlWorkLocations) {
    
    var TopLevelView = BaseView.extend({
        
        template: _.template(template),
        identifier: 'toplevel',
        events:{
            "click .boxInner":"subLevel",
            "click .news":"news",
        },
        settings:"",
        
        
        news:function(e) {
            e.preventDefault();
            e.stopPropagation();
            var hash = e.target.id;
            Helper.go("#news");  
        },    
        
        initialize: function () {
            this.settings = JSON.parse(window.localStorage.getItem("settings"));    
            Helper.setPageContent('#toplevel-content', this.$el); 
            this.render();    
        },
        render: function () {
             this.statusBar();
            var topLevels = this.getTopLevels();
            this.setElement($('#toplevel-content'));
            this.$el.html(this.template({"topLevels":topLevels}));
            return this;    
        },
        getTopLevels : function(){
            var topLevels = [];
            for (var key in this.settings) {
                topLevels.push(key);
            }
            return topLevels;
        },
        subLevel:function (e) {
            e.preventDefault();
            e.stopPropagation();
            var hash = e.target.id;
            Helper.go("#sublevel/"+hash);      
        }, 
        
        
    });           
    return TopLevelView;
});    