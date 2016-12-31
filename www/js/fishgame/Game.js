FishGame.Game = function(game) {
    this.totalClicks;
    this.totalPoints;
    this.fishGroup;
    this.gameover;
    this.overmessage;
    this.greenfish;
    this.game = game;
    //this.music;


    this.isPrawnAdded;
    this.prawn;

    this.isClownFishAdded;
    this.clownFish;
};

FishGame.Game.prototype = {
    
    create: function() {
        this.gameover = false;
        this.totalClicks = 0;
        this.totalPoints = 0;
        this.isPrawnAdded = false;
        this.isClownFishAdded = false;
        
        //this.music = this.add.audio('game_audio');
        //this.music.play('', 0, 1.0, true);
        
        this.buildWorld();
        this.inputEnabled = false;

        Phaser.Canvas.setTouchAction(this.game.canvas, "auto");
        this.game.input.touch.preventDefault = false;

    },
    
    buildWorld: function() {
        this.add.image(0, 0, 'titlescreen');
        this.buildFish();
        this.addOctopas();
        //this.countdown = this.add.bitmapText(10, 10, 'eightbitwonder', 'Fishes Fed: ' + this.totalClicks, 20);
        this.countdown = this.add.bitmapText(10, 10, 'eightbitwonder', 'Points: ' + this.totalPoints, 20);
    },

    addOctopas: function(){
        var octopus = this.add.sprite(40, 200, 'octopus');
        octopus.animations.add('swim');
        octopus.animations.play('swim', 30, true);
        octopus.scale.setTo(0.3, 0.3);
        this.add.tween(octopus).to({ y: 300 }, 2000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);


        //crab
        var crab = this.add.sprite(230, 440, 'seacreatures');
        crab.animations.add('swim', Phaser.Animation.generateFrameNames('crab1', 0, 25, '', 4), 30, true);
        crab.animations.play('swim');
        crab.scale.setTo(0.7, 0.7);

        //
        var purpleFish = this.add.sprite(-100, 53, 'seacreatures');
        purpleFish.animations.add('swim', Phaser.Animation.generateFrameNames('purpleFish', 0, 20, '', 4), 30, true);
        purpleFish.animations.play('swim');
        purpleFish.anchor.setTo(.5,.5);
        purpleFish.scale.setTo(0.6, 0.6);
        purpleFish.name = "purplefish";
        //this.add.tween(purpleFish).to({ x:  -100 }, 3500, Phaser.Easing.Quadratic.InOut, true, 0, 1000, false);
        this.gobothways(purpleFish);

        //
        var squid = this.add.sprite(90, 440, 'seacreatures', 'squid0000');
        squid.scale.setTo(0.4, 0.4);


        //
        //var prawn = this.add.sprite(10, 450, 'seacreatures', 'prawn0000');
        //prawn.scale.setTo(0.5, 0.5);

        if(this.isPrawnAdded == true){
            var prawn = this.add.sprite(10, 450, 'seacreatures', 'prawn0000');
            prawn.scale.setTo(0.5, 0.5);
        }

        if(this.isClownFishAdded == true){
            this.clownFish = this.add.sprite(-100, 253, 'clownfish');
            this.clownFish.anchor.setTo(.5,.5);
            this.clownFish.animations.add('swim');
            this.clownFish.animations.play('swim', 30, true);
            this.clownFish.scale.setTo(0.8, 0.8);
            this.clownFish.name = "clownFish";
            this.gobothways(this.clownFish);
        }

        //
        var starfish = this.add.sprite(150, 470, 'seacreatures', 'starfish0000');
        starfish.scale.setTo(0.7, 0.7);
        var starfish2 = this.add.sprite(180, 460, 'seacreatures', 'starfish0000');
        starfish2.scale.setTo(0.4, 0.4);


        //
        var greenFish = this.add.sprite(window.innerWidth + 100, 153, 'greenfish');
        greenFish.anchor.setTo(.5,.5);
        greenFish.animations.add('swim');
        greenFish.animations.play('swim', 30, true);
        greenFish.scale.setTo(0.4, 0.4);
        greenFish.name = "greenfish";
        this.gobothways(greenFish);

    },

    gobothways: function(b){
        //console.log('start again ' + b.name);

        //if()
        if(b.x > window.innerWidth){ 
            //console.log('right to left, ' + b.x);
            //b.scale.setTo(-0.4, 0.4);//b.scale.x * (-1);
            b.scale.x = -1*b.scale.x;
            t= this.add.tween(b).to({ x: -100 }, 7500, Phaser.Easing.Quadratic.InOut, true, 0);
            t.onComplete.add(this.stopFish, this); 
        }

        if(b.x < 0){
            //console.log('left to right, ' + b.x);
            b.scale.x = -1*b.scale.x;
            t = this.add.tween(b).to({ x: window.innerWidth + 100 }, 7500, Phaser.Easing.Quadratic.InOut, true, 0);
            t.onComplete.add(this.stopFish, this);
        }
    },
    
    buildFish: function() {
		  //assign number of fish
			numfish = 0;
			//assign type and age of fish
			var fishType = ["green1", "horse1", "purple1", "pink1", "magenta1"]
            this.fishGroup = this.add.group();
            this.fishGroup.enableBody = true;
			for(i = 0; i < numfish; i++){
            	var b = this.fishGroup.create(this.rnd.integerInRange(0, this.world.width), this.rnd.integerInRange(this.world.height-300, this.world.height-200), fishType[i]);
            	b.anchor.setTo(0.5, 0.5);
            	b.body.moves = false;
            	b.inputEnabled = true; //true;
            	b.events.onInputDown.add(this.addTally, this);
            	this.assignFishMovement(b);
			}
    },
    
    assignFishMovement: function(b) {
        xposition = Math.floor(this.rnd.realInRange(-100, this.world.width+100));
        yposition = Math.floor(this.rnd.realInRange(50, this.world.height-150));
        bdelay = 0; //this.rnd.integerInRange(2000, 6000);
        if(xposition < b.x){
            b.scale.x = -1;
        }else{
            b.scale.x = 1;
        }
        b.animations.add('swim');
        b.animations.play('swim', 30, true);
        t = this.add.tween(b).to({x:xposition, y:yposition}, 3500, Phaser.Easing.Quadratic.InOut, true, bdelay);
        t.onComplete.add(this.stopFish, this);
    },
    
    stopFish: function(b) {
        //this.assignFishMovement(b);
        //console.log('stopped');
        this.gobothways(b);
    },
    
    addTally: function() {
        this.totalClicks = this.totalClicks + 1;
        this.countdown.setText('Fishes Fed: ' + this.totalClicks);
    },

    test: function () {


        //
        this.totalPoints = this.totalPoints + 25;
        this.countdown.setText('Points: ' + this.totalPoints);
        /*
        var cache = [];
            JSON.stringify(this, function(key, value) {
                if (typeof value === 'object' && value !== null) {
                    if (cache.indexOf(value) !== -1) {
                        // Circular reference found, discard key
                        return;
                    }
                    // Store value in our collection
                    cache.push(value);
                }
                return value;
            });
            console.log(cache);
            cache = null; 
        */    

        //console.log('Test function ' + this.isPrawnAdded);

        if(this.isPrawnAdded == false){
            this.isPrawnAdded = true;
            this.prawn = this.add.sprite(10, 450, 'seacreatures', 'prawn0000');
            this.prawn.scale.setTo(0.5, 0.5);
        }else{
            this.isPrawnAdded = false;
            this.prawn.destroy();
            //prawn.scale.setTo(0.5, 0.5);
        }

        if(this.isClownFishAdded == false){
            this.isClownFishAdded = true;
            this.clownFish = this.add.sprite(-100, 253, 'clownfish');
            this.clownFish.anchor.setTo(.5,.5);
            this.clownFish.animations.add('swim');
            this.clownFish.animations.play('swim', 30, true);
            this.clownFish.scale.setTo(0.5, 0.5);
            this.clownFish.name = "clownFish";
            this.gobothways(this.clownFish);
        }else{
            this.isClownFishAdded = false;
            this.clownFish.destroy();
            //prawn.scale.setTo(0.5, 0.5);
        }



    },

    update: function(){
        //console.log("Update: isPrawnAdded, " + this.isPrawnAdded);
    }
};