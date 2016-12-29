// In /scripts/game/main.js
window.createGame = function(scope, players, mapId, injector) {


      var game = new Phaser.Game(
          800, 600,         // width x height
          Phaser.AUTO,      // WebGL/Canvas, etc
          'menuExample'   // DOM element to attach
        );

      var newGame, dink;

      function overNewgame() {
        game.add.tween(newGame.scale)
          .to({x: 1.3, y: 1.3}, 300, Phaser.Easing.Exponential.Out, true)
        dink.play();
      };

      function outNewgame() {
        game.add.tween(newGame.scale)
          .to({x: 1, y: 1}, 300, Phaser.Easing.Exponential.Out, true);
      }

      var menuState = {
          preload: function() {
            game.load.image('menu_background', 'assets/games/menu_background.jpg');
            game.load.image('preloader', 'assets/games/preloader.gif');
            game.load.image('background0', 'assets/games/background.png');
            game.load.image('logo', 'assets/games/logo.png');
            game.load.audio('dink', 'assets/games/dink.mp3');
          },
          create: function() {
            console.log('create');
            var image = game.cache.getImage('logo'),
              centerX = game.world.centerX,
              centerY = game.world.centerY - image.height,
              endY    = game.world.height + image.height,
              textPadding = game.device.desktop ? 60 : 30;

            // Menu background
            game.background = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'menu_background');
            game.background.autoScroll(-50, -20);
            game.background.tilePosition.x = 0;
            game.background.tilePosition.y = 0;
            dink       = game.add.audio('dink');

            var sprite = game.add.sprite(centerX, centerY - textPadding, 'logo');
            sprite.anchor.set(0.5);

            if (game.device.desktop) {
              sprite.scale.set(2);
            }

            // Add title
            var fontSize = (game.device.desktop ? '40px' : '20px');
            newGame = game.add.text(game.world.centerX, 
              centerY + textPadding,
              "New game", 
              {
                font: fontSize + " Architects Daughter", 
                align:"center", 
                fill:"#fff"
              }); 
            newGame.inputEnabled = true;
            newGame.anchor.set(0.5);

            newGame.events.onInputOver.add(overNewgame, this);
            newGame.events.onInputOut.add(outNewgame, this);
          }
        }

        game.state.add('MainMenu', menuState);
        game.state.start('MainMenu');

};


