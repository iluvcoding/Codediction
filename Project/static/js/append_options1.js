$(document).ready(function() {
	$("#b1").click(function() {
		var v = $("#i1").val().trim();
		if(v != "")
			$("#options").append("<div data-toggle='buttons'><label class='btn active'><input type='radio' name='mcq' value='"+v+"' required><i class='fa fa-circle-o fa-2x'></i><i class='fa fa-dot-circle-o fa-2x'></i>&nbsp; &nbsp;<span>"+v+"</span></label>&nbsp; &nbsp;<button class='btn btn-danger btn-xs' style='margin-top: 1%;' onclick='del(this)'><div class='glyphicon glyphicon-remove'></div> Remove</button><br><br></div>");
		$("#i1").val("");
	});
});

function del(x) {
	$(x).parent().remove();
}