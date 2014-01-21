
var _mysql = require('mysql');
var http = require("http");


var HOST = 'ec2-107-20-81-173.compute-1.amazonaws.com';
var PORT = 3306;
var MYSQL_USER = 'waris';
var MYSQL_PASS = '4327bgl52';
var DATABASE = 'bscPush';
var TABLE = 'push';

var mysql = _mysql.createConnection({
    host: HOST,
    port: PORT,
    user: MYSQL_USER,
    password: MYSQL_PASS,
    _socket: '/var/run/mysqld/mysqld.sock',
});

mysql.query('use ' + DATABASE);

 
exports.addId = function(req, res) {
    var push = req.body.token;
    console.log(push);
    mysql.query('insert into '+ TABLE +'(appname,pushid) values ("BSC",+"'+push+'")',
    function selectCb(err, results, fields) {
    if (err) throw err;
    else console.log('success');
});

 

};
 
