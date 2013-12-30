    define([
    'jquery',
    'underscore',
    'backbone',
    'global/Helper',       
    'text!templates/sublevel.html',
    ], function($, _, Backbone,Helper,template) {
    
    var SubLevelView = Backbone.View.extend({
    
        template: _.template(template),
        identifier: 'sublevel',
         settings:[],
        events:{
            "click .boxInner":"maps",
            "click #back":"home"
        },
    
        maps:function (e) {
            e.preventDefault();
            e.stopPropagation();
            var hash = e.currentTarget.id;
            window.localStorage.setItem("currentSector",hash);
              Helper.go("#maps");
    
        },
        home : function(){
            Helper.go("#toplevel");
        }   , 
        
        initialize: function () {
            this.settings = JSON.parse(window.localStorage.getItem("settings"));    
            Helper.setPageContent('#sublevel-content', this.$el); 
            this.render();    
        },
        render: function () {
            var subLevels = this.getSubLevel(this.id);
            this.setElement($('#sublevel-content'));
            if(subLevels){
                this.$el.html(this.template({"id":this.id.toLowerCase(),"subLevels":subLevels}));
            }
            return this;    
        },
        getSubLevel :function(id){
            if(!id){
            return "";
            }    
            return this.settings[id];
                },     
    
        });           
        return SubLevelView;
    });    