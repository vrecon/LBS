    define([
    'jquery',
    'underscore',
    'backbone',
    'global/Helper',      
    'global/BaseView',    
    'text!templates/sublevel.html',
    ], function($, _, Backbone,Helper,BaseView,template) {
    
    var SubLevelView = BaseView.extend({
    
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
            var currentSectorName = e.currentTarget.getAttribute("data");
            window.localStorage.setItem("currentSector",hash);
            window.localStorage.setItem("currentSectorName",currentSectorName);
              Helper.go("#maps");
    
        },
        home : function(e){
            e.preventDefault();
            e.stopPropagation();
             $("#sublevel-content").removeClass();
            Helper.go("#toplevel");
        }, 
        
        initialize: function () {
            this.settings = JSON.parse(window.localStorage.getItem("settings"));    
            Helper.setPageContent('#sublevel-content', this.$el); 
            this.render();    
        },
        render: function () {
            this.statusBar();
            var subLevels = this.getSubLevel(this.id);
            window.localStorage.removeItem("selectedPerson");
            if(this.id){
                $("#sublevel-content").removeClass();
                $('#sublevel-content').addClass(this.id.toLowerCase());
            }
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