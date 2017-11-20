var app = angular.module("myRoute", ['ngRoute', 'ngCookies']);

anss = 0;
total = 0;
var getAns = function() {}
var getTotal = function() {}

app.config(function($routeProvider) {
	$routeProvider
	.when("/Stacks", {
		templateUrl: "templ.html",
	})
	.when("/Queues", {
		templateUrl: "templ.html",
	})
	.when("/Trees", {
		templateUrl: "templ.html",
	})
	.when("/Graphs", {
		templateUrl: "templ.html",
	})
	.otherwise("/", {
	});
});

app.controller("setActive", function($scope, $cookies, $window, $http, $route, $rootScope) {
	if($cookies.get('login') == 'false') {
		alert('Please login to continue');
		$window.location.href='./index.html';
	}

	$scope.check = window.location.hash.substr(2);	// Get the part of url after #
	$scope.myText = $cookies.get('myUname');

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
		window.location.href = "./Quiz.html#/check"
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

    $scope.closePopup = function() {
    	window.location.href = "./Quiz.html#/" + $scope.check;
    }

	$scope.logout = function() {
		$cookies.put('login', 'false');
		$window.location.href='./index.html';
	}

	$scope.setCheck = function(value) {
    	$scope.check = value;
    	// console.log($scope.check);
    }
    
	// Give names to dynamically added radio buttons.
	var index = 0;
	$scope.getName = function() {
		var radName = 'mcq'+index;
		index += 1;
		return radName;
	}

	var index1 = 0;
	$scope.getCheckClass = function() {
		var checkClass = 'mycheck'+index1;
		index1 += 1;
		return checkClass;
	}

	var index2 = 0;
	$scope.getSpanClass = function() {
		var spanClass = 'myspan'+index2;
		index2 += 1;
		return spanClass;
	}

	$scope.checkTeacher = function() {
		if($cookies.get('teacher') == "true")
			return true;
		else
			return false;
	}

	$scope.answers = new Array();
	// $scope.answers.push('Stack'); // Static for stack. To be removed later

	// Load questions for quiz.html page
	$scope.loadData = function(myUrl) {
		$http({
			method: "POST",
			url: '/getQues/',
			data: {
				topics: myUrl
			}
		}).then(function(response) {
			$scope.arr = response.data;
			for(x in $scope.arr) {
				// console.log("Question: " + $scope.arr[x].question);
				$scope.answers.push($scope.arr[x].answer);
			}
			console.log("Answers: " + $scope.answers);
		});
	};

	// Check which buttons are selected
	$scope.checkAns = function() {
		var checkedAns = new Array();
		for(i = 0; i < index; i++) {
			var x = $("input[name=mcq"+i+"]:radio:checked").val();
			console.log('Selected ' + x);
			if(x != null) {
				checkedAns.push(x);
			}
		}

		// Count no of correct answers
		var correct = 0;
		for(i = 0; i < checkedAns.length; i++) {
			if(checkedAns[i] == $scope.answers[i]) {
				correct += 1;
				console.log(checkedAns[i]);
			}
		}
		if(checkedAns.length != $scope.answers.length) {
			swal(
		  		"Check Again!",
		  		"Please answer all the questions!",
		  		"warning"
			)
			return;
		}
		else {
			if(correct == $scope.answers.length) {
				swal(
			  		"Good job!",
			  		"You've got all the answers correct!",
			  		"success"
				)
			}
			else {
				swal(
			  		"Try Again!",
			  		"You've got "+correct+" answers correct!",
			  		"error"
				)
			}
		}
		$(".right").css('display', 'inline');
		console.log("Correct Answers: " + correct);
	}

	$scope.getClass = function(op1, op2) {
		// console.log('Op1 & Op2 ' + op1 + " " + op2);
		if(op1 == op2)
			return "right";
		else
			return "right1";
	}

	$scope.showChecks = function() {
		$('.myCheckBtn').css('display', 'none');
		$('.myDelBtn1').css('display', 'inline');
		$('.myDelBtn2').css('display', 'inline');
		$('.mainDelBtn').css('display', 'none');

		for(i = 0; i < index2; i++) {
			$(".myspan"+i).css('display', 'inline');
		}
	}

	$scope.cancelDel = function() {
		$('.myDelBtn1').css('display', 'none');
		$('.myDelBtn2').css('display', 'none');
		$('.myCheckBtn').css('display', 'inline');
		$('.mainDelBtn').css('display', 'inline');

		for(i = 0; i < index2; i++) {
			$(".myspan"+i).css('display', 'none');
		}
	}

	// Delete questions from quiz.html/templ.html page
	$scope.deleteQues = function() {
		var checkedCheckbox = new Array();
		for(i = 0; i < index1; i++) {
			if($('.mycheck'+i+'').is(':checked')) {
				checkedCheckbox.push($('.mycheck'+i+'').val());
			}
		}

		if(checkedCheckbox.length == 0) {
			alert("Please select atleast one question.");
			return;
		}

		$http({
			method: "POST",
			url: '/delQues/',
			data: {
				quesArr: checkedCheckbox,
			}
		}).then(function(response) {
			console.log(response.data);
			$route.reload();
		});
	}


	// Test1.html page
	$scope.loadTest = function() {
		var tName = $scope.check;  // Get test name from url
		$scope.tAns = new Array();

		// http request to get questions for a particular test
		$http({
			method: "POST",
			url: '/showTest/',
			data: {
				test: tName
			}
		}).then(function(response) {
			$scope.tArr = response.data;
			for(x in $scope.tArr) {
				// console.log("Question: " + $scope.tArr[x].question);
				$scope.tAns.push($scope.tArr[x].answer);
			}
			// console.log("Answers: " + $scope.answers);
		});


		// Timer function

		// http request to get value of test duration for a user
		var uName = $cookies.get('myUname');
		
		$http({
			method: "POST",
			url: '/getUserTestTime/',
			data: {
				test: tName,
				user: uName
			}
		}).then(function(response) {
			var res = response.data;
			for(x in res) {
				console.log(res[x]);
				console.log(res[x].name);
				console.log(res[x].time);

				if(res[x].name == uName) {	// User tries to re-open test
					// $scope.timerDuration = res[x].time;
					var openTime = res[x].time;		// Time at which user first opened the test
					var d = new Date();
					var currTime = d.getTime();		// Current time

					// http req to find total duration of test
					$http({
						method: "POST",
						url: "/getTestTime/",
						data: {
							test: tName
						}
					}).then(function(response) {
						var duration = response.data;
						console.log("open: " + openTime);
						console.log("curr: " + currTime)
						console.log("duration: " + duration);
						console.log("Remaining: " + Math.ceil(duration - (currTime - openTime)/1000));
						$rootScope.timerDuration = Math.ceil(duration - (currTime - openTime)/1000);
						if($rootScope.timerDuration <= 0) {
							$rootScope.timerDuration = 0;

								swal(
					    				"You have already taken this test!"
									).then(function() {
										window.location = './Main.html';
									}).catch(function() {
										window.location = './Main.html';	
									});
							 //setTimeout(function(){$window.location.href = './Main.html'},2000);
							return;
						}
						console.log("Inner Timer duration1: " + $rootScope.timerDuration);

						console.log("Timer duration1: " + $rootScope.timerDuration);
						clock = $('.clock').FlipClock($rootScope.timerDuration, {
							clockFace: 'MinuteCounter',
					        countdown: true,
					        callbacks: {
					        	stop: function() {
					        		var checkedAns = new Array();
									for(i = 0; i < index; i++) {
										var x = $("input[name=mcq"+i+"]:radio:checked").val();
										console.log('Selected ' + x);
										checkedAns.push(x);
									}

									// Count no of correct answers
									var correct = 0;
									for(i = 0; i < checkedAns.length; i++) {
										if(checkedAns[i] == $scope.tAns[i]) {
											correct += 1;
											console.log(checkedAns[i]);
										}
									}
					        		swal(
					    				"Result",
						    			"You've got " + correct + " out of " + $scope.tAns.length + " answers correct!",
						    			"success"
									).then(function() {
										// Store marks in database
										$http({
												method: "POST",
												url: "/setTestMarks/",
												data: {
													test: tName,
													user: uName,
													marks: correct
												}
											}).then(function(response) {
												console.log("Added marks to db");	
											});
										window.location = './Main.html';
									}).catch(function() {
										window.location = './Main.html';	
									});
									
					        	}
					        }
					    });
					});
					break;
				}
			}
		});
	}

	// Check test answers
	$scope.checkTestAns = function() {
		var checkedAns = new Array();
		for(i = 0; i < index; i++) {
			var x = $("input[name=mcq"+i+"]:radio:checked").val();
			console.log('Selected ' + x);
			checkedAns.push(x);
		}

		// Count no of correct answers
		var correct = 0;
		for(i = 0; i < checkedAns.length; i++) {
			if(checkedAns[i] == $scope.tAns[i]) {
				correct += 1;
				console.log(checkedAns[i]);
			}
		}

		var tName = $scope.check;
		var uName = $cookies.get('myUname');

		swal({
			title: "Are you sure?",
			text: "You won't be able to change the answers again!",
	    	type: "warning",
	    	showCancelButton: true,
	  		confirmButtonColor: "#3085d6",
	  		cancelButtonColor: "#d33",
	  		confirmButtonText: "Confirm"
		}).then(function() {
			swal(
    			"Result",
	    		"You've got " + correct + " out of " + $scope.tAns.length + " answers correct!",
	    		"success"
			).then(function() {
				// Store marks in database
				$http({
						method: "POST",
						url: "/setTestMarks/",
						data: {
							test: tName,
							user: uName,
							marks: correct
						}
					}).then(function(response) {
						console.log("Added marks to db");	
					});
				$window.location.href = './Main.html';
			})
		})
			// if(correct == $scope.tAns.length) {
			// 	swal(
			//   		"Good job!",
			//   		"You've got all the answers correct!",
			//   		"success"
			// 	)
			// }
			// else {
			// 	swal(
			//   		"Try Again!",
			//   		"You've got " + correct + " answers correct!",
			//   		"error"
			// 	)
			// }
		// $(".right").css('display', 'inline');
		console.log("Correct Answers: " + correct);
	}


	// Main page controller

	// Get test names for main.html page
	$scope.loadTestNames = function() {
		$http({
			method: "POST",
			url: "/testNames",
		}).then(function(response) {
			$scope.tNameArr = response.data;
			// for(x in $scope.tNameArr) {
			//  	console.log($scope.tNameArr[x]);
			//  	for(y in $scope.tNameArr[x].test) {
			//  		console.log($scope.tNameArr[x].test[y]);
			//  	}
			// }
		});
	};

	var curr = 0;	// Set different margin for each test button
	$scope.getMargin = function() {
		var c = curr+"px";
		curr = curr + 200;
		return c;
	}

	$scope.flip = function($event) {
		$($event.currentTarget).addClass("flip");
		// $event.target.addClass('flip');
	}
	$scope.unFlip = function($event) {
		$($event.currentTarget).removeClass("flip");
		// $event.target.removeClass('flip');
	}


	// Add test start time to database
	$scope.updateTime = function(myTest) {
		console.log("Test name: " + myTest);
		var uname = $cookies.get('myUname');
		var d = new Date();
		var currTime = d.getTime();

		$http({
			method: "POST",
			url: "/updateTestTime/",
			data: {
				test: myTest,
				user: uname,
				time: currTime
			}
		}).then(function(response) {
			console.log(response.data);
		});
	}

	// CodingQues.html page
	$scope.loadChallengeNames = function() {
		console.log($scope.check);

		// http request to fetch test names from database
		$http({
			method: "POST",
			url: "/getChallengeNames/",
			data: {
				topic: $scope.check
			}
		}).then(function(response) {
			$scope.cNames = response.data;
		});
	}

	// Delete questions
	// $scope.deleteChall = function() {
	// 	alert("Please select a question");
	// 	$(".list").click(function() {
	// 		var challenge = $(this).text().trim();
			
	// 		 $http({
	// 			method: "POST",
	// 			url: "/deleteChall/",
	// 			data: {
	// 				challenge: challenge
	// 			}
	// 		}).then(function(response) {
	// 			console.log("Deleted");
	// 		});

	// 		$window.location.reload();
	// 	});
	// }


		$scope.deleteChall=function(){

			swal("Please select the question");
			$(".list").click(function(){
				var challenge = $(this).text().trim();
			
			 $http({
				method: "POST",
				url: "/deleteChall/",
				data: {
					challenge: challenge
				}
			}).then(function(response) {
				console.log("Deleted");
			});

			swal("Deleted", "This challenge has been deleted", "success");
			$window.location.reload();
		});
		}
	});

