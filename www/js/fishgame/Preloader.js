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
        
        //---- both aquariums
        this.load.bitmapFont('eightbitwonder', 'fonts/eightbitwonder.png', 'fonts/eightbitwonder.fnt');
		this.load.json('fishpoints', 'js/fishpoints.json');//fish json, points

        //--- sea
        this.load.image('undersea', 'img/underwaterbr.jpg');

        
        this.load.image('titlescreen', 'img/TitleBG4.png');
        //this.load.image('connected', 'img/connected.png');
        //this.load.image('trivia', 'img/trivia.png');
        //this.load.image('meme', 'img/laughingfish.png');
        this.load.image('disconnected', 'img/disconnected.png');
    	this.load.image('coral', 'img/seabed.png');
        
        this.load.image('journal', 'img/fishjournal.png');
        this.load.image('fish_journal', 'img/fish_journal.png');
        this.load.atlasJSONArray('clownfish', 'sprite/clownfish.png', 'sprite/clownfish.json');

        
        this.load.image('fish', 'img/fish.png');
		this.load.image('treasure', 'img/treasure.png');
		
		this.load.atlasXML('octopus', 'sprite/octopus.png', 'sprite/octopus.xml');
		this.load.atlasXML('seacreatures', 'sprite/seacreatures.png', 'sprite/seacreatures.xml');
		this.load.atlasJSONArray('greenfish', 'sprite/swimrightgreenfish.png', 'sprite/swimrightgreenfish.json');
		
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

		

		//progress bar
		this.load.spritesheet('timer', 'sprite/timer.png', 150, 20);

		//reward
		this.load.image('ball', 'img/bubble256yay.png');
		this.load.image('gift', 'img/gift.png');


		//divers
		this.load.atlasJSONArray('purplediver', 'sprite/purple-diver-sprite.png', 'sprite/purple-diver-sprite.json');
		this.load.atlasJSONArray('blackdiver', 'sprite/black-diver-sprite.png', 'sprite/black-diver-sprite.json');
		this.load.atlasJSONArray('fatdiver', 'sprite/fat_swimmer.png', 'sprite/fat_swimmer.json');

		//submarine
		this.load.atlasJSONArray('submarine', 'sprite/submarine.png', 'sprite/submarine.json');
		this.load.atlasJSONArray('submarine_at', 'sprite/submarine_at.png', 'sprite/submarine_at.json');

		//--- RedBanner.png
		//this.load.atlasJSONArray('banner', 'sprite/RedBanner.png', 'sprite/RedBanner.json');
		this.load.image('banner', 'img/RedBanner.png');
		this.load.image('banner_fish', 'img/banner_fish.png');


		//this.load.atlasJSONArray('blackdiver', 'sprite/black-diver-sprite.png', 'sprite/black-diver-sprite.json');

		//
		//Returns a random integer between min (inclusive) and max (inclusive)
		//Using Math.round() will give you a non-uniform distribution!
		//
		var max = 8;
		var min = 1;
		var rand_num = Math.floor(Math.random() * (max - min + 1)) + min;
		console.log('img/pirate-' + rand_num + '.png');
		this.load.image('pirate', 'img/pirate-' + rand_num + '.png');

		//
		this.load.image('smiley', 'img/smiley.png');
		this.load.image('diver', 'img/diver-0.png');
		this.load.image('fatdiver2', 'img/fatdiver2.png');

		 var progressDisplay = 0;
		 var timerEvt = this.time.events.loop(100, function (){
            if(this.load.progress < 100){
            	progressDisplay++;
                console.log('loading... '+(this.load.progress)+'%' + "; " + (100*progressDisplay));
            }else{
                loadingText.text = 'Ready, Go!';
                //console.log('Ready, Go!');
                this.time.events.remove(timerEvt);
            }

        }, this);
		
	},

	create: function () {
		this.preloadBar.cropEnabled = false;
		//this.load.image('treasuresea', 'img/treasuresea.png');
        //this.load.atlasJSONArray('greencrab', 'sprite/greencrab.png', 'sprite/greencrab.json');
		//this.load.atlasJSONArray('angryfish', 'sprite/angryfish.png', 'sprite/angryfish.json');
		//this.load.atlasJSONArray('swordfish', 'sprite/swordfish.png', 'sprite/swordfish.json');
		//this.load.start();
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

            //this.ionic_scope.total_points = 1770;  	

            if(this.ionic_scope.total_points <770){
            	this.state.start('GameSmall');
            	this.ionic_scope.current_level = 'GameSmall';
            }


            if(this.ionic_scope.total_points >=770 && this.ionic_scope.total_points <1060){
            	this.state.start('Game');
            	this.ionic_scope.current_level = 'Game';
            }


            if(this.ionic_scope.total_points >=1060 && this.ionic_scope.total_points <1710){
            	this.state.start('Level1Small');
            	this.ionic_scope.current_level = 'Level1Small';
            }

            if(this.ionic_scope.total_points >=1710){
				this.state.start('Level1');
            	this.ionic_scope.current_level = 'Level1';
            }

            //this.state.start('Game');
            //this.state.start('Level1');
            //this.state.start('Level1Small');
        }
	}
};