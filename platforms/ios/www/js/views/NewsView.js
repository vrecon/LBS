define([
    'jquery',
    'underscore',
    'backbone',
    'global/Helper',
    'global/BaseView',    
    'collections/NewsCollection',
    'text!templates/news.html',
    "plugins/jquery.xml2json"    
], function($, _, Backbone,Helper,BaseView,NewsCollection,template) {
    
    var NewsView = BaseView.extend({
        
        template: _.template(template),
        identifier: 'news',
        events:{
            "click .meer": "readMore",
            "click .nieuwsback":"back"
        },
        
        
        back: function(e){
            e.preventDefault();
            e.stopPropagation();
            Helper.go("#toplevel"); 
        },    

        readMore : function(e){
            e.preventDefault();
            e.stopPropagation();
            var hash = e.target.id;
            Helper.go("#newsitem/"+hash);    
        },    

        initialize: function () {   
            Helper.setPageContent('#news-content', this.$el);    
            window.newsCollection = new NewsCollection();
            window.newsCollection.bind('reset', this.render, this);
            this.render();        
        },

        render: function () {

            this.setElement($('#news-content'));
            this.renderedView = this.template({"newsCollection":window.newsCollection});
            this.$el.html(this.renderedView);
            
            if(window.newsCollection.length < 1){
             window.newsCollection.fetch();   
            }    
             
            return this.renderedView;    
        },
        

    });           
    return NewsView;
});    