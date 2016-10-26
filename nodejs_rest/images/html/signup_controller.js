 signUpDiv = angular.module('test', []);
 var ch = null,
  prevChar = null;
 var startTime = 0,
  endTime = 0;
 var delayArr = new Array();
 var passwordData = new Map();
 var attribute = null;

 signUpDiv.controller("controller", function($scope, $attrs) {
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

  $scope.initVar = function() {
   console.log("Initilizing variables...");
   if (delayArr.length > 0) {
    passwordData[attribute] = delayArr;
    console.log("d==" + passwordData);
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
   console.log("Data=" + passwordData["b"].toString());
  }

 });