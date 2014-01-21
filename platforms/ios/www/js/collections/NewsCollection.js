define([
    'jquery',
    'underscore',
    'backbone',
    'models/NewsModel'
  
], function($, _, Backbone, NewsModel){
    var NewsCollection = Backbone.Collection.extend({
        initialize: function(){
        },
        model:NewsModel,
        url:'http://www.sportindebuurt.nl/contact/nieuws/xml-feed.html',
        
          fetch: function (options) {
        options = options || {};
        options.dataType = "xml";
        return Backbone.Collection.prototype.fetch.call(this, options);
    },
        parse: function(data) {
        data=$(data).find('news');
            var news = $.xml2json(data[0]);
            _.each(news.items.item,function(item){
              var dat = item.datum.substring(0,10);
             var splititem = dat.split("-");
            item.datum = splititem[2]+"-"+splititem[1]+"-"+splititem[0];    
            });
        return news.items.item;
    }

    });
 
    return NewsCollection;
});