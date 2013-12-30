define([
    'jquery',
    'underscore',
    'backbone',
    'global/Helper',
    'global/BaseView',   
    'models/NewsModel',
    'text!templates/newsitem.html'
], function($, _, Backbone,Helper,BaseView,NewsModel,template) {
    
    var NewsItemView = BaseView.extend({
        
        template: _.template(template),
        identifier: 'newsitem',
        model: NewsModel,
        events:{
            "click .nieuwsback": "back",
        },
        
        
        back: function(e){
            e.preventDefault();
            e.stopPropagation();
            Helper.go("#news"); 
        },   
        
        
        
        initialize: function () {   
            Helper.setPageContent('#newsitem-content', this.$el);    
            this.render();        
        },
        
        render: function () {
             this.statusBar();
            var id = this.id;
            if(window.newsCollection){
                this.model = window.newsCollection.get(id);
            }
            
            this.setElement($('#newsitem-content'));
            
            this.model.set("body",this.model.get("body").replace("/dotAsset/","http://www.sportindebuurt.nl/dotAsset/"));
            
            
            this.renderedView = this.template({"model":this.model});
            this.$el.html(this.renderedView);
            
            
            return this.renderedView;    
        }
                                       
                                       });           
    return NewsItemView;
});    