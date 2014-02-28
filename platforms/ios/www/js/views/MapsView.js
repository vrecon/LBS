define([
    'jquery',
    'underscore',
    'backbone',
    'gmap',
    'global/Helper',
    'global/BaseView',  
    'collections/Collection',
    'models/ItemModel',
    'views/PersonView',
    'text!templates/maps.html',
    'text!templates/xml/worklocations.xml', 
    'text!templates/ipadperson.html', 
], function($, _, Backbone, googleMap,Helper,BaseView,mapCollection,mapModel,PersonView,mapTemplate,xmlWorkLocations,ipadperson){
    
    var MapsView = BaseView.extend({
        template:_.template(mapTemplate),
        identifier: 'maps',
        model:null,
        
        events:{
            "touchstart .icon-menu":"menu",
            "touchstart .icon-cancel":"rmPopupSectors",
            "touchstart .icon-glass":"popupSectors",  
            "touchstart .rmsector":"rmPopupSectors",
            "touchstart .sector":"popupSectors",    
            "touchend .more":"person",
            "touchstart .locatie":"locatie",
            "touchstart #popUpDiv li":"reupdate",
            "touchstart #map-canvas":"hideUnder"
        },    
        
        
        hideUnder: function(e){
            e.preventDefault();
            e.stopPropagation();
            var height = window.innerHeight 
            $('#map-canvas').height(height);
            $("#popUpPerson").hide();
            $('#under_map').hide();
        },
        
        locatie : function(e){
            e.preventDefault();
            e.stopPropagation();
            this.map.setCenter(this.latlng);
        },
        
        menu : function(e){
            e.preventDefault();
            e.stopPropagation();
            Helper.go("#toplevel");
        },
        
        person : function(e){
            e.preventDefault();
            e.stopImmediatePropagation();
            var self=this;
            window.clearTimeout(timer);

            timer = window.setTimeout(
                function(){
                    self.model= new mapModel(JSON.parse(localStorage.getItem("selectedPerson")));
                        Helper.go("#person/"+self.model.get("ID"));
                },450); 
            
        },
        
        popupSectors : function(e){
            e.preventDefault();
            e.stopPropagation();
            $(".sector").addClass("rmsector");
            $(".sector").removeClass("sector");
            $(".icon-glass").addClass("icon-cancel");
            $(".icon-glass").removeClass("icon-glass");
            $(".sector").removeClass("sector");
            $("#popUpPerson").hide();
            $("#popUpDiv").show();
                                   
        },    
        
        rmPopupSectors : function(e){
            e.preventDefault();
            e.stopPropagation();
            $(".icon-cancel").addClass("icon-glass");
            $(".icon-cancel").removeClass("icon-cancel");
            $(".rmsector").addClass("sector");
            $(".rmsector").removeClass("rmsector");
            $("#popUpDiv").hide();
        },   
        
        initialize: function(){
            Helper.setPageContent('#maps-content', this.$el);  
            this.render();
        },
        
        render: function(){
            this.statusBar();
            this.setElement($('#maps-content'));    
            this.renderedView = this.template();
            this.$el.html(this.renderedView);
            var height = window.innerHeight ;
            var width = window.innerWidth;
            $('#map-canvas').height(height);
            $('#map-canvas').width(width);
            return this.renderedView;
        },
        
        
        reupdate : function(e){
            e.preventDefault();
            e.stopPropagation();
            var id = e.currentTarget.id;
            $("#under_map").hide();
            var height = window.innerHeight ;
            $('#map-canvas').height(height);
            window.localStorage.removeItem("selectedPerson");
            localStorage.setItem("currentSector",id);
            this.updateMap();
            this.rmPopupSectors(e);
        },    
        
        updateMap : function(){
            var self = this;
            setTimeout(function(){
                function geoloc(success, fail){
                    var is_echo = false;
                    if(navigator && navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            function(pos) {
                                if (is_echo){ return; }
                                is_echo = true;
                                success(pos.coords.latitude,pos.coords.longitude);
                            }, 
                            function() {
                                if (is_echo){ return; }
                                is_echo = true;
                                fail();
                            }
                        );
                    } else {
                        fail();
                    }
                }
                
                function success(lat, lng){
                    
                    self.latlng = new google.maps.LatLng(lat, lng); 
                    var mapOptions = {
                        zoom: 12,
                        center: self.latlng,
                        disableDefaultUI: true,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    self.map = new google.maps.Map(document.getElementById("map-canvas"),
                                                   mapOptions);   
                    // Create marker 
                    self.collection = new mapCollection();
                    self.getMarkers(lat,lng);
                    
                    
                } 
                
                function fail(){
                    alert("failed");
                }
                
                geoloc(success, fail);
                
                
                
            }, 100);   
            
            
            
        },
        
        getMarkers :function(lat,lng){
            var self = this;
            var currentSector = window.localStorage.getItem("currentSector");
            
            var createXML = function() {
                
                return _.template(xmlWorkLocations, {
                    token :  window.localStorage.getItem("token"),
                    latitude : lat,
                    longitude :lng,
                    sector:currentSector,
                    radius:0
                });
            };
            var soapRequest = createXML(); 
            var wsUrl = "http://bsc-api.viperonline.nl/secureservices/export.asmx?op=GetWorkLocations";
            $.ajax({ 
                type: "POST",
                url: wsUrl,
                contentType: "text/xml",
                dataType: "xml",
                data: soapRequest,
                success: processSuccess,
                error: processError
            });
            
            function processSuccess(response, status, req) {
                
                if (status == "success"){
                    json = $.xml2json(response);
                    var errorCode = json.Body.GetWorkLocationsResponse.GetWorkLocationsResult.ErrorCode
                    if(errorCode != "0"){
                        window.localStorage.removeItem("token");
                        Helper.go("#login");
                        return;
                    }    
                    
                    
                    var workLocation =json.Body.GetWorkLocationsResponse.GetWorkLocationsResult.Locations.WorkLocation;
                    window.localStorage.setItem("worklocations",JSON.stringify(workLocation));    
                    self.collection.reset(workLocation);
                    //   self.collection.bind("reset", function(){self.render();}, self);
                    self.drawMarkers(self);
                    google.maps.event.trigger(self.map, "resize");
                    if(!localStorage.getItem("selectedPerson")){
                        self.map.setZoom( self.map.getZoom() );
                        self.map.setCenter(new google.maps.LatLng(lat,lng));
                    }
                }
            }
            
            function processError(data, status, req) {
                alert(req.responseText + " " + status);
            }     
        },
        
        drawMarkers: function(self){
            var indexes = self.findDuplicates(self.collection);
            _.each(self.collection.models,function(coords,i){
                var adjusted_lat,adjusted_lon;
                if(indexes.indexOf(i) != -1){
                    adjusted_lat = parseFloat(coords.get("GeoLatitude")) + (Math.random() -.5) / 750;
                    adjusted_lon = parseFloat(coords.get("GeoLongitude")) + (Math.random() -.5) / 750;   
                }else{
                    adjusted_lat = coords.get("GeoLatitude");
                    adjusted_lon = coords.get("GeoLongitude");
                }    
                var loc = new google.maps.LatLng(adjusted_lat, adjusted_lon);
                var marker = new google.maps.Marker({
                    position: loc,
                    map: self.map,
                    title:coords.get("ID")
                });
                google.maps.event.addListener(marker, 'click', function() {
                    self.map.setZoom(14);
                    self.model=coords;
                                              
                      localStorage.setItem("selectedPerson",JSON.stringify(self.model));
                    if(window.localStorage.getItem("device") === "iPad"){
                        self.showPerson();
                    }else{
                        self.showPersonPhone(self.map,coords);
                    }   
                    
                    self.map.setCenter(marker.getPosition());
                });     
                
            });
            
  
        },
        
        showPersonPhone: function(map,coords){
            var height = window.innerHeight ;
            $('#map-canvas').height(height*0.75);
            $('#under_map').show();
            $("#bscname").html((coords.get("Coach").Clamourname+" "+coords.get("Coach").MiddleName).trim() +" "+coords.get("Coach").Surname);
            $("#bscorganisation").html(coords.get("Name"));  
            var loc = new google.maps.LatLng(coords.get("GeoLatitude"), coords.get("GeoLongitude"));
            map.setCenter(loc);
        },
        
        showPerson : function(){
            var view = new PersonView();
            view.template =  _.template(ipadperson),
            view.setElement("#popUpPerson");
           localStorage.setItem("selectedPerson",JSON.stringify(this.model));
            view.render(); 
            $("#popUpPerson").show();
        },
        
        findDuplicates : function(collection){
            
            var modelArray = [];
            _.each(collection.models,function(model) {
                var a = model.get("GeoLongitude");
                modelArray.push(a);    
            });
            
            var lowest = Math.min.apply(Math, modelArray);     //Find the lowest number
            var count = 0;                                //Set a count variable
            var indexes = [];              //New array to store indexes of lowest number
            
            for(var i=0; i<modelArray.length;i++) //Loop over your array
            {
                if(modelArray[i] == lowest) //If the value is equal to the lowest number
                {
                    indexes.push(i); //Push the index to your index array
                    count++;         //Increment your counter
                }
            }
            
            
            return indexes;
        },    
        
    });
    return MapsView;
});