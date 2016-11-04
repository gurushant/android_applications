var express=require('express');
var app = express();
var bodyParser=require('body-parser');
var mysql=require('mysql');
var session=require('express-session');
var fileUpload = require('express-fileupload');


app.use(bodyParser());
app.use(session({secret: 'ssshhhhh'}));
app.use(fileUpload());


var connection=mysql.createConnection({host:'localhost',user:'root',password:'root',database:'admin'});
connection.connect();

const THRESHOLD=20;

app.listen(9090,function(){
	console.log('Listeneing on 9090 port');
});

app.get('/test',function(req,res){
	res.json({'message':'data from test'});
});

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





var session;
app.post('/rest/login',function(req,res){
	console.log(req.session);
	res.header("Access-Control-Allow-Origin", "*");
	req.session.token='Pratibha';
	//res.send("Logged in..");
	res.redirect("http://54.213.126.142:8080/html/login.html");
});

app.get('/rest/login',function(req,res){
        console.log(req.session.token);
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
