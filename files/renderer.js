function Renderer() {
	this.game;
	this.link = function(game) {
		this.game = game;
	}
	
	this.render = function() {
		this.game.context.clearRect(0, 0, CANVAS_W, CANVAS_H);
		var renderData = [];
		var tileData = this.game.map.getRenderData();
		for (var i = 0; i < tileData.length; i++) {
			renderData.push(tileData[i]);
		}
		for (var i = 0; i < this.game.npcEngine.npcs.length; i++) {
			if (this.game.npcEngine.npcs[i].state != 0) {
				renderData.push(this.game.npcEngine.npcs[i]);
			}
		}
		for (var i = 0; i < this.game.powerUpEngine.powerUps.length; i++) {
			if (this.game.powerUpEngine.powerUps[i].state != 0) {
				renderData.push(this.game.powerUpEngine.powerUps[i]);
			}
		}
		renderData.push(this.game.player);
		var sorted = this.zSort(renderData);
		//sorted.push(this.game.player);

		for (var i = 0; i < this.game.particleEngine.particles.length; i++) {
			if (this.game.particleEngine.particles[i].state != 0) {
				sorted.push(this.game.particleEngine.particles[i]);
			}
		}
		for (var i = 0; i < sorted.length; i++) {
			sorted[i].render();
		}
		this.game.hud.render();
	}
	
	this.zSort = function(data) {
		var sorted = [];
		while (data.length > 0) {
			var farthest = data[0];
			for (var i = 0; i < data.length; i++) {
				if (farthest.z > data[i].z) {
					farthest = data[i];
				}
			}
			sorted.push(farthest);
			data.splice(data.indexOf(farthest), 1);
		}
		return sorted;
	}
}