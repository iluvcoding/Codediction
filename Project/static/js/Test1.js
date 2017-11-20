$(document).ready(function() {
	clock = $('.clock').FlipClock(3600, {
		clockFace: 'MinuteCounter',
        countdown: true,
        callbacks: {
        	stop: function() {
        		window.location = "./main.html";
        	}
        }
    });
});