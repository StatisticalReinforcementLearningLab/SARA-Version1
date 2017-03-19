FishGame.Preloader = function(game) {
    this.preloadBar = null;
    //this.titleText = null;
    this.ready = false;
    this.ionic_scope;
};

FishGame.Preloader.prototype = {
	
	preload: function () {
		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
		this.preloadBar.anchor.setTo(0.5, 0.5);
		this.load.setPreloadSprite(this.preloadBar);
        this.load.image('titlescreen', 'img/TitleBG4.png');
        this.load.image('undersea', 'img/underwaterbr.jpg');
        this.load.image('connected', 'img/connected.png');
        this.load.image('disconnected', 'img/disconnected.png');
    	this.load.image('coral', 'img/seabed.png');
        this.load.bitmapFont('eightbitwonder', 'fonts/eightbitwonder.png', 'fonts/eightbitwonder.fnt');
        this.load.image('fish', 'img/fish.png');
		this.load.image('journal', 'img/fishjournal.png');
		this.load.image('treasure', 'img/treasure.png');
		this.load.image('fish_journal', 'img/fish_journal.png');
		this.load.atlasXML('octopus', 'sprite/octopus.png', 'sprite/octopus.xml');
		this.load.atlasXML('seacreatures', 'sprite/seacreatures.png', 'sprite/seacreatures.xml');
		this.load.atlasJSONArray('greenfish', 'sprite/swimrightgreenfish.png', 'sprite/swimrightgreenfish.json');
		this.load.atlasJSONArray('clownfish', 'sprite/clownfish.png', 'sprite/clownfish.json');
		this.load.atlasJSONArray('seahorseyellow', 'sprite/seahorseyellow.png', 'sprite/seahorseyellow.json');
		this.load.atlasJSONArray('squid', 'sprite/squid.png', 'sprite/squid.json');
		this.load.atlasJSONArray('goldfish', 'sprite/goldfish.png', 'sprite/goldfish.json');
		this.load.atlasJSONArray('angelfish', 'sprite/angelfish.png', 'sprite/angelfish.json');
		this.load.atlasJSONArray('discusfish', 'sprite/discusfish.png', 'sprite/discusfish.json');
		this.load.atlasJSONArray('bettafish', 'sprite/betta.png', 'sprite/betta.json');
		
		//
		this.load.image('fish_progress', 'sprite/fish_progress_s.png');
		
        //this.load.audio('game_audio', 'audio/poop.mp3');

        //second aquarium
        //-- fish_journal
        this.load.image('treasuresea', 'img/treasuresea.png');
        this.load.atlasJSONArray('sharkswim', 'sprite/sharkswimming.png', 'sprite/sharkswimming.json');
        this.load.atlasJSONArray('nemo', 'sprite/clownfish.png', 'sprite/clownfish.json');
		this.load.atlasJSONArray('dori', 'sprite/dory2.png', 'sprite/dory2.json');
		this.load.atlasJSONArray('jellyfish', 'sprite/jellyfish.png', 'sprite/jellyfish.json');
		this.load.atlasJSONArray('redcrab', 'sprite/redcrab.png', 'sprite/redcrab.json');
		this.load.atlasJSONArray('greencrab', 'sprite/greencrab.png', 'sprite/greencrab.json');
		this.load.atlasJSONArray('angryfish', 'sprite/angryfish.png', 'sprite/angryfish.json');
		this.load.atlasJSONArray('swordfish', 'sprite/swordfish.png', 'sprite/swordfish.json');
		this.load.atlasJSONArray('salmon', 'sprite/salmon.png', 'sprite/salmon.json');
		this.load.atlasJSONArray('yellowtang', 'sprite/yellowtang.png', 'sprite/yellowtang.json');
		this.load.atlasJSONArray('dolphin', 'sprite/dolphin.png', 'sprite/dolphin.json');
		this.load.atlasJSONArray('kitefish', 'sprite/kitefish.png', 'sprite/kitefish.json');
		this.load.atlasJSONArray('whale', 'sprite/whale.png', 'sprite/whale.json');
		this.load.spritesheet('blueanchovy', 'sprite/blueanchovy.png', 512, 125, 4);
		this.load.spritesheet('greenanchovy', 'sprite/greenanchovy.png', 512, 125, 4);
		this.load.spritesheet('pinkanchovy', 'sprite/pinkanchovy.png', 512, 125, 4);
		this.load.spritesheet('greenstarfish', 'sprite/greenstarfish.png', 512, 512, 3);
		this.load.spritesheet('redstarfish', 'sprite/redstarfish.png', 512, 512, 3);
		this.load.spritesheet('bluestarfish', 'sprite/bluestarfish.png', 512, 512, 3);

		//
		this.load.json('fishpoints', 'js/fishpoints.json');

		//progress bar
		this.load.spritesheet('timer', 'sprite/timer.png', 150, 20);

	},

	create: function () {
		this.preloadBar.cropEnabled = false;
	},

	assignscope: function(scope) {
        this.ionic_scope = scope;
    },

    //this is how to handle progress bar 
    //--- See on file complete http://technotip.com/4897/progress-bar-phaser/

	update: function () {

		//this.cache.isSoundDecoded('game_audio') && 
        if(this.ready == false) {
            this.ready = true;

            //this.ionic_scope.total_points = 1180;  	

            if(this.ionic_scope.total_points <770){
            	this.state.start('GameSmall');
            	this.ionic_scope.current_level = 'GameSmall';
            }


            if(this.ionic_scope.total_points >=770 && this.ionic_scope.total_points <1060){
            	this.state.start('Game');
            	this.ionic_scope.current_level = 'Game';
            }


            if(this.ionic_scope.total_points >=1060 && this.ionic_scope.total_points <1830){
            	this.state.start('Level1Small');
            	this.ionic_scope.current_level = 'Level1Small';
            }

            if(this.ionic_scope.total_points >=1830){
            	this.state.start('Level1');
            	this.ionic_scope.current_level = 'Level1';
            }

            //this.state.start('Game');
            //this.state.start('Level1');
            //this.state.start('Level1Small');
        }
	}
};