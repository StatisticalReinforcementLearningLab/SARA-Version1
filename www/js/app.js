// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

//
//--- http://www.ng-newsletter.com/posts/building-games-with-angular.html
//

var app = angular.module('starter', ['ionic', 'ngRoute', 'ngProgress', 'ngCordova', 'gajus.swing', 'aws.cognito.identity', 'aws.cognito.sync', 'sara.data.factory', 'ngMessages','nvd3','ngMap','ionic.cloud'])

app.run(function($ionicPlatform,$ionicPush,$rootScope,$location) {
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
            
            if(ionic.Platform.isIOS()){
                StatusBar.styleLightContent();
                //StatusBar.styleDefault();
                //StatusBar.overlaysWebView(true);
            }
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
        
        /*
        $ionicPush.register().then(function(t) {
            return $ionicPush.saveToken(t);
        }).then(function(t) {
            console.log('Token saved:', t.token);
            window.localStorage['registrationIdPush'] = str(t.token);
        });
        */


        // Enable to debug issues.
        //window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
          
        var notificationOpenedCallback = function(jsonData) {
            console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));

            //
            var custom_data = jsonData["notification"]["payload"]["additionalData"];
            console.log('custom_data: ' + JSON.stringify(custom_data));


            $rootScope.insp_message = custom_data;
            //window.localStorage['insp_message'] = JSON.stringify(custom_data);
            //---- 
        };

        window.plugins.OneSignal
            .startInit("ae8ddfb9-a504-41e2-bc97-477017bb925f")
            .handleNotificationOpened(notificationOpenedCallback)
            .endInit();
            
          // Call syncHashedEmail anywhere in your app if you have the user's email.
          // This improves the effectiveness of OneSignal's "best-time" notification scheduling feature.
          // window.plugins.OneSignal.syncHashedEmail(userEmail);

        window.plugins.OneSignal.getIds(function(ids) {
            var did = ids.userId;
            //window.localStorage.setItem("did",ids.userId);
            console.log("One signal id: " + did);
            window.localStorage['oneSignalId'] = did;
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
            templateUrl: "templates/main.html",
            controller: "MainCtrl"
        })
        .when("/reward/:added/:real", {
            //templateUrl : "templates/rewards.html",
            templateUrl: "templates/reward.html",
            controller: "RewardsCtrl" //done
        })
        .when("/reinforcement", {
            templateUrl: "templates/reinforcement.html",
            controller: "ReinforcementCtrl" //done
        })
        .when("/info", {
            templateUrl: "templates/info.html",
            controller: "RedCtrl"
        })
        .when("/lifeinsights/:type", {
            templateUrl: "templates/lifeinsights.html",
            controller: "LifeInsightsCtrl" //done
        })
        .when("/activetasks", {
            templateUrl: "templates/activetasks.html",
            controller: "ATCtrl"
        })
        .when("/tappingtaskStep1", {
            templateUrl: "templates/tappingtaskStep1.html",
            controller: "TappingTaskStep1Ctrl" //done
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

        /*
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
        */ 

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


            
            var GameApp = GameApp || {};
            /*
            GameApp.USE_DEVICE_PIXEL_RATIO = false; // here you can change to use or not the device pixel ratio - it is not supported by all browsers
            if (GameApp.USE_DEVICE_PIXEL_RATIO) {
                GameApp.DEVICE_PIXEL_RATIO = window.devicePixelRatio;
                GameApp.CANVAS_WIDTH = window.innerWidth * GameApp.DEVICE_PIXEL_RATIO;
                GameApp.CANVAS_HEIGHT = window.innerHeight * GameApp.DEVICE_PIXEL_RATIO;
            } else {
                GameApp.DEVICE_PIXEL_RATIO = 1.0;
                GameApp.CANVAS_WIDTH = window.innerWidth * GameApp.DEVICE_PIXEL_RATIO;
                GameApp.CANVAS_HEIGHT = window.innerHeight * GameApp.DEVICE_PIXEL_RATIO;
            }
            */

            GameApp.CANVAS_WIDTH = 382.0;
            //GameApp.CANVAS_HEIGHT = 642.0;
            console.log("w: " + window.innerWidth + ", h: " + window.innerHeight + ", dp: " + window.devicePixelRatio);
            
            /*
            if((window.innerWidth > GameApp.CANVAS_WIDTH) &&  (window.innerHeight > GameApp.CANVAS_HEIGHT)){
                GameApp.CANVAS_WIDTH = window.innerWidth;
                GameApp.CANVAS_HEIGHT = window.innerHeight - 10;
            }
            */

            if(window.innerWidth > GameApp.CANVAS_WIDTH)
                GameApp.CANVAS_WIDTH = window.innerWidth;

            //
            GameApp.CANVAS_HEIGHT = window.innerHeight;
            //if(GameApp.CANVAS_HEIGHT < 642.0)
            //    GameApp.CANVAS_HEIGHT = 642.0;
            //var game = new Phaser.Game(GameApp.CANVAS_WIDTH, GameApp.CANVAS_HEIGHT, Phaser.AUTO);

            var game;
            if(ionic.Platform.isIOS()){
                //game = new Phaser.Game(window.innerWidt`h, window.innerHeight - 64, Phaser.AUTO, 'gameArea');
                //game = new Phaser.Game(GameApp.CANVAS_WIDTH, GameApp.CANVAS_HEIGHT - 54, Phaser.AUTO, 'gameArea');
                if(GameApp.CANVAS_HEIGHT < 642.0)//iphone SE fix.
                    GameApp.CANVAS_HEIGHT += 60;
                game = new Phaser.Game(GameApp.CANVAS_WIDTH, GameApp.CANVAS_HEIGHT - 21*window.devicePixelRatio, Phaser.AUTO, 'gameArea');
            }else if(ionic.Platform.isAndroid())
                game = new Phaser.Game(GameApp.CANVAS_WIDTH, GameApp.CANVAS_HEIGHT - 44, Phaser.AUTO, 'gameArea');    
            else
                //game = new Phaser.Game(window.innerWidth, window.innerHeight - 44, Phaser.AUTO, 'gameArea');
                //game = new Phaser.Game(GameApp.CANVAS_WIDTH, GameApp.CANVAS_HEIGHT - 34, Phaser.AUTO, 'gameArea');
                game = new Phaser.Game(GameApp.CANVAS_WIDTH, GameApp.CANVAS_HEIGHT - 20, Phaser.AUTO, 'gameArea');

            game.state.add('Boot', FishGame.Boot);
            game.state.add('Preloader', FishGame.Preloader);
            game.state.add('StartMenu', FishGame.StartMenu);
            game.state.add('Game', FishGame.Game);
            game.state.add('GameSmall', FishGame.GameSmall);
            game.state.add('Level1', FishGame.Level1);
            game.state.add('Level1Small', FishGame.Level1Small);
            game.state.add('Gameover', FishGame.Gameover);
            game.state.add('Gamelast', FishGame.GameLast);
            
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


            console.log("cognito_data:"); 
            if(window.localStorage['cognito_data'] == undefined){
                var cognito_data = {};
                cognito_data['survey_data'] = {};
                cognito_data['badges'] = {};
                cognito_data['imei'] = window.localStorage['imei'] || '';
                cognito_data['survey_data']['daily_survey'] = {}; //value['daily_survey'];
                cognito_data['survey_data']['weekly_survey'] = {}; //value['weekly_survey'];
                cognito_data['survey_data']['active_tasks_survey'] = {};
                cognito_data['username'] = window.localStorage['username'] || '';
                cognito_data = JSON.stringify(cognito_data);
                window.localStorage['cognito_data'] = cognito_data;
                returnValue = window.localStorage['cognito_data'];
            }else{
                
                returnValue = window.localStorage['cognito_data'];
                console.log("loading local copy " + returnValue);
                loadgame(returnValue);
            }




            function loadgame(returnValue){
                if(returnValue == null){
                    console.log("We got null");
                }//else
                    //window.localStorage['latest_cloud_data'] = returnValue;


                rl_data_str = window.localStorage['cognito_data'] || "{}";

                //means no 'cognito_data'. Re-install, or new --> Restore "from cloud"
                if(rl_data_str === "{}"){ 

                    //
                    if(returnValue == null){//means no internet data so far
                    }else{
                        //means we need to restore from the web.
                        rl_data_str = returnValue;
                        //if coming from the web and we don't have any backup data then we are thinking cloud is cognito.
                        //so in that case, there will be no update if we have already given done the survey or active tasks.
                        window.localStorage['cognito_data'] = returnValue; 
                    }
                }else{
                    //cognito_data is local storage is latest. Continue with that
                }

                //------ other device sync issue: START
                //cloud data initialize
                var current_cloud_data = JSON.parse(window.localStorage['latest_cloud_data'] || '{}');
                if(current_cloud_data.hasOwnProperty('lastupdate')){
                }else{
                    current_cloud_data['lastupdate'] = 0;//means first time we will write what we have.
                    window.localStorage['latest_cloud_data'] =  JSON.stringify(current_cloud_data);
                }
                //local data initialize
                var current_local_data = JSON.parse(window.localStorage['cognito_data'] || '{}');
                if(current_local_data.hasOwnProperty('lastupdate')){
                }else{
                    current_local_data['lastupdate'] = new Date().getTime(); //means first time we will store what we have.
                    window.localStorage['cognito_data'] = JSON.stringify(current_local_data); 
                }

                //update if there is new data.
                if(current_cloud_data['lastupdate'] > current_local_data['lastupdate']){
                    console.log('Cloud: updating data');
                    window.localStorage['cognito_data'] = returnValue;
                    rl_data_str = returnValue;
                }
                //----- other device sync issue: END

                //-- rl_data_str is the latest value..
                //this is the latest value.
                returnValue = rl_data_str;

                //Make sure the call for "sdcard" permission happens.
                //save to "data_ds_ws.txt"
                var rl_data = JSON.parse(returnValue);
                
                //console.log(returnValue);
                $rootScope.scoreValue=updateTheScore(returnValue);

                scope.total_days = $rootScope.total_days;

                game.state.states["Preloader"].assignscope(scope);
                game.state.states["GameSmall"].assignscope(scope);
                game.state.states["Game"].assignscope(scope);
                game.state.states["Level1"].assignscope(scope);
                game.state.states["Level1Small"].assignscope(scope);
                game.state.states["Gamelast"].assignscope(scope);
                //game.state.add('Gamelast', FishGame.GameLast);

                game.state.start('Boot');
                

                //save now in the disk
                saraDatafactory.saveDataCollectionState(rl_data['survey_data']['daily_survey'], rl_data['survey_data']['weekly_survey']); 

                //showstartatthebottom($rootScope.scoreValue);

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
                //}

                //save the changes if there is a change....
                //scope.$emit('update:cloud');
            }


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

                //console.log("reinfrocement_data: "+ JSON.stringify($rootScope.reinfrocement_data))

                if('reinfrocement_data' in rl_data){
                    //console.log('Assigning reinfrocement_data');
                    //window.localStorage['reinfrocement_data'] = JSON.stringify(rl_data['reinfrocement_data']);
                }else{
                    rl_data['reinfrocement_data'] = {};
                }

                //if undefined then get from local storage
                
                //--- This is causing problems.
                //if($rootScope.reinfrocement_data == undefined)
                //    $rootScope.reinfrocement_data = JSON.parse(window.localStorage['reinfrocement_data'] || "{}");

                //var reinfrocement_data = $rootScope.reinfrocement_data;

                //if($rootScope.reinfrocement_data == undefined)
                //$rootScope.reinfrocement_data = rl_data['reinfrocement_data'];

                var reinfrocement_data = rl_data['reinfrocement_data'];//$rootScope.reinfrocement_data; 


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
                                //window.localStorage['reinfrocement_data'] = JSON.stringify(reinfrocement_data);

                                //
                                //-- write it down to 'rl_data'
                                //
                                //var rl_data = JSON.parse(window.localStorage['cognito_data'] || "{}");
                                ////don't worry load from local. It is only today. Also, ither will fill out stuffs here.
                                //var reinforcement_record = rl_data['reinfrocement_data'] || {};
                                //if(Object.keys(reinforcement_record).length === 0)
                                //     rl_data['reinfrocement_data'] = {};

                                //save only for today.
                                rl_data['reinfrocement_data'][moment().format('YYYYMMDD')] = reinfrocement_data[moment().format('YYYYMMDD')];
                                rl_data['lastupdate'] = new Date().getTime();
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
                                rl_data['lastupdate'] = new Date().getTime();
                                window.localStorage['cognito_data'] = JSON.stringify(rl_data);
                                //saraDatafactory.storedata('rl_data',rl_data, moment().format('YYYYMMDD'));

                                //window.localStorage['reinfrocement_data'] = JSON.stringify(reinfrocement_data);
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
                                //window.localStorage['reinfrocement_data'] = JSON.stringify(reinfrocement_data);

                                //
                                //-- write it down to 'rl_data'
                                //
                                //var rl_data = JSON.parse(window.localStorage['cognito_data'] || "{}");
                                ////don't worry load from local. It is only today. Also, ither will fill out stuffs here.
                                // var reinforcement_record = rl_data['reinfrocement_data'] || {};
                                //if(Object.keys(reinforcement_record).length === 0)
                                //     rl_data['reinfrocement_data'] = {};

                                //save only for today.
                                rl_data['reinfrocement_data'][moment().format('YYYYMMDD')] = reinfrocement_data[moment().format('YYYYMMDD')];
                                rl_data['lastupdate'] = new Date().getTime();
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
                                rl_data['lastupdate'] = new Date().getTime();
                                window.localStorage['cognito_data'] = JSON.stringify(rl_data);
                                //saraDatafactory.storedata('rl_data',rl_data, moment().format('YYYYMMDD'));

                                //window.localStorage['reinfrocement_data'] = JSON.stringify(reinfrocement_data);
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

                //
                console.log("Cloud update initiated");
                scope.$emit('update:cloud');

                //get the badges
                scope.$emit('update:badge');

                //
                scope.$emit('update:streak');

                //
                showstartatthebottom($rootScope.scoreValue);

            }
            //saraDatafactory.storedata('game_score',json_data, moment().format('YYYYMMDD'));

            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            scope.$on('show:checkReinforcement', function() {
                //console.log("show:checkReinforcement");
                checkReinforcement();
            });

            scope.$on('game:updatebadge', function() {
                //console.log("show:checkReinforcement");
                if (scope.current_level === "GameSmall")
                    game.state.states["GameSmall"].changebadgecount($rootScope.number_of_badges);
                if (scope.current_level === "Game")
                    game.state.states["Game"].changebadgecount($rootScope.number_of_badges);
                if (scope.current_level === "Level1Small")
                    game.state.states["Level1Small"].changebadgecount($rootScope.number_of_badges);
                if (scope.current_level === "Level1")
                    game.state.states["Level1"].changebadgecount($rootScope.number_of_badges);

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
                //console.log("Updating score " + JSON.stringify(scoreValue));
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

                //
                $rootScope.aquarium_score = scope.total_points;

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

                return scoreValue;
            }

            function showstartatthebottom(scoreValue){

                var daily_survey = scoreValue['daily_survey'];
                scope.daily_survey_images = [];

                //get the first date
                var first_date = moment().format('YYYYMMDD');
                var first_date_moment_js = moment(first_date,"YYYYMMDD");
                var key_moment_js;
                for (var key in daily_survey) {
                    key_moment_js = moment(key,"YYYYMMDD");
                    //takes the first day only. But it may not be the first date.
                    //break;
                    if (key_moment_js < first_date_moment_js) {
                        first_date = key;
                        first_date_moment_js = moment(first_date,"YYYYMMDD");
                    }
                }

                //get the first date
                /*
                var first_date = moment().format('YYYYMMDD');
                for (var key in daily_survey) {
                    first_date = key;
                    break;
                }
                */
                $rootScope.first_date_of_study = first_date;

                $rootScope.total_days = 0;
                //np data on the first day
                var daily_survey_streaks = 0;
                var daily_survey_last_date = moment().format('YYYYMMDD');
                scope.daily_survey_images_str = '<div style="padding:10px;padding-top:15px;"><p><u>Surveys across days</u></p><div><p style="color:#5e9eb9;float:left;">Start&#8594;</p>';
                if(first_date === moment().format('YYYYMMDD')){
                    //{name: 'clubs', symbol: '♣', show:true, up:100, class: 'blue', img:'img/blue.png', show_image: true}
                    if(daily_survey.hasOwnProperty(first_date)){
                        //scope.daily_survey_images.push({img: 'img/survey_done.png', width: 15, class:"fa fa-star", color:'red'});
                        scope.daily_survey_images.push({width: 15, text: "&#9733;", color:'red'});
                        scope.daily_survey_images_str = scope.daily_survey_images_str + '<p style="color:red;float:left;">&#9733;</p>';
                        $rootScope.total_days = 1;
                    }else{
                        scope.daily_survey_images.push({width: 15, text:"&#9734;", color:'DarkGray'});
                        scope.daily_survey_images_str = scope.daily_survey_images_str + '<p style="color:DarkGray;float:left;">&#9734;</p>';
                    }
                    scope.daily_survey_images_str = scope.daily_survey_images_str + "<div><img src='img/today.png' style='height:15px;float: left;'/></div>"
                    //scope.daily_survey_images[1] = {img: 'img/today.png', width: 15};
                    //return;
                }else{
                    //there is more data
                    var current_date = first_date;
                    var number_of_days = 1;
                    while(true){

                        if(daily_survey.hasOwnProperty(current_date)){
                            scope.daily_survey_images.push({width: 15, text: "&#9733;", color:'red'});
                            scope.daily_survey_images_str = scope.daily_survey_images_str + '<p style="color:red;float:left;">&#9733;</p>';
                            daily_survey_streaks = daily_survey_streaks + 1;
                            daily_survey_last_date = current_date;
                        }
                        else{
                            scope.daily_survey_images.push({width: 15, text:"&#9734;", color:'DarkGray'});
                            scope.daily_survey_images_str = scope.daily_survey_images_str + '<p style="color:DarkGray;float:left;">&#9734;</p>';
                            daily_survey_streaks = 0;
                        }

                        if((scope.daily_survey_images.length+1)%5 == 0){
                            if(current_date === moment().format('YYYYMMDD')){
                                scope.daily_survey_images.push({img: 'img/today.png', width: 15});
                                scope.daily_survey_images_str = scope.daily_survey_images_str + "<div><img src='img/today.png' style='height:15px;float: left;'/></div>"
                            }
                            else if((scope.daily_survey_images.length+1)%20 == 0){
                                scope.daily_survey_images.push({img: 'img/arrow.png', width: 15, text: "" + number_of_days + " days" });
                                //scope.daily_survey_images_str = scope.daily_survey_images_str + "<p></p>"
                            }
                            else{
                                scope.daily_survey_images.push({img: 'img/nothing.png', width: 6});
                                //scope.daily_survey_images_str = scope.daily_survey_images_str + '<p style="height:1px;color:white;float:left;">&#9734;</p>'
                            }
                        }else{
                            if(current_date === moment().format('YYYYMMDD'))
                                scope.daily_survey_images_str = scope.daily_survey_images_str + "<div><img src='img/today.png' style='height:15px;float: left;'/></div>"
                                //scope.daily_survey_images.push({img: 'img/today.png', width: 15});
                        }

                        /*
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
                        }*/

                        //if((scope.daily_survey_images.length+1)%15 == 0)

                        if(current_date === moment().format('YYYYMMDD'))
                            break;

                        current_date = moment(current_date, "YYYYMMDD").add(1, 'day').format('YYYYMMDD');
                        number_of_days++;
                    }
                    $rootScope.total_days = number_of_days;
                }
                scope.daily_survey_images_str = scope.daily_survey_images_str + '</div></div>';
                //console.log(scope.daily_survey_images);
                console.log("todal days: " + $rootScope.total_days);


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
                var active_task_streaks = 0;
                var active_task_last_date = moment().format('YYYYMMDD');
                scope.active_task_images_str = '<div style="padding:10px;padding-top:15px;clear:left;"><p><u><br>Active task across days</u></p><p style="color:#5e9eb9;float:left;">Start&#8594;</p>';
                if(first_date === moment().format('YYYYMMDD')){
                    if(active_tasks_survey.hasOwnProperty(first_date)){
                        //scope.active_tasks_survey_images.push({img: 'img/active_task_done.png', width: 15, class:"fa fa-star", color:'Navy'});
                        scope.active_tasks_survey_images.push({width: 15, text: "&#9733;", color:'Navy'});
                        scope.active_task_images_str = scope.active_task_images_str + '<p style="color:Navy;float:left;">&#9733;</p>';
                    }
                    else{
                        scope.active_tasks_survey_images.push({width: 15, text:"&#9734;", color:'DarkGray'});
                        scope.active_task_images_str = scope.active_task_images_str + '<p style="color:DarkGray;float:left;">&#9734;</p>';
                    }

                    //scope.active_tasks_survey_images[1] = {img: 'img/today.png', width: 15};
                }else{

                    //there is more data
                    var current_date = first_date;
                    number_of_days = 1;
                    while(true){

                        if(active_tasks_survey.hasOwnProperty(current_date)){
                            //scope.active_tasks_survey_images.push({img: 'img/active_task_done.png', width: 15, class:"fa fa-star", color:'Navy'});
                            scope.active_tasks_survey_images.push({width: 15, text: "&#9733;", color:'Navy'});
                            scope.active_task_images_str = scope.active_task_images_str + '<p style="color:Navy;float:left;">&#9733;</p>';
                            active_task_streaks = active_task_streaks + 1;
                            active_task_last_date = current_date;
                        }
                        else{
                            //scope.active_tasks_survey_images.push({img: 'img/not_done.png', width: 15, class:"fa fa-star-o", color:'DarkGray'});
                            scope.active_tasks_survey_images.push({width: 15, text:"&#9734;", color:'DarkGray'});
                            scope.active_task_images_str = scope.active_task_images_str + '<p style="color:DarkGray;float:left;">&#9734;</p>';
                            active_task_streaks = 0;
                        }

                        if((scope.active_tasks_survey_images.length+1)%5 == 0){
                            if(current_date === moment().format('YYYYMMDD'))
                                scope.active_task_images_str = scope.active_task_images_str + "<div><img src='img/today.png' style='height:15px;float: left;'/></div>"
                        }else{
                            if(current_date === moment().format('YYYYMMDD'))
                                scope.active_task_images_str = scope.active_task_images_str + "<div><img src='img/today.png' style='height:15px;float: left;'/></div>"
                                //scope.daily_survey_images.push({img: 'img/today.png', width: 15});
                        }
                        /*
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
                        }*/

                        //if((scope.active_tasks_survey_images.length+1)%5 == 0)
                        //    scope.active_tasks_survey_images.push('img/nothing.png');

                        //if((scope.daily_survey_images.length+1)%15 == 0)


                        number_of_days++;
                        if(current_date === moment().format('YYYYMMDD'))
                            break;
                        current_date = moment(current_date, "YYYYMMDD").add(1, 'day').format('YYYYMMDD');

                        
                    }
                }
                scope.active_task_images_str = scope.active_task_images_str + '</div></div>';
                scope.daily_survey_images_str = scope.daily_survey_images_str + scope.active_task_images_str;

                //console.log(scope.active_tasks_survey_images);

                $rootScope.current_streak = active_task_streaks;
                $rootScope.last_date = active_task_last_date;
                if(active_task_streaks < daily_survey_streaks){
                    $rootScope.current_streak = daily_survey_streaks;
                    $rootScope.last_date = daily_survey_last_date;
                }

                //scope.daily_survey_images[0] = 'img/active_task_done.png';
                //scope.daily_survey_images[1] = 'img/not_done.png';
                //scope.daily_survey_images[2] = 'img/survey_done.png';
                creatLifeInsights(scoreValue);

                //
                var username = window.localStorage['username'] || 'unknown';
                this.isStudyParticipant = username.indexOf('-study-') !== -1;
                if(($rootScope.total_days > 30) && this.isStudyParticipant){
                    //this.state.start('Gameover');
                    //game.load.image('gameover', 'img/Fireworks.png');
                    game.state.start('Gameover');
                }

            }



            function creatLifeInsights(scoreValue){

                //
                var rl_data = JSON.parse(window.localStorage['cognito_data'] || "{}");
                var lifeinsights_data = {};
                if("life-insights" in rl_data){
                    lifeinsights_data = rl_data["life-insights"];
                }else{
                    lifeinsights_data["daily_survey"] = {};
                    lifeinsights_data["at_sp"] = {};
                    lifeinsights_data["at_tap"] = {};
                }

                var daily_survey = scoreValue['daily_survey'];


                //get the first date
                /*
                var first_date = moment().format('YYYYMMDD');
                var first_date_moment_js = moment(first_date,"YYYYMMDD");
                var key_moment_js;
                for (var key in daily_survey) {
                    key_moment_js = moment(key,"YYYYMMDD");
                    //takes the first day only. But it may not be the first date.
                    //break;
                    if (key_moment_js < first_date_moment_js) {
                        first_date = key;
                        first_date_moment_js = moment(first_date,"YYYYMMDD");
                    }
                }
                */
                var first_date = $rootScope.first_date_of_study;

                //get all dates
                var dates = [];
                var current_date = first_date;
                while(true){
                    dates.push(parseInt(current_date));
                    if(current_date === moment().format('YYYYMMDD'))
                        break;
                    current_date = moment(current_date, "YYYYMMDD").add(1, 'day').format('YYYYMMDD');
                }
                dates = dates.reverse();
                //console.log("Dates: " + JSON.stringify(dates));  

                var life_insights = {};
                //$scope.survey['Q1d'] + "," + $scope.survey['QMood'] + "," + $scope.survey['Q3d'] + "," + $scope.survey['Q4d'] + "," + $scope.survey['Q5d'] + ","  + $scope.survey['Q6d'];

                var data_types = ['Q1d', 'Q2d', 'Q3d', 'Q4d', 'Q5d', 'Q6d', 'Q7d', 'at_sp', 'at_tap'];
                for(var i=0; i < data_types.length-2; i++){
                    

                    //get data for life-insights
                    var q_data = [];
                    var q_data_test = '';
                    for(var j=0; j<dates.length; j++){
                        if(dates[j] in lifeinsights_data["daily_survey"]){
                            //q_data_test = JSON.parse(lifeinsights_data["daily_survey"][dates[j]]);
                            var str_split = lifeinsights_data["daily_survey"][dates[j]].split(',');

                            q_data_test = str_split[i];
                            if(q_data_test == 'undefined')
                                q_data.push(-1);
                            else
                                q_data.push(parseInt(q_data_test)); //

                            //console.log("q_data_test: " + q_data_test);
                        }else
                            q_data.push(-1); 
                    }

                    if(data_types[i] == 'Q2d'){
                    }else{
                        life_insights[data_types[i]]={};
                        life_insights[data_types[i]]['dates'] = JSON.stringify(dates);
                        life_insights[data_types[i]]['data'] = JSON.stringify(q_data);
                    }

                }

                //add the at_tap
                var q_data = [];
                for(var j=0; j<dates.length; j++){
                    if(dates[j] in lifeinsights_data["at_tap"]){
                        //q_data_test = JSON.parse(lifeinsights_data["daily_survey"][dates[j]]);
                        var tap_data = lifeinsights_data["at_tap"][dates[j]];
                        if(str_split == undefined)
                            q_data.push(-1);
                        else
                            q_data.push(parseInt(tap_data)); //

                        //console.log("q_data_test: " + q_data_test);
                    }else
                        q_data.push(-1); 
                }
                //console.log("q_data, " + JSON.stringify(q_data));
                var at_life_insights = {};
                at_life_insights["tapcount"]={};
                at_life_insights["tapcount"]['dates'] = JSON.stringify(dates);
                at_life_insights["tapcount"]['data'] = JSON.stringify(q_data);


                //add the at_sp
                q_data = [];
                for(var j=0; j<dates.length; j++){
                    if(dates[j] in lifeinsights_data["at_sp"]){
                        //q_data_test = JSON.parse(lifeinsights_data["daily_survey"][dates[j]]);
                        var tap_data = lifeinsights_data["at_sp"][dates[j]];
                        if(str_split == undefined)
                            q_data.push(-1);
                        else
                            q_data.push(parseInt(tap_data)); //

                        //console.log("q_data_test: " + q_data_test);
                    }else
                        q_data.push(-1); 
                }
                //console.log("q_data, " + JSON.stringify(q_data));
                //var at_life_insights = {};
                at_life_insights["spatialspeed"]={};
                at_life_insights["spatialspeed"]['dates'] = JSON.stringify(dates);
                at_life_insights["spatialspeed"]['data'] = JSON.stringify(q_data);


                //console.log(scope.daily_survey_images);
                //console.log(JSON.stringify(life_insights));
                window.localStorage['lifeinsights_data'] = JSON.stringify(life_insights);
                window.localStorage['at_life_insights_data'] = JSON.stringify(at_life_insights);
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
                //StatusBar.overlaysWebView(true);
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
            $scope.$broadcast('game:resumed');
            //if($rootScope.insideMain == true)
            saraDatafactory.copyUsageStats({'view':'app','status':'resume'});
            isPaused = false;
            //$rootScope.game.lockRender = true;

            

        }, false);

        document.addEventListener("pause", function() {
            //$interval.cancel(promise);
            console.log('paused');
            //
            $scope.$broadcast('game:paused');
            //if($rootScope.insideMain == true)
            saraDatafactory.copyUsageStats({'view':'app','status':'paused'});
            isPaused = true;

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

    //
    $scope.isSyncing = false;


    function testResumePause() {
        console.log("App paused: " + isPaused);
        $interval.cancel(promise);
        promise = $interval(testResumePause, 1000);
        //console.log("Important stats: " + window.innerWidth + "," + window.innerHeight + "," + window.devicePixelRatio);

        //var regid = $ionicPush.token;//window.localStorage['registrationIdPush']; // || 'not found';
        //console.log("RegID: " + regid);
        //if(isPaused==false)
        //    readActiveTaskData();
        var regid = window.localStorage['oneSignalId'] || 'unknown';

        //$rootScope.game.lockRender = false;
        /*
        var data = {};
        data['username'] = 'test';
        var updates = {};
        updates['/test/'] = data;
        data['ts'] = new Date().getTime();
        data['readableTs'] = moment().format('MMMM Do YYYY, h:mm:ss a ZZ');
        firebase.database().ref().update(updates);
        */


        if (ionic.Platform.isIOS()) {
            if($scope.username === 'unknown')
                return;

            if(regid != undefined){
                //console.log("RegID: " + regid);
                //var stored_regid = window.localStorage['registrationIdPush'] || 'unknown'; 
                var stored_regid = window.localStorage['registrationIdPush'] || 'unknown'; 
                //console.log('stored_regid ' + stored_regid);
                //console.log('regid ' + regid);
                if(stored_regid === regid){
                }else{
                    window.localStorage['registrationIdPush'] = regid;//regid.token;
                    var updates = {};

                    var newPostKey = firebase.database().ref().child('iOS').child('HistoryRegToken').push().key;

                    var data = {};
                    data['username'] = $scope.username;
                    data['regId'] = "decomissioned"; //$ionicPush.token;
                    data['oneSignalId'] = window.localStorage['oneSignalId'];
                    data['ts'] = new Date().getTime();
                    data['readableTs'] = moment().format('MMMM Do YYYY, h:mm:ss a ZZ');

                    updates['/iOS/RegToken/' + $scope.username] = data;
                    updates['/iOS/HistoryRegToken/' + newPostKey] = data;
                    firebase.database().ref().update(updates);
                }
            }
        }

        //
        //--- updates['/user-posts/' + $scope.survey.id + '/' + newPostKey] = $scope.survey;
        //
        if(isPaused == true)
            $rootScope.definedOnce = false;
        else
            $rootScope.definedOnce = true;

        if($rootScope.definedOnce == true){
            var rl_data = JSON.parse(window.localStorage['cognito_data'] || "{}");
            if(rl_data.hasOwnProperty('badges')){
                $scope.money = rl_data['badges']['money'];
                if($scope.money=="" || $scope.money==undefined)
                    $scope.money = "0";
                window.localStorage['total_money_earned'] = "" + $scope.money;
            }
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

            //
            //console.log("AT data: " + isActiveTaskAddedHowMany + ", " + isActiveTaskAdded);
            //console.log("AT data prior: " + JSON.stringify(active_task_prior_data));
            //console.log("AT data new: "  + JSON.stringify(active_tasks_survey_data));
            //if(isActiveTaskAdded){
            //
                    
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
                //saraDatafactory.storedata('rl_data',rl_data, moment().format('YYYYMMDD'));
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

    $scope.$on('update:streak', function(event, args) {
        
    });

    $scope.$on('update:badge', function(event, args) {
        //update the cloud
        //updateCloudData();
        //var rl_data = JSON.parse(window.localStorage['cognito_data'] || '{}');
        $rootScope.number_of_badges = 0;
        var badges;
        if($rootScope.badges == undefined){
            //badges = JSON.parse(window.localStorage['badges'] || "{}");
           var cognito_data = JSON.parse(window.localStorage['cognito_data'] || "{}");
           badges = cognito_data['badges'];
           if('money' in badges){ //means things are empty.
           }else{
               badges['daily_survey'] = [0,0,0,0,0,0];
               badges['weekly_survey'] = [0,0,0,0];
               badges['active_tasks'] = [0,0,0,0,0,0];
               badges['money'] = 0;
           }
           $rootScope.badges = badges;
        }else{
           badges = $rootScope.badges;
        }

        //
        for(var i=0; i < badges['daily_survey'].length; i++)
            $rootScope.number_of_badges += badges['daily_survey'][i];

        for(var i=0; i < badges['weekly_survey'].length; i++)
            $rootScope.number_of_badges += badges['weekly_survey'][i];

        for(var i=0; i < badges['active_tasks'].length; i++)
            $rootScope.number_of_badges += badges['active_tasks'][i];

        console.log("number_of_badges: " + $rootScope.number_of_badges);

        //
        $scope.$broadcast('game:updatebadge');

    });

    //
    //
    $scope.$on('update:cloud', function(event, args) {
        //update the cloud
        updateCloudData();
    });


    //-- 
    function updateCloudData(){
        //console.log("update cloud called");
        
        //cloud data initialize
        var current_cloud_data = JSON.parse(window.localStorage['latest_cloud_data'] || '{}');
        if(current_cloud_data.hasOwnProperty('lastupdate')){
        }else{
            current_cloud_data['lastupdate'] = 0;//means first time we will write what we have.
        }

        //local data initialize
        var current_local_data = JSON.parse(window.localStorage['cognito_data'] || '{}');
        if(current_local_data.hasOwnProperty('lastupdate')){
            if($rootScope.cognito_data != undefined){
                //if($rootScope.cognito_data['lastupdate'] > current_local_data['lastupdate'])
                //    current_local_data = $rootScope.cognito_data;
            }
        }else{
            current_local_data['lastupdate'] = new Date().getTime(); //means first time we will store what we have.
        }

        console.log("from app.js");
        console.log(window.localStorage['cognito_data']); 
        //update if there is new data.
        if(current_cloud_data['lastupdate'] < current_local_data['lastupdate']){
            console.log('Cloud: updating data');
            current_local_data['readable_ts'] = moment().format("MMMM Do YYYY, h:mm:ss a ZZ");
            saraDatafactory.storedata('rl_data',current_local_data, moment().format('YYYYMMDD'));

            //now latest_cloud_data and current_local_data is the same
            window.localStorage['latest_cloud_data'] = window.localStorage['cognito_data']  || '{}';

            if(ionic.Platform.isIOS()){
                //store firebase score.
                var data = {};
                var updates = {};
                var username = window.localStorage['username'] || 'unknown';
                if(username != 'unknown'){
                    data['score'] = $rootScope.aquarium_score;
                    data['streak'] = $rootScope.current_streak;
                    data['username'] = username;
                    data['lastlogdate'] = $rootScope.last_date;
                    data['readableTs'] = moment().format("MMMM Do YYYY, h:mm:ss a ZZ");
                    data['ts'] = Date.now();
                    var newPostKey = firebase.database().ref().child('iOS').child('HistoryUserData').push().key;
                    updates['/iOS/userdata/' + username] = data;
                    updates['/iOS/HistoryUserData/' + newPostKey] = data;
                    firebase.database().ref().update(updates);
                }
            }
        }else
            console.log('Cloud: no update necessary');




    }


    ///////////////////////////////////////////////////////////////////////
    // --- Daily survey
    ///////////////////////////////////////////////////////////////////////
    $scope.startDailySurvey = function() {
        $scope.myPopup.close();

        //only available after 6PM.
        var today_date_string = moment().format('YYYY-MM-DD');
        var daily_survey_start_time = moment(today_date_string + " " + "6:00" + " pm", "YYYY-MM-DD hh:mm a");
        //var daily_survey_start_time = moment(today_date_string + " " + "1:00" + " am", "YYYY-MM-DD hh:mm a");
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
            //if (isDailySurveyCompleted <= 1) { //==0
            if (isDailySurveyCompleted == 0) { //==0
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
        //var daily_survey_start_time = moment(today_date_string + " " + "1:00" + " am", "YYYY-MM-DD hh:mm a");
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

            //
            var isDailySurveyCompleted = window.localStorage['active_task_' + moment().format('YYYYMMDD')] || 0;

            //$location.path("/activetasks");
            //$location.path("/tappingtask");
            if(isDailySurveyCompleted == 0)
                $location.path("/tappingtaskStep1");
            else
                $scope.showAlertCompletedAT();
                
                

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

    $scope.showAlertCompletedAT = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Thank you.',
            template: 'You already completed the active tasks.'
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
                    //StatusBar.overlaysWebView(true);
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

        $scope.pressedLogin = false;
        $scope.signIn = function(login) {
            //$scope.loading = true;
            $scope.pressedLogin = true;
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
                    //$scope.loading = false;
                    $scope.pressedLogin = true;
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


