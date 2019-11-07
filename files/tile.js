function Tile() {
	this.type = 0;
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.isox = 0;
	this.isoy = 0;
	this.mark = 0;

	this.w = TILE_W;
	this.h = TILE_H;
	this.solid = 0;
	this.game;
	this.sprite;
	
	this.link = function(game) {
		this.game = game;
		this.sprite = this.game.spriteSet.grass1;
	}

	this.render = function() {
		var locx = this.x - this.game.viewport.x;
		var locy = this.y - this.game.viewport.y;
		this.isox = (locx/this.w - locy/this.h)* 70;
		this.isoy = (locx/this.w + locy/this.h) * 40;
		//
		//this.isox = locx;
		//this.isoy = locy;
		//
		this.game.context.drawImage(this.game.graphics, this.sprite.srcx, this.sprite.srcy, this.sprite.w, this.sprite.h, Math.round(this.isox) + PAD_X, Math.round(this.isoy) + PAD_Y - (this.sprite.h - 160), this.sprite.w, this.sprite.h);
	}
}