function Particle() {
	this.x = 0;	
	this.y = 0;
	this.z = 0;
	this.isox = 0;
	this.isoy = 0;
	this.w = 16;
	this.h = 16;
	this.state = 0;
	this.lastStateChange = Date.now();
	this.type = 0;
	this.vx = 0;
	this.vy = 0;
	this.grav = 0;
	this.game;
	
	this.link = function(game) {
		this.game = game;
	}
	
	this.spawn = function(x, y) {
		this.x = x + Math.floor(Math.random() * 7) - 3;
		this.y = y + Math.floor(Math.random() * 7) - 3;
		this.grav = -15;
		this.vx = Math.floor(Math.random() * 3) - 1;
		this.vy = Math.floor(Math.random() * 2) - 1;
		if (this.vx == 0 && this.vy == 0) {
			this.vy = -1;
		}
		this.vx *= Math.floor(Math.random() * 5) + 5;
		this.vy *= Math.floor(Math.random() * 10) + 5;
		this.w = Math.floor(Math.random() * 6) + 5;
		this.h = this.w;
		this.state = 1;
		var rand = Math.floor(Math.random() * 4);
		this.type = 1;
		if (rand == 0) this.type = 0;
		this.lastStateChange = Date.now();
	}
	
	this.update = function() {
		if (this.state == 1) {
			this.x += this.vx;
			this.y += this.vy;
			this.y += this.grav;
			this.x += this.grav;
			this.w++;
			this.h++;
			if (this.type == 1) {
				this.grav += 2;
			}
			
			else {
				this.grav++;
			}
			
			if (Date.now() - this.lastStateChange > 400) {
				this.state = 0;
			}
		}
		
		var tile = this.game.map.getTileAt(this.x + this.w, this.y + this.h);
		this.z = tile.z;
	}

	this.render = function() {
		var locx = this.x - this.game.viewport.x;
		var locy = this.y - this.game.viewport.y;
		this.isox = (locx/TILE_W - locy/TILE_H)* 70;
		this.isoy = (locx/TILE_W + locy/TILE_H) * 40;
		if (this.type == 0) {
			this.game.context.fillStyle = "#FFFFFF";
			this.game.context.fillRect(this.isox + PAD_X, this.isoy + PAD_Y + this.grav, this.w, this.h);
		}
		else if (this.type == 1) {
			this.game.context.fillStyle = "#FF0000";
			this.game.context.fillRect(this.isox + PAD_X, this.isoy + PAD_Y + this.grav, this.w, this.h);
		}
	}
}