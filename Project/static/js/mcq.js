$(document).ready(function() {

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
            $(".containers").css("margin-top", "340px");
        }
        else if($(window).width() < 760) {
            $(".containers").css("margin-top", "190px");
        }
        else {
            $(".containers").css("margin-top", "100px");
        }
    });
})