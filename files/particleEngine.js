function ParticleEngine() {
	this.particles = [];
	this.state = 0;
	this.lastStateChange = 0;
	this.x = 0;
	this.y = 0;
	this.game;
	
	for (var i = 0; i < MAX_PARTICLES; i++) {
		var particle = new Particle();
		this.particles.push(particle);
	}

	this.spawnExplosion = function(x, y) {
		for (var i = 0; i < 8; i++) {
			this.spawn(x, y);
		}
	}

	this.spawn = function(x, y) {
		this.x = x;
		this.y = y;
		this.state = 1;
		this.lastStateChange = Date.now();
		for (var i = 0; i < this.particles.length; i++) {
			var particle = this.particles[i];
			if (particle.state == 0) {
				particle.spawn(x, y);
				return true;
			}
		}
		return false;
	}

	this.link = function(game) {
		this.game = game;
		for (var i = 0; i < this.particles.length; i++) {
			this.particles[i].link(game);
		}
	}

	this.reset = function() {
		for (var i = 0; i < this.particles.length; i++) {
			this.particles[i].state = 0;
		}
	}

	this.update = function() {
		if (this.state == 1) {
			if (Date.now() - this.lastStateChange > 100) {
				this.spawnExplosion(this.x, this.y);
			}
		}
		for (var i = 0; i < this.particles.length; i++) {
			this.particles[i].update();
		}
	}
}