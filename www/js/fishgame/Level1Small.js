FishGame.Level1Small = function(game) {
    this.totalClicks;
    this.totalPoints;
    this.fishGroup;
    this.gameover;
    this.overmessage;
    this.music;
    this.game = game;
    this.ionic_scope;
    this.progress_sprite
};

FishGame.Level1Small.prototype = {
    
    create: function() {
        this.gameover = false;
        this.totalClicks = 0;
        this.totalPoints = this.ionic_scope.total_points;
        this.music = this.add.audio('game_audio');
        //this.music.play('', 0, 1.0, true);
        
        this.buildWorld();


        this.inputEnabled = false;

        Phaser.Canvas.setTouchAction(this.game.canvas, "auto");
        this.game.input.touch.preventDefault = false;
    },
    
    buildWorld: function() {
        this.height = window.innerHeight-44;
        var undersea = this.add.image(0, 0, 'undersea');
        undersea.scale.setTo(0.8, 0.8);

        //coral
        

        undersea.x = -200;
        undersea.y = 0;
        undersea.height = this.game.height;
        undersea.width = this.game.width*5;


        
        //
        this.add.sprite(8, 40, 'timer', 1);
        this.progress_sprite = this.game.add.sprite(8, 40, 'timer', 0);
        var rect = new Phaser.Rectangle(0, 0, 0, this.progress_sprite.height);;
        rect.width = 0.5 * this.progress_sprite.width;
        this.progress_sprite.crop(rect);


        //
        var treasure = this.add.image(35, this.height-100, 'treasuresea');
        treasure.scale.setTo(0.3, 0.3);
        treasure.inputEnabled = true;
        treasure.events.onInputDown.add(this.showunlockables, this);
        treasure.angle += 10;

        //
        this.active_task_connected = this.add.image(10, 70, 'disconnected');
        this.active_task_connected.set
        this.active_task_connected.scale.setTo(0.15, 0.15);
        this.active_task_connected.inputEnabled = true;
        this.active_task_connected.events.onInputDown.add(this.logdata, this);
        this.active_task_connected.visible = true;


        //this.countdown = this.add.bitmapText(10, 10, 'eightbitwonder', 'Fishes Fed: ' + this.totalClicks, 20);

        this.countdown = this.add.bitmapText(10, 10, 'eightbitwonder', 'Points: ' + this.totalPoints, 20);

        //this.buildFish();
        this.buildAquarium();

        //
        var journal = this.add.image(window.innerWidth - 70, 1, 'fish_journal');
        journal.scale.setTo(0.5, 0.5);
        journal.inputEnabled = true;
        journal.events.onInputDown.add(this.logdata, this);

    },

    logdata: function() {
        //this.totalClicks = this.totalClicks + 1;
        //this.countdown.setText('Fishes Fed: ' + this.totalClicks);
        this.ionic_scope.$emit('survey:logdata', this.ionic_scope);
        //console.log("Came here");
    },

    //update the connected and disconnected things
    updateconnectivity: function(state) {
        //console.log("Is connected: " +  state);
        this.active_task_connected.visible = state;
    },

    assignscope: function(scope) {
        this.ionic_scope = scope;
    },

    buildAquarium: function() {

        ////////////////////////////////////////////////////////////
        //upper aquarium
        ////////////////////////////////////////////////////////////

        /*
        this.sharkfish = this.add.sprite(window.innerWidth + 100, 70, 'sharkswim');
        this.sharkfish.anchor.setTo(.5,.5);
        this.sharkfish.animations.add('swim');
        this.sharkfish.animations.play('swim',10, true);
        this.sharkfish.scale.setTo(0.3, 0.22);
        this.sharkfish.name = "sharkswim";
        this.gobothways(this.sharkfish);

        //swordfish
        this.swordfish = this.add.sprite(-150, 120, 'swordfish');
        this.swordfish.anchor.setTo(.5,.5);
        this.swordfish.animations.add('swim');
        this.swordfish.animations.play('swim',30, true);
        this.swordfish.scale.setTo(0.3, 0.3);
        this.swordfish.name = "swordfishswim";
        this.gobothways(this.swordfish);

        this.dolphin = this.add.sprite(-150, 180, 'dolphin');
        this.dolphin.anchor.setTo(.5,.5);
        this.dolphin.animations.add('swim');
        this.dolphin.animations.play('swim',10, true);
        this.dolphin.scale.setTo(0.6, 0.6);
        this.dolphin.name = "dolphinswim";
        this.dolphin.angle -= 3;
        this.gobothways(this.dolphin);
        */

        var phaserJSON = this.game.cache.getJSON('fishpoints');

        ////////////////////////////////////////////////////////////
        //upper aquarium
        ////////////////////////////////////////////////////////////
        var data = phaserJSON;
        var survey_string = "";
        var current_points = this.totalPoints;
        for(var i = 0; i < data.length; i++) {
            if(current_points >= data[i].points){

                //nemo
                if(data[i].name.valueOf() === "Nemo Dory")
                    this.addDori();


                //starfish
                if(data[i].name.valueOf() === "Jelly fish")
                    this.addJellyFish();

                //squid
                if(data[i].name.valueOf() === "Green Crab")
                    this.addCrab();


                if(data[i].name.valueOf() === "Achovies")
                    this.addAnchovies();

                if(data[i].name.valueOf() === "Bubbles")
                    this.addYellowTang();

                if(data[i].name.valueOf() === "Salmon")
                    this.addSalmon();

                if(data[i].name.valueOf() === "Angry fish")
                    this.addAngryFish();



                //if(data[i].name.valueOf() === "Tiger barb")
                //    this.animateTigerbarb();
            }
        }

        this.addCoral();

    },


    addAFish: function(added_point){

          var phaserJSON = this.game.cache.getJSON('fishpoints');
          //console.log(JSON.stringify(phaserJSON));


          var data = phaserJSON;
          var survey_string = "";
          var current_points = this.totalPoints;
          var old_points = current_points - added_point;
          console.log("" + current_points + ", " + old_points);
          for(var i = 0; i < data.length; i++) {
              if(current_points >= data[i].points && 
                    old_points < data[i].points){

                //nemo
                if(data[i].name.valueOf() === "Nemo Dory")
                    this.addDori();


                //starfish
                if(data[i].name.valueOf() === "Jelly fish")
                    this.addJellyFish();

                //squid
                if(data[i].name.valueOf() === "Green Crab")
                    this.addCrab();


                if(data[i].name.valueOf() === "Achovies")
                    this.addAnchovies();

                if(data[i].name.valueOf() === "Bubbles")
                    this.addYellowTang();

                if(data[i].name.valueOf() === "Salmon")
                    this.addSalmon();

                if(data[i].name.valueOf() === "Angry fish")
                    this.addAngryFish();


                //if(data[i].name.valueOf() === "Tiger barb")
                //    this.animateTigerbarb();

              }
          }

    },

    addDori: function() {        
        ////////////////////////////////////////////////////////////
        // mid aquarium
        ////////////////////////////////////////////////////////////
        var dori = this.add.sprite(90, 100, 'dori');
        dori.animations.add('swim');
        dori.animations.play('swim', 10, true);
        dori.angle -= 10;
        dori.scale.setTo(0.5, 0.5);

        var nemo = this.add.sprite(75, 110, 'nemo');
        nemo.animations.add('swim');
        nemo.animations.play('swim', 7, true);
        nemo.angle += 10;
        nemo.scale.setTo(-0.5, 0.5);

    },

    addYellowTang: function() {  
        var yellowtang = this.add.sprite(70, 180, 'yellowtang');
        yellowtang.animations.add('swim');
        yellowtang.animations.play('swim', 10, true);
        yellowtang.scale.setTo(0.45, 0.45);
        yellowtang.angle -= 10;
        yellowtang.anchor.setTo(.5,.5);
    },


    addJellyFish: function() {  

        //
        var jellyfish = this.add.sprite(window.innerWidth - 80, 100, 'jellyfish');
        jellyfish.animations.add('swim');
        jellyfish.animations.play('swim', 15, true);
        jellyfish.scale.setTo(0.25, 0.25);

    },


    addSalmon: function() { 
        var salmon = this.add.sprite(window.innerWidth - 100, 240, 'salmon');
        salmon.animations.add('swim');
        salmon.animations.play('swim', 10, true);
        salmon.scale.setTo(0.4, 0.4);
        salmon.anchor.setTo(.5,.5);



        ////////////////////////////////////////////////////////////
        // bottom aquarium
        ////////////////////////////////////////////////////////////

        //
        /*
        var whale = this.add.sprite(window.innerWidth+150, this.height-100, 'whale');
        whale.animations.add('swim');
        whale.animations.play('swim', 12, true);
        whale.scale.setTo(1.8, 1.8);
        whale.anchor.setTo(.5,.5);
        whale.angle += 5;
        whale.name = "whaleswim";
        this.gobothways(whale);
        */

    },


    addCrab: function() { 
        var redcrab = this.add.sprite(window.innerWidth-30, this.height-105, 'redcrab');
        redcrab.animations.add('swim');
        redcrab.animations.play('swim', 15, true);
        redcrab.scale.setTo(-0.3, 0.3);

        //
        var greencrab = this.add.sprite(window.innerWidth-240, this.height-85, 'greencrab');
        greencrab.animations.add('swim');
        greencrab.animations.play('swim', 15, true);
        greencrab.scale.setTo(0.3, 0.3);

        //angryfish
        //var angryfish = this.add.sprite(220, this.height-205, 'angryfish');
        //angryfish.animations.add('swim');
        //angryfish.animations.play('swim', 15, true);
        //angryfish.scale.setTo(0.35, 0.35);
    },



        //angryfish
        //var angryfish = this.add.sprite(220, this.height-205, 'angryfish');
        //angryfish.animations.add('swim');
        //angryfish.animations.play('swim', 15, true);
        //angryfish.scale.setTo(0.35, 0.35);

    addAngryFish: function() { 
        this.angryfish = this.add.sprite(-100, this.height-150, 'angryfish');
        this.angryfish.anchor.setTo(1.2,.5);
        this.angryfish.animations.add('swim');
        this.angryfish.animations.play('swim',20, true);
        this.angryfish.scale.setTo(0.4, 0.4);
        this.angryfish.name = "angryfishswim";
        this.gobothways(this.angryfish);


    },

    addAnchovies: function() { 
        //
        this.blueanchovy = this.add.sprite(-100, this.height-250, 'blueanchovy');
        this.blueanchovy.anchor.setTo(.9,.9);
        this.blueanchovy.animations.add('swim');
        this.blueanchovy.animations.play('swim',4, true);
        this.blueanchovy.scale.setTo(0.18, 0.18);
        this.blueanchovy.name = "blueanchovyswim";
        this.gobothways(this.blueanchovy);

        this.greenanchovy = this.add.sprite(-100, this.height-235, 'greenanchovy');
        this.greenanchovy.anchor.setTo(.5,.5);
        this.greenanchovy.animations.add('swim');
        this.greenanchovy.animations.play('swim',8, true);
        this.greenanchovy.scale.setTo(0.13, 0.13);
        this.greenanchovy.name = "greenanchovyswim";
        this.gobothways(this.greenanchovy);

        this.pinkanchovy = this.add.sprite(-100, this.height-270, 'pinkanchovy');
        this.pinkanchovy.anchor.setTo(.2,.2);
        this.pinkanchovy.animations.add('swim');
        this.pinkanchovy.animations.play('swim',2, true);
        this.pinkanchovy.scale.setTo(0.21, 0.21);
        this.pinkanchovy.name = "pinkanchovyswim";
        this.gobothways(this.pinkanchovy);

    },
    

    addCoral: function() { 
        //
        var coral = this.add.image(0, this.height-90, 'coral');
        coral.scale.setTo(0.7, 0.7);

        
    },  

    showunlockables: function() {
        //this.totalClicks = this.totalClicks + 1;
        //this.countdown.setText('Fishes Fed: ' + this.totalClicks);
        //this.ionic_scope.$emit('survey:logdata');
        console.log("Came here treasure");
        //this.game.destroy();
        this.ionic_scope.$emit('show:red',this.ionic_scope);

        var cache = [];
            JSON.stringify(this.ionic_scope, function(key, value) {
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

        //this.ionic_scope.reoutetored(this.ionic_scope);

    },

    gobothways: function(b){
        //console.log('start again ' + b.name);

        //if()
        if(b.x > window.innerWidth){ 
            //console.log('right to left, ' + b.x);
            //b.scale.setTo(-0.4, 0.4);//b.scale.x * (-1);
            b.scale.x = -1*b.scale.x;
            t= this.add.tween(b).to({ x: -100 }, 10500, Phaser.Easing.Quadratic.InOut, true, 0);
            t.onComplete.add(this.stopFish, this); 
        }

        if(b.x < 0){
            //console.log('left to right, ' + b.x);
            b.scale.x = -1*b.scale.x;
            t = this.add.tween(b).to({ x: window.innerWidth + 100 }, 10500, Phaser.Easing.Quadratic.InOut, true, 0);
            t.onComplete.add(this.stopFish, this);
        }
    },      
    
    buildFish: function() {
        
        //assign number of fish
        numfish = 5;
        //assign type and age of fish
        var fishType = ["green4", "horse4", "purple4", "pink4", "magenta4"]
        this.fishGroup = this.add.group();
        this.fishGroup.enableBody = true;
        for(i = 0; i < numfish; i++){
            var b = this.fishGroup.create(this.rnd.integerInRange(0, this.world.width), this.rnd.integerInRange(this.world.height-300, this.world.height-200), fishType[i]);
            b.scale.setTo(0.4, 0.8);
            b.anchor.setTo(0.5, 0.5);
            b.body.moves = false;
            b.inputEnabled = true;
            b.events.onInputDown.add(this.addTally, this);
            this.assignFishMovement(b);
        }

    },
    
    assignFishMovement: function(b) {
        xposition = Math.floor(this.rnd.realInRange(50, this.world.width-50));
        yposition = Math.floor(this.rnd.realInRange(100, this.world.height-200));
        bdelay = this.rnd.integerInRange(2000, 6000);
        if(xposition < b.x){
            b.scale.x = -1;
        }else{
            b.scale.x = 1;
        }
        t = this.add.tween(b).to({x:xposition, y:yposition}, 3500, Phaser.Easing.Quadratic.InOut, true, bdelay);
        t.onComplete.add(this.stopFish, this);
    },
    
    stopFish: function(b) {
        //this.assignFishMovement(b);
        this.gobothways(b);
    },
    
    addTally: function() {
        this.totalClicks = this.totalClicks + 1;
        this.countdown.setText('Fishes Fed: ' + this.totalClicks);
    },

    updatescore: function (added_points) {
        console.log("Update score called inside game, " + this.ionic_scope.total_points);
        this.totalPoints = this.ionic_scope.total_points;
        this.addAFish(added_points);
        this.countdown.setText('Points: ' + this.totalPoints);
    }
};