var mysql      = require('mysql');
var propertyReader = require('properties-reader');

/*Following code includes the logger.js file and executes it and returns logger object.
*This logger can be used to log the info,error,debug messages.
*/
var logger = require("../logger/logger");
var dbProp=propertyReader('../config/db.properties');

logger.debug('Creating db connection pool of '+dbProp.get('connection_pool')+' connections');
var pool  = mysql.createPool({
	 connectionLimit : dbProp.get('connection_pool'),
	 host     : dbProp.get('host'),
         user     : dbProp.get('user'),
         password : dbProp.get('password'),
         database : dbProp.get('database')
});

exports.pool=pool;

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
*This function release the db connection ,this is confirmed by verifying the value of connection by calling'pool._freeConnections.indexOf(connection)' If it 0 then connection is released else not.
*However some time it still returns 1,in that case i have called 'connection.release();' function,if it throws exception then it is closed else *not closed
*/

function releaseDbCon(connection)
        {
                         connection.release();
                        var conRelease=pool._freeConnections.indexOf(connection);

                         if(conRelease==0)
                         {
                                logger.debug('db connection is released succesfully')
                         }
                         else
                         {
                                 try
                                {
                                        connection.release();
                                        logger.error('Error while releasing db connection');
                                }
                                catch(err)
                                {       logger.warn('Got exception.Called connection.release() again to confirm whether connection is closed.Since \'pool._freeConnections.indexOf(connection)\' returns unstable value to decide whether connection is closed');
                                        logger.debug('db connection is released succesfully')
                                }

                         }
        }


/**
*This function is used to execute update,insert queries
*/
exports.executeQuery=function(query,callback)
        {
                 logger.debug("Executing=> "+query);
                pool.getConnection(function(err, connection) {
                connection.query(query,function(err,rows)
                {
                        if(err!=null)
                        {
                                callback(err,rows);
                                return;
                        }
                         callback(err,rows);
                        releaseDbCon(connection);
                });

                });
        }

/*
*This function is used to check whether record exists.
*/
exports.checkRecordExists=function(query,callback)
        {
                var isRecordExist=true;
                 logger.debug("Executing whether feedback already exists => "+query);
                pool.getConnection(function(err, connection) {
                connection.query(query,function(err,rows)
                {
                        var isRecordExist=true;
                        if(err!=null)
                        {
                                 releaseDbCon(connection)
                                 callback(err,true)
                        }
                        if(rows.length > 0)
                        {
                                isRecordExist=true;
                        }
                        else
                        {
                                isRecordExist=false;
                        }
                        releaseDbCon(connection);
                        callback(err,isRecordExist);

                });
            });
        }

