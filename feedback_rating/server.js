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



/*
*Following api accepts the order id,fetches order details from database and responds back to the server.
*/
app.get('/orders/getOrderDetail',function(req,res)
{
	var orderId=req.query.order_id;
	logger.info('Getting order details of '+orderId);
	commonUtils.getOrderDetail(orderId,function(rows){
		if(rows.length==1){
			var response=rows[0];
			response=JSON.stringify(response);
			logger.debug('order details of '+orderId+' is '+response);
			res.send(response);	
		}
	});	
});


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
	for(var k=0;k <receipeLength;k++)
	{
		ratingSum+=parseFloat(JSON.stringify(recipeArray[k]).split(':')[1].replace('}',''));
	}
	logger.info('Rating sum is '+ratingSum);
	var overallRecipeRating=ratingSum/receipeLength;
	var overAllRating=(overallRecipeRating+parseFloat(economy)+parseFloat(ambience)+parseFloat(qos))/4;
	logger.info('Final recipe rating is '+overallRecipeRating);
	logger.info('Final rating of order id '+overAllRating);
	req.body.recipe_overall_rating=overallRecipeRating;
	req.body.overall_order_rating=overAllRating;
	var feedbackPayload=JSON.stringify(req.body);
	logger.info('Feedback payload is '+feedbackPayload);

	logger.info('Checking whether is already received.');
	commonUtils.checkFeedbackExist(orderId,restaurantId,function(err,response){
		console.log('>>>>>>>>>>>>>>>>>>>>>'+response);
		if(response==false)
		{
		}
	
	});	
	 commonUtils.postFeedbackAndRating(feedbackPayload,orderId,restaurantId,function(err,response){
			if(err!=null)
			{
				logger.error('Error occured while inserting feedback and rating.Error is =>'+err);
				res.json("{ \"status\": \"failed\", \"message\": \"Oops,Error occured while processing feedback.Try again later.\" }");
			}
			else
			{
				 res.json("{ \"status\": \"success\", \"message\": \"!!Thanks,Successfully posted feedback and rating of the order\" }");

			}
        });

});
