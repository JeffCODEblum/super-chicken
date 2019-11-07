function Hud() {
	this.score = 0;
	this.title;
	this.game;
	this.titleY = 0;
	this.link = function(game) {
		this.game = game;
		this.title = this.game.spriteSet.title;
	}
	
	this.update = function() {
		this.titleY += 10;
		if (this.titleY >350) {
			this.titleY = 350;
		}
	}
	
	this.render = function() {
		if (this.game.state == 0) {
			this.game.context.drawImage(this.game.graphics, this.title.srcx, this.title.srcy, this.title.w, this.title.h, (CANVAS_W - this.title.w)/2, -320 + this.titleY, this.title.w, this.title.h);
		}
		else {
			this.game.context.font = "38px Arial";
			this.game.context.fillStyle = "#000000";
			this.game.context.fillText("" + this.score, 330 + 4, 54);
			this.game.context.fillText("" + this.score, 330 + 2, 52);
			this.game.context.fillStyle = "#FFFFFF";
			this.game.context.fillText("" + this.score, 330, 50);
		}
	}
}