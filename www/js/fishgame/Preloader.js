FishGame.Preloader = function(game) {
    this.preloadBar = null;
    //this.titleText = null;
    this.ready = false;
};

FishGame.Preloader.prototype = {
	
	preload: function () {
		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
		this.preloadBar.anchor.setTo(0.5, 0.5);
		this.load.setPreloadSprite(this.preloadBar);
        this.load.image('titlescreen', 'img/TitleBG3.png');
        this.load.bitmapFont('eightbitwonder', 'fonts/eightbitwonder.png', 'fonts/eightbitwonder.fnt');
        this.load.image('fish', 'img/fish.png');
		this.load.image('green1', 'img/green1.png');
		this.load.image('green2', 'img/green2.png');
		this.load.image('green3', 'img/green3.png');
		this.load.image('green4', 'img/green4.png');
		this.load.image('horse1', 'img/horse1.png');
		this.load.image('horse2', 'img/horse2.png');
		this.load.image('horse3', 'img/horse3.png');
		this.load.image('horse4', 'img/horse4.png');
		this.load.image('magenta1', 'img/magenta1.png');
		this.load.image('magenta2', 'img/magenta2.png');
		this.load.image('magenta3', 'img/magenta3.png');
		this.load.image('magenta4', 'img/magenta4.png');
		this.load.image('pink1', 'img/pink1.png');
		this.load.image('pink2', 'img/pink2.png');
		this.load.image('pink3', 'img/pink3.png');
		this.load.image('pink4', 'img/pink4.png');
		this.load.image('purple1', 'img/purple1.png');
		this.load.image('purple2', 'img/purple2.png');
		this.load.image('purple3', 'img/purple3.png');
		this.load.image('purple4', 'img/purple4.png');
		this.load.image('yellow1', 'img/yellow1.png');
		this.load.image('yellow2', 'img/yellow2.png');
		this.load.image('yellow3', 'img/yellow3.png');
		this.load.image('yellow4', 'img/yellow4.png');
		this.load.atlasXML('octopus', 'sprite/octopus.png', 'sprite/octopus.xml');
		this.load.atlasXML('seacreatures', 'sprite/seacreatures.png', 'sprite/seacreatures.xml');
		this.load.atlasJSONArray('greenfish', 'sprite/swimrightgreenfish.png', 'sprite/swimrightgreenfish.json');
		this.load.atlasJSONArray('clownfish', 'sprite/clownfish.png', 'sprite/clownfish.json');
		
        //this.load.audio('game_audio', 'audio/poop.mp3');
	},

	create: function () {
		this.preloadBar.cropEnabled = false;
	},

	update: function () {

		//this.cache.isSoundDecoded('game_audio') && 
        if(this.ready == false) {
            this.ready = true;
            this.state.start('Game');
        }
	}
};