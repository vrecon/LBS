define([
    'jquery',
    'underscore',
    'backbone',
    'models/NewsModel'
  
], function($, _, Backbone, NewsModel){
    var NewsCollection = Backbone.Collection.extend({
        initialize: function(){
        },
        url:'http://www.sportindebuurt.nl/contact/nieuws/xml-feed.html',
        
    fetch: function (options) {
        options = options || {};
        options.dataType = "xml";
        return Backbone.Collection.prototype.fetch.call(this, options);
    },
        parse: function(data) {
            data=$(data).find('news');
            var news = $.xml2json(data);
        return news.items;
    }

    });
 
    return NewsCollection;
});