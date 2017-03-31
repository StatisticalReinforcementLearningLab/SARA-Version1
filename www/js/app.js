// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

//
//--- http://www.ng-newsletter.com/posts/building-games-with-angular.html
//

var app = angular.module('starter', ['ionic', 'ngRoute', 'ngProgress', 'ngCordova', 'gajus.swing', 'aws.cognito.identity', 'aws.cognito.sync', 'sara.data.factory', 'ngMessages'])

app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
        if (navigator.splashscreen) {
            navigator.splashscreen.hide();
        }
    });
});


app.config(function($routeProvider) {
    $routeProvider
        .when("/main", {
            templateUrl: "templates/main.html",
            controller: "MainCtrl"
                //templateUrl : "templates/survey.html",
                //controller : "SurveyCtrl"
                //templateUrl : "templates/recall.html",
                //controller : "RecallCtrl"
        })
        .when("/daily", {
            templateUrl: "templates/survey2.html",
            controller: "DailySurveyCtrl"
        })
        .when("/weekly", {
            templateUrl: "templates/survey2.html",
            controller: "WeeklySurveyCtrl"
        })
        .when("/points", {
            templateUrl: "templates/points.html",
            controller: "PointsCtrl"
        })
        .when("/register", {
            templateUrl: "templates/register.view.html",
            controller: "RegisterCtrl"
        })
        .when("/", {
            templateUrl: "templates/login.view.html",
            controller: "LoginCtrl"
        })
        .when("/reward/:added/:real", {
            //templateUrl : "templates/rewards.html",
            templateUrl: "templates/reward.html",
            controller: "RewardsCtrl"
        })
        .when("/red", {
            templateUrl: "templates/red.html",
            controller: "RedCtrl"
        });
});

app.directive('compile', function($compile) {
    // directive factory creates a link function
    return function(scope, element, attrs) {
        scope.$watch(
            function(scope) {
                // watch the 'compile' expression for changes
                return scope.$eval(attrs.compile);
            },
            function(value) {
                // when the 'compile' expression changes
                // assign it into the current DOM
                element.html(value);

                // compile the new DOM and link it to the current
                // scope.
                // NOTE: we only compile .childNodes so that
                // we don't get into infinite loop compiling ourselves
                $compile(element.contents())(scope);
            }
        );
    };
});


app.directive("w3TestDirective", function($rootScope, saraDatafactory) {
    return {
        restrict: "A",
        template: "<div id = 'gameArea'></div>",
        link: function(scope, element, attrs, injector, location, http, rootScope) {
            //console.log("link function called");


            var game = new Phaser.Game(window.innerWidth, window.innerHeight - 44, Phaser.AUTO, 'gameArea');

            //game.input.touch.enabled = false;
            //game.input.mouse.enabled = false;

            //Phaser.Canvas.setTouchAction(game.canvas, "auto");
            //game.input.touch.preventDefault = false;

            game.state.add('Boot', FishGame.Boot);
            game.state.add('Preloader', FishGame.Preloader);
            game.state.add('StartMenu', FishGame.StartMenu);
            game.state.add('Game', FishGame.Game);
            game.state.add('GameSmall', FishGame.GameSmall);
            game.state.add('Level1', FishGame.Level1);
            game.state.add('Level1Small', FishGame.Level1Small);

            //cognito data
            /*
            var cognito_data = {};
            cognito_data['survey_data'] = JSON.parse(window.localStorage['score_data'] || '{}');;
            cognito_data['badges'] = JSON.parse(window.localStorage['badges'] || '{}');
            cognito_data['imei'] = window.localStorage['imei'] || '';
            cognito_data['username'] = window.localStorage['username'] || '';
            window.localStorage['cognito_data'] = JSON.stringify(cognito_data);
            console.log("cognito_data: " + JSON.stringify(cognito_data));
            saraDatafactory.storedata('rl_data',cognito_data, moment().format('YYYYMMDD'));
            */


            saraDatafactory.pullRLData(function(returnValue) {
                // use the return value here instead of like a regular (non-evented) return value
                //console.log(returnValue);
                //
                //console.log("json content: " + returnValue);

                //ToDo: New user initialization.
                if (returnValue == null)
                    returnValue = window.localStorage['cognito_data'] || "{}";
                else
                    window.localStorage['cognito_data'] = returnValue;


                updateTheScore(returnValue);

                game.state.states["Preloader"].assignscope(scope);
                game.state.states["GameSmall"].assignscope(scope);
                game.state.states["Game"].assignscope(scope);
                game.state.states["Level1"].assignscope(scope);
                game.state.states["Level1Small"].assignscope(scope);

                game.state.start('Boot');

                //console.log("json content: " + "came here");
                //
                //saraDatafactory.copyJSONToFile({"kola":"kola"},"");

                //Don't write this now, After I read AT, and other files I will do it.
                //saraDatafactory.saveDataCollectionState(JSON.parse(returnValue));

            });
            //saraDatafactory.storedata('game_score',json_data, moment().format('YYYYMMDD'));

            function updateTheScore(scoreValue) {

                scoreValue = JSON.parse(scoreValue);
                scoreValue = scoreValue['survey_data'];
                console.log("Updating score " + JSON.stringify(scoreValue));
                /////////////////////////////////////////////////////////////////////////////
                //  Start: calculate all the points
                /////////////////////////////////////////////////////////////////////////////

                //score data
                var score_data = {};

                //daily survey
                var daily_survey = scoreValue['daily_survey']; //JSON.parse(window.localStorage['daily_survey_data'] || "{}");
                console.log(JSON.stringify(daily_survey));
                scope.total_daily_surveys = 0;
                for (var key in daily_survey) {
                    //console.log(key);
                    scope.total_daily_surveys += 1;
                }
                score_data['daily_survey'] = daily_survey;

                //weekly survey
                var weekly_survey = scoreValue['weekly_survey']; //JSON.parse(window.localStorage['weekly_survey_data'] || "{}");
                console.log(JSON.stringify(weekly_survey));
                scope.total_weekly_surveys = 0;
                for (var key in weekly_survey) {
                    //console.log(key);
                    scope.total_weekly_surveys += 1;
                }
                score_data['weekly_survey'] = weekly_survey;


                //active tasks
                //var active_tasks_survey = scoreValue['active_tasks_survey_data'];
                var active_tasks_survey = scoreValue['active_tasks_survey'];//JSON.parse(window.localStorage['active_tasks_survey_data'] || "{}");
                console.log(JSON.stringify(active_tasks_survey));
                scope.total_active_tasks_surveys = 0;
                for (var key in active_tasks_survey) {
                    //console.log(key);
                    scope.total_active_tasks_surveys += active_tasks_survey[key];
                }
                //console.log(JSON.stringify(active_tasks_survey));
                score_data['active_tasks_survey'] = active_tasks_survey;

                //
                scope.total_points = scope.total_daily_surveys * 30 + scope.total_weekly_surveys * 50 + scope.total_active_tasks_surveys * 15;
                score_data['points'] = scope.total_points;

                if ($rootScope.total_score == undefined)
                    $rootScope.total_score = scope.total_points;
                else
                    scope.total_points = $rootScope.total_score;


                //saraDatafactory.storedata('rl_data',cognito_data, moment().format('YYYYMMDD'));
                //
                //window.localStorage['score_data'] = JSON.stringify(score_data);

                /////////////////////////////////////////////////////////////////////////////
                //  End: calculate all the points
                /////////////////////////////////////////////////////////////////////////////

                return score_data;
            }

            //game.state.states["Level"].assignscope(scope);

            /*
            //I want change a directive
            scaleRatio = window.devicePixelRatio / 3;

            //Create a new game instance and assign it to the 'gameArea' div

            //game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, (window.innerHeight * window.devicePixelRatio) - 45 * window.devicePixelRatio, Phaser.AUTO, 'gameArea');
       
            var game = new Phaser.Game(window.innerWidth-20, 300, Phaser.AUTO, 'gameArea', { preload: preload, create: create });
       
            function preload () {
                  game.load.image('logo', 'img/ionic.png');
            }

            function create () {

                //
                var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
                logo.anchor.setTo(0.5, 0.5);

                Phaser.Canvas.setTouchAction(game.canvas, "auto");
                game.input.touch.preventDefault = false;

                //
                scope.$emit('game:something', 'holla');  
            }
            */

            //create the game here


            /* --- If this goes from the game to ionic
            // See how to handle -- http://stackoverflow.com/questions/14502006/working-with-scope-emit-and-on
            var addNewPlayer = function(player) {
              players.push(player); // some player array holding all the players
              scope.$emit('game:newPlayer', player);
            }
            */

            /*
                // Set up the game
                // from "ionic" to "game" with "$injector".
                scope.$on('game:toggleMusic', function() {
                  Game.toggleMusic(); // some function that toggles the music
                });
            */

            //clown fish animation
            //-- http://www.sevenoaksart.co.uk/clownfish.htm
            //more fishes: http://www.sevenoaksart.co.uk/goldfish.htm
            //shark -- http://www.sevenoaksart.co.uk/shark.htm
            //dophins http://www.sevenoaksart.co.uk/dolphins.htm
            //Convert gif to imgaes "http://ezgif.com/split"
            //Decompose sprite <!-- https://jmsliu.com/products/sprite-sheet-decomposer/decomposer.php -->

            function checkLevelChange(added_points) {

                if (added_points == 0)
                    return;

                //do nothing
                //if(scope.total_points <770)
                //  game.state.start('GameSmall',true,false);


                if (scope.total_points >= 770 && (scope.total_points - added_points) < 770) {
                    game.state.start('Game', true, false);
                    scope.current_level = 'Game';
                }


                if (scope.total_points >= 1060 && (scope.total_points - added_points) < 1060) {
                    game.state.start('Level1Small', true, false);
                    scope.current_level = 'Level1Small';
                }

                if (scope.total_points >= 1830 && (scope.total_points - added_points) < 1830) {
                    game.state.start('Level1', true, false);
                    scope.current_level = 'Level1';
                }

            }

            scope.$on('game:test', function() {
                //console.log(JSON.stringify(game, null, 4));
                //call something like the follows
                //-- Game.toggleMusic();

                //add a fish.
                //game.state.Game.test();
                //game.state["Game"].test();
                game.state.states["Game"].test();

            });

            //$scope.$broadcast('game:addscore', {state: points});
            scope.$on('game:addscore', function(event, args) {
                scope.total_points += args.state;
                $rootScope.total_score = scope.total_points;

                console.log("Current points: " + scope.total_points + ", added: " + args.state);

                //check level change
                checkLevelChange(args.state);


                if (scope.current_level === "GameSmall")
                    game.state.states["GameSmall"].updatescore(args.state);

                if (scope.current_level === "Game")
                    game.state.states["Game"].updatescore(args.state);


                if (scope.current_level === "Level1Small")
                    game.state.states["Level1Small"].updatescore(args.state);


                if (scope.current_level === "Level1")
                    game.state.states["Level1"].updatescore(args.state);



                if (args.state != 300) {
                    console.log("Game object: " + game);
                    //game.destroy();
                    scope.$emit('show:reward', args);
                }
            });


            scope.$on('$destroy', function() {
                console.log("Game destroyed");
                game.destroy(); // Clean up the game when we leave this scope
            });

            scope.$on('game:updatescore', function(event, args) {
                //console.log("Update score called " + scope.total_points);
                //call something like the follows
                //-- Game.toggleMusic();

                console.log("called: updated score 2");

                //add a fish.
                //game.state.Game.test();
                //game.state["Game"].test();
                scope.total_points = args.state;
                $rootScope.total_points = scope.total_points;

                checkLevelChange();

                if (scope.current_level === "GameSmall")
                    game.state.states["GameSmall"].updatescore();
                if (scope.current_level === "Game")
                    game.state.states["Game"].updatescore();
                if (scope.current_level === "Level1Small")
                    game.state.states["Level1Small"].updatescore();
                if (scope.current_level === "Level1")
                    game.state.states["Level1"].updatescore();

            });

            scope.$on('game:level2', function() {

                //call something like the follows
                //-- Game.toggleMusic();
                //add a fish.
                //game.state.Game.test();
                //game.state["Game"].test();
                //game.state.states["Game"].test();

                var current_level = window.localStorage['current_level'] || 'Game';
                //console.log(current_level);
                if (current_level == 'Game') {
                    game.state.start('Level1');
                    window.localStorage['current_level'] = 'Level1';
                } else {
                    game.state.start('Game');
                    window.localStorage['current_level'] = 'Game';
                }
            });


            scope.$on('game:level', function(event, args) {

                //call something like the follows
                //-- Game.toggleMusic();
                //add a fish.
                //game.state.Game.test();
                //game.state["Game"].test();
                //game.state.states["Game"].test();
                var next_level = args.state;
                var added_points = 0;

                if (next_level == '1') {
                    scope.total_points = 760;
                    $rootScope.total_points = scope.total_points;
                    game.state.start('GameSmall', true, false);
                    scope.current_level = 'GameSmall';
                }

                if (next_level == '2') {
                    scope.total_points = 1050;
                    $rootScope.total_points = scope.total_points;
                    game.state.start('Game', true, false);
                    scope.current_level = 'Game';
                }

                if (next_level == '3') {
                    scope.total_points = 1820;
                    $rootScope.total_points = scope.total_points;
                    game.state.start('Level1Small', true, false);
                    scope.current_level = 'Level1Small';
                }

                if (next_level == '4') {
                    scope.total_points = 2100;
                    $rootScope.total_points = scope.total_points;
                    game.state.start('Level1', true, false);
                    scope.current_level = 'Level1';
                }

                //console.log("Current points: " + scope.total_points + ", added: " + args.state);

            });


            scope.$on('update:scope', function() {
                console.log("face");
            });

            scope.$on('game:updateIsConnected', function(event, args) {
                if (scope.current_level === "GameSmall")
                    game.state.states["GameSmall"].updateconnectivity(args.state);
                if (scope.current_level === "Game")
                    game.state.states["Game"].updateconnectivity(args.state);
                if (scope.current_level === "Level1Small")
                    game.state.states["Level1Small"].updateconnectivity(args.state);
                if (scope.current_level === "Level1")
                    game.state.states["Level1"].updateconnectivity(args.state);
            });
        }
    };
});



app.controller("MainCtrl", function($scope, $state, $rootScope, $ionicPlatform, $ionicPopup, $timeout, $location, $cordovaStatusbar, $cordovaInAppBrowser, $interval, $rootScope, saraDatafactory) {

    window.localStorage['email'] = "sara-test";

    //for testing
    window.localStorage['current_level'] = 'Game';



    //status bar color
    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        console.log(StatusBar);
        if (ionic.Platform.isAndroid()) {
            //$cordovaStatusbar.overlaysWebView(true);
            //$cordovaStatusbar.styleHex('#4527A0');
            if (window.StatusBar) {
                StatusBar.overlaysWebView(true);
                StatusBar.backgroundColorByHexString("#303F9F"); //Light
                //StatusBar.style(2); //Black, transulcent
                //StatusBar.style(3); //Black, opaque
            }
        }

        //
        console.log("On device ready");

        /*
        saraDatafactory.loadDataCollectionState(function(returnValue) {
            if (returnValue == null) {

            } else {
                var sdcard_data = JSON.parse(returnValue);
                console.log("json content: " + JSON.stringify(sdcard_data));
            }
        });
        */
        readActiveTaskData();

    }

    $ionicPlatform.on('resume', function() {
        console.log("App resumed");
    });


    var promise = $interval(readActiveTaskData, 3000);
    function readActiveTaskData() {
        //read active task data here.
        //problem is we need to load it every 5 seconds.
        saraDatafactory.loadDataCollectionState(function(returnValue) {
            if (returnValue == null) {} 
            else {
                var sdcard_data = JSON.parse(returnValue);
                //console.log("json content: " + JSON.stringify(sdcard_data));

                //
                var active_task_prior_data = JSON.parse(window.localStorage['at_data'] || "{}");
                //active_task_data = active_task_data['active_tasks_survey_data']


                //if for today there is something new then add that to the main one, and add to the points
                var isActiveTaskAdded =  false;
                var isActiveTaskAddedHowMany =  0;
                var active_tasks_survey_data = sdcard_data['active_tasks_survey'];
                for (var key in active_tasks_survey_data) {
                    if (active_tasks_survey_data.hasOwnProperty(key)) {
                        //console.log(key + " -> " + p[key]);
                        if (active_task_prior_data.hasOwnProperty(key)) {
                            //we need to see if the count is different
                            if (active_task_prior_data[key] < active_tasks_survey_data[key]){
                                isActiveTaskAddedHowMany = isActiveTaskAddedHowMany + active_tasks_survey_data[key] - active_task_prior_data[key];
                                active_task_prior_data[key] = active_tasks_survey_data[key];
                                isActiveTaskAdded = true;
                            }
                        } else {
                            //means we have new data, since the date don't exist
                            active_task_prior_data[key] = active_tasks_survey_data[key];
                            isActiveTaskAdded = true;
                            isActiveTaskAddedHowMany = isActiveTaskAddedHowMany + active_tasks_survey_data[key];
                        }
                    }
                }
                console.log("AT data: " + isActiveTaskAddedHowMany + ", " + isActiveTaskAdded);
                if(isActiveTaskAdded){
                    $scope.$broadcast('game:addscore', {
                        state: 15 * isActiveTaskAddedHowMany
                    });
                }
                window.localStorage['at_data'] = JSON.stringify(active_task_prior_data);


                //console.log("AT data: " + JSON.stringify(active_task_prior_data));

                //save to the cloud.
                //saraDatafactory.storedata('game_score',active_task_prior_data, moment().format('YYYYMMDD'));
            }
        });
    }



    //getActiveTaskData();
    $rootScope.isConnectedWithApp = false;
    $rootScope.rewardIsActiveTask = false;

    function isLoggedIn() {
        //console.log("Is connected: " +  $rootScope.isConnectedWithApp);

        if ($rootScope.isConnectedWithApp == false) {
            $scope.$broadcast('game:updateIsConnected', {
                state: true
            });
        } else {
            $scope.$broadcast('game:updateIsConnected', {
                state: true
            });
            //$interval.cancel();
        }

        //getActiveTaskData();
        //sendSurveyCompletedData();
        // call your service method here
        if (($rootScope.activeTaskAdded != undefined) && $rootScope.activeTaskAdded) {
            $scope.$broadcast('game:addscore', {
                state: 15 * $rootScope.activeTaskAddedHowMany
            });
            $rootScope.activeTaskAdded = false;

            //set this is an active task update
            $rootScope.rewardIsActiveTask = true;
        }


        //
        // send a new one for whether the daily and weekly survey is completed.
        //


    }

    $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        console.log("Interval canceled");
        $interval.cancel(promise);
    });


    $scope.location = $location;
    $scope.startGame = function() {
        //console.log("came here");

        $scope.$broadcast('game:test'); //SUCCESS

        //$location.path("/red");
        // $state.go('game');

        //use the scope to do things?
    };



    $scope.addpoint = function(points) {
        $scope.$broadcast('game:addscore', {
            state: points
        });
    };


    $scope.startNewLevel = function() {
        $scope.$broadcast('game:level2'); //SUCCESS  
    };

    $scope.changeLevel = function(level) {
        $scope.$broadcast('game:level', {
            state: level
        }); //SUCCESS  
    };


    $scope.$on('survey:logdata', function(event, data) {
        //console.log("Got something: " + data); 
        //console.log("Got something " + data); 
        showPopup();
    });


    $scope.$on('show:red', function(event, scope) {
        //console.log("Got something: " + data); 
        //console.log("Got something: red, " + scope + " " + $location); 
        //console.log($location.path());

        //$location.path("/red");

        $location.path("/points");
        $scope.$apply();
    });

    //
    $scope.$on('show:reward', function(event, args) {
        //console.log("Got something: " + data); 
        //console.log("Got something: red, " + scope + " " + $location); 
        //console.log($location.path());
        //$location.path("/red");

        $location.path("/reward/" + args.state + "/false");
        $scope.$apply();
    });


    ///////////////////////////////////////////////////////////////////////
    // --- Daily survey
    ///////////////////////////////////////////////////////////////////////
    $scope.startDailySurvey = function() {
        $scope.myPopup.close();

        //only available after 6PM.
        var today_date_string = moment().format('YYYY-MM-DD');
        var daily_survey_start_time = moment(today_date_string + " " + "1:00" + " am", "YYYY-MM-DD hh:mm a");
        var daily_survey_end_time = moment(today_date_string + " " + "11:59" + " pm", "YYYY-MM-DD hh:mm a");

        if (moment().valueOf() >= daily_survey_start_time && moment().valueOf() <= daily_survey_end_time) {

            //
            var isDailySurveyCompleted = window.localStorage['daily_survey_' + moment().format('YYYYMMDD')] || 0;

            //For debug, keep it
            if (isDailySurveyCompleted <= 1) { //==0
                console.log("Daily survey ");
                //$scope.$broadcast('$destroy');
                $location.path("/daily");
            } else {
                $scope.showAlertCompletedDaily();
            }
        } else {
            $scope.showAlertDaily();
        }
    };


    $scope.showAlertCompletedDaily = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Thank you.',
            template: 'You already completed the daily survey.'
        });

        alertPopup.then(function(res) {
            console.log('Daily survey unavilable');
        });
    };

    $scope.showAlertDaily = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Daily survey unavilable',
            template: 'Daily survey is only available between 6PM to 12AM.'
        });

        alertPopup.then(function(res) {
            console.log('Daily survey unavilable');
        });
    };



    ///////////////////////////////////////////////////////////////////////
    // --- Weekly survey
    ///////////////////////////////////////////////////////////////////////
    $scope.startWeeklySurvey = function() {
        $scope.myPopup.close();

        //only available after 6PM.
        var today_date_string = moment().format('YYYY-MM-DD');
        //var weekly_survey_start_time = moment(today_date_string + " " + "6:00" + " pm", "YYYY-MM-DD hh:mm a");
        //var weekly_survey_end_time = moment(today_date_string + " " + "11:59" + " pm", "YYYY-MM-DD hh:mm a");

        //
        var weekly_survey_start_time = moment(today_date_string + " " + "12:01" + " am", "YYYY-MM-DD hh:mm a");
        var weekly_survey_end_time = moment(today_date_string + " " + "11:59" + " pm", "YYYY-MM-DD hh:mm a");

        //-- 
        if (moment().valueOf() >= weekly_survey_start_time && moment().valueOf() <= weekly_survey_end_time) {
            console.log("Weekly survey " + moment().format('dddd'));
            //if(moment().format('dddd') == 'Sunday')
            {

                var isWeeklySurveyCompleted = window.localStorage['weekly_survey_' + moment().format('YYYYMMDD')] || 0;
                //
                if (isWeeklySurveyCompleted <= 1) { //==0
                    console.log("Weekly survey ");
                    //$scope.$broadcast('$destroy');
                    $location.path("/weekly");
                } else {
                    $scope.showAlertCompletedWeekly();
                }
            }
            //else
            //    $scope.showAlertWeekly();
        } else
            $scope.showAlertWeekly();
    };



    $scope.showAlertWeekly = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Weekly survey unavilable',
            template: 'Weekly survey is only available between 6PM to 12AM on Sunday.'
        });

        alertPopup.then(function(res) {
            console.log('Weekly survey unavilable');
        });
    };


    $scope.showAlertCompletedWeekly = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Thank you.',
            template: 'You already completed the weekly survey.'
        });

        alertPopup.then(function(res) {
            console.log('Weekly survey unavilable');
        });
    };



    ///////////////////////////////////////////////////////////////////////
    // --- Active tasks
    ///////////////////////////////////////////////////////////////////////
    $scope.startSpatialActiveTask = function() {
        console.log("Active task survey ");

        //-- http://www.gajotres.net/how-to-launch-external-application-with-ionic-framework/
        //var scheme;
        //-- https://github.com/lampaa/com.lampa.startapp
        //-- 

        $scope.myPopup.close();
        if (device.platform === 'Android') {
            var sApp = startApp.set({ /* params */
                "package": "edu.stat.srl.passivedatakit",
                "intentstart": "startActivity",
                "component": ["edu.stat.srl.passivedatakit", "edu.stat.srl.passivedatakit.activetasks.SpatialTask.SpatialMemoryTaskA1"]
            }, { /* extras */

            });


            sApp.check(function(values) { /* success */
                console.log(values)
            }, function(error) { /* fail */
                alert(error);
            });

            sApp.start(function() { /* success */
                console.log(values)
            }, function(error) { /* fail */
                alert(error);
            });
        }

    };

    $scope.startTwoFingerActiveTask = function() {
        console.log("Active task survey ");

        //-- http://www.gajotres.net/how-to-launch-external-application-with-ionic-framework/
        //var scheme;
        //-- https://github.com/lampaa/com.lampa.startapp
        //-- 

        $scope.myPopup.close();
        if (device.platform === 'Android') {
            var sApp = startApp.set({ /* params */
                "package": "edu.stat.srl.passivedatakit",
                "intentstart": "startActivity",
                "component": ["edu.stat.srl.passivedatakit", "edu.stat.srl.passivedatakit.activetasks.TappingTask.TwoFingerTappingA1"]
            }, { /* extras */

            });


            sApp.check(function(values) { /* success */
                console.log(values)
            }, function(error) { /* fail */
                alert(error);
            });

            sApp.start(function() { /* success */
                console.log(values)
            }, function(error) { /* fail */
                alert(error);
            });
        }

    };

    //show pop-up
    function showPopup() {

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({

            //'<button class="button button-full button-positive" ng-click="startDailySurvey()">Daily Survey</button><button class="button button-full button-positive" ng-click="startWeeklySurvey()">Weekly Survey</button><button class="button button-full button-positive" ng-click="startActiveTask()">Active Tasks</button>'; 
            //<button class="button button-full button-positive" ng-click="startDailySurvey()" style="padding-top:3px;padding-bottom:1px;" ><p style="line-height:1.2;">Daily Survey <br><spa style="font-size: 12px;">Today after 6PM</span></p></button>
            template: '<button class="button button-full button-royal" ng-click="startDailySurvey()" style="padding-top:2px;padding-bottom:-3px;">' +
                '<p style="line-height:1.2;">Daily Survey<br><spa style="font-size: 12px;">Today after 6PM</span></p>' +
                '</button>' +
                '<button class="button button-full button-positive" ng-click="startSpatialActiveTask()" style="padding-top:2px;padding-bottom:-3px;">' +
                '<p style="line-height:1.2;">Spatial task<br><spa style="font-size: 12px;">Today after 6PM</span></p>' +
                '</button>' +
                '<button class="button button-full button-positive" ng-click="startTwoFingerActiveTask()" style="padding-top:2px;padding-bottom:-3px;">' +
                '<p style="line-height:1.2;">Finger tapping task<br><spa style="font-size: 12px;">Today after 6PM</span></p>' +
                '</button>' +
                '<button class="button button-full button-dark" ng-click="startWeeklySurvey()" style="padding-top:2px;padding-bottom:-3px;">' +
                '<p style="line-height:1.2;">Weekly Survey<br><spa style="font-size: 12px;">Sunday after 6PM</span></p>' +
                '</button>',
            title: 'Complete the following surveys',
            //subTitle: 'Current id: <b>' + $scope.email + '<b>',
            scope: $scope,
            buttons: [{
                text: 'Cancel',
                type: 'button-assertive'
            }]

        });

        myPopup.then(function(res) {
            //console.log('Tapped!', res);
        });

        $timeout(function() {
            myPopup.close(); //close the popup after 3 seconds for some reason
        }, 10000);

        $scope.myPopup = myPopup;
    };


    $scope.checkWebSocket = function() {
        getActiveTaskData();
    };


    $scope.showRegister = function() {
        $location.path("/login");
    };


    //update points
    function updatePoints(x) {

        var daily_survey = JSON.parse(window.localStorage['daily_survey_data'] || "{}");
        console.log(JSON.stringify("Daily survey: " + daily_survey));
        $scope.total_daily_surveys = 0;
        for (var key in daily_survey) {
            //console.log(key);
            $scope.total_daily_surveys += 1;
        }


        //weekly survey
        var weekly_survey = JSON.parse(window.localStorage['weekly_survey_data'] || "{}");
        console.log(JSON.stringify("Weekly survey: " + weekly_survey));
        $scope.total_weekly_surveys = 0;
        for (var key in weekly_survey) {
            //console.log(key);
            $scope.total_weekly_surveys += 1;
        }


        //active tasks
        var active_tasks_survey = JSON.parse(window.localStorage['active_tasks_survey_data'] || "{}");
        $scope.total_active_tasks_surveys = 0;
        if (active_tasks_survey.hasOwnProperty(moment().format('YYYYMMDD')))
            $scope.total_active_tasks_surveys = active_tasks_survey[moment().format('YYYYMMDD')];
        console.log(JSON.stringify("Active tasks: " + JSON.stringify(active_tasks_survey)));
        console.log(JSON.stringify("Active tasks: " + $scope.total_active_tasks_surveys));

        $scope.total_active_tasks_surveys = x;
        console.log(JSON.stringify("Active tasks: " + $scope.total_active_tasks_surveys));

        //
        $scope.total_points = $scope.total_daily_surveys * 30 + $scope.total_weekly_surveys * 50 + $scope.total_active_tasks_surveys * 15;
        console.log("Total points: " + $scope.total_points);

        //
        //-- $scope.$broadcast('game:addscore', {state: points});        

        //update points
        //$scope.$broadcast('game:updatescore',$scope.total_points);
        //$scope.$broadcast('game:updatescore', {state: $scope.total_points});
    }


    function sendSurveyCompletedData(type, time) {
        //this is the websocket.
        if ("WebSocket" in window) {
            //alert("WebSocket is supported by your Browser!");

            // Let us open a web socket
            //127.0.0.1", 9090

            //see here ---- http://stackoverflow.com/questions/12702305/using-html5-client-with-a-server-in-java
            //var ws = new WebSocket("ws://35.2.5.151:9090/");
            var ws = new WebSocket("ws://127.0.0.1:9090/");
            //35.2.23.154
            //var ws = new WebSocket("ws://35.2.23.154:9090/");
            //var ws = new WebSocket("ws://192.168.2.127:9090/");

            ws.onopen = function() {

                //// Web Socket is connected, send data using send()
                //ws.send("Message to send");

                //-- var isDailySurveyCompleted = window.localStorage['daily_survey_' + moment().format('YYYYMMDD')] || 0;
                //-- var isWeeklySurveyCompleted = window.localStorage['weekly_survey_' + moment().format('YYYYMMDD')] || 0;

                var isDailySurveyCompleted = window.localStorage['daily_survey_' + moment().format('YYYYMMDD')] || 0;
                if (isDailySurveyCompleted > 0) {
                    var type = "d";
                    //var time = moment().format("X");
                    ws.send("Done," + type + "," + 1);
                }

                //
                var isWeeklySurveyCompleted = window.localStorage['weekly_survey_' + moment().format('YYYYMMDD')] || 0;
                if (isWeeklySurveyCompleted > 0) {
                    var type = "w";
                    //var time = moment().format("X");
                    ws.send("Done," + type + "," + 1);
                }
            };

            ws.onerror = function(error) {
                ws.close();
            };

            ws.onmessage = function(evt) {
                var received_msg = evt.data;
                //console.log("" + received_msg);
                if (received_msg === "Got it dude, w") {
                    //console.log("closing");
                    ws.close();
                }

                if (received_msg === "Got it dude, d") {
                    //console.log("closing");
                    ws.close();
                }

                //ws.close();
            };

            ws.onclose = function() {};
        } else {
            // The browser doesn't support WebSocket
            alert("WebSocket NOT supported by your Browser!");
        }
    };



    function getActiveTaskData() {
        //this is the websocket.
        //
        //console.log("AT called");
        if ("WebSocket" in window) {
            //alert("WebSocket is supported by your Browser!");

            // Let us open a web socket
            //127.0.0.1", 9090

            //see here ---- http://stackoverflow.com/questions/12702305/using-html5-client-with-a-server-in-java
            var ws = new WebSocket("ws://127.0.0.1:9090/");
            //35.2.23.154//35.2.5.151
            //var ws = new WebSocket("ws://35.2.5.151:9090/");
            //var ws = new WebSocket("ws://192.168.2.127:9090/");

            ws.onopen = function() {
                //// Web Socket is connected, send data using send()

                //console.log("AT connected");

                //ws.send("Message to send");
                ws.send("Get:ActiveTask");
                //alert("Connection open...");
            };

            ws.onerror = function(error) {
                //\\console.log('WebSocket Error ');
                //alert(error);
                //var str = JSON.stringify(error);
                //var str = JSON.stringify(error, null, 4); // (Optional) beautiful indented output.
                //console.log(str);

                //
                //$scope.total_points = 90;
                //$scope.$broadcast('game:updatescore', {state: 110});
                //console.log("AT error");
                $rootScope.isConnectedWithApp = false;

            };

            ws.onmessage = function(evt) {
                //console.log("AT msg");
                var received_msg = evt.data;
                //alert("Message is received..., " + evt.data);
                var active_task_survey_data = JSON.parse(window.localStorage['active_tasks_survey_data'] || "{}");

                //
                var current_at = parseInt(received_msg) || -1;

                if (current_at > -1) { //means this is data about active tasks.

                    //load the earlier one, if it does not exist.
                    var prior_at = active_task_survey_data[moment().format('YYYYMMDD')] || -1;

                    //means no record for today so far
                    if (prior_at == -1) {
                        prior_at = 0;
                        for (var key in active_task_survey_data) {
                            if (active_task_survey_data.hasOwnProperty(key)) {
                                prior_at += active_task_survey_data[key];
                            }
                        }
                    }

                    // save the results
                    active_task_survey_data[moment().format('YYYYMMDD')] = parseInt(received_msg) || -1;

                    //
                    console.log(JSON.stringify("Works: " + JSON.stringify(active_task_survey_data)) + " , prior: " + prior_at);
                    window.localStorage['active_tasks_survey_data'] = JSON.stringify(active_task_survey_data);

                    //
                    $rootScope.activeTaskAdded = false;
                    if (current_at > prior_at) {
                        //updatePoints(current_at);
                        $rootScope.activeTaskAdded = true;
                        $rootScope.activeTaskAddedHowMany = current_at - prior_at;
                    }
                    ws.close();
                    //}

                    $rootScope.isConnectedWithApp = true;
                }

            };

            ws.onclose = function() {
                // websocket is closed.
                //alert("Connection is closed..."); 
                //console.log("AT close");
            };


            //
        } else {
            // The browser doesn't support WebSocket
            alert("WebSocket NOT supported by your Browser!");
        }
    };

    //update immediately
    if (($rootScope.activeTaskAdded != undefined) && $rootScope.activeTaskAdded) {

        //beofore tomorrow vs today.

        $scope.$broadcast('game:addscore', {
            state: 15 * $rootScope.activeTaskAddedHowMany
        });
        $rootScope.activeTaskAdded = false;
    }

});



app.controller('RegisterCtrl', ['$scope', 'awsCognitoIdentityFactory', '$state', '$ionicLoading', '$location',
    function($scope, awsCognitoIdentityFactory, $state, $ionicLoading, $location) {
        $scope.user = {};

        $scope.error = {
            message: null
        };

        $scope.goLogin = function() {
            $location.path("/login");
        };

        $scope.register = function() {
            $ionicLoading.show({
                template: 'Loading...'
            });
            awsCognitoIdentityFactory.signUp($scope.user.username, $scope.user.email, $scope.user.password,
                function(err, result) {
                    if (err) {
                        errorHandler(err);
                        return false;
                    }

                    $ionicLoading.hide();
                    $scope.$apply();

                    $scope.user = {}; //clear register form
                    $location.path("/login");
                    //$state.go('confirm');
                });
            return true;
        }

        errorHandler = function(err) {
            console.log(err);
            $scope.error.message = err.message;
            $scope.$apply();
            $ionicLoading.hide();
        }

    }
]);


app.controller('LoginCtrl', ['$scope', 'awsCognitoIdentityFactory', '$state', '$ionicLoading', '$location',
    function($scope, awsCognitoIdentityFactory, $state, $ionicLoading, $location) {
        $scope.user = {
            email: null,
            password: null
        };
        $scope.error = {
            message: null
        };


        $scope.getUserFromLocalStorage = function() {
            awsCognitoIdentityFactory.getUserFromLocalStorage(function(err, isValid) {
                if (err) {
                    $scope.error.message = err.message;
                    if (isValid == false)
                        return false;
                }
                //if(isValid) $state.go('todo', {}, {reoload: true})
                if (isValid) {
                    $location.path("/main");
                    $scope.$apply();
                }
                //$state.go('todo', {}, {reoload: true})

            });
        }

        $scope.signIn = function(login) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            awsCognitoIdentityFactory.signIn($scope.user.email, $scope.user.password, function(err) {
                if (err) {
                    console.log(err);
                    if (err.message === 'Incorrect username or password.') {
                        // https://github.com/aws/amazon-cognito-identity-js/issues/42
                        $scope.error.message = err.message + ' Have you verified ' + $scope.user.email + ' account?'
                    } else {
                        $scope.error.message = err.message;
                    }
                    $ionicLoading.hide();
                    $scope.$apply();
                    return false;
                }

                $ionicLoading.hide();
                clearForm(login);
                $location.path("/main");
                //$state.go('todo', {}, {reoload: true});
            })
        }

        $scope.userLogged = function() {
            if (awsCognitoIdentityFactory.ifUserLogged) {
                $location.path("/main");
                //$state.go('todo', {}, {reload: true});
            }
        }

        var clearForm = function(login) {
            $scope.user = {
                email: '',
                password: ''
            }
            login.$setUntouched();
        }
    }
]);



app.controller("RedCtrl", function($scope, $location, $cordovaStatusbar, $timeout, awsCognitoSyncFactory, awsCognitoIdentityFactory, $ionicHistory, $state, $ionicLoading, saraDatafactory) {
    //console.log($location.path());

    //status bar color
    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        console.log(StatusBar);
        if (ionic.Platform.isAndroid()) {
            //$cordovaStatusbar.overlaysWebView(true);
            //$cordovaStatusbar.styleHex('#4527A0');
            if (window.StatusBar) {
                StatusBar.overlaysWebView(true);
                StatusBar.backgroundColorByHexString("#303F9F"); //Light
                //StatusBar.style(2); //Black, transulcent
                //StatusBar.style(3); //Black, opaque
            }
        }
    }

    saraDatafactory.testtstr();



    $scope.goHome = function() {
        $location.path("/");
    };

    /*
    $scope.cards = [
        {name: 'clubs', symbol: '♣', show:true, up:100, class: 'blue', img:'img/blue.png', show_image: true},
        {name: 'diamonds', symbol: '♦', show:false, up:130, class: 'red', img:'img/blue.png', show_image: false},
        {name: 'hearts', symbol: '♥', show:false, up:160, class: 'green', img:'img/blue.png', show_image: false},
        {name: 'spades', symbol: '♠', show:false, up:190, class: 'yellow', img:'img/blue.png', show_image: true}
    ];


    $scope.remove = function (index) {
        $scope.cards.splice(index, 1);
    };

    $scope.options = {
          isThrowOut: function (offset, elementWidth, throwOutConfidence) {
                console.log('isThrowOut', offset, elementWidth, throwOutConfidence);
                return throwOutConfidence === 1;
          }
    };

    $scope.toshow = false;
    var index  = 1;

    //
    var increment = 30;
    $scope.cards[0].up = 10;
    $scope.cards[1].up = $scope.cards[0].up + 30;
    $scope.cards[2].up = $scope.cards[1].up + 30;
    $scope.cards[3].up = $scope.cards[2].up + 30;

    //
    $scope.throwOut = function () {
        //var myElement = document.getElementsByTagName('li[swing-card]:last');
        //console.log(myElement);
        //myElement.addClass('animated rotateOutUpLeft');

        //this will work when animate is completed.
        //$timeout(function () {
        //    $scope.cards.splice(-1);
        //}, 400);
         $scope.cards[index].show = true;
         index = index + 1;
    };
    */


});