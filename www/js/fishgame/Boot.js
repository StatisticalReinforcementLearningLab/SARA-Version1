var FishGame = {};

FishGame.Boot = function(game) {};

FishGame.Boot.prototype = {
    preload: function() {
        this.load.image('preloaderBar', 'img/loader_bar.png');
    },
    
    create: function() {
        this.input.maxPointers = 1;
		this.stage.disableVisibilityChange = false;
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.minWidth = 270;
		this.scale.minHeight = 400;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.stage.forcePortrait = true;
		//this.scale.setScreenSize(true);

		this.input.addPointer();

		//Change color here 
		//-- http://www.w3schools.com/colors/colors_picker.asp
		this.stage.backgroundColor = '#095e98';
        
        this.state.start('Preloader');
    }
}