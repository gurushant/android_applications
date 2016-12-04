var express=require('express');
var app = express();
var bodyParser=require('body-parser');
var mysql=require('mysql');
var session=require('express-session');
var fileUpload = require('express-fileupload');
var cookieParser = require('cookie-parser');


app.use(bodyParser());
app.use(session({secret: 'ssshhhhh'}));
app.use(fileUpload());


var connection=mysql.createConnection({host:'localhost',user:'root',password:'root',database:'admin'});
connection.connect();

const THRESHOLD=2000;

app.listen(9090,function(){
	console.log('Listeneing on 9090 port');
});

app.get('/index.html', function(req,res) {
  res.sendFile('/home/ec2-user/nodejs/express_rest/public/index.html');
});


app.get('/test',function(req,res){
	        res.header("Access-Control-Allow-Origin", "*");
	session=req.session;
	session.test="dev";
	res.json({'message':'data from test'});
});

app.get('/test_1',function(req,res){
        console.log(req.session.test);
	res.json({'message':'data from test'});
});


function isSessionValid()
{
	console.log("Token is "+token.text);
	if(token.text!=null)
	{
		return true;
	}
	else
	{
		return false;
	}
}


//Method to get list of available product.
app.get('/rest/getProducts',function(req,res)
{
	console.log("Request received...");
	console.log(req.session.token);
	         res.header("Access-Control-Allow-Origin", "*");
	if(isSessionValid()==true)
	{
         res.setHeader('Content-Type', 'application/json');
	var jsonResult=null;
	 connection.query('select *from product_details order by id',function(err,data)
	{
             		jsonResult=JSON.stringify(data);
			 console.log(jsonResult);
		        res.send(jsonResult);

	});
	}

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





var token=null;
app.post('/rest/login',function(req,res){
	console.log(req.session);
	res.header("Access-Control-Allow-Origin", "*");
	token=req.session;
	token.text="loggedin";
	console.log("login body request"+req.body);
	console.log(req.session.token);
	req.session.cookie.expires = false;
	var isValidCredential=verifyLogin(req.body,res);
//	console.log('isValidCredential is '+isValidCredential);
//	res.send("file:///F:/P/Forms/PasswordKeyDelay/html/item_list.html");
});




function verifyLogin( body,res)
{
	console.log('body is '+body);
	var jsonData=null;
	var json;
	var userIdIndex=body.toString().split(',').length-1;
	var jsonBody = JSON.stringify(body);
	jsonBody=JSON.parse(jsonBody)
	var userId=jsonBody[userIdIndex];
	console.log('user id is +++  '+userId);
	delete jsonBody[userIdIndex]
	jsonBody=jsonBody.toString().substring(0,jsonBody.toString().length-1);
	body=jsonBody;
        console.log('json body after delete is '+jsonBody);



	connection.query('select pwd_data from admin_user  where id=1',function(err,rows,fields)
	{
		 json=rows[0].pwd_data;
		 json=JSON.parse(json);
		var isValidPass=false;
		for(var k=0;k<9;k++)
		{
			isValidPass=false;
			var pattern=json['password_'+k].toString();
			var tokenArr=pattern.split(",");
			var passwordArr=body.toString().split(",");
			console.log('tokenArr='+tokenArr);
			console.log('passwordArr='+passwordArr);
			console.log('------------------------------------------ '+tokenArr.length+','+passwordArr.length);
			if(tokenArr.length==passwordArr.length)
			{
				for(var l=0;l<tokenArr.length;l++)
				{
					var tempToken=tokenArr[l].split('=>')[1];
					var tempPass=passwordArr[l].split('=>')[1];
					console.log('>>>>>>tempToken is'+tempToken);
					console.log('>>>>>>passwordArr is'+tempPass);
					if(tokenArr[l].split('=>')[0]==passwordArr[l].split('=>')[0])
					{
						var diff=tempToken-tempPass;
						diff=Math.abs(diff);
						console.log('diff is '+diff);
						if(diff < THRESHOLD)
						{
							isValidPass=true;
						}
					}
				}
			}
			if(isValidPass==true)
			{
				console.log('is >>  password valid '+isValidPass);
				res.send("file:///F:/P/PasswordKeyDelay/html/item_list.html");
				return isValidPass;
			}
		}
	        console.log('is password valid '+isValidPass);
	 
		 if(isValidPass==true)
                        {
                                console.log('is >>  password valid '+isValidPass);
                                res.send("file:///F:/P/PasswordKeyDelay/html/item_list.html");
                                return isValidPass;
                        }
		else
			{
				 console.log('is >>  password valid '+isValidPass);
                                res.send("file:///F:/P/PasswordKeyDelay/html/invalid_pwd.html");
                                return isValidPass;
			
			}


	});
	
}


function createDataMap(json)
{
	var map={};
	for(var i=0;i<9;i++)
	{
		var key="password_"+i;
		console.log(key);
		console.log("data="+json);
	}
}


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
	connection.query('update admin_user set pwd_data=\''+convJson+'\'',[convJson],function(err,result)
                         {
				console.log("Error="+err);
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
