define([
    'jquery',
    'underscore',
    'backbone',
    'global/Helper',
    'global/BaseView',    
    'text!templates/news.html',
    "plugins/jquery.xml2json"    
], function($, _, Backbone,Helper,BaseView,template) {
    
    var LoginView = BaseView.extend({
        
        template: _.template(template),
        identifier: 'news',
        events:{

        },
        


        initialize: function () {   
            Helper.setPageContent('#news-content', this.$el);    
            this.render();        
        },

        render: function () {
            
          
            
            this.setElement($('#news-content'));
            this.renderedView = this.template();
            this.$el.html(this.renderedView);
              $.ajax({
                    type: "GET",
                    url: "http://www.sportindebuurt.nl/contact/nieuws/xml-feed.html",
                    contentType: "text/xml",
                    dataType: "xml",
                    success: processSuccess,
                    error: processError
                });
            
             function processSuccess(data, status, req) {
                if (status == "success"){
                    data=$(data).find('news');
                    $('#mydiv').html(data);
                    alert('Done.');
                }
             }
              function processError(data, status, req) {
               
            }  
            
            return this.renderedView;    
        },
        

    });           
    return LoginView;
});    