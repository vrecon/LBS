define([
    'jquery',
    'underscore',
    'backbone',
    'models/ItemModel',
  
], function($, _, Backbone, mapModel,xmlWorkLocations){
    var mapCollection = Backbone.Collection.extend({
        initialize: function(){
        },
        model: mapModel,   
    });
 
    return mapCollection;
});