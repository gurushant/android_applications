
var loginDiv=angular.module('login',[]);
 var ch = null,
 prevChar = null;
 var startTime = 0,
 endTime = 0;
 var delayArr = new Array();
 var attribute = null;
		var serverIpAddress="54.212.228.206";

loginDiv.controller('login_controller',function ($scope,$attrs,$http,$window){
				$scope.ButtonClick=function(){
					var config = {headers:  {
    	    					'Accept': 'application/json',
        						'Content-Type':'application/json',
    										}
  								 };
				isValid=verifyInput();
				if(isValid==true)
				{
					$http.post("http://"+serverIpAddress+":9090/rest/login",JSON.stringify(delayArr, null, 4),config).success(function(data)
					{
						console.log(data)
						//$window.location.href = data;
					}).
					error(function(status)
					{
						console.log("error occured");	
					});
			}
		 }	

		function verifyInput()
		  {
			userId=document.getElementById('user_id').value;
			var retVal=true;
		    if(userId!=null && userId.length==0)
		    {
		      document.getElementById("user_id").style["border"] = "2px solid red";      
		      retVal=false;
		    }
			password=document.getElementById('password').value;

		    if(password!=null && password.length==0)
		    {
		      document.getElementById("password").style["border"] = "2px solid red";      
		      retVal=false;
		    }
		    return retVal;  	
		  }

		$scope.keyPress = function(event) {
		   code = event.keyCode;
		   ch = String.fromCharCode(code);
		   attribute = $attrs.id;
		   console.log("Attribute=" + attribute);
		   if (code == 13) {
		    ch = null;
		   }

		   if (ch != null) {
		    {
		     if (prevChar != null) {
		      endTime = new Date().getTime();
		      diff = endTime - startTime;
		      token = prevChar + "," + ch + "=>" + diff
		      console.log(token);
		      delayArr.push(token);
		      console.log(delayArr);
		      prevChar = ch;
		     }
		    }
		   }

		  }

  		$scope.keyUp = function(event) {
	   if (ch != null) {
	    startTime = new Date().getTime();
	    if (prevChar == null) {
	     prevChar = ch;
	    }
	   }
	  }
});

