var express=require('express');
var app = express();
var bodyParser=require('body-parser');
var mysql=require('mysql');
var session=require('express-session');
var fileUpload = require('express-fileupload');
var cors = require('cors');

app.use(cors());
app.use(bodyParser());
app.use(session({secret: 'ssshhhhh'}));
app.use(fileUpload());




var connection=mysql.createConnection({host:'localhost',user:'root',password:'root',database:'admin'});
connection.connect();

const THRESHOLD=20;

app.listen(9090,function(){
	console.log('Listeneing on 9090 port');
});



app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', "http://"+req.headers.host+':8000');

        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        next();
    }
);




//Method to get list of available product.
app.get('/rest/getProducts',function(req,res)
{
	console.log("Request received...");
	 res.header("Access-Control-Allow-Origin", "*");
         res.setHeader('Content-Type', 'application/json');
	var jsonResult=null;
	 connection.query('select *from product_details order by id',function(err,data)
	{
             		jsonResult=JSON.stringify(data);
			 console.log(jsonResult);
		        res.send(jsonResult);

	});

});


//Method to get single queried..
app.get('/rest/getProduct',function(req,res)
{
        console.log("Request received..."+ req.query.id);
         res.header("Access-Control-Allow-Origin", "*");
         res.setHeader('Content-Type', 'application/json');
        var jsonResult=null;
         connection.query('select *from product_details where id='+req.query.id,function(err,data)
        {
                        jsonResult=JSON.stringify(data);
                         console.log(jsonResult);
                        res.send(jsonResult);

        });

});



app.get('/rest/fetchProducts',function(req,res)
{
         res.header("Access-Control-Allow-Origin", "*");
         res.setHeader('Content-Type', 'application/json');
	//res.send("[\"product_images/1.jpg\",\"product_images/2.jpg\",\"product_images/3.jpg\", \"product_images/4.jpg\",\"product_images/5.jpg\"]");
	res.send("{\"1\": {\"first\": \"product_images/1.jpg\",\"second\": \"product_images/2.jpg\",\"third\": \"product_images/3.jpg\"},\"2\": {\"first\": \"product_images/4.jpg\",\"second\": \"product_images/5.jpg\",\"third\": \"product_images/6.jpg\"}}");
});



//Method to fetch product id list
app.get('/rest/getProdId',function(req,res)
{
	console.log("Fetching product id list");
	 res.header("Access-Control-Allow-Origin", "*");
         res.setHeader('Content-Type', 'application/json');
        var jsonResult=null;
         connection.query('select id,prod_name from product_details order by id',function(err,data)
        {
                        jsonResult=JSON.stringify(data);
                         console.log(jsonResult);
                        res.send(jsonResult);

        });

});

//method to upload the file
app.post('/rest/uploadProd',function(req,res,next)
{
     var sampleFile;
     res.header("Access-Control-Allow-Origin", "*");
    if (!req.files) {
        
        return;
    }
	console.log("Request received..."); 
	 var convJson=JSON.stringify(req.body);
        console.log("text=",convJson);
	var jsonObj=JSON.parse(convJson);
 	var price=jsonObj["price"];
	var name=jsonObj["name"];
	var discount=jsonObj["discount"];	
	var fileName=new Date().getTime()+'.png';
        var filePath='images/'+fileName;
	console.log('insert into product_details(prod_name,prod_price,prod_discount,prod_image_path) values("'+name+'","'+price+'","'+discount+'","'+fileName+'")');
	 connection.query('insert into product_details(prod_name,prod_price,prod_discount,prod_image_path) values("'+name+'","'+price+'","'+discount+'","'+fileName+'")',function(err,result)
                         {
                         });
	sampleFile = req.files.file;
    	sampleFile.mv(filePath, function(err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.send('File uploaded!');
        }


    });
});


//
//method to update the prod
app.post('/rest/updateProd',function(req,res,next)
{
     var sampleFile;
     res.header("Access-Control-Allow-Origin", "*");
    if (!req.files) 
	{
	   console.log("Request received without file...");
         var convJson=JSON.stringify(req.body);
        console.log("text=",convJson);
        var jsonObj=JSON.parse(convJson);
        var price=jsonObj["price"];
        var name=jsonObj["name"];
        var discount=jsonObj["discount"];
	var id=jsonObj["id"];
	var query="update product_details set prod_name='"+name+"',prod_price='"+price+"',prod_discount='"+discount+"' where id="+id;
	console.log(query);
        connection.query(query,
	function(err,result)
	{
	});



        res.send('No files were uploaded.');
        return;
    }
        console.log("Request received...");
         var convJson=JSON.stringify(req.body);
        console.log("text=",convJson);
        var jsonObj=JSON.parse(convJson);
        var price=jsonObj["price"];
        var name=jsonObj["name"];
	var id=jsonObj["id"];
	 connection.query("delete from product_details where id="+id,function(err,result)
        {
        });
        var discount=jsonObj["discount"];
        var fileName=new Date().getTime()+'.png';
        var filePath='images/'+fileName;
        console.log('insert into product_details(prod_name,prod_price,prod_discount,prod_image_path) values("'+name+'","'+price+'","'+discount+'","'+fileName+'")');
         connection.query('insert into product_details(prod_name,prod_price,prod_discount,prod_image_path) values("'+name+'","'+price+'","'+discount+'","'+fileName+'")',function(err,result)
                         {
                         });
        sampleFile = req.files.file;
        sampleFile.mv(filePath, function(err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.send('File uploaded!');
        }


    });
});



var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    if(typeof(req.headers['content-type']) === 'undefined'){
        req.headers['content-type'] = "application/json; charset=UTF-8";
    }
    next();
};
app.use(allowCrossDomain);



var session;
app.post('/rest/login',function(req,res){
	console.log(req.session);

	 res.header('Access-Control-Allow-Origin', '*');
 	   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
 
//	req.session.token='test';

//	res.redirect(302,"http://www.google.com");
	res.send("file:///E:/AngularJs/Forms/temp_repeat.html");
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


app.post('/rest/changePassword',function(req,res){
	jsonBody=req.body;
	console.log("Body is ",jsonBody);	
	var convJson=JSON.stringify(jsonBody);
	console.log("text=",convJson);
	res.header("Access-Control-Allow-Origin", "*");
	connection.query('update admin_user set pwd_data=? where id=1',[convJson],function(err,result)
                         {
                         });

	res.send("test...");
	
});

app.get('/',function(req,res){
    res.header('Access-Control-Allow-Origin', req.headers.origin);
  
res.send("Gurushant...");

});


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
