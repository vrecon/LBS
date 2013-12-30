// Filename: router.js
define([
    'jquery',
    'underscore',
    'backbone',
    'global/Helper',
    'global/BaseRouter',
    'views/LoginView',
    'views/TopLevelView',
    'views/SubLevelView',
    'views/MapsView',
    'views/PersonView',
    'views/NewsView'
], function($, _, Backbone,Helper,BaseRouter,LoginView,TopLevelView,SubLevelView,MapsView,PersonView,NewsView) {
    
    var AppRouter = BaseRouter.extend({
        
        
        routes: { 
            "": 'login',
            "login": 'login',
            "toplevel":"metro",
            "sublevel/:id":"subMetro",
            "maps": "maps",
            "person/:id":"person",
            "news":"news"
        },
        
        
        news:function(){
         var self = this;
             if(this.checkForToken()){
            Helper.showPage('#news', function(){
                if( self.viewManager.getView('news')){
                    var view =  self.viewManager.getView('news');
                }else{
                    var view = self.viewManager.addView('news' ,new NewsView());  
                }
                
            });     
             }
        },
        
        
        login : function(){
         var self = this;
             var token = window.localStorage.getItem("token");
            Helper.showPage('#login', function(){
                if( self.viewManager.getView('login')){
                    var view =  self.viewManager.getView('login');
                }else{
                    var view = self.viewManager.addView('login' ,new LoginView());  
                }
                
            });     
        },
        metro : function(){
            var self = this;
            if(this.checkForToken()){
                Helper.showPage('#toplevel', function(){
                    if( self.viewManager.getView('metro')){
                        var view =  self.viewManager.getView('toplevel');
                    }else{
                        var view = self.viewManager.addView('toplevel' ,new TopLevelView());  
                    }
                      var removeView =  self.viewManager.getView('sublevel');
                     removeView.$el[0].innerHTML = "";
                }); 
            }    
        },
        subMetro : function(id){
            var self = this;
            if(this.checkForToken()){
                Helper.showPage('#sublevel', function(){
                   // var mapsView = self.viewManager.deleteView('maps');
                    var view = self.viewManager.addView('sublevel' ,new SubLevelView({"id":id}));  
                }); 
            }    
        },    
        maps : function(){
            var self = this;
            if(this.checkForToken()){
                Helper.showPage('#maps', function(){
                 //if( self.viewManager.getView('maps')){
                //       var view = self.viewManager.getView('maps' ,new MapsView());     
                //    }else{
                       var view = self.viewManager.addView('maps' ,new MapsView());  
                        view.updateMap(); 
                //    } 
                         
               
                }); 
            }
        },   
        person : function(id){
            var self = this;
            if(this.checkForToken()){
                Helper.showPage('#person', function(){
                    var view = self.viewManager.addView('person' ,new PersonView({"id":id}));  
                }); 
            }
        }, 
        
        checkForToken : function(){
            var token = window.localStorage.getItem("token");
            if(!token ||  token==""){
                this.login();
                return false;
            }   
            return true;
        }    
    });
    return AppRouter;
});
