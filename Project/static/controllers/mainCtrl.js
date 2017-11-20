var app = angular.module("myApp", ['ngCookies']);

app.controller("loginCtrl", function($scope, $http, $window, $cookies) {
	
	var masterPass = "admin";
	// Login
	$scope.validate = function() {
		console.log("Validate func");

		$http({
			method: "POST",
			url: "/login/",
			data: {
				name: $scope.uname1,
				passw: $scope.pass1,
			}
		}).then(function(response) {
			var flag = response.data;
			console.log("Res: " + flag);

			if(flag == false) {
				console.log("Invalid login");
				$("#invalidLogin").css("display", "block");
				return;
			}
			else {
				$cookies.put('myUname', $scope.uname1);
				$cookies.put('login', 'true');
				if($scope.pass1 == masterPass)
					$cookies.put('teacher', 'true');
				else
					$cookies.put('teacher', 'false');
				$window.location.href = './Main.html';
			}
		});
	};

	// Register
	$scope.add = function() {
		console.log("Register function");	// uname2 email2 pass2 pass3

		// If 2 passwords entered by user don't match, print error and return
		if($scope.pass2 != $scope.pass3) {
			console.log("Passwords don't match!");
			return;
		}

		// Post request to send email, username and password to database
		$http({
			method: "POST",
			url: "/register/",
			data: {
				name: $scope.uname2,
				email: $scope.email2,
				passw: $scope.pass2,
			}
		}).then(function(response) {
			var result = response.data;
			console.log("Result: " + result);
			if(result == "uname") {
				$("#invalidUser").css("display", "block");
				return;
			}
			else {
				$("#invalidUser").css("display", "none");
			}

			if(result == "email") {
				$("#invalidEmail").css("display", "block");
				return;
			}
			else {
				$("#invalidEmail").css("display", "none");
			}

			if(result == "done") {
				console.log("Registered!");
				$("#registered").css("display", "block");
				setTimeout(backToLogin, 2000);
			}
			else {
				$("#registered").css("display", "none");
			}

		});
	};
});

// Main page controller
// app.controller("mainPageCtrl", function($scope, $http, $cookies, $window) {
// 	if($cookies.get('login') == 'false') {
// 		alert('Please login to continue');
// 		$window.location.href='./index.html';
// 	}

// 	$scope.myText = $cookies.get('myUname');

// 	$scope.checkTeacher = function() {
// 		if($cookies.get('teacher') == "true")
// 			return true;
// 		else
// 			return false;
// 	}

// 	$scope.delAccount = function() {
// 		// http request to delete account
// 		$("#passMismatch").css('display', 'none');
// 		$("#invPass").css('display', 'none');

// 		var pass1 = $scope.delPass1;
// 		var pass2 = $scope.delPass2;

// 		if(pass1 == pass2) {
// 			$http({
// 				method: "POST",
// 				url: "/delAccount/",
// 				data: {
// 					userName: $cookies.get('myUname'),
// 					password: pass1,
// 				}
// 			}).then(function(response) {
// 				if(response.data == "yes") {
// 					$window.location.href='./index.html';
// 				}
// 				else {
// 					$("#invPass").css('display', 'block');
// 				}
// 			});
// 		}
// 		else {
// 			$("#passMismatch").css('display', 'block');
// 		}
// 	}

// 	$scope.changePass = function() {
// 		$("#passMismatch2").css('display', 'none');
// 		$("#passMatch").css('display', 'none');

// 		var oldPass = $scope.changePass1;
// 		var newPass = $scope.changePass2;

// 		$http({
// 			method: "POST",
// 			url: "/changePass/",
// 			data: {
// 				userName: $cookies.get('myUname'),
// 				currPass: oldPass,
// 				nextPass: newPass,
// 			}
// 		}).then(function(response) {
// 			if(response.data == "no") {
// 				$("#passMismatch2").css('display', 'block');
// 			}
// 			else {
// 				$("#passMatch").css('display', 'block');
// 			}
// 		});
// 	}

// 	$scope.logout = function() {
// 		$cookies.put('login', 'false');
// 	 	$window.location.href='./index.html';
// 	}
// });


// MCQ page ctrl
app.controller("QuesCtrl", function($scope, $http, $cookies, $window) {
	// If user is not logged in, send him/her to login page
	if($cookies.get('login') == 'false') {
		alert('Please login to continue');
		$window.location.href='./index.html';
	}

	// Select topic for dropdown menu in create questions page
	$scope.setTopic = "Select Topic";
	$scope.selectTop = function(text) {
		$scope.setTopic = text;
	};

	// Add new question to database
	$scope.addQuestion = function() {
		console.log("Add ques function");

		// Clear every error message first
		$("#emptyQues").css('display','none');
		$("#emptyOptions").css('display', 'none');
		$("#emptyAnswer").css('display', 'none');
		$("#emptyTopic").css('display', 'none');

		// Test part won't exist for create question page but it will be there for create test page.
		var testPage = false;	// Variable to check if it is test page or create question page
		if($("#emptyTest").length != 0) {
			testPage = true;
			$("#emptyTest").css('display', 'none');
			$("#emptyTestTime").css('display', 'none');

			var myTest = $("#tName").val().trim();	// Name of test
			if(myTest == "") {	// If test name is not displayed, show error
				$("#emptyTest").css('display', 'block');
				return;
			}

			var duration = $("#tTime").val().trim();	// Duration of the test
			if(duration == "") {
				$("#emptyTestTime").css('display', 'block');
				return;
			}
		}	

		var question = $("#t1").val().trim();	// Question name
		if(question == "") {
			$("#emptyQues").css('display','inline');
			return;
		}

		var optionsArray = new Array();		// Array to store options for mcq
		var answer = $("input[name=mcq]:checked").val();	// Answer of mcq
		$("#options").find("span").each(function() {
			optionsArray.push($(this).text());
		});

		if(optionsArray.length < 2) {		// If no of options is less than 2, show error
			$("#emptyOptions").css('display', 'block');
			return;
		}

		if(answer == null) {
			$("#emptyAnswer").css('display', 'block');
			return;
		}

		if($scope.setTopic == "Select Topic") {		// If no topic is selected, show error
			$("#emptyTopic").css('display', 'block');
			return;
		}

		console.log(question);
		console.log(optionsArray);
		console.log(answer);
		console.log($scope.setTopic);

		// http request to add question
		var testName;
		if(testPage == true) {
			testName = $("#tName").val().trim();
		}
		else {
			testName = null;
		}
		$http({
			method: "POST",
			url: "/addQues/",
			data: {
				question: question,
				answer: answer,
				options: optionsArray,
				topic: $scope.setTopic,
				test : testName,
			}
		}).then(function(response) {
			console.log("Response: " + response);
		});

		// Reset everything
		var form = document.getElementById("mcq_form");
		form.reset();
		$("#options").children().remove();
		$scope.setTopic = "Select Topic";

		swal({
			title: '<font color="#5cb85c">Success!</font>',
		  	text: 'You successfully created the question!',
		  	timer: 2000
			}).then(
		  	function () {},
		  	// handling the promise rejection
		  	function (dismiss) {
		    	if (dismiss === 'timer') {
		    		console.log('Error in creating question')
		    	}
		  	}
		)

		if(testPage == true) {
			$scope.showTestQues();
		}
	};

	// Add new test to test collection
	$scope.addNewTest = function() {
		var myTest = $("#tName").val().trim();
		var duration = $scope.testTime;
		
		$http({
			method: "POST",
			url: "/addNewTest",
			data: {
				test: myTest,
				time: duration
			}
		}).then(function(response) {
			$window.location.href="./Main.html";
		});
		
	}

	// Show all questions in sidebar
	$scope.sidebarQues = function() {
		$http({
			method: "POST",
			url: "/sidebarQues"
		}).then(function(response) {
			$scope.sideArr = response.data;
			// for(x in $scope.sideArr)
			// 	console.log($scope.sideArr[x].question);
		});
	}

	// Give names to checkboxes and radio buttons
	var index = 0;
	$scope.getName = function() {
		var chName = 'mcq'+index;
		index += 1;
		return chName;
	}

	// Show all selected questions for test
	$scope.showTestQues = function()
	{
		var sideSelectArr = new Array();
		for(i = 0; i < index; i++) {
			var x = $("input[name=mcq"+i+"]:checkbox:checked").val();
			if(x)
				sideSelectArr.push(x);
		}
		
		var testName = $("#tName").val().trim();
		if(testName.length == 0) {
			alert("Please enter a test name first!");
			return;
		}

		// Add selected questions from sidebar to test and return all questions selected for the test
		$http({
			method: "POST",
			url: "/testQues",
			data: {
				questions: sideSelectArr,
				test: testName,
			}
		}).then(function(response) {
			$scope.testQuesArr = response.data;
			// for(x in $scope.testQuesArr)
			//  	console.log($scope.testQuesArr[x].question);
		});
	}

	// Remove questions from current test
	removeTestQues = function(x) {
		var myQues = $(x).parent().find('span').text();
		var myTest = $("#tName").val().trim();
		console.log(myQues);

		$http({
			method: "POST",
			url: "/delTestQues",
			data: {
				ques: myQues,
				test: myTest
			}
		}).then(function(response) {
			console.log(response.data);
		});

		$(x).parent().remove();
	}

	// if($cookies.get('login') == 'false') {
	// 	alert('Please login to continue');
	// 	$window.location.href='./index.html';
	// }

	$scope.myText = $cookies.get('myUname');

	$scope.checkTeacher = function() {
		if($cookies.get('teacher') == "true")
			return true;
		else
			return false;
	}

	$scope.delAccount = function() {
		// http request to delete account
		$("#passMismatch").css('display', 'none');
		$("#invPass").css('display', 'none');

		var pass1 = $scope.delPass1;
		var pass2 = $scope.delPass2;

		if(pass1 == pass2) {
			$http({
				method: "POST",
				url: "/delAccount/",
				data: {
					userName: $cookies.get('myUname'),
					password: pass1,
				}
			}).then(function(response) {
				if(response.data == "yes") {
					$window.location.href='./index.html';
				}
				else {
					$("#invPass").css('display', 'block');
				}
			});
		}
		else {
			$("#passMismatch").css('display', 'block');
		}
		// window.location.href = "./Quiz.html#/check"
	}

	$scope.changePass = function() {
		$("#passMismatch2").css('display', 'none');
		$("#passMatch").css('display', 'none');

		var oldPass = $scope.changePass1;
		var newPass = $scope.changePass2;

		$http({
			method: "POST",
			url: "/changePass/",
			data: {
				userName: $cookies.get('myUname'),
				currPass: oldPass,
				nextPass: newPass,
			}
		}).then(function(response) {
			if(response.data == "no") {
				$("#passMismatch2").css('display', 'block');
			}
			else {
				$("#passMatch").css('display', 'block');
			}
		});
	}

	$scope.logout = function() {
		$cookies.put('login', 'false');
	 	$window.location.href='./index.html';
	}


	// Create challenge page

	// Add challenge
	$scope.addChallenge	= function() {
		// Clear every error message first
		$("#emptyChallenge").css('display', 'none');
		$("#emptyStatement").css('display', 'none');
		$("#emptyIpFormat").css('display', 'none');
		$("#emptyConstr").css('display', 'none');
		$("#emptyOpFormat").css('display', 'none');
		$("#emptyTCase").css('display', 'none');
		$("#emptyTopic").css('display', 'none');

		var challenge = $("#ch1").val().trim();
		if(challenge == "") {
			$("#emptyChallenge").css('display', 'inline');
			return;
		}

		var statement = $("#ch2").val().trim();
		if(statement == "") {
			$("#emptyStatement").css('display', 'inline');
			return;
		}

		var ip = $("#ch3").val().trim();
		if(ip == "") {
			$("#emptyIpFormat").css('display', 'inline');
			return;
		}

		var constr = $("#ch4").val().trim();
		if(constr == "") {
			$("#emptyConstr").css('display', 'inline');
			return;
		}

		var op = $("#ch5").val().trim();
		if(op == "") {
			$("#emptyOpFormat").css('display', 'inline');
			return;
		}

		var inputArray = new Array();		// Array to store test cases
		var outputArray = new Array();
		$("#options").find(".myInp").each(function() {
			inputArray.push($(this).html());
		});

		$("#options").find(".myOp").each(function() {
			outputArray.push($(this).html());
		});

		if(inputArray.length < 1) {		// If no of test cases is less than 1, show error
			$("#emptyTCase").css('display', 'block');
			return;
		}

		if($scope.setTopic == "Select Topic") {		// If no topic is selected, show error
			$("#emptyTopic").css('display', 'block');
			return;
		}

		console.log('Challenge ' + challenge);
		console.log('Stat ' + statement);
		console.log('ip ' + ip);
		console.log('constr ' + constr);
		console.log('op ' + op);
		console.log('topic ' + $scope.setTopic);
		console.log("Inputs: ");
		for(i in inputArray) {
			console.log(inputArray[i]);
		}

		console.log("Outputs:");
		for(i in outputArray) {
			console.log(outputArray[i]);
		}

		// http request to add challenge
		$http({
			method: "POST",
			url: "/addChallenge/",
			data: {
				challenge: challenge,
				statement: statement,
				ipFormat: ip,
				opFormat: op,
				constraints: constr,
				topic: $scope.setTopic,
				inputTC: inputArray,
				outputTC: outputArray,
			}
		}).then(function(response) {
			console.log("Response");
		});

		// Reset everything
		var form = document.getElementById("challenge_form");
		form.reset();
		$("#options").children().remove();
		$scope.setTopic = "Select Topic";

		swal({
			title: '<font color="#5cb85c">Success!</font>',
		  	text: 'You successfully created the question!',
		  	timer: 2000
			}).then(
		  	function () {},
		  	// handling the promise rejection
		  	function (dismiss) {
		    	if (dismiss === 'timer') {
		    		console.log('Timer expired')
		    	}
		  	}
		)
	}
});

// app.controller("testCtrl", function($scope, $http, $cookies, $window) {
// 	if($cookies.get('login') == 'false') {
// 		alert('Please login to continue');
// 		$window.location.href='./index.html';
// 	}

// 	$scope.myText = $cookies.get('myUname');

// 	$scope.checkTeacher = function() {
// 		if($cookies.get('teacher') == "true")
// 			return true;
// 		else
// 			return false;
// 	}

// 	$scope.delAccount = function() {
// 		// http request to delete account
// 		$("#passMismatch").css('display', 'none');
// 		$("#invPass").css('display', 'none');

// 		var pass1 = $scope.delPass1;
// 		var pass2 = $scope.delPass2;

// 		if(pass1 == pass2) {
// 			$http({
// 				method: "POST",
// 				url: "/delAccount/",
// 				data: {
// 					userName: $cookies.get('myUname'),
// 					password: pass1,
// 				}
// 			}).then(function(response) {
// 				if(response.data == "yes") {
// 					$window.location.href='./index.html';
// 				}
// 				else {
// 					$("#invPass").css('display', 'block');
// 				}
// 			});
// 		}
// 		else {
// 			$("#passMismatch").css('display', 'block');
// 		}
// 		// window.location.href = "./Quiz.html#/check"
// 	}

// 	$scope.changePass = function() {
// 		$("#passMismatch2").css('display', 'none');
// 		$("#passMatch").css('display', 'none');

// 		var oldPass = $scope.changePass1;
// 		var newPass = $scope.changePass2;

// 		$http({
// 			method: "POST",
// 			url: "/changePass/",
// 			data: {
// 				userName: $cookies.get('myUname'),
// 				currPass: oldPass,
// 				nextPass: newPass,
// 			}
// 		}).then(function(response) {
// 			if(response.data == "no") {
// 				$("#passMismatch2").css('display', 'block');
// 			}
// 			else {
// 				$("#passMatch").css('display', 'block');
// 			}
// 		});
// 	}

// 	$scope.logout = function() {
// 		$cookies.put('login', 'false');
// 	 	$window.location.href='./index.html';
// 	}

// 	$scope.check = window.location.hash.substr(1);
// 	console.log($scope.check);
// });