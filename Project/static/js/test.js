$(document).ready(function() {
	$("#menu-close").click(function() {
    	console.log("hello1");
    	$("#sidebar-wrapper").toggleClass("active");
	});
	$("#menu-toggle").click(function() {
	    console.log("hello2");
	    $("#sidebar-wrapper").toggleClass("active");
	});

	$("input[type=checkbox]").click(function() {
		if($(this).is(":checked")) {
			console.log($(this).parent().css("color"));
			console.log($(this).parent().css("background"));
			console.log($(this).parent().css("text-decoration"));
			$(this).parent().css("color", "#fff");
			$(this).parent().css("background", "#007AFF");
			$(this).parent().css("text-decoration", "none");
		}
		else {
			$(this).parent().css("background", "black");
		}
	})
});