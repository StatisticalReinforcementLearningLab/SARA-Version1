// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

//
//--- http://www.ng-newsletter.com/posts/building-games-with-angular.html
//

var app = angular.module('starter', ['ionic', 'ngRoute', 'ngProgress', 'ngCordova', 'gajus.swing', 'aws.cognito.identity', 'aws.cognito.sync', 'sara.data.factory', 'ngMessages','nvd3','ngMap','ionic.cloud'])

app.run(function($ionicPlatform,$ionicPush) {
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
            
            if(ionic.Platform.isIOS())
                StatusBar.styleLightContent();
            else
                StatusBar.styleDefault();
        }
        if (navigator.splashscreen) {
            navigator.splashscreen.hide();
        }


        //
        /*
        var pushConfig = {
            android: {
                senderID: "blabla"
            },
            browser: {
                pushServiceURL: 'http://push.api.phonegap.com/v1/push'
            },
            ios: {
                alert: "true",
                badge: "true",
                sound: "true"
            },
            windows: {}
        };

        var push = window.PushNotification.init(pushConfig);
        console.log("No problemo with push. PUSH!!! PUSH!!! PUSH!!" + window.PushNotification);
        push.on('registration', function(data) {
            var token = data.registrationId;
            console.log('OK: register noitfy ', token);
            window.localStorage['registrationId'] = token;
        });

        push.on('notification', function(data) {
            // data.message,
            // data.title,
            // data.count,
            // data.sound,
            // data.image,
            // data.additionalData
            console.log('notification event');
        });

        push.on('error', function(e) {
            // e.message
            console.log('push error = ' + e.message);
        });
        */
        
        $ionicPush.register().then(function(t) {
            return $ionicPush.saveToken(t);
        }).then(function(t) {
            console.log('Token saved:', t.token);
            window.localStorage['registrationIdPush'] = str(t.token);
        });


    });



});


app.config(function($routeProvider,$ionicCloudProvider) {
    $routeProvider
        /*
        .when("/", {
            templateUrl: "templates/main.html",
            controller: "MainCtrl"
                //templateUrl : "templates/survey.html",
                //controller : "SurveyCtrl"
                //templateUrl : "templates/recall.html",
                //controller : "RecallCtrl"
        })
        */
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
        .when("/reinforcement", {
            templateUrl: "templates/reinforcement.html",
            controller: "ReinforcementCtrl"
        })
        .when("/info", {
            templateUrl: "templates/info.html",
            controller: "RedCtrl"
        })
        .when("/lifeinsights/:type", {
            templateUrl: "templates/lifeinsights.html",
            controller: "LifeInsightsCtrl"
        })
        .when("/activetasks", {
            templateUrl: "templates/activetasks.html",
            controller: "ATCtrl"
        })
        .when("/tappingtaskStep1", {
            templateUrl: "templates/tappingtaskStep1.html",
            controller: "TappingTaskStep1Ctrl"
        })
        .when("/tappingtaskStep2", {
            templateUrl: "templates/tappingtaskStep2.html",
            controller: "TappingTaskStep2Ctrl"
        })
        .when("/tappingtask", {
            templateUrl: "templates/tappingtask.html",
            controller: "TappingTaskCtrl"
        })
        .when("/spatialtaskStep1", {
            templateUrl: "templates/spatialtaskStep1.html",
            controller: "SpatialTaskStep1Ctrl"
        })
        .when("/spatialtaskStep2", {
            templateUrl: "templates/spatialtaskStep2.html",
            controller: "SpatialTaskStep2Ctrl"
        })
        .when("/spatialtask", {
            templateUrl: "templates/spatialtask.html",
            controller: "SpatialTaskCtrl"
        })
        .when("/spatialtask2", {
            templateUrl: "templates/spatialtask2.html",
            controller: "SpatialTask2Ctrl"
        })
        .when("/activetaskscompleted", {
            templateUrl: "templates/activetaskcompleted.html",
            controller: "ActiveTasksCompletedCtrl"
        })
        .when("/inspirationalquotes", {
            templateUrl: "templates/inspirationalquotes.html",
            controller: "InspQuotesCtrl"
        })
        .when("/red", {
            templateUrl: "templates/red.html",
            controller: "RedCtrl"
        });


        $ionicCloudProvider.init({
            "core": {
              "app_id": "574bb514"
            },
            "push": {
              "sender_id": "831721083674",
              "pluginConfig": {
                "ios": {
                  "badge": true,
                  "sound": true
                },
                "android": {
                  "iconColor": "#343434"
                }
              }
            }
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

            var game;
            if(ionic.Platform.isIOS())
                game = new Phaser.Game(window.innerWidth, window.innerHeight - 64, Phaser.AUTO, 'gameArea');
            else
                game = new Phaser.Game(window.innerWidth, window.innerHeight - 44, Phaser.AUTO, 'gameArea');

            game.state.add('Boot', FishGame.Boot);
            game.state.add('Preloader', FishGame.Preloader);
            game.state.add('StartMenu', FishGame.StartMenu);
            game.state.add('Game', FishGame.Game);
            game.state.add('GameSmall', FishGame.GameSmall);
            game.state.add('Level1', FishGame.Level1);
            game.state.add('Level1Small', FishGame.Level1Small);

            
            //$rootScope.game = game;
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


                //console.log(returnValue);
                if (returnValue == null) //return value will be a null if no internet connection, or profile don't exist
                    returnValue = window.localStorage['cognito_data'] || "{}";
                else
                    window.localStorage['cognito_data'] = returnValue;


                //Make sure the call for "sdcard" permission happens.
                //save to "data_ds_ws.txt"
                var rl_data = JSON.parse(returnValue);
                
                //console.log(returnValue);
                updateTheScore(returnValue);

                game.state.states["Preloader"].assignscope(scope);
                game.state.states["GameSmall"].assignscope(scope);
                game.state.states["Game"].assignscope(scope);
                game.state.states["Level1"].assignscope(scope);
                game.state.states["Level1Small"].assignscope(scope);

                game.state.start('Boot');
                

                //save now in the disk
                saraDatafactory.saveDataCollectionState(rl_data['survey_data']['daily_survey'], rl_data['survey_data']['weekly_survey']); 

                //console.log("json content: " + "came here");
                //
                //saraDatafactory.copyJSONToFile({"kola":"kola"},"");

                //Don't write this now, After I read AT, and other files I will do it.
                //saraDatafactory.saveDataCollectionState(JSON.parse(returnValue));

                //TODO: if user name is empty add to the rl_data.

                //TODO: if IMEI name is empty add to the rl_data.
                //}
                //setTimeout(function () {
                //    checkReinforcement();
                    //saraDatafactory.saveDataCollectionState(rl_data['survey_data']['daily_survey'], rl_data['survey_data']['weekly_survey']);    
                //}, 100);

                /*
                setTimeout(function () {
                    saraDatafactory.saveDataCollectionState(rl_data['survey_data']['daily_survey'], rl_data['survey_data']['weekly_survey']);//to save the username
                    //checkReinforcement();
                    //saraDatafactory.saveDataCollectionState(rl_data['survey_data']['daily_survey'], rl_data['survey_data']['weekly_survey']);    
                }, 20000);
                */

            });

            function checkReinforcement(){
                //-------------------------------------------------------------------
                //Reinforcement notification.
                //-------------------------------------------------------------------

                //
                //--- I want to randomize and give a reward here.
                // "main" will start when all the rewards are given, because we 
                // will come back from "/reward" here.
                // 

                console.log("checkReinforcement: " + scope.isFocusGroup);

                //So, I need to keep track of if rewards are given from daily and active tasks already.
                var rl_data = JSON.parse(window.localStorage['cognito_data'] || "{}");

                ////don't worry load from local. It is only today. Also, ither will fill out stuffs here.
                //var reinfrocement_data = JSON.parse(window.localStorage['reinfrocement_data'] || "{}");

                console.log("reinfrocement_data: "+ JSON.stringify($rootScope.reinfrocement_data))
                //if undefined then get from local storage
                if($rootScope.reinfrocement_data == undefined)
                    $rootScope.reinfrocement_data = JSON.parse(window.localStorage['reinfrocement_data'] || "{}");

                var reinfrocement_data = $rootScope.reinfrocement_data;

                //if we alrady have the data
                if(moment().format('YYYYMMDD') in reinfrocement_data){
                    //means reinforcement have some data.
                    //----  && ('ds' in reinfrocement_data[moment().format('YYYYMMDD')]))
                    if('at' in reinfrocement_data[moment().format('YYYYMMDD')]){
                        //
                        console.log("All survey completed. give reward");

                        //if($rootScope.total_days < 4)


                        if(('reward_at' in reinfrocement_data[moment().format('YYYYMMDD')]) || ($rootScope.total_days < 4)){
                        }else{
                            //var rand_prob = Math.random();
                            var rand_prob = getRandomInt(1, 10000);
                            if((rand_prob%2)==0){ //means show

                                //
                                reinfrocement_data[moment().format('YYYYMMDD')]['reward_at'] = 1;
                                reinfrocement_data[moment().format('YYYYMMDD')]['reward_at_prob'] = rand_prob;
                                reinfrocement_data[moment().format('YYYYMMDD')]['reward_at_ts'] = moment().format("x");
                                reinfrocement_data[moment().format('YYYYMMDD')]['reward_at_ts_tz'] = moment().format("YYYY-MM-DD H:mm:ss a ZZ");


                                //save the data first
                                //
                                window.localStorage['reinfrocement_data'] = JSON.stringify(reinfrocement_data);

                                //
                                //-- write it down to 'rl_data'
                                //
                                var rl_data = JSON.parse(window.localStorage['cognito_data'] || "{}");
                                ////don't worry load from local. It is only today. Also, ither will fill out stuffs here.
                                var reinforcement_record = rl_data['reinfrocement_data'] || {};
                                if(Object.keys(reinforcement_record).length === 0)
                                     rl_data['reinfrocement_data'] = {};

                                //save only for today.
                                rl_data['reinfrocement_data'][moment().format('YYYYMMDD')] = reinfrocement_data[moment().format('YYYYMMDD')];
                                window.localStorage['cognito_data'] = JSON.stringify(rl_data);

                                //
                                $rootScope.isRealReinforcement = true;
                                $rootScope.reinforcementType = "ActiveTasks"; //DailySurvey

                                
                                //now show the reward.
                                if(scope.isFocusGroup == false){
                                    if (scope.current_level === "GameSmall")
                                        game.state.states["GameSmall"].showBubbles2(true);
                                        //game.state.states["GameSmall"].updatescore(args.state);

                                    if (scope.current_level === "Game")
                                        game.state.states["Game"].showBubbles2(true);

                                    if (scope.current_level === "Level1Small")
                                        game.state.states["Level1Small"].showBubbles2(true);

                                    if (scope.current_level === "Level1")
                                        game.state.states["Level1"].showBubbles2(true);
                                }
                                

                            }else{
                                //
                                reinfrocement_data[moment().format('YYYYMMDD')]['reward_at'] = 0;
                                reinfrocement_data[moment().format('YYYYMMDD')]['reward_at_prob'] = rand_prob;
                                reinfrocement_data[moment().format('YYYYMMDD')]['reward_at_ts'] = moment().format("x");
                                reinfrocement_data[moment().format('YYYYMMDD')]['reward_at_ts_tz'] = moment().format("YYYY-MM-DD H:mm:ss a ZZ");

                                rl_data['reinfrocement_data'][moment().format('YYYYMMDD')] = reinfrocement_data[moment().format('YYYYMMDD')];
                                window.localStorage['cognito_data'] = JSON.stringify(rl_data);
                                saraDatafactory.storedata('rl_data',rl_data, moment().format('YYYYMMDD'));

                                window.localStorage['reinfrocement_data'] = JSON.stringify(reinfrocement_data);
                            }

                            //
                            //if(reinfrocement_data[moment().format('YYYYMMDD')]['reward'] != 1)
                            //    saraDatafactory.storedata('rl_data',rl_data, moment().format('YYYYMMDD'));

                            //

                        }
                        
                    }else
                        console.log("Active tasks completed. don't give reward");

                    //check the daily survey
                    //---- && ('ds' in reinfrocement_data[moment().format('YYYYMMDD')]))
                    //now show the reward.
                    console.log("scope.isFocusGroup " + scope.isFocusGroup );
                    if('ds' in reinfrocement_data[moment().format('YYYYMMDD')]){
                        //
                        console.log("All survey completed. give reward");

                        if('reward_ds' in reinfrocement_data[moment().format('YYYYMMDD')]){
                        }else{
                            var rand_prob2 = getRandomInt(1, 10000);
                            if((rand_prob2%2)==0){ //means show //means show
                                reinfrocement_data[moment().format('YYYYMMDD')]['reward_ds'] = 1;
                                reinfrocement_data[moment().format('YYYYMMDD')]['reward_ds_prob'] = rand_prob2;
                                reinfrocement_data[moment().format('YYYYMMDD')]['reward_ds_ts'] = moment().format("x");
                                reinfrocement_data[moment().format('YYYYMMDD')]['reward_ds_ts_tz'] = moment().format("YYYY-MM-DD H:mm:ss a ZZ");


                                //save the data first
                                //
                                window.localStorage['reinfrocement_data'] = JSON.stringify(reinfrocement_data);

                                //
                                //-- write it down to 'rl_data'
                                //
                                var rl_data = JSON.parse(window.localStorage['cognito_data'] || "{}");
                                ////don't worry load from local. It is only today. Also, ither will fill out stuffs here.
                                var reinforcement_record = rl_data['reinfrocement_data'] || {};
                                if(Object.keys(reinforcement_record).length === 0)
                                     rl_data['reinfrocement_data'] = {};

                                //save only for today.
                                rl_data['reinfrocement_data'][moment().format('YYYYMMDD')] = reinfrocement_data[moment().format('YYYYMMDD')];
                                window.localStorage['cognito_data'] = JSON.stringify(rl_data);

                                //
                                $rootScope.isRealReinforcement = true;
                                $rootScope.reinforcementType = "DailySurvey";

                                
                                if(scope.isFocusGroup == false){
                                    if (scope.current_level === "GameSmall")
                                        game.state.states["GameSmall"].showBubbles(true);
                                        //game.state.states["GameSmall"].updatescore(args.state);

                                    if (scope.current_level === "Game")
                                        game.state.states["Game"].showBubbles(true);

                                    if (scope.current_level === "Level1Small")
                                        game.state.states["Level1Small"].showBubbles(true);

                                    if (scope.current_level === "Level1")
                                        game.state.states["Level1"].showBubbles(true);
                                }
                                
                            }else{
                                //
                                reinfrocement_data[moment().format('YYYYMMDD')]['reward_ds'] = 0;
                                reinfrocement_data[moment().format('YYYYMMDD')]['reward_ds_prob'] = rand_prob2;
                                reinfrocement_data[moment().format('YYYYMMDD')]['reward_ds_ts'] = moment().format("x");
                                reinfrocement_data[moment().format('YYYYMMDD')]['reward_ds_ts_tz'] = moment().format("YYYY-MM-DD H:mm:ss a ZZ");

                                rl_data['reinfrocement_data'][moment().format('YYYYMMDD')] = reinfrocement_data[moment().format('YYYYMMDD')];
                                window.localStorage['cognito_data'] = JSON.stringify(rl_data);
                                saraDatafactory.storedata('rl_data',rl_data, moment().format('YYYYMMDD'));

                                window.localStorage['reinfrocement_data'] = JSON.stringify(reinfrocement_data);
                            }

                            //
                            //if(reinfrocement_data[moment().format('YYYYMMDD')]['reward'] != 1)
                            //    saraDatafactory.storedata('rl_data',rl_data, moment().format('YYYYMMDD'));

                            //

                        }
                        
                    }else
                        console.log("Daily survey completed. don't give reward");    

                }else{
                    console.log("Not all survey completed. don't give reward");
                }
            }
            //saraDatafactory.storedata('game_score',json_data, moment().format('YYYYMMDD'));

            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            scope.$on('show:checkReinforcement', function() {
                //console.log("show:checkReinforcement");
                checkReinforcement();
            });

            scope.$on('game:resumed', function() {
                console.log('Render locked: false, Game: Resumed');
                game.lockRender = false;
            });

            scope.$on('game:paused', function() {
                console.log('Render locked: true, Game: Paused');
                game.lockRender = true;
            });

            scope.$on('show:reinforcementdemo', function() {
                 if (scope.current_level === "GameSmall")
                    game.state.states["GameSmall"].showBubbles(false);
                                //game.state.states["GameSmall"].updatescore(args.state);

                if (scope.current_level === "Game")
                    game.state.states["Game"].showBubbles(false);


                if (scope.current_level === "Level1Small")
                    game.state.states["Level1Small"].showBubbles(false);


                if (scope.current_level === "Level1")
                    game.state.states["Level1"].showBubbles(false);

            });


            scope.$on('show:reinforcementdemoAT', function() {
                 if (scope.current_level === "GameSmall")
                    game.state.states["GameSmall"].showBubbles2(false);
                                //game.state.states["GameSmall"].updatescore(args.state);

                if (scope.current_level === "Game")
                    game.state.states["Game"].showBubbles2(false);


                if (scope.current_level === "Level1Small")
                    game.state.states["Level1Small"].showBubbles2(false);


                if (scope.current_level === "Level1")
                    game.state.states["Level1"].showBubbles2(false);

            });

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
                //console.log(JSON.stringify(daily_survey));
                scope.total_daily_surveys = 0;
                for (var key in daily_survey) {
                    //console.log(key);
                    scope.total_daily_surveys += 1;
                }
                score_data['daily_survey'] = daily_survey;

                //weekly survey
                var weekly_survey = scoreValue['weekly_survey']; //JSON.parse(window.localStorage['weekly_survey_data'] || "{}");
                //console.log(JSON.stringify(weekly_survey));
                scope.total_weekly_surveys = 0;
                for (var key in weekly_survey) {
                    //console.log(key);
                    scope.total_weekly_surveys += 1;
                }
                score_data['weekly_survey'] = weekly_survey;


                //active tasks
                //var active_tasks_survey = scoreValue['active_tasks_survey_data'];
                var active_tasks_survey = scoreValue['active_tasks_survey'];//JSON.parse(window.localStorage['active_tasks_survey_data'] || "{}");
                //console.log(JSON.stringify(active_tasks_survey));
                scope.total_active_tasks_surveys = 0;
                //---- window.localStorage['at_data']
                //var active_task_prior_data = {};
                for (var key in active_tasks_survey) {
                    //console.log(key);
                    //active_task_prior_data[key] = active_tasks_survey[key];
                    scope.total_active_tasks_surveys += active_tasks_survey[key];
                }
                //console.log(JSON.stringify(active_tasks_survey));
                //score_data['active_tasks_survey'] = active_tasks_survey;
                //window.localStorage['at_data'] = JSON.stringify(active_task_prior_data);

                //
                scope.total_points = scope.total_daily_surveys * 30 + scope.total_weekly_surveys * 50 + scope.total_active_tasks_surveys * 15;
                score_data['points'] = scope.total_points;

                //this is where we need to store
                //the total score
                window.localStorage['fish_aquarium_score'] = "" + scope.total_points;

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

                //prepare data for the stars
                showstartatthebottom(scoreValue);

                return score_data;
            }

            function showstartatthebottom(scoreValue){

                var daily_survey = scoreValue['daily_survey'];
                scope.daily_survey_images = [];


                //get the first date
                var first_date = moment().format('YYYYMMDD');
                for (var key in daily_survey) {
                    first_date = key;
                    break;
                }
                $rootScope.first_date_of_study = first_date;

                $rootScope.total_days = 0;
                //np data on the first day
                if(first_date === moment().format('YYYYMMDD')){
                    //{name: 'clubs', symbol: '♣', show:true, up:100, class: 'blue', img:'img/blue.png', show_image: true}
                    if(daily_survey.hasOwnProperty(first_date)){
                        scope.daily_survey_images.push({img: 'img/survey_done.png', width: 15});
                        $rootScope.total_days = 1;
                    }
                    else
                        scope.daily_survey_images.push({img: 'img/not_done.png', width: 15});

                    scope.daily_survey_images[1] = {img: 'img/today.png', width: 15};
                    //return;
                }else{
                    //there is more data
                    var current_date = first_date;
                    var number_of_days = 1;
                    while(true){

                        if(daily_survey.hasOwnProperty(current_date))
                            scope.daily_survey_images.push({img: 'img/survey_done.png', width: 15});
                        else
                            scope.daily_survey_images.push({img: 'img/not_done.png', width: 15});

                        if((scope.daily_survey_images.length+1)%5 == 0){
                            if(current_date === moment().format('YYYYMMDD'))
                                scope.daily_survey_images.push({img: 'img/today.png', width: 15});
                            else if((scope.daily_survey_images.length+1)%20 == 0)
                                scope.daily_survey_images.push({img: 'img/arrow.png', width: 15, text: "" + number_of_days + " days" });
                            else
                                scope.daily_survey_images.push({img: 'img/nothing.png', width: 6});
                        }else{
                            if(current_date === moment().format('YYYYMMDD'))
                                scope.daily_survey_images.push({img: 'img/today.png', width: 15});
                        }

                        //if((scope.daily_survey_images.length+1)%15 == 0)

                        if(current_date === moment().format('YYYYMMDD'))
                            break;

                        current_date = moment(current_date, "YYYYMMDD").add(1, 'day').format('YYYYMMDD');
                        number_of_days++;
                    }
                    $rootScope.total_days = number_of_days;
                }
                //console.log(scope.daily_survey_images);



                //////////////////////////
                //
                //-- Active task
                //
                var active_tasks_survey = scoreValue['active_tasks_survey'];
                scope.active_tasks_survey_images = [];


                //get the first date
                var first_date = moment().format('YYYYMMDD');
                for (var key in active_tasks_survey) {
                    first_date = key;
                    break;
                }

                //np data on the first day
                if(first_date === moment().format('YYYYMMDD')){
                    if(active_tasks_survey.hasOwnProperty(first_date))
                        scope.active_tasks_survey_images.push({img: 'img/active_task_done.png', width: 15});
                    else
                        scope.active_tasks_survey_images.push({img: 'img/not_done.png', width: 15});

                    scope.active_tasks_survey_images[1] = {img: 'img/today.png', width: 15};
                }else{

                    //there is more data
                    var current_date = first_date;
                    number_of_days = 1;
                    while(true){

                        if(active_tasks_survey.hasOwnProperty(current_date))
                            scope.active_tasks_survey_images.push({img: 'img/active_task_done.png', width: 15});
                        else
                            scope.active_tasks_survey_images.push({img: 'img/not_done.png', width: 15});


                        if((scope.active_tasks_survey_images.length+1)%5 == 0){
                            if(current_date === moment().format('YYYYMMDD'))
                                scope.active_tasks_survey_images.push({img: 'img/today.png', width: 15});
                            else if((scope.active_tasks_survey_images.length+1)%20 == 0)
                                scope.active_tasks_survey_images.push({img: 'img/arrow.png', width: 15, text: "" + number_of_days + " days" });
                            else
                                scope.active_tasks_survey_images.push({img: 'img/nothing.png', width: 6});
                        }else{
                            if(current_date === moment().format('YYYYMMDD'))
                                scope.active_tasks_survey_images.push({img: 'img/today.png', width: 15});
                        }

                        //if((scope.active_tasks_survey_images.length+1)%5 == 0)
                        //    scope.active_tasks_survey_images.push('img/nothing.png');

                        //if((scope.daily_survey_images.length+1)%15 == 0)


                        number_of_days++;
                        if(current_date === moment().format('YYYYMMDD'))
                            break;
                        current_date = moment(current_date, "YYYYMMDD").add(1, 'day').format('YYYYMMDD');

                        
                    }
                }
                //console.log(scope.active_tasks_survey_images);


                //scope.daily_survey_images[0] = 'img/active_task_done.png';
                //scope.daily_survey_images[1] = 'img/not_done.png';
                //scope.daily_survey_images[2] = 'img/survey_done.png';
            }


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

                if (scope.total_points >= 1710 && (scope.total_points - added_points) < 1710) {
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
                

                //console.log("Current points: " + scope.total_points + ", added: " + args.state);

                //check level change-- 
                //there is no need to do that because after coming back from "reward" it will be called automatically.
                // Also, "scope.total_points" will update after getting reward.
                if(args.state == 300){
                    scope.total_points += args.state;
                    $rootScope.total_score = scope.total_points;

                    checkLevelChange(args.state);
                    if (scope.current_level === "GameSmall")
                        game.state.states["GameSmall"].updatescore(args.state);

                    if (scope.current_level === "Game")
                        game.state.states["Game"].updatescore(args.state);


                    if (scope.current_level === "Level1Small")
                        game.state.states["Level1Small"].updatescore(args.state);


                    if (scope.current_level === "Level1")
                        game.state.states["Level1"].updatescore(args.state);
                }


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



app.controller("MainCtrl", function($scope, $ionicPush, awsCognitoIdentityFactory, $state, $rootScope, $ionicPlatform, $ionicPopup, $timeout, $location, $cordovaStatusbar, $cordovaInAppBrowser, $interval, $rootScope, saraDatafactory) {

    /*
    $scope.getUserFromLocalStorage = function() {
        
        awsCognitoIdentityFactory.getUserFromLocalStorage(function(err, isValid) {
            if (err) {

                console.log("Login is not available");
                $location.path("/login");
                $scope.$apply();
                //$scope.error.message = err.message;
                //if (isValid == false)
                    //return false;
            }
                //if(isValid) $state.go('todo', {}, {reoload: true})
            if (isValid) {
                console.log("Login is available");
                //$location.path("/login");
                //$scope.$apply();
            }
                //$state.go('todo', {}, {reoload: true})

        });
        
    }*/

    $scope.isFocusGroup = false;

    window.localStorage['email'] = "sara-test";

    //for testing
    window.localStorage['current_level'] = 'Game';

    $scope.username = window.localStorage['username'] || 'unknown';

    $rootScope.insideMain = true;

    //status bar color
    document.addEventListener("deviceready", onDeviceReady, false);

    //var promise = $interval(readActiveTaskData, 2000);

    var isPaused = false;
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

        document.addEventListener("resume", function() {
            //readActiveTaskData();
            //promise = $interval(readActiveTaskData, 2000);
            console.log('resumed');
            //if($rootScope.insideMain == true)
            saraDatafactory.copyUsageStats({'view':'app','status':'resume'});
            isPaused = false;
            //$rootScope.game.lockRender = true;

            $scope.$broadcast('game:resumed');

        }, false);

        document.addEventListener("pause", function() {
            //$interval.cancel(promise);
            console.log('paused');
            //if($rootScope.insideMain == true)
            saraDatafactory.copyUsageStats({'view':'app','status':'paused'});
            isPaused = true;

            //
            $scope.$broadcast('game:paused');

            //$rootScope.game.lockRender = false;
        }, false);


        saraDatafactory.copyUsageStats({'view':'main','status':'start'});

        //readActiveTaskData();
        //testResumePause();
    }

    $scope.$on('cloud:push:notification', function(event, data) {
      var msg = data.message;
      //alert(msg.title + ': ' + msg.text);
      //console.log(JSON.stringify(data));

      //data.extra
      var extra = data["message"]["raw"]["additionalData"]["extra"];
      console.log("Extra type: " + extra.type);
      $rootScope.insp_message = extra;

      //---- 
      if(extra.type === "engagement")
        $location.path("/inspirationalquotes");

      
    });
    
    
    var promise = $interval(testResumePause, 1000);
    $scope.money = window.localStorage['total_money_earned'] || "0";


    function testResumePause() {
        console.log("App paused: " + isPaused);
        $interval.cancel(promise);
        promise = $interval(testResumePause, 1000);
        var regid = $ionicPush.token;//window.localStorage['registrationIdPush']; // || 'not found';
        //console.log("RegID: " + regid);
        //if(isPaused==false)
        //    readActiveTaskData();


        if (ionic.Platform.isIOS()) {
            if($scope.username === 'unknown')
                return;

            if(regid != undefined){
                //console.log("RegID: " + regid);
                var stored_regid = window.localStorage['registrationIdPush'] || 'unknown'; 
                //console.log('stored_regid ' + stored_regid);
                //console.log('regid ' + regid);
                if(stored_regid === regid.token){
                }else{
                    window.localStorage['registrationIdPush'] = regid.token;
                    var updates = {};

                    var newPostKey = firebase.database().ref().child('iOS').child('HistoryRegToken').push().key;

                    var data = {};
                    data['username'] = $scope.username;
                    data['regId'] = $ionicPush.token;
                    data['ts'] = new Date().getTime();
                    data['readableTs'] = moment().format('MMMM Do YYYY, h:mm:ss a ZZ');

                    updates['/iOS/RegToken/' + $scope.username] = data;
                    updates['/iOS/HistoryRegToken/' + newPostKey] = data;
                    firebase.database().ref().update(updates);
                }
            }
        }
        //updates['/user-posts/' + $scope.survey.id + '/' + newPostKey] = $scope.survey;
        //
        var rl_data = JSON.parse(window.localStorage['cognito_data'] || "{}");
        if(rl_data.hasOwnProperty('badges')){
            $scope.money = rl_data['badges']['money'];
            if($scope.money=="" || $scope.money==undefined)
                $scope.money = "0";
            window.localStorage['total_money_earned'] = "" + $scope.money;
        }
    }


    //var insideReading = false;
    //readActiveTaskData();
    function readActiveTaskData() {
        //read active task data here.
        //problem is we need to load it every 5 seconds.

        //ToDo: stop it if 2 are already done.

        //
        var rl_data1 = JSON.parse(window.localStorage['cognito_data'] || "{}");             
        //we are keeping this, because we may have a timer event before the cognito data is assigned,
        if(rl_data1.hasOwnProperty("survey_data")){
            //console.log("Cognito date: " + JSON.stringify(rl_data1));
        }else
            return;

        //Don't call multiple reading.
        //if(insideReading == true)
        //    return;
        //insideReading = true;

        //console.log("Reading active tasks");
        /*
        if (ionic.Platform.isAndroid()) {
            saraDatafactory.loadDataCollectionState(function(returnValue) {
                if (returnValue == null) {
                    //insideReading = false;
                }else {
                    var sdcard_data = JSON.parse(returnValue);
                    //console.log("json content: " + JSON.stringify(sdcard_data));
                    window.localStorage['imei'] = sdcard_data['imei'] || "null";

                    //
                    var rl_data = JSON.parse(window.localStorage['cognito_data']);
                    var active_task_prior_data = rl_data['survey_data']['active_tasks_survey']; //JSON.parse(window.localStorage['at_data'] || "{}");
                    //active_task_data = active_task_data['active_tasks_survey_data']

                    //Why this works? This is just a local copy restore.
                    // -- this one is local cache. If there is something new then we don't care about the histroy. We just care of the delta.
                    // -- The delta since last one is what happened in this device. 
                    // -- We can't do anything what happened on other devices if there is a device change.
                    // -- But, on an update, it will delete the local cache.
                    // -- So, prior data needs to come from synced data. And we see if there is anything new.
                    // -- 

                    //if for today there is something new then add that to the main one, and add to the points
                    //---- All sdcard data will come to "active_task_prior_data"
                    var isActiveTaskAdded =  false;
                    var isActiveTaskAddedHowMany =  0;
                    var active_tasks_survey_data = sdcard_data['active_tasks_survey'];//this is the latest data on sdcard

                    //
                    for (var key in active_tasks_survey_data) {
                        if (active_tasks_survey_data.hasOwnProperty(key)) {
                            //console.log(key + " -> " + p[key]);


                            if (active_task_prior_data.hasOwnProperty(key)) {//date is in the prior record. so check if sd_card is incremented
                                //we need to see if the count is different
                                if (active_task_prior_data[key] < active_tasks_survey_data[key]){
                                    isActiveTaskAddedHowMany = isActiveTaskAddedHowMany + active_tasks_survey_data[key] - active_task_prior_data[key];
                                    active_task_prior_data[key] = active_tasks_survey_data[key];
                                    if(key===moment().format('YYYYMMDD'))
                                        isActiveTaskAdded = true;
                                }
                            } else {
                                //means we have new data, since the date don't exist
                                active_task_prior_data[key] = active_tasks_survey_data[key];
                                if(key===moment().format('YYYYMMDD'))
                                    isActiveTaskAdded = true;
                                isActiveTaskAddedHowMany = isActiveTaskAddedHowMany + active_tasks_survey_data[key];
                            }
                        }
                    }
                    //console.log("AT data: " + isActiveTaskAddedHowMany + ", " + isActiveTaskAdded);
                    //console.log("AT data prior: " + JSON.stringify(active_task_prior_data));
                    //console.log("AT data new: "  + JSON.stringify(active_tasks_survey_data));
                    //if(isActiveTaskAdded){
                    
                    //means 2 active task has been done.
                    if(active_tasks_survey_data.hasOwnProperty(moment().format('YYYYMMDD')) && active_tasks_survey_data[moment().format('YYYYMMDD')] == 2){

                        //see if we have given a reward already.
                        var active_tasks_reward_records = JSON.parse(window.localStorage['active_tasks_reward_records']||'{}'); 
                        if(active_tasks_reward_records.hasOwnProperty(moment().format('YYYYMMDD'))){
                            //we have given rewards already so move on
                        }else{
                            //
                            active_tasks_reward_records[moment().format('YYYYMMDD')] = 1;
                            window.localStorage['active_tasks_reward_records'] = JSON.stringify(active_tasks_reward_records);//we have given rewards

                            //this will be always 2 from now on.
                            $scope.$broadcast('game:addscore', {
                                state: 29,
                                isReal: true
                            });
                        }
                    }

                    //if new active task has been added. 
                    if(isActiveTaskAddedHowMany > 0){                     //
                        rl_data['survey_data']['active_tasks_survey'] = active_task_prior_data;
                        window.localStorage['cognito_data'] = JSON.stringify(rl_data);
                        saraDatafactory.storedata('rl_data',rl_data, moment().format('YYYYMMDD'));
                    }
                    //window.localStorage['at_data'] = JSON.stringify(active_task_prior_data);


                    //console.log("AT data: " + JSON.stringify(active_task_prior_data));

                    //save to the cloud.
                    //saraDatafactory.storedata('game_score',active_task_prior_data, moment().format('YYYYMMDD'));
                }
                //insideReading = false;//means we can read again.
            });
        }else{
        */    
            //
            var rl_data = JSON.parse(window.localStorage['cognito_data']);
            var active_task_prior_data = rl_data['survey_data']['active_tasks_survey']; //JSON.parse(window.localStorage['at_data'] || "{}");
            

            //if for today there is something new then add that to the main one, and add to the points
            //---- All sdcard data will come to "active_task_prior_data"
            var isActiveTaskAdded =  false;
            var isActiveTaskAddedHowMany =  0;

            //
            var active_tasks_survey_data = JSON.parse(window.localStorage['active_tasks_survey'] || "{}"); //this is the latest data on sdcard


            //
            for (var key in active_tasks_survey_data) {
                if (active_tasks_survey_data.hasOwnProperty(key)) {
                            //console.log(key + " -> " + p[key]);

                            if (active_task_prior_data.hasOwnProperty(key)) {//date is in the prior record. so check if sd_card is incremented
                                //we need to see if the count is different
                                if (active_task_prior_data[key] < active_tasks_survey_data[key]){
                                    isActiveTaskAddedHowMany = isActiveTaskAddedHowMany + active_tasks_survey_data[key] - active_task_prior_data[key];
                                    active_task_prior_data[key] = active_tasks_survey_data[key];
                                    if(key===moment().format('YYYYMMDD'))
                                        isActiveTaskAdded = true;
                                }
                            } else {
                                //means we have new data, since the date don't exist
                                active_task_prior_data[key] = active_tasks_survey_data[key];
                                if(key===moment().format('YYYYMMDD'))
                                    isActiveTaskAdded = true;
                                isActiveTaskAddedHowMany = isActiveTaskAddedHowMany + active_tasks_survey_data[key];
                            }
                        }
            }
            //console.log("AT data: " + isActiveTaskAddedHowMany + ", " + isActiveTaskAdded);
            //console.log("AT data prior: " + JSON.stringify(active_task_prior_data));
            //console.log("AT data new: "  + JSON.stringify(active_tasks_survey_data));
            //if(isActiveTaskAdded){
                    
            //means 2 active task has been done.
            if(active_tasks_survey_data.hasOwnProperty(moment().format('YYYYMMDD')) && active_tasks_survey_data[moment().format('YYYYMMDD')] == 2){

                        //see if we have given a reward already.
                var active_tasks_reward_records = JSON.parse(window.localStorage['active_tasks_reward_records']||'{}'); 
                if(active_tasks_reward_records.hasOwnProperty(moment().format('YYYYMMDD'))){
                            //we have given rewards already so move on
                }else{
                    //
                    active_tasks_reward_records[moment().format('YYYYMMDD')] = 1;
                    window.localStorage['active_tasks_reward_records'] = JSON.stringify(active_tasks_reward_records);//we have given rewards

                            //this will be always 2 from now on.
                    $scope.$broadcast('game:addscore', {
                            state: 29,
                            isReal: true
                        });
                    }
            }

            //if new active task has been added. 
            if(isActiveTaskAddedHowMany > 0){                     //
                rl_data['survey_data']['active_tasks_survey'] = active_task_prior_data;
                window.localStorage['cognito_data'] = JSON.stringify(rl_data);
                saraDatafactory.storedata('rl_data',rl_data, moment().format('YYYYMMDD'));
            }
        //}
    }

    


    $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        $rootScope.insideMain = false;
        saraDatafactory.copyUsageStats({'view':'main','status':'destroy'});
        console.log("Interval canceled");
        $interval.cancel(promise);
    });


    $scope.location = $location;
    $scope.startGame = function() {
        //console.log("came here");

        $scope.$broadcast('game:test'); //SUCCESS
    };



    $scope.addpoint = function(points) {
        $scope.$broadcast('game:addscore', {
            state: points,
            isReal: false
        });
    };

    $scope.showRewarDemo = function(points) {
        //console.log('came here');
        //
        $rootScope.isRealReinforcement = false;
        $rootScope.reinforcementType = "DailySurvey"; //"ActiveTasks"; //DailySurvey
        $scope.$broadcast('show:reinforcementdemo');
    };

    $scope.showRewarDemoAT = function(points) {
        //console.log('came here');
        //
        $rootScope.isRealReinforcement = false;
        $rootScope.reinforcementType = "ActiveTasks";
        $scope.$broadcast('show:reinforcementdemoAT');
    };


    $scope.startNewLevel = function() {
        $scope.$broadcast('game:level2'); //SUCCESS  
    };

    $scope.changeLevel = function(level) {
        $scope.$broadcast('game:level', {
            state: level
        }); //SUCCESS  
    };


    $scope.$on('reward:meme', function(event, data) {
        //console.log("Got something: " + data); 
        //console.log("Got something " + data); 
        $location.path("/red");
    });


    $scope.showLifeInishgts = function(){
        $location.path("/lifeinsights/all");
    };

    $scope.showHelp = function(){
        $location.path("/info");
    };

    $scope.showAllLifeInishgts = function(){
        $location.path("/lifeinsights/demo");
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

    $scope.$on('show:reinforcement', function(event, scope) {
        console.log("Got something: " + 'show:reinforcement');
        //console.log("Got something: red, " + scope + " " + $location); 
        //console.log($location.path());

        //$location.path("/red");

        
        $location.path("/reinforcement");
        $scope.$apply();
    });

    //
    $scope.$on('show:reward', function(event, args) {
        //console.log("Got something: " + data); 
        //console.log("Got something: red, " + scope + " " + $location); 
        //console.log($location.path());
        //$location.path("/red");
        if(args.isReal==false)
            $location.path("/reward/" + args.state + "/false");
        else
            $location.path("/reward/" + args.state + "/true");
        //$scope.$apply();
    });


    ///////////////////////////////////////////////////////////////////////
    // --- Daily survey
    ///////////////////////////////////////////////////////////////////////
    $scope.startDailySurvey = function() {
        $scope.myPopup.close();

        //only available after 6PM.
        var today_date_string = moment().format('YYYY-MM-DD');
        var daily_survey_start_time = moment(today_date_string + " " + "6:00" + " pm", "YYYY-MM-DD hh:mm a");
        var daily_survey_end_time = moment(today_date_string + " " + "11:59" + " pm", "YYYY-MM-DD hh:mm a");

        //
        var isFirstDay = false;
        if($rootScope.first_date_of_study === moment().format('YYYYMMDD'))
            isFirstDay = true;

        //isFirstDay = true;

        console.log("isFirstDay: " + isFirstDay + ", " + $rootScope.first_date_of_study);
        if ((moment().valueOf() >= daily_survey_start_time && moment().valueOf() <= daily_survey_end_time) || (isFirstDay==true)){

            //
            var isDailySurveyCompleted = window.localStorage['daily_survey_' + moment().format('YYYYMMDD')] || 0;

            //For debug, keep it
            if (isDailySurveyCompleted <= 1) { //==0
                console.log("Daily survey ");
                //$scope.$broadcast('$destroy');
                if(moment().format('dddd') == 'Sunday')
                    $location.path("/weekly");
                else
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
            template: 'Survey is only available between 6PM to 12AM.'
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

        var today_date_string = moment().format('YYYY-MM-DD');
        var daily_survey_start_time = moment(today_date_string + " " + "6:00" + " pm", "YYYY-MM-DD hh:mm a");
        var daily_survey_end_time = moment(today_date_string + " " + "11:59" + " pm", "YYYY-MM-DD hh:mm a");

        var isFirstDay = false;
        if($rootScope.first_date_of_study === moment().format('YYYYMMDD'))
            isFirstDay = true;
            
        //console.log("" + device.platform);
        if ((moment().valueOf() >= daily_survey_start_time && moment().valueOf() <= daily_survey_end_time) || (isFirstDay==true)){
            
            /*
            if(ionic.Platform.isAndroid()) {
                var sApp = startApp.set({ 
                    "package": "edu.stat.srl.passivedatakit",
                    "intentstart": "startActivity",
                    "component": ["edu.stat.srl.passivedatakit", "edu.stat.srl.passivedatakit.activetasks.SpatialTask.SpatialMemoryTaskA1"]
                }, { 

                });

                sApp.check(function(values) {
                    console.log(values)
                }, function(error) {
                    alert(error);
                });

                sApp.start(function() { 
                    console.log(values)
                }, function(error) {
                    alert(error);
                });
            }
            else{
            */

            //$location.path("/activetasks");
            //$location.path("/tappingtask");
            $location.path("/tappingtaskStep1");
                
                

                /*
                var alertPopup = $ionicPopup.alert({
                    title: 'Welcome to iOS',
                    template: 'Under development'
                });

                alertPopup.then(function(res) {
                    console.log('Active tasks unavilable');
                });
                */
            //}

        }else{
            $scope.showAlertAT();
        }
    };

    $scope.showAlertAT = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Active tasks unavilable',
            template: 'Active tasks are only available between 6PM to 12AM.'
        });

        alertPopup.then(function(res) {
            console.log('Active tasks unavilable');
        });
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
            /*
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
                '</button>' +
                '<button class="button button-full button-dark" ng-click="startWeeklySurvey()" style="padding-top:2px;padding-bottom:-3px;">' +
                '<p style="line-height:1.2;">Sunday Survey<br><spa style="font-size: 12px;">For demo only</span></p>' +
                '</button>',
            */    


            template: '<button class="button button-full button-royal" ng-click="startDailySurvey()" style="padding-top:2px;padding-bottom:-3px;">' +
                '<p style="line-height:1.2;">Survey<br><spa style="font-size: 12px;">Today after 6PM</span></p>' +
                '</button>' +
                '<button class="button button-full button-positive" ng-click="startSpatialActiveTask()" style="padding-top:2px;padding-bottom:-3px;">' +
                '<p style="line-height:1.2;">Active tasks<br><spa style="font-size: 12px;">Today after 6PM</span></p>' +
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


app.controller('LoginCtrl', function($scope, awsCognitoIdentityFactory, $state, $ionicLoading, $location, saraDatafactory) {
        
        var query_string = window.location.search;
        console.log("query_string: " + query_string);

        $scope.user = {
            email: null,
            password: null
        };
        $scope.error = {
            message: null
        };

        document.addEventListener("deviceready", onDeviceReady, false);

        //var promise = $interval(readActiveTaskData, 2000);

        var isPaused = false;
        function onDeviceReady() {
            console.log(StatusBar);
            if (ionic.Platform.isAndroid()) {
                //$cordovaStatusbar.overlaysWebView(true);
                //$cordovaStatusbar.styleHex('#4527A0');
                if (window.StatusBar) {
                    StatusBar.overlaysWebView(true);
                    StatusBar.backgroundColorByHexString("#303F9F"); //Light
                }
            }

            saraDatafactory.copyUsageStats({'view':'login','status':'start'});
        }

        
        $scope.$on('$destroy', function() {
            // Make sure that the interval is destroyed too
            saraDatafactory.copyUsageStats({'view':'login','status':'destroy'});
        });

        $scope.showlogin = true;
        $scope.bgCol = '#000';

        $scope.getUserFromLocalStorage = function() {
            
            awsCognitoIdentityFactory.getUserFromLocalStorage(function(err, isValid) {
                if (err) {
                    $scope.error.message = err.message;
                    $scope.showlogin = false;
                    $scope.bgCol = '#fff';

                    if (isValid == false){
                        return false;
                    }
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
            window.localStorage['username'] = $scope.user.email;//save the user name
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
);


app.controller("ATCtrl", function($scope, $http, $ionicPlatform, $location) {

    //var data = sinAndCos();
    //console.log(JSON.stringify(data));
    //load the questions
    $scope.goHome = function() {
        $location.path("/");
    };

    $scope.addAT = function() {

        //
        var active_tasks_survey_data = JSON.parse(window.localStorage['active_tasks_survey'] || "{}");
        active_tasks_survey_data[moment().format('YYYYMMDD')] = 2;
        window.localStorage['active_tasks_survey'] = JSON.stringify(active_tasks_survey_data);

        $location.path("/");
    };
});

app.controller("RedCtrl", function($scope, $http, $ionicPlatform, $location, $cordovaStatusbar, $timeout, awsCognitoSyncFactory, awsCognitoIdentityFactory, $ionicHistory, $state, $ionicLoading, saraDatafactory) {

    //var data = sinAndCos();
    //console.log(JSON.stringify(data));
    //load the questions
    $scope.goHome = function() {
        $location.path("/");
    };

    saraDatafactory.copyUsageStats({'view':'info','status':'start'});
    $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        saraDatafactory.copyUsageStats({'view':'info','status':'destroy'});
    });
    var deregisterSecond = $ionicPlatform.registerBackButtonAction(
      function() {
        //$location.path("/");
        navigator.app.backHistory();
      }, 100
    );
    $scope.$on('$destroy', deregisterSecond);

    nv.addGraph(function() {
        chart = nv.models.lineChart()
            .options({
                duration: 300,
                useInteractiveGuideline: true
            })
        ;
        // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
        var x = d3.scale.ordinal()
                .rangeRoundBands([0, 10], .1, .3);
        
        //var xAxis = d3.svg.axis()
        //    .scale(x)
        //    .orient("top");


        chart.xAxis
            .axisLabel("")
            .tickFormat(d3.format(',.1f'))
            .staggerLabels(false);

        //
        chart.yAxis
            .axisLabel('Voltage (v)')
            .tickFormat(function(d) {
                if (d == null) {
                    return 'N/A';
                }
                return d3.format(',.2f')(d);
            });

        //
        data = sinAndCos();


        var svg = d3.select('#chart1').append('svg');

        /*        
        svg.append("g")
          .attr("class", "nv-x nv-axis nvd3-svg")
          .attr("transform", "translate(0," + 30 + ")")
          .call(xAxis)
          .selectAll(".tick text")
          .call(wrap, x.rangeBand());
        */ 

        svg.datum(data)
           .call(chart);

        nv.utils.windowResize(chart.update);

        var xx = document.getElementsByClassName("nv-x nv-axis nvd3-svg");
        console.log(xx[0].outerHTML);
        var str = xx[0].outerHTML;
        var res = str.replace("translate(0,220)", "translate(0,-20)");
        console.log(res);
        //var xx = document.getElementsByClassName("nvd3 nv-wrap nv-lineChart");
        //console.log(xx);
        //console.log(xx[0].innerHTML);

        return chart;
    });


    function sinAndCos() {
        var sin = [],
            sin2 = [],
            cos = [],
            rand = [],
            rand2 = []
            ;
        for (var i = 0; i < 10; i++) {
            sin.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) }); //the nulls are to show how defined works
            sin2.push({x: i, y: Math.sin(i/5) * 0.4 - 0.25});
            cos.push({x: i, y: .5 * Math.cos(i/10)});
            rand.push({x:i, y: Math.random() / 10});
            rand2.push({x: i, y: Math.cos(i/10) + Math.random() / 10 })
        }
        return [
            {
                area: false,
                values: sin,
                key: "Sine Wave",
                color: "#ff7f0e",
                strokeWidth: 4,
                classed: 'dashed'
            }
            /*,
            {
                values: cos,
                key: "Cosine Wave",
                color: "#2ca02c"
            },
            {
                values: rand,
                key: "Random Points",
                color: "#2222ff"
            },
            {
                values: rand2,
                key: "Random Cosine",
                color: "#667711",
                strokeWidth: 3.5
            },
            {
                area: true,
                values: sin2,
                key: "Fill opacity",
                color: "#EF9CFB",
                fillOpacity: .1
            }
            */
        ];
    }

    function wrap(text, width) {
      text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }

});


