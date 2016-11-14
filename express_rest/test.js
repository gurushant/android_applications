var express = require('express');
var session = require('express-session');
var app = express();

app.use(session({secret: 'ssshhhhh'}));


app.get('/test', function(req, res) {
  req.session.lastPage = '/awesome';
	         res.header("Access-Control-Allow-Origin", "*");
         res.setHeader('Content-Type', 'application/json');
 
	  res.send('Your Awesome.');
});

app.get('/test_1',function(req,res){
	console.log('dev='+req.session.lastPage);
	res.send('test');
});


app.listen(9090,function(){
        console.log('Listeneing on 9090 port');
});

