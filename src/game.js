
BasicGame.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;	//	the tween manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator

    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

var player;
var enemigo;
var platforms;
var cursors;
var weapon;
var fireButton;
var stars;
var score = 0;
var scoreText;
var scoreEnemy = 0;
var scoreEnemyText;
var fix = false;
var jump=false;
var left=false;
var right=false;
var fire = false;
var enemyleft = false;
var enemyright = false;


BasicGame.Game.prototype = {

	create: function () {
        var self = this;

		this.score = 42;
		this.add.sprite(0, 0, 'fondo');
        var headY = 25 + 60 / 2;
        this.pauseButton = this.add.button(25 + (60 / 2), headY, 'pause', function() { self.pause(); });
        this.pauseButton.anchor.setTo(0.5, 0.5);
		this.scoreboard = new Scoreboard(this.game);
		this.add.existing(this.scoreboard);
        this.pauseboard = new Pauseboard(this.game);
        this.add.existing(this.pauseboard);

        this.physics.startSystem(Phaser.Physics.ARCADE);
        player = this.add.sprite(100, 100, 'mono');
        enemigo = this.add.sprite(700,100 , 'enemigo')
        this.physics.arcade.enable(player);
        this.physics.arcade.enable(enemigo);

        weapon = this.add.weapon(2, 'bullet');
        weapon.bulletKillTYpe = Phaser.Weapon.KILL_WORLD_BOUNDS;
        weapon.bulletSpeed = 300;
        weapon.fireRate = 500;
        weapon.trackSprite(player, 0, 25, false);

        weapon_enemy = this.add.weapon(2, 'bullet');
        weapon_enemy.bulletKillTYpe = Phaser.Weapon.KILL_WORLD_BOUNDS;
        weapon_enemy.bulletSpeed = 300;
        weapon_enemy.fireRate = 500;
        weapon_enemy.trackSprite(enemigo, 0, 25, false);


        platforms = this.add.group();
        platforms.enableBody = true;

        var ground = platforms.create(0, this.world.height - 20, 'ground');
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;

        var ledge = platforms.create(400, this.world.height - 220, 'ground');
        ledge.body.immovable = true;

        ledge = platforms.create(-150, this.world.height - 120, 'ground');
        ledge.body.immovable = true;


        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;

        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);


        enemigo.body.bounce.y = 0.2;
        enemigo.body.gravity.y = 300;
        enemigo.body.collideWorldBounds = true;

        enemigo.animations.add('left', [9, 10, 11], 10, true);
        enemigo.animations.add('right', [6, 7, 8], 10, true);

        stars = this.add.group();
        stars.enableBody = true;



     if(!this.game.device.desktop){
            this.game.input.onDown.add(this.gofull, this);
            this.game.scale.startFullScreen(false);

            buttonjump = this.game.add.button(this.world.width - 100, this.world.height - 95, 'buttonjump', null, this, 0, 1, 0, 1); 
            buttonjump.fixedToCamera = true;
            buttonjump.events.onInputOver.add(function(){jump=true;});
            buttonjump.events.onInputOut.add(function(){jump=false;});
            buttonjump.events.onInputDown.add(function(){jump=true;});
            buttonjump.events.onInputUp.add(function(){jump=false;});

            buttonfire = this.game.add.button(this.world.width - 200, this.world.height - 95, 'buttonfire', null, this, 0, 1, 0, 1); 
            buttonfire.fixedToCamera = true;
            buttonfire.events.onInputOver.add(function(){fire=true;});
            buttonfire.events.onInputOut.add(function(){fire=false;});
            buttonfire.events.onInputDown.add(function(){fire=true;});
            buttonfire.events.onInputUp.add(function(){fire=false;});

            buttonleft = this.game.add.button(32, this.world.height - 95, 'buttonhorizontal', null, this, 0, 1, 0, 1);
            buttonleft.fixedToCamera = true;
            buttonleft.events.onInputOver.add(function(){left=true;});
            buttonleft.events.onInputOut.add(function(){left=false;});
            buttonleft.events.onInputDown.add(function(){left=true;});
            buttonleft.events.onInputUp.add(function(){left=false;});

            buttonbottomleft = this.game.add.button(32, this.world.height - 51, 'buttondiagonal', null, this, 6, 4, 6, 4);
            buttonbottomleft.fixedToCamera = true;
            buttonbottomleft.events.onInputOver.add(function(){left=true;});
            buttonbottomleft.events.onInputOut.add(function(){left=false;});
            buttonbottomleft.events.onInputDown.add(function(){left=true;});
            buttonbottomleft.events.onInputUp.add(function(){left=false;});


            buttonright = this.game.add.button(160, this.world.height - 95, 'buttonhorizontal', null, this, 0, 1, 0, 1);
            buttonright.fixedToCamera = true;
            buttonright.events.onInputOver.add(function(){right=true;});
            buttonright.events.onInputOut.add(function(){right=false;});
            buttonright.events.onInputDown.add(function(){right=true;});
            buttonright.events.onInputUp.add(function(){right=false;});

            buttonbottomright = this.game.add.button(160, this.world.height - 51, 'buttondiagonal', null, this, 7, 5, 7, 5);
            buttonbottomright.fixedToCamera = true;
            buttonbottomright.events.onInputOver.add(function(){right=true;});
            buttonbottomright.events.onInputOut.add(function(){right=false;});
            buttonbottomright.events.onInputDown.add(function(){right=true;});
            buttonbottomright.events.onInputUp.add(function(){right=false;});
        
    }

    var barConfig = {x:200, y:100};

   
    this.createStar();

    scoreText = this.add.text(16, 16, 'Player Score: 0', { fontSize: '16px', fill: '#000' });
    scoreEnemyText = this.add.text(16, 32, 'Enemy Score: 0', { fontSize: '16px', fill: '#000' });

    cursors = this.input.keyboard.createCursorKeys();
    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);


    player.health = 100;
    player.maxHealth = 100;

    enemigo.health = 100;
    enemigo.maxHealth = 100;

    playerHealthMeter = this.game.add.plugin(Phaser.Plugin.HealthMeter);
    playerHealthMeter.bar(
        player,
        {x: 20, y: 100, width: 200, height: 20}
    );

    enemigoHealthMeter = this.game.add.plugin(Phaser.Plugin.HealthMeter);
    enemigoHealthMeter.bar(
        enemigo,
        {x: 500, y: 100, width: 200, height: 20}
    );



	},

    pause: function() {
        if (!this.game.soundMute) {
            this.game.menuSelect.play();
        }

        this.game.add.tween(this.pauseButton.scale).
            to( { x: 1.1, y: 1.1 }, 150, Phaser.Easing.Linear.None, true, 0, 0, true);

        this.pauseboard.show();
    },

	update: function () {

        this.physics.arcade.collide(player, platforms);
        this.physics.arcade.collide(enemigo, platforms);
        this.physics.arcade.collide(stars, platforms);

        this.physics.arcade.overlap(player, stars, this.collectStar, null, this);
        this.physics.arcade.overlap(enemigo, stars, this.collecStartEnemy, null, this);

        this.physics.arcade.overlap(player,weapon_enemy.bullets , this.hitPlayer, null, this  );
        this.physics.arcade.overlap(enemigo,weapon.bullets ,this.hitEnemy, null, this  );

        player.body.velocity.x = 0;
        enemigo.body.velocity.x = 0;


        if(cursors.left.isDown || left ){
            player.body.velocity.x = -150;
            player.animations.play('left');
        }else if(cursors.right.isDown || right){
            player.body.velocity.x = 150;
            player.animations.play('right');
        }else{
            player.animations.stop();
            player.frame = 4;
        }
         if ((cursors.up.isDown && player.body.touching.down) || (jump && player.body.touching.down)) 
        {
            player.body.velocity.y = -300;
        }

        if(fireButton.isDown || fire){
            if(cursors.left.isDown || left ){
                weapon.fireAngle = Phaser.ANGLE_LEFT;
            }else if(cursors.right.isDown || right){
                weapon.fireAngle = Phaser.ANGLE_RIGHT;
            }
            weapon.fire();
        }


    this.moveEnemy(player, enemigo, stars);
    this.fireEnemy(player, enemigo);

	},

	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.state.start('MainMenu');
	},

    createStar: function(){
        stars.remove(stars.children[stars.length - 1]);
        var star = stars.create(Math.floor(Math.random() * (760 - 0)) + 0, 0, 'star');
        star.body.gravity.y = 300;
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    },

    gofull: function(){
        this.game.scale.startFullScreen(false);
    },
    collectStar: function (player, star){
        star.kill();
        score += 10;
        scoreText.text = 'Player Score: ' + score;
        this.createStar();
    },
    collecStartEnemy: function(enemigo, star){
        star.kill();
        scoreEnemy+=10;
        scoreEnemyText.text = 'Enemy Score: '+scoreEnemy;
        this.createStar();
    },
    hitPlayer: function(player, bullets){
        bullets.kill();
        player.health = player.health - 10;

    },
    hitEnemy: function(enemigo, bullets){
        bullets.kill();
        enemigo.health = enemigo.health - 10;
    },
    moveEnemy: function(player, enemigo, star){
        
        if(fix==false){
            if(star.children[star.length - 1].x == enemigo.x){
                enemigo.animations.stop();
                enemigo.body.velocity.x = 0;
                enemyleft = false;
                enemyright = false;
            }else{
                if(star.children[star.length - 1].x > enemigo.x + 15){
                    enemigo.body.velocity.x = 150;
                    enemigo.animations.play('right');
                    enemyright = true;
                }else if(star.children[star.length - 1].x + 15 < enemigo.x ){
                    enemigo.body.velocity.x = -150;
                    enemigo.animations.play('left');
                    enemyleft = true;

                }else{
                    enemigo.animations.stop();
                    enemigo.frame = 0;
                    enemigo.body.velocity.x = 0;
                    enemyleft = false;
                    enemyright = false;
                }
                if(star.children[star.length - 1].y < enemigo.y && enemigo.body.touching.down){
                    enemigo.body.velocity.y = -300;

                }

                if(star.children[star.length - 1].y<300 && enemigo.x < 250 && enemigo.y > 352){
                    console.log('le vamos a poner true');
                    fix = true;
                    enemigo.body.velocity.x = 150;
                    if (enemigo.body.touching.down){
                        fix = true;
                        enemigo.body.velocity.x = 150;
                        enemigo.body.velocity.y = -300;
                    }   
                    enemigo.animations.play('right');
                }
            }
        }   
            if(fix==true){
                enemigo.body.velocity.x = 150;
                
                    enemigo.body.velocity.y = -300;
            
                if(enemigo.y<352 && enemigo.x>250){
                    fix=false;
                    console.log('ahora quedo en false');
                }
            }

    },
    fireEnemy: function(player, enemigo){

        if (player.y + 20 >= enemigo.y && player.y - 20 <= enemigo.y){
            if(player.x < enemigo.x){
                weapon_enemy.fireAngle = Phaser.ANGLE_LEFT;
            }else{
                weapon_enemy.fireAngle = Phaser.ANGLE_RIGHT;
            }

            weapon_enemy.fire();
        }
    }
};
