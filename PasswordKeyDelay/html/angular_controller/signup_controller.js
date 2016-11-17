 signUpDiv = angular.module('signup', []);
 var ch = null,
 prevChar = null;
 var startTime = 0,
 endTime = 0;
 var delayArr = new Array();
 var passwordData = new Map();
 var attribute = null;

 signUpDiv.controller("signup_controller", function($scope, $attrs,$http) {
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
      token = prevChar + "-" + ch + "=>" + diff
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

  $scope.initVar = function() {
   console.log("Initilizing variables...");
   if (delayArr.length > 0) {
    passwordData[attribute] = delayArr;
    ch = null;
    prevChar = null;
    startTime = 0;
    endTime = 0;
    delayArr = new Array();
    attribute = null;
   }
  }

  $scope.showData = function() {
   passwordData[attribute] = delayArr;
   console.log("Showing data...");
  }


  $scope.changePassword=function()
  {
    var config = {headers:  {
        'Accept': 'application/json',
        'Content-Type':'application/json',
    }
  };

     if (delayArr.length > 0) {
      passwordData[attribute] = delayArr;
      ch = null;
      prevChar = null;
      startTime = 0;
      endTime = 0;
      delayArr = new Array();
      attribute = null;
     }
     // existing_pass=angular.element('#existing_password').val();
     // console.log("$scope.existing_password=="+existing_pass);
     // console.log("json=="+JSON.stringify(passwordData, null, 4));
     console.log("existing password"+document.getElementById('existing_password').value);
     passwordData["existing_password"]=document.getElementById('existing_password').value;
     console.log(JSON.stringify(passwordData, null, 4));

     boolVal=verifyInput();

    if(boolVal==true)
    {
    $http.post("http://54.149.195.217:9090/rest/changePassword",JSON.stringify(passwordData, null, 4),config).success(function(data)
    {
      console.log("json=="+JSON.stringify(passwordData, null, 4));
      console.log("response from sign up "+data);
    }).
    error(function(status)
    {
      
    });
    } 
  }

  function verifyInput()
  {
    var retVal=true;
    var newPwd=null;
    existing_pwd=document.getElementById('existing_password').value;
    if(existing_pwd!=null && existing_pwd.length==0)
    {
      document.getElementById("existing_password").style["border"] = "2px solid red";      
      retVal=false;
    }
    newPwdFirst=document.getElementById('password_0').value;
    if(newPwdFirst==null || newPwdFirst.length==0 )
    {
      document.getElementById("password_0").style["border"] = "2px solid red";      
      retVal=false;
    }
    newPwd=document.getElementById('password_1').value;
    if(newPwd==null || newPwd.length==0 || newPwdFirst!=newPwd)
    {
      document.getElementById("password_1").style["border"] = "2px solid red";      
      retVal=false;
    }
    newPwd=document.getElementById('password_2').value;
    if(newPwd==null || newPwd.length==0 || newPwdFirst!=newPwd)
    {
      document.getElementById("password_2").style["border"] = "2px solid red";      
      retVal=false;
    }
    newPwd=document.getElementById('password_3').value;
    if(newPwd==null || newPwd.length==0 || newPwdFirst!=newPwd)
    {
      document.getElementById("password_3").style["border"] = "2px solid red";      
      retVal=false;
    }
    newPwd=document.getElementById('password_4').value;
    if(newPwd==null || newPwd.length==0 || newPwdFirst!=newPwd)
    {
      document.getElementById("password_4").style["border"] = "2px solid red";      
      retVal=false;
    }
    newPwd=document.getElementById('password_5').value;
    if(newPwd==null || newPwd.length==0 || newPwdFirst!=newPwd)
    {
      document.getElementById("password_5").style["border"] = "2px solid red";      
      retVal=false;
    }
    newPwd=document.getElementById('password_6').value;
    if(newPwd==null || newPwd.length==0 || newPwdFirst!=newPwd)
    {
      document.getElementById("password_6").style["border"] = "2px solid red";      
      retVal=false;
    }
    newPwd=document.getElementById('password_7').value;
    if(newPwd==null || newPwd.length==0 || newPwdFirst!=newPwd)
    {
      document.getElementById("password_7").style["border"] = "2px solid red";      
      retVal=false;
    }

    newPwd=document.getElementById('password_8').value;
    if(newPwd==null || newPwd.length==0 || newPwdFirst!=newPwd)
    {
      document.getElementById("password_8").style["border"] = "2px solid red";      
      retVal=false;
    }
    newPwd=document.getElementById('password_9').value;
    if(newPwd==null || newPwd.length==0 || newPwdFirst!=newPwd)
    {
      document.getElementById("password_9").style["border"] = "2px solid red";      
      retVal=false;
    }

    return retVal;
  }

});