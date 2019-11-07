function PowerUp() {
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.isox = 0;
	this.isoy = 0;
	this.jumpY = 0;
	this.game;
	this.state = 0;
	this.sprite;
	
	this.link = function(game) {
		this.game = game;
		this.sprite = this.game.spriteSet.coffee;
	}

	this.spawn = function(x, y) {
		this.x = x;
		this.y = y;
		this.state = 1;
	}
	
	this.update = function() {
		if (this.state == 1) {
			this.jumpY += 1;
			if (this.jumpY > 20) {
				this.jumpY = 20;
				this.state = 2;
			}
		}
		else if (this.state == 2) {
			this.jumpY -= 1;
			if (this.jumpY < 0) {
				this.jumpY = 0;
				this.state = 1;
			}
		}
	}

	this.render = function() {
		var locx = this.x - this.game.viewport.x;
		var locy = this.y - this.game.viewport.y;
		this.isox = (locx/TILE_W - locy/TILE_H)* 70;
		this.isoy = (locx/TILE_W + locy/TILE_H) * 40;

		this.game.context.drawImage(this.game.graphics, this.sprite.srcx, this.sprite.srcy, this.sprite.w, this.sprite.h, Math.round(this.isox) + PAD_X + 40, Math.round(this.isoy) + PAD_Y - 60 - this.jumpY, this.sprite.w, this.sprite.h);
	}
}