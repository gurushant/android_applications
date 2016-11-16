/*
*Following code includes the logger.js file and executes it and returns logger object.
*This logger can be used to log the info,error,debug messages.
*/
var logger = require("../logger/logger");

/*
*Following line executes
*/
var dbUtil = require("../db/db_util");

var dbCon=dbUtil.getDbConnection();


exports.getOrderDetail=function(orderId,callback)
{
	var query='select *from orders where id='+orderId;
	dbCon.query(query ,function(err,rows)
        {
		var returnVal=null;
		if(err!=null)
		{
			logger.error('Error occured while executing '+query+'. Exception='+err);
			returnVal= null;
		}
		else
		{
			returnVal= rows
		}
		callback(returnVal);		
        });
}



exports.updateEmailNotifications=function(orderId,restaurantId,callback)
	{
		var emailUpdateQuery=" update email_notification set is_feedback_rating_received=true,feedback_received_time=now() where order_id="+orderId+" and restaruent_id="+restaurantId;
		logger.info('Email notification update query is =>'+emailUpdateQuery);
		 dbCon.query(emailUpdateQuery ,function(err,response)
	         {
         	       callback(err,response);
       		 });

	}

exports.updateOrders=function(feedbackPayload,orderId,restaurantId,callback)
	{	
	        var orderUpdateQuery=" update orders set rating_feedback_data='"+feedbackPayload+"' where id="+orderId+" and restaruent_id="+restaurantId;
		logger.info('Order update query is=>'+orderUpdateQuery);
		 dbCon.query(orderUpdateQuery ,function(err,response)
                 {
                       callback(err,response);
                 });
	}

exports.checkFeedbackExist=function(orderId,restaurantId,callback)
	{
	 var query="select *from email_notification  where order_id='"+orderId+"' and  restaruent_id='"+restaurantId+"' and is_feedback_rating_received=true";
	logger.info('email notification check query is=>'+query);
	dbCon.query(query ,function(err,rows)
        {
		if(err!=null)
		{
			logger.error('Error occured while checking order status=>'+err);
			callback(err,false);
			return;
		}
              if(rows.length >0 )
                {
      	          callback(err,true);
                }
	     else
		{		                  
		 callback(err,false);
		}

        });

       }

