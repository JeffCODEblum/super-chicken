function Player() {
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.isox = 0;
	this.isoy = 0;
	this.jumpY = 0;

	this.vx = 0;
	this.vy = 0;
	this.stepCount = 0;
	this.state = 0;
	this.lastStateChange = Date.now();

	this.poweredUp = false;
	this.powerRunOut = false;
	this.lastPowerUp = 0;

	this.game;
	this.sprite;
	this.link = function(game) {
		this.game = game;
		this.sprite = this.game.spriteSet.chicken1;
	}

	this.setSprites = function() {
		if (this.poweredUp && !this.powerRunOut) {
			if (this.sprite == this.game.spriteSet.chicken1) {
				this.sprite = this.game.spriteSet.superChicken1;
			}
			else if (this.sprite == this.game.spriteSet.chicken2) {
				this.sprite = this.game.spriteSet.superChicken2;
			}
			else if (this.sprite == this.game.spriteSet.chicken3) {
				this.sprite = this.game.spriteSet.superChicken3;
			}
			else if (this.sprite == this.game.spriteSet.chicken4) {
				this.sprite = this.game.spriteSet.superChicken4;
			}
		}
		else if (!this.poweredUp || this.powerRunOut) {
			if (this.sprite == this.game.spriteSet.superChicken1) {
				this.sprite = this.game.spriteSet.chicken1;
			}
			else if (this.sprite == this.game.spriteSet.superChicken2) {
				this.sprite = this.game.spriteSet.chicken2;
			}
			else if (this.sprite == this.game.spriteSet.superChicken3) {
				this.sprite = this.game.spriteSet.chicken3;
			}
			else if (this.sprite == this.game.spriteSet.superChicken4) {
				this.sprite = this.game.spriteSet.chicken4;
			}
		}
	}

	this.update = function() {
		if (this.poweredUp && Date.now() - this.lastPowerUp > 4000) {
			this.powerRunOut = true;
		}
		if (this.poweredUp && Date.now() - this.lastPowerUp > 5000) {
			this.powerRunOut = false;
			this.poweredUp = false;
		}
		if (this.state == 0) {
			var willMove = false;
			this.vx = 0;
			this.vy = 0;
			if (this.game.ctrl.w || this.game.ctrl.up2 || this.game.ctrl.upSwipe) {
				this.vy = -1;
				this.sprite = this.game.spriteSet.chicken1;
				willMove = true;
			}
			else if (this.game.ctrl.s || this.game.ctrl.down2 || this.game.ctrl.downSwipe) {
				this.sprite = this.game.spriteSet.chicken2;
				this.vy = 1;
				willMove = true;
			}
			else if (this.game.ctrl.a || this.game.ctrl.left2 || this.game.ctrl.leftSwipe) {
				this.sprite = this.game.spriteSet.chicken4;
				this.vx = -1;
				willMove = true;
			}
			else if (this.game.ctrl.d || this.game.ctrl.right2 || this.game.ctrl.rightSwipe) {
				this.sprite = this.game.spriteSet.chicken3;
				this.vx = 1;
				willMove = true;
			}
			this.game.ctrl.upSwipe = 0;
			this.game.ctrl.downSwipe = 0;
			this.game.ctrl.leftSwipe = 0;
			this.game.ctrl.rightSwipe = 0;

			this.setSprites();
			if (willMove) {
				var hitFox = false;
				for (var i = 0; i < this.game.npcEngine.npcs.length; i++) {
					var npc = this.game.npcEngine.npcs[i];
					if (npc.state != 0) {
						if(npc.x == this.x + this.vx * TILE_W && npc.y == this.y + this.vy * TILE_H) {
							hitFox = npc;
						}
					}
				}
				if (hitFox != false) {
					if (this.poweredUp) {
						this.game.hit1Sound.currentTime = 0;
						this.game.hit1Sound.play();
						this.game.hud.score += 5;
						hitFox.state = 0;
						hitFox.jumpY = 0;
					}
					else return;
				}
				
				var nextTile = this.game.map.getTileAt(this.x + this.vx * TILE_W, this.y + this.vy *TILE_H);
				if (nextTile.solid == 0) {
					this.game.boopSound.currentTime = 0;
					this.game.boopSound.play();
					this.state = 1;
					this.lastStateChange = Date.now();
					this.stepCount = 0;
				}
			}
		}

		else if (this.state == 1) {
			this.jumpY += 6;
			this.x += this.vx * 20;
			this.y += this.vy * 20;
			this.game.viewport.x += this.vx * 20;
			this.game.viewport.y += this.vy * 20;
			this.stepCount++;
			if (this.stepCount >= 3) {
				this.state = 2;
				this.lastStateChange = Date.now();
			}
		}

		else if (this.state == 2) {
			this.jumpY -= 6;
			if (this.jumpY < 0) {
				this.jumpY = 0;
			}
			this.x += this.vx * 20;
			this.y += this.vy * 20;
			this.game.viewport.x += this.vx * 20;
			this.game.viewport.y += this.vy * 20;
			this.stepCount++;
			if (this.stepCount >= 7) {
				this.state = 3;
				this.lastStateChange = Date.now();
			}
		}

		else if (this.state == 3) {
			this.jumpY = 0;
			if (Date.now() - this.lastStateChange > 50) {
				this.state = 0;
				this.lastStateChange = Date.now();
			}
		}

		// hit check with foxes
		for (var i = 0; i < this.game.npcEngine.npcs.length; i++) {
			var npc = this.game.npcEngine.npcs[i];
			if (npc.state != 0) {
				if(npc.x == this.x && npc.y == this.y) {
					if (this.poweredUp) {
						this.game.hit1Sound.currentTime = 0;
						this.game.hit1Sound.play();
						this.game.hud.score += 5;
						npc.state = 0;
						npc.jumpY = 0;
					}
					else {
						this.game.gongSound.currentTime = 0;
						this.game.gongSound.play();
						npc.state = 8;
						npc.jumpY = 0;
						npc.z = this.z + 1;
						this.game.particleEngine.spawnExplosion(this.x + 25, this.y);
						this.game.state = 3;
						this.game.lastStateChange = Date.now();
					}
				}
			}
		}

		// hit check with powerUps
		for (var i = 0; i < this.game.powerUpEngine.powerUps.length; i++) {
			var powerUp = this.game.powerUpEngine.powerUps[i];
			if (powerUp.state != 0) {
				if(powerUp.x == this.x && powerUp.y == this.y) {
					this.game.powerSound.currentTime = 0;
					this.game.powerSound.play();
					this.game.hud.score += 5;
					powerUp.state = 0;
					this.poweredUp = true;
					this.lastPowerUp = Date.now();
				}
			}
		}

		// hit check doors
		if (this.x == this.game.map.eastDoor.x && this.y == this.game.map.eastDoor.y) {
			for (var i = 0; i < 1000; i++) {
				if (this.game.map.createWorld()) break;
			}
			this.game.hud.score += 10;
			this.game.npcEngine.reset();
			this.game.npcEngine.spawn();
			this.game.npcEngine.spawn();
			this.game.powerUpEngine.reset();
			this.game.powerUpEngine.spawn();
			this.game.powerUpEngine.spawn();
			var startTile = this.game.map.westDoor;
			this.x = startTile.x;
			this.y = startTile.y;
			this.game.viewport.x = this.x - CANVAS_W/2;
			this.game.viewport.y = this.y - CANVAS_H/2;
			this.game.map.southDoor.type = 5;
			this.game.map.southDoor.solid = 1;
			this.game.map.southDoor.sprite = this.game.spriteSet.blank;
		}
		if (this.x == this.game.map.northDoor.x && this.y == this.game.map.northDoor.y) {
			for (var i = 0; i < 1000; i++) {
				if (this.game.map.createWorld()) break;
			}
			this.game.hud.score += 10;
			this.game.powerUpEngine.reset();
			this.game.powerUpEngine.spawn();
			this.game.powerUpEngine.spawn();
			this.game.npcEngine.reset();
			this.game.npcEngine.spawn();
			this.game.npcEngine.spawn();
			var startTile = this.game.map.southDoor;
			this.x = startTile.x;
			this.y = startTile.y;
			this.game.viewport.x = this.x - CANVAS_W/2;
			this.game.viewport.y = this.y - CANVAS_H/2;
			this.game.map.westDoor.type = 5;
			this.game.map.westDoor.solid = 1;
			this.game.map.westDoor.sprite = this.game.spriteSet.blank;
		}
		
		var tile = this.game.map.getTileAt(this.x + 50, this.y + 50);
		this.z = tile.z;
	}

	this.spawn = function() {
		this.state = 0;
		this.direction = 0;
		this.sprite = this.game.spriteSet.chicken1;
		var tile = this.game.map.southDoor;
		this.x = tile.x;
		this.y = tile.y;
		/*
			this.x = 0;
			this.y = 0;
			this.z = 1;
		*/
		this.game.viewport.x = this.x - CANVAS_W/2;
		this.game.viewport.y = this.y - CANVAS_H/2;
		this.jumpY = 0;

		var tile = this.game.map.getTileAt(this.x + 50, this.y + 50);
		this.z = tile.z;
	}

	this.render = function() {
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
		//this.game.context.fillRect(pointIsox + 300, pointIsoy, 4, 4);
		this.game.context.drawImage(this.game.graphics, this.sprite.srcx, this.sprite.srcy, this.sprite.w, this.sprite.h, Math.round(this.isox) + PAD_X + 40, Math.round(this.isoy) + PAD_Y - 60 - this.jumpY, this.sprite.w, this.sprite.h);
	}
}