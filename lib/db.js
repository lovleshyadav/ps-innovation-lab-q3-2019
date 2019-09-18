var mysql=require('mysql');
var config = require('../config.json');
	
var connection=mysql.createConnection(
{
	host: config.readDB.host,
	port: config.readDB.port,
	user: config.readDB.user,
	password: config.readDB.password,
});

connection.connect(function(error){
	if(!!error){
		console.log(error);
	} else {
		console.log('Connected!:)');
	}
});

module.exports = connection; 