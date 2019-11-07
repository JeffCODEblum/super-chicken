function NpcEngine() {
	this.npcs = [];
	for (var i = 0; i < MAX_NPCS; i++) {
		var npc = new Npc();
		this.npcs.push(npc);
	}
	
	this.link = function(game) {
		this.game = game;
		for (var i = 0; i < MAX_NPCS; i++) {
			this.npcs[i].link(game);
		}
	}

	this.update = function() {
		for (var i = 0; i < MAX_NPCS; i++) {
			this.npcs[i].update();
		}
	}

	this.reset = function() {
		for (var i = 0; i < MAX_NPCS; i++) {
			this.npcs[i].state = 0;
		}
	}
	
	this.spawn = function() {
		for (var i = 0; i < this.npcs.length; i++) {
			if (this.npcs[i].state == 0) {
				this.npcs[i].spawn();
				return;
			}
		}
	}
}