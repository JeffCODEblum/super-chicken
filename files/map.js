function Map() {
	this.firstWorld = 1;
	this.game;
	this.data = [];
	this.eastDoor;
	this.northDoor;
	this.westDoor;
	this.southDoor;
	var z = 0;
	for (var j = 0; j < MAP_H; j++) {
		this.data.push([]);
		for (var i = 0; i < MAP_W; i++) {
			var tile = new Tile();
			tile.x = i * tile.w;
			tile.y = j * tile.h;
			tile.z = z;
			tile.solid = 1;
			tile.mark = 0;
			z++;
			this.data[j].push(tile);
		}
	}

	this.link = function(game) {
		this.game = game;
		for (var j = 0; j < this.data.length; j++) {
			for (var i = 0; i < this.data[0].length; i++) {
				this.data[j][i].link(game);
			}
		}
	}

	this.getTileAt = function(x, y) {
		for (var j = 0; j < this.data.length; j++) {
			if (Math.floor(y/TILE_H) == this.data[j][0].y/TILE_H) {
				for (var i = 0; i < this.data[0].length; i++) {
					if (Math.floor(x/TILE_W) == this.data[j][i].x / TILE_W) return this.data[j][i];
				}
			}
		}
		return false;
	}
	
	this.getRandWalkable = function() {
		while (1) {
			var randX = Math.floor(Math.random() * MAP_W * TILE_W);
			var randY = Math.floor(Math.random() * MAP_H * TILE_H);
			var tile = this.getTileAt(randX, randY);
			if (tile.solid == 0) {
				return tile;
			}
		}
	}
	
	this.getNpcSpawn = function() {
		while (1) {
			var randX = (Math.floor(Math.random() * (MAP_W - 8)) + 4) * (TILE_W);
			var randY = (Math.floor(Math.random() * (MAP_H - 8)) + 4) * (TILE_H);
			var tile = this.getTileAt(randX, randY);
			if (tile.solid == 0) {
				return tile;
			}
		}
	}

	this.getRenderData = function() {
		var drawData = [];
		var startX;
		var startY;
		var width;
		var height;
		
		//startX = Math.floor(this.game.viewport.x / TILE_W);
		//startY = Math.floor(this.game.viewport.y / TILE_H);
		//width = Math.floor(this.game.viewport.w / TILE_W);
		//height = Math.floor(this.game.viewport.h / TILE_H);
	
		startX = 0;
		startY = 0;
		width = MAP_W;
		height = MAP_H;
		
		for (var i = startY; i < startY + height; i++) {
			for (var j = startX; j < startX + width; j++) {
				if (i >= 0 && j >= 0 && i < this.data.length && j < this.data[0].length) {
					var tile = this.data[i][j];
					drawData.push(tile);
				}
			}
		}
		return(drawData);
	}


	this.checkContinuity = function() {
		var continuity = true;
		var tile = this.getRandWalkable();
		this.fillWalkable(tile.x/TILE_W, tile.y/TILE_H);
		for (var j = 0; j < this.data.length; j++) {
			for (var i = 0; i < this.data[0].length; i++) {
				var tile = this.data[j][i];
				if (tile.mark == 0 && tile.solid == 0) {
					continuity = false;
				}
			}
		}
		return continuity;
	}

	this.fillWalkable = function(x, y) {
		if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) {
			return;
		}
		var cell = this.data[y][x];
		if (cell.solid == 1 || cell.mark == 1) {
			return;
		}
		cell.mark = 1;
		this.fillWalkable(x, y - 1);
		this.fillWalkable(x, y + 1);
		this.fillWalkable(x - 1, y);
		this.fillWalkable(x + 1, y);
	}

	this.getRandNorthEdge = function() {
		for (var i = 0; i < 1000; i++) {
			var randX = Math.floor(Math.random() * 14) + 1;
			var tile = this.data[0][randX];
			if (this.data[1][randX].type == 1 || this.data[1][randX].type == 2) {
				return tile;
			}
		}
		return false;
	}

	this.getRandEastEdge = function() {
		var success = false;
		for (var i = 0; i < 1000; i++) {
			var randY = Math.floor(Math.random() * 14) + 1;
			var tile = this.data[randY][MAP_W - 1];
			if (this.data[randY][MAP_W - 2].type == 1 || this.data[1][randY].type == 2) {
				return tile;
			}
		}
		return false;
	}

	this.getRandSouthEdge = function() {
		for (var i = 0; i < 1000; i++) {
			var randX = Math.floor(Math.random() * 14) + 1;
			var tile = this.data[MAP_H - 1][randX];
			if (this.data[MAP_H - 2][randX].type == 1 || this.data[1][randX].type == 2) {
				return tile;
			}
		}
		return false;
	}

	this.getRandWestEdge = function() {
		var success = false;
		for (var i = 0; i < 1000; i++) {
			var randY = Math.floor(Math.random() * 14) + 1;
			var tile = this.data[randY][0];
			if (this.data[randY][1].type == 1 || this.data[1][randY].type == 2) {
				return tile;
			}
		}
		return false;
	}

	this.createWorld = function() {
		// make water
		for (var j = 0; j < this.data.length; j++) {
			for (var i = 0; i < this.data[0].length; i++) {
				this.data[j][i].type = 0;
				this.data[j][i].solid = 1;
				this.data[j][i].mark = 0;
			}
		}
		
		// plant grass
		for (var j = 0; j < this.data.length; j++) {
			for (var i = 0; i < this.data[0].length; i++) {
				var rand = Math.floor(Math.random() * 100);
				if (rand < 50) {
					this.data[j][i].type = 1;
				}
			}
		}
		this.automate(0, 1, 2);

		// vary grass
		for (var j = 0; j < this.data.length; j++) {
			for (var i = 0; i < this.data[0].length; i++) {
				if (this.data[j][i].type == 1) {
					var rand = Math.floor(Math.random() * 100);
					if (rand < 40) {
						this.data[j][i].type = 2;
					}
				}
			}
		}

		// plant trees
		for (var j = 0; j < this.data.length; j++) {
			for (var i = 0; i < this.data[0].length; i++) {
				if (this.data[j][i].type == 1 || this.data[j][i].type == 2) {
					var rand = Math.floor(Math.random() * 100);
					if (rand < 45) {
						this.data[j][i].type = 3;
					}
				}
			}
		}
		this.automate(1, 3, 2);
		

		// vary trees
		for (var j = 0; j < this.data.length; j++) {
			for (var i = 0; i < this.data[0].length; i++) {
				if (this.data[j][i].type == 3) {
					var rand = Math.floor(Math.random() * 100);
					if (rand < 66) {
						this.data[j][i].type = 4;
					}
				}
			}
		}
		
		// set solidity
		for (var j = 0; j < this.data.length; j++) {
			for (var i = 0; i < this.data[0].length; i++) {
				var tile = this.data[j][i];
				if (tile.type == 0) {
					tile.solid = 1;
				}
				else if (tile.type == 1) {
					tile.solid = 0;
				}
				else if (tile.type == 2) {
					tile.solid = 0;
				}
				else if (tile.type == 3) {
					tile.solid = 1;
				}
				else if (tile.type == 4) {
					tile.solid = 1;
				}
				else if (tile.type == 5) {
					tile.solid = 1;
				}
			}
		}

		// make border of nothing
		for (var i = 0; i < this.data.length; i++) {
			this.data[i][0].type = 5;
			this.data[i][MAP_W - 1].type = 5;
			this.data[i][MAP_W - 1].solid = 1;
		}
		for (var i = 0; i < this.data[0].length; i++) {
			this.data[0][i].type = 5;
			this.data[MAP_H - 1][i].type = 5;
			this.data[MAP_H - 1][i].solid = 1;
		}

		// make random doors
		var north = this.getRandNorthEdge();
		var east = this.getRandEastEdge();
		var south = this.getRandSouthEdge();
		var west = this.getRandWestEdge();
		if (north == false || east == false || west == false || south == false) return 0;
		north.type = 1;
		north.solid = 0;
		east.type = 1;
		east.solid = 0;
		south.type = 1;
		south.solid = 0;
		west.type = 1;
		west.solid = 0;

		this.eastDoor = east;
		this.northDoor = north;
		this.southDoor = south;
		this.westDoor = west;

		if (this.firstDoor == 1) {
			this.westDoor.type = 5;
			this.westDoor.solid = 1;
			this.westDoor.sprite = this.game.spriteSet.blank;
			this.firstDoor = 0;
		}

		if (!this.checkContinuity()) return 0;

		// set sprites
		for (var j = 0; j < this.data.length; j++) {
			for (var i = 0; i < this.data[0].length; i++) {
				if (this.data[j][i].type == 0) {
					this.data[j][i].sprite = this.game.spriteSet.water1;
					this.data[j][i].solid = 1;
				}
				else if (this.data[j][i].type == 1) {
					this.data[j][i].sprite = this.game.spriteSet.grass1;
					this.data[j][i].solid = 0;
				}
				else if (this.data[j][i].type == 2) {
					this.data[j][i].sprite = this.game.spriteSet.grass2;
					this.data[j][i].solid = 0;
				}
				else if (this.data[j][i].type == 3) {
					this.data[j][i].sprite = this.game.spriteSet.tree1;
					this.data[j][i].solid = 1;
				}
				else if (this.data[j][i].type == 4) {
					this.data[j][i].sprite = this.game.spriteSet.tree2;
					this.data[j][i].solid = 1;
				}
				else if (this.data[j][i].type == 5) {
					this.data[j][i].sprite = this.game.spriteSet.blank;
					this.data[j][i].solid = 1;
				}
			}
		}
		return true;
	}

	this.automate = function(type1, type2, numTimes) {
		for (var times = 0; times < numTimes; times++) {
			for (var i = 0; i < this.data.length; i++) {
				for (var j = 0; j < this.data[i].length; j++) {
					var tile = this.data[i][j];
					var liveNeighborCount = 0;
					for (var k = i - 1; k < i + 2; k++) {
						for (var l = j - 1; l < j + 2; l++) {
							if (k > 0 
							&& l > 0 
							&& k < this.data.length 
							&& l < this.data[0].length)
							{
								var neighbor = this.data[k][l];
								if (neighbor.type == type2 && (j != k || i != l)) {
									liveNeighborCount++;
								}
							}
						}
					}
					if (tile.type == type1 || tile.type == type2) {
						if (liveNeighborCount > 3) {
							tile.type = type2;
						}
						else {
							tile.type = type1;
						}
					}
				}
			}
		}
	}
}