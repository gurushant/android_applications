var express=require('express');
var app = express();
var bodyParser=require('body-parser');
var PORT_NO=9095;



app.use(bodyParser());


/*
*Following code includes the logger.js file and executes it and returns logger object.
*This logger can be used to log the info,error,debug messages.
*/
var logger = require("./utils/logger/logger");

/*
*Following line executes 
*/
var dbConnection = require("./utils/db/db_util");

/*
*Following code  contains the reference to common methods modules.
*/
var commonUtils=require('./utils/commonUtils/commonMethods');


/*
*Server listener on the port.
*/ 
app.listen(PORT_NO,function(){
	logger.info('Listenening on '+PORT_NO);
});



 /**
 *This function is for
 * 1.To fetch order details by calling method from common utils.
 * 2.If order does not exist then respond with appropriate message.  
 */
app.get('/orders/getOrderDetail',function(req,res)
{
	var orderId=req.query.order_id;
	logger.info('Getting order details of '+orderId);
	res.header("Access-Control-Allow-Origin", "*");
	commonUtils.getOrderDetail(orderId,function(rows){
		var response=null;
		if(rows.length==1){
			response=rows[0];
			console.log('response >>>>>>>>>>>>'+response.toString());
			response=JSON.stringify(response);
			response=JSON.parse(response);
			response.status='SUCCESS';
			response.message='Order detail fetched successfully';
//			response=JSON.stringify(response);
			logger.info('order details of '+orderId+' is '+response);
		}
		else
		{	//If order does not exist in database
			logger.debug('Order does not exist =>'+orderId);
			response="{ \"status\":\"ERROR\", \"message\":\"Order not found\"}";	
		}
		res.json(response);
	});	
});

/**
 *This function is for
 * 1.If feedback is already received then respond with message appropriate message.
 * 2.If feedback does not exist then call method of common utils to save the feedback and rating payload.
 * 3.Calculate overall rating of recipe and add json element into the payload.
 * 4.Calculate overall rating of order including overall recipe rating and insert json element for order's overall rating into the payload.
 * 5.Error handling if any exception occurs.
 */

app.post('/review/post_feedback',function(req,res)
{	
	logger.debug('Feedback request detail=>'+req.body);
	logger.info('Posting feedback and rating');
	var orderId=req.body.order_id;
	var restaurantId=req.body.restaruent_id;
	var userEmail=req.body.email_id;
	var feedback=req.body.feedback;
	var economy=req.body.economy;
	var ambience=req.body.ambience;
	var qos=req.body.qos;
	var recipeArray=req.body.recipe_rating;
	var receipeLength=recipeArray.length;
	logger.info('Recipe array length is '+receipeLength);
	var ratingSum=0;
	//Sum of all recipies in order.
	for(var k=0;k <receipeLength;k++)
	{
		ratingSum+=parseFloat(JSON.stringify(recipeArray[k]).split(':')[1].replace('}',''));
	}
	logger.info('Rating sum is '+ratingSum);
	//Calculating overall rating of recipes in order
	var overallRecipeRating=ratingSum/receipeLength;
	//Calculating overall rating of an order.
	var overAllRating=(overallRecipeRating+parseFloat(economy)+parseFloat(ambience)+parseFloat(qos))/4;
	logger.info('Final recipe rating is '+overallRecipeRating);
	logger.info('Final rating of order id '+overAllRating);
	req.body.recipe_overall_rating=overallRecipeRating;
	req.body.overall_order_rating=overAllRating;
	var feedbackPayload=JSON.stringify(req.body);
	logger.info('Feedback payload is '+feedbackPayload);
	//Checking whether order has already recived feedback and rating .
	logger.info('Checking whether is already received.');
	commonUtils.checkFeedbackExist(orderId,restaurantId,function(err,response){
		logger.info('Checking whether feedback is already received for this order '+orderId+'=>'+response);
		//If order does not have feedback and rating recived.This is the first time.
		if(response==false)
		{
			logger.info('Updating email notifications table');
			commonUtils.updateEmailNotifications(orderId,restaurantId,function(err,response)
			{
				if(err==null)
				{
					logger.log('Email notification table is updated');
					logger.log('Updating orders table');
					commonUtils.updateOrders(feedbackPayload,orderId,restaurantId,function(err,response)
					{
						if(err!=null)
						{
							logger.error('Error occured while updating orders table =>'+err);
							 res.json("{ \"status\": \"error\", \"message\": \"Error occured while updating feedback and rating.\" }");
						}
						else
						{
							logger.info('Order updated successfully');
			         			 res.json("{ \"status\": \"success\", \"message\": \"Feedback updated successfully.\" }");
						}
					});
				}
				else
				{
					logger.error('Error occrued while updating email notification table =>'+err);	
					res.json("{ \"status\": \"error\", \"message\": \"Error occured while updating feedback and rating.\" }");
				}

			});	
		}
		else
		{
			        res.json("{ \"status\": \"success\", \"message\": \"Feedback already exist for this order\" }");
	
		}
	
	});	

});


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
