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
            MobileNr:"",
            MiddleName:" ",
            Community:"Den Haag",
            ExtraCommunity:" ",
            FacebookID:"",
            LinkedInID:"",
            TwitterID:"",
                  
            },    
            
            },
            
          });
       return ItemModel;

});    