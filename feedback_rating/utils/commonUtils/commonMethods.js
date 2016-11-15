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

exports.postFeedbackAndRating=function(feedbackPayload,orderId,restaurantId,callback)
{
	 
	var query="select *from email_notification  where id='"+orderId+"' and  restaruent_id='"+restaurantId+"'";
        dbCon.query(query ,function(err,rows)
	{
	      if(rows.length >0 )
		{
		callback(err,'ALREADY_FEEDBACK_EXIST');
		return;
		}
	});	

	var query="insert into email_notification(payload,order_id,restaruent_id,email_sent_time,is_feedback_rating_received) values('"+feedbackPayload+"','"+orderId+"','"+restaurantId+"',now(),true)";
	logger.info('posting feedback and rating '+query);
	 dbCon.query(query ,function(err,response)
        {
                callback(err,response);
        });
}

exports.checkFeedbackExist=function(orderId,restaurantId,callback)
	{
	 var query="select *from email_notification  where order_id='"+orderId+"' and  restaruent_id='"+restaurantId+"'";
	dbCon.query(query ,function(err,rows)
        {
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

