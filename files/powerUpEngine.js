function PowerUpEngine() {
	this.powerUps = [];
	this.game;
	
	for (var i = 0; i < 2; i++) {
		var powerUp = new PowerUp();
		this.powerUps.push(powerUp);
	}

	this.link = function(game){
		this.game = game;
		for (var i = 0; i < this.powerUps.length; i++) {
			this.powerUps[i].link(game);
		}
	}

	this.spawn = function() {
		var tile = this.game.map.getRandWalkable();
		for (var i = 0; i < this.powerUps.length; i++) {
			if (this.powerUps[i].state == 0) {
				this.powerUps[i].spawn(tile.x , tile.y);
				this.powerUps[i].z = tile.z + 1;
				return;
			}
		}
	}

	this.update = function() {
		for (var i = 0; i < this.powerUps.length; i++) {
			this.powerUps[i].update();
		}
	}

	this.reset = function() {
		for (var i = 0; i < this.powerUps.length; i++) {
			this.powerUps[i].state = 0;
		}
	}
}