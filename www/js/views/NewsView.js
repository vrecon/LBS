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
    
    var LoginView = BaseView.extend({
        
        template: _.template(template),
        identifier: 'news',
        events:{

        },
        


        initialize: function () {   
            Helper.setPageContent('#news-content', this.$el);    
            this.newsCollection = new NewsCollection();
            this.newsCollection.bind('reset', this.render, this);
            this.render();        
        },

        render: function () {
            
          
            
            this.setElement($('#news-content'));
            this.renderedView = this.template();
            this.$el.html(this.renderedView);
            
            if(this.newsCollection.length < 1){
             this.newsCollection.fetch();   
            }    
             
            return this.renderedView;    
        },
        

    });           
    return LoginView;
});    