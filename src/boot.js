BasicGame = {

    /* Here we've just got some global level vars that persist regardless of State swaps */
    score: 0,

    /* If the music in your game needs to play through-out a few State swaps, then you could reference it here */
    music: null,

    /* Your game can check BasicGame.orientated in internal loops to know if it should pause or not */
    orientated: false

};

BasicGame.Boot = function (game) {
};

BasicGame.Boot.prototype = {

    preload: function () {
        this.game.stage.backgroundColor = "#fff";
        //  Here we load the assets required for our preloader (in this case a background and a loading bar)


        this.load.image('preloaderBackground', 'assets/preLoader_background_2.png');
        this.load.image('preloaderBar', 'assets/preloader_bar.png');
        this.load.image('preloaderBarGray', 'assets/preloader_bar_gray.png');
        this.load.image('fondo','assets/jungle.png');

    },

	create: function () {

		this.input.maxPointers = 1;
		this.stage.disableVisibilityChange = true;
		BasicGame.orientated = true;
		//this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
		this.scale.minWidth = this.game.width / 2;
		this.scale.minHeight = this.game.height / 2;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;

		if (this.game.device.desktop)
		{
			this.scale.maxWidth = this.game.width;
			this.scale.maxHeight = this.game.height;
			//this.scale.setScreenSize(true);
			
		}
		else
		{
			this.scale.maxWidth = this.game.width * 2.5;
			this.scale.maxHeight = this.game.height * 2.5;
			this.scale.pageAlignHorizontally = true;            
			this.scale.pageAlignVertically = true;    
			this.scale.forceOrientation(true, false);
			this.scale.setResizeCallback(this.gameResized, this);
			this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
			this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
			//this.scale.setScreenSize(true);



				 var ow = parseInt(this.game.canvas.style.width,10);
	 	var oh = parseInt(this.game.canvas.style.height,10);
	 var r = Math.max(window.innerWidth/ow,window.innerHeight/oh);
	 var nw = ow*r;var nh = oh*r;
	 this.game.canvas.style.width = nw+"px";
	 this.game.canvas.style.height= nh+"px";
	 this.game.canvas.style.marginLeft = (window.innerWidth/2 - nw/2)+"px"; 
	 this.game.canvas.style.marginTop = (window.innerHeight/2 - nh/2)+"px";
	 document.getElementById("game").style.width = window.innerWidth+"px";
	 document.getElementById("game").style.height = window.innerHeight-1+"px";//The css for body includes 1px top margin, I believe this is the cause for this -1
	 document.getElementById("game").style.overflow = "hidden";
		}

		Phaser.ScaleManager.prototype.setScreenSize = Phaser.ScaleManager.prototype.updateLayout;



		this.state.start('CheckOrientation');

	},

	gameResized: function (width, height) {

		//  This could be handy if you need to do any extra processing if the game resizes.
		//  A resize could happen if for example swapping orientation on a device.

	},

	enterIncorrectOrientation: function () {

		BasicGame.orientated = false;

		document.getElementById('orientation').style.display = 'block';

	},

	leaveIncorrectOrientation: function () {

		BasicGame.orientated = true;

		document.getElementById('orientation').style.display = 'none';
//		this.scale.setScreenSize(true);
		Phaser.ScaleManager.prototype.setScreenSize = Phaser.ScaleManager.prototype.updateLayout;
	}
};