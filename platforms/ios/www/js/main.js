// Author: Thomas Davis <thomasalwyndavis@gmail.com>
// Filename: main.js

// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
  paths: {
    plugins: "libs/plugins",
    jquery: 'libs/jquery/jquery-min',
    xml2json: "libs/plugins/jquery.xml2json",  
    underscore: 'libs/underscore/underscore-min',
    backbone: 'libs/backbone/backbone-min',
    gmap:'libs/maps/gmap',
     oms:'libs/maps/oms',  
    async: 'libs/async/async',
    text:'libs/text/text',  
    templates: '../templates'
  },

shim: {
        'jquery': {
            exports: '$'
        },
    
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },  
    
        'oms':{
        exports:'oms'
        },
       "plugins/jquery.xml2json": ['$'],
    }    
});

require([
  // Load our app module and pass it to our definition function
  'app',

], function(app){
  // The "app" dependency is passed in as "App"
  // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
app.init();
});
