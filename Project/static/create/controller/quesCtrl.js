var app = angular.module("Ques",["myApp"]);

app.controller("QuesCtrl", function($scope, shareUname) {
	$scope.f = function() {
		console.log(shareUname.uname);
	}
});