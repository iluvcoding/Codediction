$(document).ready(function() {
	$("#b1").click(function() {
		var v = $("#i1").val().trim();
		var x = $("#i2").val().trim();
		if(v != "" && x != "")
			$("#options").append("<div data-toggle='buttons'><label class='btn active'><input type='radio' name='mcq' value='"+v+"' required><i class='fa fa-circle-o fa-2x'></i><i class='fa fa-dot-circle-o fa-2x'></i>&nbsp; &nbsp;<span class='myInp'>"+v+"</span></label><label class='btn active' style='margin-left: 5px';><input type='radio' name='mcq' value='"+x+"' required><i class='fa fa-circle-o fa-2x'></i><i class='fa fa-dot-circle-o fa-2x'></i>&nbsp; &nbsp;<span class='myOp'>"+x+"</span></label>&nbsp; &nbsp;<button class='btn btn-danger btn-xs' style='margin-top: 1%;' onclick='del(this)'><div class='glyphicon glyphicon-remove'></div> Remove</button><br><br></div>");
		$("#i1").val("");
		$("#i2").val("");
	});
});

function del(x) {
	$(x).parent().remove();
}