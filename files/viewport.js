function Viewport() {
	this.x = 0;
	this.y = 0;
	this.w = CANVAS_W;
	this.h = CANVAS_H;
	this.game;
	this.link = function(game) {
		this.game = game;
	}

	this.update = function() {
		//console.log(this.x, this.y);
		
	}
}