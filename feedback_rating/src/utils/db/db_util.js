var mysql      = require('mysql');
var propertyReader = require('properties-reader');

/*Following code includes the logger.js file and executes it and returns logger object.
*This logger can be used to log the info,error,debug messages.
*/
var logger = require("../logger/logger");
var dbProp=propertyReader('../config/db.properties');



/*
*Function to connect to specified database.
*/
exports.getDbConnection=function()
{
	var connection = mysql.createConnection({
  	host     : dbProp.get('host'),
  	user     : dbProp.get('user'),
 	password : dbProp.get('password'),
  	database : dbProp.get('database')
	});
	logger.debug('Connecting to the db');
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

