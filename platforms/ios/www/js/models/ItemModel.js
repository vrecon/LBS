 define([
	'jquery',
	'underscore',
	'backbone',
 	], function($, _, Backbone) {
        var ItemModel = Backbone.Model.extend({
            defaults:{
            Name:" ",
            Address:" ",
            ZipCode:" ",    
            Residence:" ",
            Sector:" ",    
            Description:" ",
            Surname:"",
            Coach:{
            Clamourname:"",    
            Email:"",
            MobileNr:"",
            MiddleName:" ",
            Community:" ",
            ExtraCommunity:" ",
            FacebookID:"",
            LinkedInID:"",
            TwitterID:"",
                  
            },    
            
            },
            
          });
       return ItemModel;

});    