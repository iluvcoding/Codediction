$(document).ready(function(){
    $(".push_menu").click(function(){
        $(".wrapper").toggleClass("active");
    });

    $("div.menu > li > a").click(function() {
        $("div.menu > li > a").removeClass("active");
        $(this).addClass("active");
    });

    $(window).resize(function() {
    	if($(window).width() < 760) {
    		$(".wrapper").addClass("active");
    	}
    	else {
    		$(".wrapper").removeClass("active");
    	}
        if($(window).width() > 760 && !($("#checkButt").hasClass("collapsed"))) {
            $(".containers").css("margin-top", "100px");
        }
        if($(window).width() > 760) {
            $("#bs-example-navbar-collapse-1").removeClass("in");
            $("#checkButt").attr("aria-expanded", "false");
            $("#bs-example-navbar-collapse-1").attr("aria-expanded", "false");
            $("#checkButt").addClass("collapsed");
        }
        $("#newId").css('height', $(window).height() - 105);
    });

    $("#checkButt").click(function() {
        if($("#checkButt").hasClass("collapsed")) {
            $(".containers").css("margin-top", "240px");
        }
        else {
            $(".containers").css("margin-top", "100px");
        }
        $(".containers").css("-webkit-transition", "all 0.2s");
        $(".containers").css("-moz-transition", "all 0.2s");
        $(".containers").css("-o-transition", "all 0.2s");
        $(".containers").css("transition", "all 0.2s");
    });


    $("#user").click(function() {
        if($(window).width() < 760 && !($("#padd").hasClass("open"))) {
            $(".containers").css("margin-top", "312px");
        }
        else if($(window).width() < 760) {
            $(".containers").css("margin-top", "190px");
        }
        else {
            $(".containers").css("margin-top", "100px");
        }
    });

    if($(window).width() < 760) {
        $(".wrapper").addClass("active");
    }

    $("#newId").css('height', $(window).height() - 105);
});