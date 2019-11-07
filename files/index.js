
var game = new Game();

document.getElementById("canvas").style.width = "400px";
document.getElementById("canvas").style.height = "600px";
CANVAS_W = 400;
PAD_X = 200;
PAD_Y = 150;
CANVAS_H = 600;

function Run() {
	game.update();
	setTimeout(Run, 1000/60);
}
Run();

document.addEventListener('keydown', function(e) {
	if (e.keyCode == 87) {
		game.ctrl.w = 1;
	}
	if (e.keyCode == 65) {
		game.ctrl.a = 1;
	}
	if (e.keyCode == 83) {
		game.ctrl.s = 1;
	}
	if (e.keyCode == 68) {
		game.ctrl.d = 1;
	}

	else if (e.keyCode == 38) {
		game.ctrl.up2 = 1;
	}
	else if (e.keyCode == 40) {
		game.ctrl.down2 = 1;
	}
	else if (e.keyCode == 37) {
		game.ctrl.left2 = 1;
	}
	else if (e.keyCode == 39) {
		game.ctrl.right2 = 1;
	}
});

document.addEventListener('keyup', function(e) {
	if (e.keyCode == 87) {
		game.ctrl.w = 0;
	}
	if (e.keyCode == 65) {
		game.ctrl.a = 0;
	}
	if (e.keyCode == 83) {
		game.ctrl.s = 0;
	}
	if (e.keyCode == 68) {
		game.ctrl.d = 0;
	}

	else if (e.keyCode == 38) {
		game.ctrl.up2 = 0;
	}
	else if (e.keyCode == 40) {
		game.ctrl.down2 = 0;
	}
	else if (e.keyCode == 37) {
		game.ctrl.left2 = 0;
	}
	else if (e.keyCode == 39) {
		game.ctrl.right2 = 0;
	}
});

var touch = {
	x: 0,
	y: 0
};

document.addEventListener('touchstart', function(e) {
	if (game.state == 0) game.state = 1;
	touch.x = e.touches[0].pageX;
	touch.y = e.touches[0].pageY;
});

document.addEventListener('touchmove', function(e) {
	e.preventDefault();
	var dx = touch.x - e.touches[0].pageX;
	var dy = touch.y - e.touches[0].pageY;
	if (dx > 100 && Math.abs(dy) < 100) {
		console.log("left swipe");
		game.ctrl.leftSwipe = 1;
	}
	else if (dx < -100 && Math.abs(dy) < 100) {
		console.log("right swipe");
		game.ctrl.rightSwipe = 1;
	}
	else if (dy > 100 && Math.abs(dx) < 100) {
		console.log("up swipe");
		game.ctrl.upSwipe = 1;
	}
	else if (dy < -100 && Math.abs(dx) < 100) {
		console.log("down swipe");
		game.ctrl.downSwipe = 1;
	}
});

document.addEventListener('touchend', function(e) {
	touch.x = 0;
	touch.y = 0;
	game.ctrl.upSwipe = 0;
	game.ctrl.downSwipe = 0;
	game.ctrl.leftSwipe = 0;
	game.ctrl.rightSwipe = 0;
});