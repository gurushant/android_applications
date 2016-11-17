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



var ERROR_MSG="{ \"status\":\"ERROR\", \"message\":\"Error occured.Please try again\"}";

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
 * 1.To fetch order details by calling method from CommonUtils.js.
 * 2.If order does not exist then it respond with appropriate message.  
 */
app.get('/orders/getOrderDetail',function(req,res)
{
	var orderId=req.query.order_id;
	var restId=req.query.restaruent_id;
	logger.info('Getting order details of '+orderId);
	res.header("Access-Control-Allow-Origin", "*");
	commonUtils.getOrderDetail(orderId,restId,function(err,rows){
		var response=null;
		if(err!=null)
		{
			logger.error('Error occured while fetching order details.Error is =>'+err);
			response=ERROR_MSG;
		}
		else
		if(rows.length==1){
			response=rows[0];
			response=JSON.stringify(response);
		        console.log('response >>>>>>>>>>>>'+response.toString());
			response=JSON.parse(response);
			response.status='SUCCESS';
			response.message='Order detail fetched successfully';
//			response=JSON.stringify(response);
			logger.info('order details of '+orderId+' is '+response);
		}
		else
		{	//If order does not exist in database
			logger.debug('Order does not exist =>'+orderId);
			response="{ \"status\":\"SUCCESS\", \"message\":\"Order not found\"}";	
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
        res.header("Access-Control-Allow-Origin", "*");
	logger.info('Feedback request detail=>'+req.body);
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
		console.log(parseFloat(JSON.stringify(recipeArray[k]).split(':')[1].replace('}','')));
		ratingSum+=parseFloat(JSON.stringify(recipeArray[k]).split(':')[1].replace('}',''));
	}
	logger.debug('Rating sum is '+ratingSum);
	//Calculating overall rating of recipes in order
	var overallRecipeRating=ratingSum/receipeLength;
	logger.debug('Rounding up recipe rating');
	overallRecipeRating= commonUtils.roundUpRating(overallRecipeRating);
	logger.debug('Rounded recipe rating is '+overallRecipeRating);

	//Calculating overall rating of an order.
	var overAllRating=(overallRecipeRating+parseFloat(economy)+parseFloat(ambience)+parseFloat(qos))/4;

	//Rounding up over all rating
	logger.debug('Rounding up overall  rating.Wihout rounding is '+overAllRating);
        overAllRating= commonUtils.roundUpRating(overAllRating);
        logger.debug('Rounded overall rating is '+overAllRating);

	logger.debug('Final recipe rating is '+overallRecipeRating);
	logger.debug('Final rating of order id '+overAllRating);
	req.body.overall_recipe_rating=overallRecipeRating;
	req.body.overall_order_rating=overAllRating;
	var feedbackPayload=JSON.stringify(req.body);
	logger.debug('Feedback payload is '+feedbackPayload);
	//Checking whether order has already recived feedback and rating .
	logger.debug('Checking whether order has already received feedback.');
	commonUtils.checkFeedbackExist(orderId,restaurantId,function(err,response){
		logger.debug('Checking whether feedback is already received for this order '+orderId+'=>'+response);
		if(err!=null)
		{
			response=ERROR_MSG;
			res.json(response);
		}
		else
		{
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
							logger.error('Error occured while updating orders table =>'+err.toString());
							response="{ \"status\": \"ERROR\", \"message\": \"Error occured while updating feedback and rating.\" }";
						}
						else
						{
							logger.info('Order updated successfully');
			         			response="{ \"status\": \"SUCCESS\", \"message\": \"Feedback updated successfully.\" }";
					
						}
						 res.json(response);
					});
				}
				else
				{
					logger.error('Error occrued while updating email notification table =>'+err);	
					response="{ \"status\": \"ERROR\", \"message\": \"Error occured while updating feedback and rating.\" }";
					 res.json(response);
				}

			});	
		}
		else
		{
			        response="{ \"status\": \"SUCCESS\", \"message\": \"Feedback already exist for this order\" }";
				 res.json(response);	
		}
		}
	
	});	

});


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
