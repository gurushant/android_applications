/*
*Following code includes the logger.js file and executes it and returns logger objectu.This logger object can be used to log info,error,debug,... data to the log file.
*This logger can be used to log the info,error,debug messages.
*/
var logger = require("../utils/logger/logger");

/*
*Following line executes db_util.js and returns dbUtil object.This object can be used to connect to the database,execute the query.
*/
var dbUtil = require("../utils/db/db_util");

/**
* Following line creates an object of database.
*/
var dbCon=dbUtil.getDbConnection();

/**
*This is the rest api.It accepts order and restaruent id,fetches order details from database,converts query output to the json and responds back 
*/
exports.getOrderDetail=function(orderId,restaruent_id,callback)
{
	var query='select *from orders where id='+orderId+' and restaruent_id='+restaruent_id;
	logger.debug("Executing=> "+query); 
	dbCon.query(query ,function(err,rows)
        {
		callback(err,rows);		
        });
}

/**
*This function rounds up the value.i.e if 2.3 then it is 2.5 ,if 2.1 then it is 2 and so on
*/
exports.roundUpRating=function(stars)
	{
		stars=parseFloat(stars);
		if(stars >5 )
		{
			return null;
		}
		var val=parseFloat(stars/0.5).toFixed(1);
		var rate=Math.round(stars/0.5);
		console.log('rating is '+rate);
		return rate/2;

	}

/**
*This method updates order's record in email_notification table.
*/
exports.updateEmailNotifications=function(orderId,restaurantId,callback)
	{
		var emailUpdateQuery=" update email_notification set is_feedback_rating_received=true,feedback_received_time=now() where order_id="+orderId+" and restaruent_id="+restaurantId;
		logger.debug('Email notification update query is =>'+emailUpdateQuery);
		 dbCon.query(emailUpdateQuery ,function(err,response)
	         {
         	       callback(err,response);
       		 });

	}

/**
*This method updates order's record in orders table.
*/
exports.updateOrders=function(feedbackPayload,orderId,restaurantId,callback)
	{	
	        var orderUpdateQuery=" update orders set rating_feedback_data='"+feedbackPayload+"' where id="+orderId+" and restaruent_id="+restaurantId;
		logger.debug('Order update query is=>'+orderUpdateQuery);
		 dbCon.query(orderUpdateQuery ,function(err,response)
                 {
                       callback(err,response);
                 });
	}


/**
*This method check whether order has already received feedback . 
*/
exports.checkFeedbackExist=function(orderId,restaurantId,callback)
	{
	 var query="select *from email_notification  where order_id='"+orderId+"' and  restaruent_id='"+restaurantId+"' and is_feedback_rating_received=true";
	logger.debug('email notification check query is=>'+query);
	dbCon.query(query ,function(err,rows)
        {
              if(rows.length >0 )
                {
      	          callback(err,true);  //returns true if feedback exists
                }
	     else
		{		                  
		 callback(err,false);  //returns false if feedback does not exist.
		}

        });

       }

