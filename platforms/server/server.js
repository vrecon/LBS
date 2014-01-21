 var express = require('express'),
  push = require('./routes/push');
//  message = require('./routes/message');
 
 
var app = express();
 
 app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

// allow cross origin scripting to get data from devices directly
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
 

app.post('/pushid', push.addId);

//app.get('/messages',message.findAll);
//app.get('/message/:id',message.findById);
//app.get('/messagesbypoi/:id',message.findAllByPoiId);
app.listen(3011);
console.log('Listening on port 3011...');