var mysql=require('mysql');
	
var connection=mysql.createConnection(
{
	host:'proxysql-office.service.consul.taboolasyndication.com',
	port:'6033',
	user:'updater',
	password:'ubsrwgpcgr',
	database:'trc'
});

// {
// 	host:'localhost',
// 	user:'root',
// 	password:'Taboola#123',
// 	database:'express_boiler'
// }
connection.connect(function(error){
	if(!!error){
		console.log(error);
	} else {
		console.log('Connected!:)');
	}
});

module.exports = connection; 