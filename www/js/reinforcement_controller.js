app.controller("ReinforcementCtrl", function($scope, $http, $ionicPlatform, $location, $rootScope, $cordovaStatusbar, $timeout, awsCognitoSyncFactory, awsCognitoIdentityFactory, $ionicHistory, $state, $ionicLoading, saraDatafactory, $cordovaProgress, $interval) {
    
    /*
    if(Math.random() > 0.5)
        $scope.rein_image = 'img/reinforcements/ken_hair.gif';
    else
        $scope.rein_image = 'img/reinforcements/devil_kid.jpg';
    */

    //save everything
    
    //we automatically go to life insight from reinforement
    //but back button will lead us here.
    //we need to change that.
    /*
    if($rootScope.leavingLI==undefined){
        $rootScope.leavingLI = false;
    }else{
        if($rootScope.leavingLI == true){//means we are back from LI, so go to home.
            $rootScope.leavingLI = false;
            $location.path("/");
        }
    }
    */
        

    $scope.isRealReinforcement = $rootScope.isRealReinforcement;
    console.log("" + $scope.isRealReinforcement);
    //
    var rl_data = JSON.parse(window.localStorage['cognito_data'] || "{}");
    rl_data['reinfrocement_data'] = rl_data['reinfrocement_data'] ||{};
    var reinfrocement_data_today = rl_data['reinfrocement_data'][moment().format('YYYYMMDD')] || {}; // {} when undefined or demo.   

    var type;
    /*
    if(Math.random() > 0.5)
        type = "memes";
    else
        type = "money";
    */

    //
    //$rootScope.reinforcementType == "ActiveTasks";

    if($rootScope.reinforcementType != "ActiveTasks")
        saraDatafactory.copyUsageStats({'view':'reinforcement_view','status':'start'});
    $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        if($rootScope.reinforcementType != "ActiveTasks")
            saraDatafactory.copyUsageStats({'view':'reinforcement_view','status':'destroy'});
    });
    var deregisterSecond = $ionicPlatform.registerBackButtonAction(
      function() {
        //$location.path("/");
        navigator.app.backHistory();
      }, 100
    );
    $scope.$on('$destroy', deregisterSecond);
    

    var reward_options = ['gif','memes'];//,'money','life_insights'];

    if($rootScope.reinforcementType=="Demo")
        reward_options = ['gif', 'memes', 'life_insights'];//means it is a demo so I can show anything.

    var random_int = getRandomInt(0, reward_options.length-1);//
    type = reward_options[random_int];
    //type = reward_options[3];

    var visible_lifeinsights = rl_data['reinfrocement_data']['visible_lifeinsights'] || {};



    if($rootScope.reinforcementType=="ActiveTasks"){
        type = 'life_insights';
        //reinfrocement_data_today['reward_type_at'] = type;
    }

    //if($rootScope.reinforcementType=="DailySurvey")
    //    reinfrocement_data_today['reward_type_ds'] = type;
    

    //add a meme
    if(type === 'memes' || type === 'gif'){
        $http.get('js/memeslist.json').success(function(data2) {

            //
            //generateDailySurveyInsights(data2);
            
            //
            //console.log(JSON.stringify(data2));

            //
            //console.log("" + data2.length); 
            var index = getRandomInt(0, data2.length-1);

            //
            // following lines are commented for open sourcing
            // "img/reinforcements/memes/HM4.jpg" is the filename
            // $scope.rein_image = data2[index].filename;
            //

            //
            $scope.rein_image = "img/sample_meme.jpg";

            //
            $scope.all_images = data2;

            //
            if($rootScope.reinforcementType=="DailySurvey"){
                reinfrocement_data_today['reward_ds_content'] = data2[index].filename;
                if($rootScope.isRealReinforcement == true){
                    rl_data['reinfrocement_data']['visible_lifeinsights'] = visible_lifeinsights;
                    rl_data['reinfrocement_data'][moment().format('YYYYMMDD')] = reinfrocement_data_today;    
                    rl_data['lastupdate'] = new Date().getTime();
                    $rootScope.cognito_data = rl_data;
                    window.localStorage['cognito_data'] = JSON.stringify(rl_data); 

                    //save to local
                    var reinfrocement_data_total = JSON.parse(window.localStorage['reinfrocement_data'] || "{}");
                    reinfrocement_data_total[moment().format('YYYYMMDD')] = reinfrocement_data_today;
                    window.localStorage['reinfrocement_data'] = JSON.stringify(reinfrocement_data_total);
                    //$rootScope.reinfrocement_data = JSON.parse(window.localStorage['reinfrocement_data'] || "{}");

                    //saraDatafactory.storedata('rl_data',rl_data, moment().format('YYYYMMDD'));
                }
            }
        });
    }

    //give the money
    /*
    if(type === 'money'){
        $scope.rein_image = 'img/one_dollar.jpeg';
        reinfrocement_data_today['reward_type_extra'] = '1 dollar';
    }
    */


    //ToDo: change to Cloud..
    //var visible_lifeinsights = JSON.parse(window.localStorage['visible_lifeinsights'] || '{}');
    //var rl_data = JSON.parse(window.localStorage['cognito_data'] || "{}");
    
    if(type === 'life_insights'){
        //$scope.rein_image = 'img/one_dollar.jpeg';

        
        if(visible_lifeinsights.hasOwnProperty('Q1d')){
            //console.log(JSON.stringify(visible_lifeinsights));
        }else{
            //means we have nothing.
            visible_lifeinsights['Q1d'] = 0;
            visible_lifeinsights['Q3d'] = 0;
            visible_lifeinsights['Q4d'] = 0;
            visible_lifeinsights['Q5d'] = 0;
            visible_lifeinsights['Q6d'] = 0;
            visible_lifeinsights['steps'] = 0;
            visible_lifeinsights['maps'] = 0;
            visible_lifeinsights['tapcount'] = 0;
            visible_lifeinsights['spatialspeed'] = 0;
            window.localStorage['visible_lifeinsights'] = JSON.stringify(visible_lifeinsights);
        }

        //add the tap-count and spatial task
        if('tapcount' in visible_lifeinsights){
        }else{
            visible_lifeinsights['tapcount'] = 0;
            visible_lifeinsights['spatialspeed'] = 0;
            rl_data['reinfrocement_data']['visible_lifeinsights'] = visible_lifeinsights;
            rl_data['lastupdate'] = new Date().getTime();
            window.localStorage['cognito_data'] = JSON.stringify(rl_data);
        }


        //pick for the length
        //console.log('' + visible_lifeinsights.length);

        //we have 7 life insights.
        var life_insight_keys = ['Q1d','Q3d','Q4d','Q5d','Q6d','tapcount','spatialspeed'];//,'steps','maps'];

        //pick a life insight index 
        var rand_index = -1;
        while(true){
             rand_index = getRandomInt(0, 6);//so we will only pick two
             if(visible_lifeinsights[life_insight_keys[rand_index]] == 0){
                visible_lifeinsights[life_insight_keys[rand_index]] = 1;
                window.localStorage['visible_lifeinsights'] = JSON.stringify(visible_lifeinsights);
                break;//means we got a new one
             }

             //
             var all_visible = true;
             for(var j=0; j < life_insight_keys.length; j++){
                if(visible_lifeinsights[life_insight_keys[j]] == 0)
                    all_visible = false;
             }

             if(all_visible == true){
                //means all are visible, so pick a random index, show that one as Billie said
                rand_index = getRandomInt(0, 5);
                break;
            }
        }

        //TODO: the reward content has not been saved
        if(rand_index == -1){//this rand_index=-1 will never happen
            reinfrocement_data_today['reward_type_extra_at'] = 'all';
            //$location.path("/lifeinsights/" + all);
        }else{
            reinfrocement_data_today['reward_at_content'] = life_insight_keys[rand_index];
            //$location.path("/lifeinsights/" + life_insight_keys[rand_index]);
        }
        

        if($rootScope.isRealReinforcement == true){
            rl_data['reinfrocement_data']['visible_lifeinsights'] = visible_lifeinsights;
            rl_data['reinfrocement_data'][moment().format('YYYYMMDD')] = reinfrocement_data_today;    
            rl_data['lastupdate'] = new Date().getTime();
            $rootScope.cognito_data = rl_data;
            window.localStorage['cognito_data'] = JSON.stringify(rl_data);

            //------ 
            var reinfrocement_data_total = JSON.parse(window.localStorage['reinfrocement_data'] || "{}");
            reinfrocement_data_total[moment().format('YYYYMMDD')] = reinfrocement_data_today;
            window.localStorage['reinfrocement_data'] = JSON.stringify(reinfrocement_data_total);
            //$rootScope.reinfrocement_data = JSON.parse(window.localStorage['reinfrocement_data'] || "{}");

            //saraDatafactory.storedata('rl_data',rl_data, moment().format('YYYYMMDD'));
        }


        if(rand_index == -1){//this rand_index=-1 will never happen
            //reinfrocement_data_today['reward_type_extra_at'] = 'all';
            $location.path("/lifeinsights/" + all);
        }else{
            //reinfrocement_data_today['reward_at_content'] = life_insight_keys[rand_index];
            $location.path("/lifeinsights/" + life_insight_keys[rand_index]);
        }


    }


    //add a life insights.
    

    //one_dollar.jpeg
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //
    $scope.goHome = function() {
        $location.path("/");
    };

    //
    $scope.s = {};
    var promise;
    $scope.ratingChanged = function(x){
        //rl_data = JSON.parse(window.localStorage['cognito_data'] || "{}");
        //rl_data['reinfrocement_data'] = rl_data['reinfrocement_data'] ||{};
        //reinfrocement_data_today = rl_data['reinfrocement_data'][moment().format('YYYYMMDD')] || {};
        reinfrocement_data_today['reward_ds_rating'] = x;
        reinfrocement_data_today['reward_ds_rating_ts'] = moment().format("x");
        reinfrocement_data_today['reward_ds_rating_tz'] = moment().format("ZZ");

        //$rootScope.isRealReinforcement = true;
        console.log("" + x + ", " + $rootScope.isRealReinforcement);
        console.log("came here");
        if($rootScope.isRealReinforcement == true)
        {
            //rl_data['reinfrocement_data']['visible_lifeinsights'] = visible_lifeinsights;
            rl_data['reinfrocement_data'][moment().format('YYYYMMDD')] = reinfrocement_data_today;    
            rl_data['lastupdate'] = new Date().getTime();
            $rootScope.cognito_data = rl_data;
            console.log("from meme.js");
            window.localStorage['cognito_data'] = JSON.stringify(rl_data);
            console.log("came here");
            console.log(window.localStorage['cognito_data']);    
            //saraDatafactory.storedata('rl_data',rl_data, moment().format('YYYYMMDD'));
        }

        if(ionic.Platform.isIOS()){
            promise = $interval(testResumePause, 1000);
            //$cordovaProgress.showSimpleWithLabel(true, "Saving");
        }else{
            $location.path("/main");
            //promise = $interval(testResumePause, 1000);
            //$cordovaProgress.showSimpleWithLabel(true, "Saving");
        }
    }

    function testResumePause() {
        console.log("wait two seconds")
        //if(ionic.Platform.isIOS())
        //    $cordovaProgress.hide();

        $interval.cancel(promise);
        $location.path("/main");
    }

    /*
    var el = document.querySelector('#el');

    // current rating, or initial rating
    var currentRating = 0;

    // max rating, i.e. number of stars you want
    var maxRating= 5;

    // callback to run after setting the rating
    var callback = function(rating) { alert(rating); };

    // rating instance
    var myRating = rating(el, currentRating, maxRating, callback);

    myRating.setRating(3);

    // sets rating and runs callback
    myRating.setRating(3, true);

    // sets rating and doesn't run callback
    myRating.setRating(3, false);

    // gets the rating
    myRating.getRating();
    */

    //console.log($location.path());

    //status bar color
    //document.addEventListener("deviceready", onDeviceReady, false);

    /*
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
    */


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