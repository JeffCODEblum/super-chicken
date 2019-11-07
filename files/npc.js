function Npc() {
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.vx = 0;
	this.vy = 0;
	this.isox = 0;
	this.isoy = 0;
	this.state = 0;
	this.lastStateChange = 0;
	this.stepCount = 0;
	this.jumpY = 0;
	this.direction = 0;
	this.game;
	this.sprite;
	
	this.link = function(game) {
		this.game = game;
		this.sprite = this.game.spriteSet.fox1;
	}

	this.lookForPlayer = function() {
		var found = false;
		if (this.direction == 0) { // right
			if (this.game.player.x > this.x && this.game.player.y == this.y) {
				found = true;
			}
		}
		else if (this.direction == 1) { // left
			if (this.game.player.x < this.x && this.game.player.y == this.y) {
				found = true;
			}
		}
		else if (this.direction == 2) { // down
			if (this.game.player.y > this.y && this.game.player.x == this.x) {
				found = true;
			}
		}
		else if (this.direction == 3) { // up
			if (this.game.player.y < this.y && this.game.player.x == this.x) {
				found = true;
			}
		}
		
		var dx = this.x - this.game.player.x;
		var dy = this.y - this.game.player.y;
		var dist = Math.sqrt(dx * dx + dy * dy);
		if (dist < 300) {
			found = true;
		}
		if (found) {
			this.vx = 0;
			this.vy = 0;
			if (this.x < this.game.player.x) {
				if (this.game.player.poweredUp) {
					this.direction = 1;
					this.sprite = this.game.spriteSet.fox4;
					this.vx = -1;
				}
				else {
					this.direction = 0;
					this.sprite = this.game.spriteSet.fox2;
					this.vx = 1;
				}
			}
			else if (this.x > this.game.player.x) {
				if (this.game.player.poweredUp) {
					this.direction = 0;
					this.sprite = this.game.spriteSet.fox2;
					this.vx = 1;
				}
				else {
					this.direction = 1;
					this.sprite = this.game.spriteSet.fox4;
					this.vx = -1;
				}
			}
			else if (this.y < this.game.player.y) {
				if (this.game.player.poweredUp) {
					this.direction = 3;
					this.sprite = this.game.spriteSet.fox3;
					this.vy = -1;
				}
				else {
					this.direction = 2;
					this.sprite = this.game.spriteSet.fox1;
					this.vy = 1;
				}
			}
			else if (this.y > this.game.player.y) {
				if (this.game.player.poweredUp) {
					this.direction = 2;
					this.sprite = this.game.spriteSet.fox1;
					this.vy = 1;
				}
				else {
					this.direction = 3;
					this.sprite = this.game.spriteSet.fox3;
					this.vy = -1;
				}
			}
		}

		return found;
	}

	this.update = function() {
		if (this.state == 0) return;	
		// choose to wait or walk
		if (this.state == 1) {
			var agro = this.lookForPlayer();
			if (agro == true) {
				this.state = 4;
				return;
			}
			var rand = Math.floor(Math.random() * 4);
			if (rand == 0) {
				this.state = 2;
				this.lastStateChange = Date.now();
			}
			else {
				this.state = 3;
				this.lastStateChange = Date.now();
			}
		}
		// wait
		else if (this.state == 2) {
			var agro = this.lookForPlayer();
			if (agro == true) {
				this.state = 4;
				return;
			}
			if (Date.now() - this.lastStateChange > 1000) {
				this.state = 1;
				this.lastStateChange = Date.now();
			}
		}
		// pick a direction
		else if (this.state == 3) {
			var rand = Math.floor(Math.random() * 2);
			if (rand == 0) {
				// pick a new direction
				this.vx = 0;
				this.vy = 0;
				var rand = Math.floor(Math.random() * 4);
				if (rand == 0) {
					this.direction = 0;
					this.vx = 1;
					this.sprite = this.game.spriteSet.fox2;
				}
				else if (rand == 1) {
					this.direction = 1;
					this.vx = -1;
					this.sprite = this.game.spriteSet.fox4;
				}
				else if (rand == 2) {
					this.direction = 2;
					this.vy = 1;
					this.sprite = this.game.spriteSet.fox1;
				}
				else if (rand == 3) {
					this.direction = 3;
					this.vy = -1;
					this.sprite = this.game.spriteSet.fox3;
				}
			}
			this.stepCount = 0;
			this.state = 4;
			this.lastStateChange = Date.now();
		}
		// check if way is clear
		else if (this.state == 4) {
			var moveOk = true;
			var nextTile = this.game.map.getTileAt(this.x + 50 + (TILE_W * this.vx), this.y + 50 + (TILE_H * this.vy));

			if (nextTile.solid == 1 || nextTile == this.game.map.eastDoor || nextTile == this.game.map.northDoor) {
				moveOk = false;
			}
			for (var i = 0; i < this.game.npcEngine.npcs.length; i++) {
				var npc = this.game.npcEngine.npcs[i];
				if (npc.state != 0 && npc != this) {
					if(npc.x == this.x + (TILE_W * this.vx) && npc.y == this.y + (TILE_H * this.vy)) {
						moveOk = false;
					}
				}
			}

			if (moveOk) {
				// path is clear
				this.state = 5;
				this.stepCount = 0;
			}
			else {
				// path is not clear
				this.state = 3;
			}
		}
		
		// walk
		else if (this.state == 5) {
			this.x += this.vx * 20;
			this.y += this.vy * 20;
			this.jumpY += 6;
			this.stepCount++;
			if (this.stepCount >= 3) {
				this.state = 6;
				this.lastStateChange = Date.now();
			}
		}
		else if (this.state == 6) {
			this.jumpY -= 6;
			if (this.jumpY < 0) {
				this.jumpY = 0;
			}
			this.x += this.vx * 20;
			this.y += this.vy * 20;
			this.stepCount++;
			if (this.stepCount >= 7) {
				this.stepCount = 0;
				this.state = 7;
				this.lastStateChange = Date.now();
			}
		}
		else if (this.state == 7) {
			if (Date.now() - this.lastStateChange > 150) {
				this.state = 1;
				this.lastStateChange = Date.now();
			}
		}
		else if (this.state == 8) {
			this.jumpY +=2;
			if (this.jumpY > 10) {
				this.jumpY = 10;
				this.state = 9;
			}
		}
		else if (this.state == 9) {
			this.jumpY -= 2;
			if (this.jumpY < 0) {
				this.jumpY = 0;
				this.state = 8;
			}
		}
		if (this.state != 8 && this.state != 9) {
			var tile = this.game.map.getTileAt(this.x + 50, this.y + 50);
			this.z = tile.z;
		}
	}

	this.spawn = function() {
		this.state = 1;
		var tile = this.game.map.getNpcSpawn();
		if (tile == false) return false;
		this.x = tile.x;
		this.y = tile.y;
		this.z = tile.z + MAP_W + 1;
		/*
			this.x = 0;
			this.y = 0;
			this.z = 1;
		*/
		return true;
	}

	this.render = function() {
		if (this.state == 0) return;
		var locx = this.x - this.game.viewport.x;
		var locy = this.y - this.game.viewport.y;
		this.isox = (locx/TILE_W - locy/TILE_H)* 70;
		this.isoy = (locx/TILE_W + locy/TILE_H) * 40;

		//this.isox = locx;
		//this.isoy = locy;
		var pointx = this.x;
		var pointy = this.y;
		var pointLocx = pointx - this.game.viewport.x;
		var pointLocy = pointy - this.game.viewport.y;
		var pointIsox = (pointLocx/TILE_W - pointLocy/TILE_H) * 70;
		var pointIsoy = (pointLocx/TILE_W + pointLocy/TILE_H) * 40;
		this.game.context.fillStyle = "#FF0000";
		//this.game.context.fillRect(pointIsox + 250, pointIsoy + 100, 40, 40);

		this.game.context.drawImage(this.game.graphics, this.sprite.srcx, this.sprite.srcy, this.sprite.w, this.sprite.h, Math.round(this.isox) + PAD_X + 20, Math.round(this.isoy) + PAD_Y - 40 - this.jumpY - (this.sprite.h - 100), this.sprite.w, this.sprite.h);
	}
}