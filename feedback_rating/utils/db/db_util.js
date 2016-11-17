var mysql      = require('mysql');

/*Following code includes the logger.js file and executes it and returns logger object.
*This logger can be used to log the info,error,debug messages.
*/
var logger = require("../logger/logger");



/*
*Function to connect to specified database.
*/
exports.getDbConnection=function()
{
	var connection = mysql.createConnection({
  	host     : 'localhost',
  	user     : 'root',
 	password : 'root',
  	database : 'feedback_rating'
	});
	logger.info('Connecting to the db');
	connection.connect();
	logger.debug('Database connection object is '+connection);
	return connection;
};

/**
* Function to close database connection
*/
exports.dbConClose=function(connection)
{
	connection.end();
};

