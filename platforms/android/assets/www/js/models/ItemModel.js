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
            Surname:"Persoon",
            Coach:{
            Clamourname:"Test",    
            Email:"test@vrecon.nl",
            MobileNr:"06-12345678",
            MiddleName:" ",
            Community:"Den Haag",
            ExtraCommunity:" ",
            LinkedInID:" ",
            TwitterID:" "    
            },    
            
            },
            
          });
       return ItemModel;

});    