function Game() {
	this.state = 0;
	this.lastStateChange = Date.now();
	this.map = new Map();
	this.renderer = new Renderer();
	this.spriteSet = new SpriteSet();
	this.canvas = document.getElementById("canvas");
	this.context = this.canvas.getContext('2d');
	this.graphics = new Image();
	this.ctrl = new Ctrl();
	this.player = new Player();
	this.npcEngine = new NpcEngine();
	this.particleEngine = new ParticleEngine();
	this.powerUpEngine = new PowerUpEngine();
	this.viewport = new Viewport();
	this.hud = new Hud();
	this.graphics.src = "./files/graphics.png";

	this.boopSound = document.getElementById("boopSound");
	this.gongSound = document.getElementById("gongSound");
	this.chimeSound = document.getElementById("chimeSound");
	this.powerSound = document.getElementById("powerSound");
	this.hit1Sound = document.getElementById("hit1Sound");

	this.map.link(this);
	this.renderer.link(this);
	this.player.link(this);
	this.viewport.link(this);
	this.npcEngine.link(this);
	this.particleEngine.link(this);
	this.powerUpEngine.link(this);
	this.hud.link(this);
	
	var success = false;
	while (!success) {
		success = this.map.createWorld();
	}

	this.chimeSound.play();
	this.player.spawn();
	this.update = function() {
		if (this.state == 0) {
			this.hud.update();
			if (this.ctrl.w || this.ctrl.a || this.ctrl.s || this.ctrl.d || this.ctrl.up2 || this.ctrl.down2 || this.ctrl.right2 || this.ctrl.left2 || this.ctrl.swipeUp || this.ctrl.swipeDown || this.ctrl.swipeLeft || this.ctrl.swipeRight) {
				this.state = 1;
			}
		}
		else if (this.state == 1) {
			this.hud.score = 0;
			this.npcEngine.spawn();
			this.npcEngine.spawn();
			this.powerUpEngine.spawn();
			this.powerUpEngine.spawn();
			this.state = 2;
		}
		else if (this.state == 2) {
			this.powerUpEngine.update();
			this.player.update();
			this.npcEngine.update();
			this.viewport.update();
		}
		else if (this.state == 3) {
			this.map.firstDoor = 1;
			this.particleEngine.update();
			this.npcEngine.update();
			if (Date.now() - this.lastStateChange > 2000) {
				var success = 0;
				while(!success) {
					success = this.map.createWorld();
				}
				this.hud.titleY = 0;
				this.player.spawn();
				this.npcEngine.reset();
				this.powerUpEngine.reset();
				this.particleEngine.reset();
				this.state = 0;
				this.chimeSound.play();
			}
		}
		this.renderer.render();
	}
}