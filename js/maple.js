$(function() {
    var Key = {
      _pressed: {},

      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,
      Digit1: 49,
      Digit2: 50,
      Digit3: 51,
      X: 88,
      BACKSPACE: 32,

      isDown: function(keyCode) {
        return this._pressed[keyCode];
      },

      onKeydown: function(event) {
        this._pressed[event.keyCode] = true;
      },

      onKeyup: function(event) {
        delete this._pressed[event.keyCode];
      }
    };
        
    window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
    window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

    var Game = {
      fps: 60,
      width: 640,
      height: 480
    };

    Game._onEachFrame = (function() {
      var requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

      if (requestAnimationFrame) {
       return function(cb) {
          var _cb = function() { cb(); requestAnimationFrame(_cb); }
          _cb();
        };
      } else {
        return function(cb) {
          setInterval(cb, 1000 / Game.fps);
        }
      }
    })();
    
    Game.start = function() {
      Game.player = new Player('nico');
      setTimeout(function() { 
          $("#mapfooter").after('<div class="startEff0"></div>');
          setTimeout(function() { 
              $(".startEff0").remove();
          }, 2000);
      }, 1500);
      Game._onEachFrame(Game.run);
    };
    
    Game.run = (function() {
      var loops = 0, skipTicks = 1000 / Game.fps,
          maxFrameSkip = 10,
          nextGameTick = (new Date).getTime(),
          lastGameTick;

      return function() {
        loops = 0;

        while ((new Date).getTime() > nextGameTick) {
          Game.update();
          nextGameTick += skipTicks;
          loops++;
        }

        if (loops) Game.draw();
      }
    })();
    
    Game.draw = function() {
      // Game.context.clearRect(0, 0, Game.width, Game.height);
      Game.player.draw(Game.context);
    };
    
    Game.update = function() {
      Game.player.update();
    };

    function PlayerFace(tagId) {
    	this.faceXML = {
    		_state: "default",
    		_default: {bottom: 4, right: 3, img: 'default.face'},
    		_cheers: {bottom: 1, right: 3, img: 'cheers.0.face'},
    		_vomit: {bottom: -30, right: 3, img: 'vomit.0.face'}
    	};
    	this.loops = 0;
    	this.face = $('#' + tagId + " .face");
    }
    PlayerFace.prototype.getFaceState = function() {
    	if (this.faceXML._state == "default") {
    		var ret = this.faceXML._default;
    		this.loops %= 240;
    		if (this.loops < 5)
    			ret.img = 'blink.0.face';
    		else if (this.loops < 10)
    			ret.img = 'blink.1.face';
    		else if (this.loops < 15)
    			ret.img = 'blink.0.face';
    		else if (this.loops < 20)
    			ret.img = 'blink.2.face';
    		else
    			ret.img = 'default.face';
    		return ret;
    	}
    	if (this.faceXML._state == "cheers") {
    		if (this.loops == 240)	this.faceXML._state = 'default';
    		return this.faceXML._cheers;
    	}
    	if (this.faceXML._state == "vomit") {
    		if (this.loops == 240)	this.faceXML._state = 'default';
    		var cycle = this.loops % 50;
    		var ret = this.faceXML._vomit;
    		if (cycle < 20)	
    			ret.img = 'vomit.0.face';
    		else
    			ret.img = 'vomit.1.face';
    		return ret;	
    	}
    }
    PlayerFace.prototype.update = function(state) {
    	if (state == 'F1')	this.faceXML._state = 'cheers', this.loops = 0;
    	if (state == 'F2')	this.faceXML._state = 'default';
    	if (state == 'F3')	this.faceXML._state = 'vomit';
    }
    PlayerFace.prototype.draw = function() {
    	var info = this.getFaceState();
    	this.loops = this.loops + 1;
    	this.face.css({'background-image': 'url(css/images/Face/' + info.img + '.png)',
    					'bottom': info.bottom + 'px',
    					'right': info.right + 'px'});
    }

	function PlayerBody(tagId) {
		this.bodyXML = {
    		_state: "default",
    		_default: {bottom: 0, right: 0, img: 'stand1.0.body'},
    		_walk: {bottom: 0, right: 0, img: 'walk1.1.body'}
    	};
    	this.armXML = {
    		_state: "default",
    		_default: {bottom: 11, right: -11, img: 'stand1.0.arm'},
    		_walk: {bottom: 13, right: -11, img: 'walk1.0.arm'}
    	}
    	this.robeDressXML = {
    		_state: "mail",
    		_mail: {bottom: 2, right: -2, img: 'stand1.0.mail'},
    		_walk: {bottom: 2, right: -2, img: 'walk1.0.mail'}
    	}    	
    	this.robeArmXML = {
    		_state: "mail",
    		_mail: {bottom: 17, right: -11, img: 'stand1.0.mailArm'},
    		_walk: {bottom: 17, right: -11, img: 'walk1.0.mailArm'}
    	}
    	this.loops = 0;
    	this.body = $('#' + tagId + " .body");
    	this.bodyArm = $('#' + tagId + " .arm");
    	this.robeArm = $('#' + tagId + " .coatArm");
    	this.robeDress = $('#' + tagId + " .robe .coat");
	}    
	PlayerBody.prototype.getBodyState = function() {
    	if (this.bodyXML._state == "default") {
    		var ret = this.bodyXML._default;
    		var cycle = this.loops%360;
    		return ret;
    		if (cycle < 60) {
    			ret.img = 'stand1.0.body';
    		} else if (cycle < 80) {
    			ret.img = 'stand1.1.body';
    		} else if (cycle < 180) {
    			ret.img = 'stand1.2.body';
    		} else if (cycle < 300) {
    			ret.img = 'stand1.1.body';
    		} else {
    			ret.img = 'stand1.0.body';
    		}
    		return ret;
    	} else if (this.bodyXML._state == "walk") {
    		var ret = this.bodyXML._walk;
    		var cycle = this.loops%80;
    		if (cycle < 20) {
    			ret.right = 0;
    			ret.img = 'walk1.0.body';
    		} else if (cycle < 40) {
    			ret.right = -1;
    			ret.img = 'walk1.1.body';
    		} else if (cycle < 60) {
    			ret.right = 0;
    			ret.img = 'walk1.2.body';
    		} else if (cycle < 80) {
    			ret.right = 0;
    			ret.img = 'walk1.3.body';
    		}
    		return ret;
    	}
    }
    PlayerBody.prototype.getArmState = function() {
    	if (this.armXML._state == "default") {
    		var ret = this.armXML._default;
    		var cycle = this.loops%360;
    		return ret;
    		if (cycle < 60) {
    			ret.img = 'stand1.0.arm';
    		} else if (cycle < 80) {
    			ret.img = 'stand1.1.arm';
    		} else if (cycle < 180) {
    			ret.img = 'stand1.2.arm';
    		} else if (cycle < 300) {
    			ret.img = 'stand1.1.arm';
    		} else {
    			ret.img = 'stand1.0.arm';
    		}
    		return ret;
    	} else if (this.armXML._state == "walk") {
    		var ret = this.armXML._walk;
    		var cycle = this.loops%80;
    		if (cycle < 20) {
    			ret.bottom = 13;
    			ret.right = -11;
    			ret.img = 'walk1.0.arm';
    		} else if (cycle < 40) {
    			ret.bottom = 11;
    			ret.right = -5;
    			ret.img = 'walk1.1.arm';
    		} else if (cycle < 60) {
    			ret.bottom = 13;
    			ret.right = -12;
    			ret.img = 'walk1.2.arm';
    		} else if (cycle < 80) {
    			ret.bottom = 13;
    			ret.right = -14;
    			ret.img = 'walk1.3.arm';
    		}
    		return ret;
    	}
    }
    PlayerBody.prototype.getRobeDressState = function() {
    	if (this.robeDressXML._state == "mail") {
    		var ret = this.robeDressXML._mail;
    		var cycle = this.loops%360;
    		return ret;
    		if (cycle < 60) {
    			ret.img = 'stand1.0.mail';
    		} else if (cycle < 80) {
    			ret.img = 'stand1.1.mail';
    		} else if (cycle < 180) {
    			ret.img = 'stand1.2.mail';
    		} else if (cycle < 300) {
    			ret.img = 'stand1.1.mail';
    		} else {
    			ret.img = 'stand1.0.mail';
    		}
    		return ret;
    	} else if (this.robeDressXML._state == "walk") {
    		var ret = this.robeDressXML._walk;
    		var cycle = this.loops%80;
    		if (cycle < 20) {
    			ret.right = -2;
    			ret.img = 'walk1.0.mail';
    		} else if (cycle < 40) {
    			ret.right = -3;
    			ret.img = 'walk1.1.mail';
    		} else if (cycle < 60) {
    			ret.right = -2;
    			ret.img = 'walk1.2.mail';
    		} else if (cycle < 80) {
    			ret.right = -2;
    			ret.img = 'walk1.3.mail';
    		}
    		return ret;
    	}
    }
    PlayerBody.prototype.getRobeArmState = function() {
    	if (this.robeArmXML._state == "mail") {
    		var ret = this.robeArmXML._mail;
    		var cycle = this.loops%360;
    		return ret;
    		if (cycle < 60) {
    			ret.img = 'stand1.0.mailArm';
    		} else if (cycle < 80) {
    			ret.img = 'stand1.1.mailArm';
    		} else if (cycle < 180) {
    			ret.img = 'stand1.2.mailArm';
    		} else if (cycle < 300) {
    			ret.img = 'stand1.1.mailArm';
    		} else {
    			ret.img = 'stand1.0.mailArm';
    		}
    		return ret;
    	} else if (this.robeArmXML._state == "walk") {
    		var ret = this.robeArmXML._walk;
    		var cycle = this.loops%80;
    		if (cycle < 20) {
    			ret.bottom = 17;
    			ret.right = -11;
    			ret.img = 'walk1.0.mailArm';
    		} else if (cycle < 40) {
    			ret.bottom = 15;
    			ret.right = -10;
    			ret.img = 'walk1.1.mailArm';
    		} else if (cycle < 60) {
    			ret.bottom = 20;
    			ret.right = -11;
    			ret.img = 'walk1.2.mailArm';
    		} else if (cycle < 80) {
    			ret.bottom = 20;
    			ret.right = -15;
    			ret.img = 'walk1.3.mailArm';
    		}
    		return ret;
    	}
    }
    PlayerBody.prototype.update = function(state) {
    	if (state == 'stand') {
    		this.bodyXML._state = 'default';
    		this.armXML._state = 'default';
    		this.robeDressXML._state = 'mail';
    		this.robeArmXML._state = 'mail';
    	} else if (state == 'walk') {
    		this.bodyXML._state = 'walk';
    		this.armXML._state = 'walk';
    		this.robeDressXML._state = 'walk';
    		this.robeArmXML._state = 'walk';
    	}
    }
    PlayerBody.prototype.draw = function() {
    	this.loops = this.loops + 1;
    	var info;
    	info = this.getBodyState();
    	this.body.css({'background-image': 'url(css/images/Body/' + info.img + '.png)'});
    	this.body.css({'bottom': info.bottom + 'px', 'right': info.right + 'px'});

    	info = this.getArmState();
    	this.bodyArm.css({'background-image': 'url(css/images/Body/' + info.img + '.png)',
    						'bottom': info.bottom + 'px',
    						'right': info.right + 'px'});

    	info = this.getRobeDressState();
    	this.robeDress.css({'background-image': 'url(css/images/Coat/' + info.img + '.png)'});
    	this.robeDress.css({'right': info.right + 'px'});
    	info = this.getRobeArmState();
    	this.robeArm.css({'background-image': 'url(css/images/Coat/' + info.img + '.png)',
    						'bottom': info.bottom + 'px',
    						'right': info.right + 'px'});
    }


    function Player(tagId) {
      this.x = -600;
      this.y = 0;
      this.prev_vx = 0;
      this.jumptime = 0;
      this.moveState = 'normal';
      this.main = $('#' + tagId);
      this.faceDir = 1; // {}
      this.face = new PlayerFace(tagId);
      this.body = new PlayerBody(tagId);
    }

    Player.prototype.draw = function() {
      this.main.css("right", (-this.x) + "px");
      this.face.draw();
      this.body.draw();
    };

    Player.prototype.moveLeft = function() {
    	if (this.moveState == 'normal') {
      		this.x -= 3.5;
      		this.prev_vx += 3.5;
  		}
      if (this.faceDir == 1) {
      	this.main.find('.character').css({transform: 'scaleX(1)', right: '200px'});
      	this.faceDir = 0;
      }
      this.validPos();
    };

    Player.prototype.moveRight = function() {
    	if (this.moveState == 'normal') {
      		this.x += 3.5;
      		this.prev_vx += 3.5;
  		}
      if (this.faceDir == 0) {
      	this.main.find('.character').css({transform: 'scaleX(-1)', right: '0px'});
      	this.faceDir = 1;
      }
      this.validPos();
    };

    Player.prototype.moveUp = function() {
      // this.y += 2;
    };

    Player.prototype.moveDown = function() {
      // this.y -= 2;
    };
    Player.prototype.validPos = function() {
        this.x = Math.min(Math.max(-650, this.x), 190);
    }
    Player.prototype.jump = function() {
    	if (this.moveState == 'normal') {
    		this.moveState = 'jumping';
    		this.prev_vx = Math.min(this.prev_vx, 3.5);
    		this.jumptime = 1;
    	} else if (this.moveState == 'jumping') {
    		this.main.find('.character').css({bottom: this.y + 'px'});
    		this.y = 9 * this.jumptime + 0.5 * (-0.5) * this.jumptime * this.jumptime;
			this.x += this.faceDir ? this.prev_vx : -this.prev_vx;
    		if (this.jumptime == 9 * 4 + 1) {
    			this.moveState = 'normal';
    			this.prev_vx = 0;
    		}
    		this.jumptime++;
   		}      
      this.validPos();
    };
    
    Player.prototype.update = function() {
      if (Key.isDown(Key.UP)) 	this.moveUp();
      if (Key.isDown(Key.LEFT)) this.moveLeft();
      if (Key.isDown(Key.DOWN)) this.moveDown();
      if (Key.isDown(Key.RIGHT))this.moveRight();
      if (Key.isDown(Key.Digit1)) this.face.update('F1');
      if (Key.isDown(Key.Digit2)) this.face.update('F2');
      if (Key.isDown(Key.Digit3)) this.face.update('F3');
      if (Key.isDown(Key.BACKSPACE) && this.moveState != 'jumping')	this.jump();
      if (Key.isDown(Key.LEFT) || Key.isDown(Key.RIGHT))
      		this.body.update('walk');
      if (!Key.isDown(Key.LEFT) && !Key.isDown(Key.RIGHT))
      		this.body.update('stand');
      if (this.moveState == 'jumping')
      		this.jump();
    };

    Game.start();
});