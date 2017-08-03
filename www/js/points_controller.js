
app.controller("PointsCtrl", function($scope, $location,$cordovaStatusbar,$http,$rootScope,saraDatafactory,$ionicPlatform) {
    console.log($location.path() + ", " + $rootScope.total_points);

    

        //status bar color
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        console.log(StatusBar);
        if(ionic.Platform.isAndroid()){
          //$cordovaStatusbar.overlaysWebView(true);
          //$cordovaStatusbar.styleHex('#4527A0');
          if(window.StatusBar) {
            StatusBar.overlaysWebView(true);
            StatusBar.backgroundColorByHexString("#303F9F"); //Light
            //StatusBar.style(2); //Black, transulcent
            //StatusBar.style(3); //Black, opaque
          }
        }
    }

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
    saraDatafactory.pullBadgeData(function(returnValue) {
        // use the return value here instead of like a regular (non-evented) return value
        console.log("Badge value: " + returnValue);
        //window.localStorage['score_data'] = returnValue;
    });
    */

    saraDatafactory.copyUsageStats({'view':'treasure_chest','status':'start'});
    $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        saraDatafactory.copyUsageStats({'view':'treasure_chest','status':'destroy'});
    });


    //
    //all badges-- There is a record for the badges.
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

    //for demo
    /*
    $rootScope.total_score = 360;
    badges['daily_survey'] = [1,1,0,0,0,0];
    badges['weekly_survey'] = [0,0,0,0];
    badges['active_tasks'] = [1,1,0,0,0,0];
    badges['money'] = 3;
    */
    
    //
    $scope.amount_earned = "$" + badges['money'];




    //var current_points = 1000;
    var current_points = $rootScope.total_score;

    $http.get('js/fishpoints.json').success(function(data) {
      //console.log("Fishes: " + data);


      var survey_string = "";
      var isNextAvailableStillMasked = false;
      for(var i = 0; i < data.length; i++) {
          data[i].class = 'nonshade';
          data[i].img = data[i].img.substring(0, data[i].img.length-4) + '_tn.jpg';
          if(current_points < data[i].points){
            if(isNextAvailableStillMasked == false){
               //
               data[i].img = data[i].img.substring(0, data[i].img.length-7) + '-grey_tn.jpg';
               isNextAvailableStillMasked = true;
               //data[i].class = 'shade';
            }
            else{
              data[i].img = 'img/cryptocoin_tn.jpg';
            }
          }
      }
       
      $scope.pointsdata = data;


      //console.log("Fishes: " + JSON.stringify($scope.pointsdata));
      //$scope.$apply();
    });



    //decide which badges to show

    var demo_show_all_badges = false;

    //-------------- Active tasks
    //--------------
    //var active_tasks = [5,2,2,2,5,2];
    //var active_tasks = [0,0,0,0,0];
    var active_tasks = badges['active_tasks'];
    var active_tasks_badges_img = ['img/badgeAT-none.png','img/badgeAT1.png','img/badgeAT2.png','img/badgeAT3.png','img/badgeAT4.png','img/badgeAT5.png','img/badgeAT6.png'];
    //we are doing this because the trophies do have the right size.
    var at_width = [50,30,42,30,42,40,46];

    $scope.active_tasks_badges = [];
    if(sum(active_tasks)  == 0){
        $scope.active_tasks_badges.push({"img": active_tasks_badges_img[0], "count": 0, "width": at_width[0]});
    }else{

        for(var i = 1; i < active_tasks_badges_img.length; i++){
          if(active_tasks[i-1] > 0){

            for(var q = 0; q < active_tasks[i-1]; q++)
              $scope.active_tasks_badges.push({"img": active_tasks_badges_img[i], "count": active_tasks[i-1], "width": at_width[i]*3/2});
          }
        }

    }
    //console.log("Active tasks: " + JSON.stringify($scope.active_tasks_badges));


    var daily_survey_tasks = badges['daily_survey']; 
    //var daily_survey_tasks = [3,2,0,2,2,1]; 
    //var daily_survey_tasks = [0,0,0,0,0];
    var ds_tasks_badges = ['img/backgroud_daily.png','img/green.png','img/blue.png','img/red.png','img/bronze.png','img/silver.png','img/gold.png'];
    $scope.daily_survey_badges = [];
    if(sum(daily_survey_tasks)  == 0){
        $scope.daily_survey_badges.push({"img": ds_tasks_badges[0], "count": 0, "width": 45});
    }else{

        for(var i = 1; i < ds_tasks_badges.length; i++){
          if(daily_survey_tasks[i-1] > 0){
            for(var q = 0; q < daily_survey_tasks[i-1]; q++)
              $scope.daily_survey_badges.push({"img": ds_tasks_badges[i], "count": daily_survey_tasks[i-1], "width": 45});
          }
        }

    }

    //badges['weekly_survey'] = [0,0,0,0];
    var weekly_survey_tasks_count = sum(badges['weekly_survey']);  
    //badges['weekly_survey'] = [1,1,1,1];
    var ws_tasks_badges = ['img/trophy_background.png','img/green_trophy.png','img/bronze_trophy.png','img/silver_trophy.png','img/gold_trophy.png'];
    
    //
    $scope.weekly_survey_badges = [];
    if(weekly_survey_tasks_count == 0){
        $scope.weekly_survey_badges.push({"img": ws_tasks_badges[0], "count": 0, "width": 40*10/9});
    }
    if(badges['weekly_survey'][0]==1){
        $scope.weekly_survey_badges.push({"img": ws_tasks_badges[1], "count": 0, "width": 45*10/9});
    }
    if(badges['weekly_survey'][1]==1){
        $scope.weekly_survey_badges.push({"img": ws_tasks_badges[2], "count": 0, "width": 45*10/9});
    }
    if(badges['weekly_survey'][2]==1){
        $scope.weekly_survey_badges.push({"img": ws_tasks_badges[3], "count": 0, "width": 35*10/9});
    }
    if(badges['weekly_survey'][3]==1){
        $scope.weekly_survey_badges.push({"img": ws_tasks_badges[4], "count": 0, "width": 45*10/9});
    }



    $scope.goHome = function() {
        $location.path("/main");
    };

    function sum(arr){
        var total=0;
        for(var i in arr){
          total += arr[i]; 
        }
        return total;
    }


    var deregisterSecond = $ionicPlatform.registerBackButtonAction(
      function() {
        //$location.path("/");
        navigator.app.backHistory();
      }, 100
    );
    $scope.$on('$destroy', deregisterSecond);



});