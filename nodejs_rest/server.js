var express=require('express');
var app = express();
var bodyParser=require('body-parser');
var mysql=require('mysql');
var session=require('express-session');
var fileUpload = require('express-fileupload');
var cors = require('cors');

app.use(cors());
app.use(session({secret: 'ssshhhhh'}));



app.listen(9090,function(){
   console.log('Listeneing on 9090 port');
});


var imageServerIP="54.214.201.205";
var imageServerPort="8080";
var imageServer="http://"+imageServerIP+":"+imageServerPort+"/";


app.get('/rest/fetchProducts',function(req,res)
{
         res.header("Access-Control-Allow-Origin", "*");
         res.setHeader('Content-Type', 'application/json');
	
	  var response="{\"1\": {\"first\": \""+imageServer+"product_images/1.jpg\",\"second\": \""+imageServer+"product_images/2.jpg\",\"third\": \""+imageServer+"product_images/3.jpg\"},\"2\": {\"first\": \""+imageServer+"product_images/4.jpg\",\"second\": \""+imageServer+"product_images/5.jpg\",\"third\": \""+imageServer+"product_images/6.jpg\"}}";


	console.log("get products="+response);
	res.send(response);	
});





var session;
app.post('/rest/login',function(req,res){
	console.log(req.session);

	 res.header('Access-Control-Allow-Origin', '*');
 	req.session.token='test';
	res.send("file:///E:/AngularJs/Forms/item_product_list.html");
});


app.post('/rest/logout',function(req,res){
	req.session.destroy(function(err) {
  if(err) {
    console.log(err);
  } else {
    res.redirect('/');
  }
});
});


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
