app.controller("RewardsCtrl", function($scope, $location,$cordovaStatusbar,$rootScope,$routeParams,$http,saraDatafactory, $ionicPlatform) {
    console.log($location.path());

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

    $scope.goHome = function() {
        $location.path("/");
    };



    //////////////////////////////////////////////////////////////////////
    //show the rewards for points and fishes
    //////////////////////////////////////////////////////////////////////
    $scope.showAquariumPoints = true;
    $scope.showTrivia = true;

    


    //
    $scope.cards = [];
    //$scope.cards.push({name: 'clubs', symbol: '♣', show:true, up:100, class: 'blue', img:'img/blue.png', show_image: true});
    //$scope.cards.push({name: "You earned 3 dollars for completing three weekly surveys.", show: true, up:100, class: 'blue', img: "img/gold_trophy.png", show_image: true});
    //    {name: 'clubs', symbol: '♣', show:true, up:100, class: 'blue', img:'img/blue.png', show_image: true},
    //    {name: 'diamonds', symbol: '♦', show:false, up:130, class: 'red', img:'img/blue.png', show_image: false},
    //    {name: 'hearts', symbol: '♥', show:false, up:160, class: 'green', img:'img/blue.png', show_image: false},
    //    {name: 'spades', symbol: '♠', show:false, up:190, class: 'yellow', img:'img/blue.png', show_image: true}

    
    /*
    var index  = 1;
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

    var deregisterSecond = $ionicPlatform.registerBackButtonAction(
      function() {
        //$location.path("/");
        //navigator.app.backHistory();
      }, 100
    );
    $scope.$on('$destroy', deregisterSecond);
    

    //
    //$rootScope.total_score = 320;
    console.log("current score: " + $rootScope.total_score);

    //
    var added_points = $routeParams.added;
    console.log("added: " + added_points);

    //
    $scope.added_fish_points = added_points;

    //all badges
    var cognito_data = JSON.parse(window.localStorage['cognito_data'] || "{}");
    var badges = cognito_data['badges'];
    if(!('money' in badges)){ //means things are empty.
        badges['daily_survey'] = [0,0,0,0,0,0];
        badges['weekly_survey'] = [0,0,0,0];
        badges['active_tasks'] = [0,0,0,0,0,0];
        badges['money'] = 0;

        if($routeParams.real=='true'){
            //TODO: update the local copy.
            window.localStorage['badges'] = JSON.stringify(badges);
        }
    }

    //--- this is for faking.
    if($rootScope.badges==undefined) //undefined means we need gate from another place.
      $rootScope.badges = badges;


    //---------------------------------------------------------------------
    //
    //  --- The following is for fish display
    //
    //---------------------------------------------------------------------
    //this may come last since this is a callback.
    $http.get('js/fishpoints.json').success(function(data) {
      //console.log("Fishes: " + data);

      //contents
      
      var survey_string = "";
      $scope.images = [];
      $scope.fish_names = "";
      var added_points2 = parseInt(added_points);
      if(added_points2==29)//active task correction, add one becaues it will be 30
          added_points2 = added_points2 + 1;
      $rootScope.total_score = parseInt($rootScope.total_score);
      $rootScope.total_score += added_points2;




      for(var i = 0; i < data.length; i++) {
          if((data[i].points > ($rootScope.total_score - added_points2)) && (data[i].points <= $rootScope.total_score)){

                //console.log("" + data[i].points + "," + $rootScope.total_score + "," + added_points + "," + (data[i].points > $rootScope.total_score) + "," + ($rootScope.total_score + added_points));
                data[i].img = data[i].img.substring(0, data[i].img.length-4) + '_tn.jpg';
                $scope.images.push(data[i].img);
                $scope.fish_names = "Congratulations "+ data[i].name.valueOf() + " has been unlocked.";
                                                                                                                                                                                                                                           
                if("trivia" in data[i])
                    $scope.trivia_text = data[i].trivia.valueOf();
                else
                    $scope.trivia_text =  'Fun facts'; 

                $scope.cards.push({name: $scope.fish_names, show: true, up:0, class: 'blue', img: data[i].img, show_image: true});
                $scope.cards.push({name: $scope.trivia_text, show: true, up:0, class: 'blue', img: 'img/trivia.png', show_image: true});
          }
      }
      //console.log($scope.images);

      //back ground fish
      $scope.next_fish = [];
      $scope.next_fish_names = "";
      for(var i = 0; i < data.length; i++) {
          if(data[i].points > $rootScope.total_score){
                //console.log("" + data[i].points + "," + $rootScope.total_score + "," + added_points + "," + (data[i].points > $rootScope.total_score) + "," + ($rootScope.total_score + added_points));
                $scope.next_fish[0] = data[i].img.substring(0, data[i].img.length-4) + '-grey_tn.jpg'; //data[i].img = data[i].img.substring(0, data[i].img.length-4) + '-grey.png';
                $scope.next_fish_names = "You are close to unlocking the next fish. Can you guess what kind of fish is it?";

                $scope.cards.push({name: $scope.next_fish_names, show: true, up:0, class: 'blue', img: $scope.next_fish[0], show_image: true});
                break;
          }
      }

      $scope.showNextFish = true;
      if($scope.images.length==0){
          $scope.images[0] = $scope.next_fish[0];
          $scope.fish_names = $scope.next_fish_names;
          $scope.showNextFish = false;
      }
      console.log($scope.images);
       
      $scope.pointsdata = data;

      var isreal2 = $routeParams.real=='true';
        if(isreal2 == true){
          //This will force a reload
          //+= parseInt(added_points);
          $rootScope.total_score = undefined; 
      }

      adjust_css();

    });


    //var cognito_data2 = JSON.parse(window.localStorage['cognito_data'] || "{}");
    var monetary_reward = $rootScope.badges['money'] ;//cognito_data2['badges']['money'];

    //---------------------------------------------------------------------
    //
    //  --- show the reward for badges, daily survey
    //
    //---------------------------------------------------------------------
    var isreal = $routeParams.real=='true';
    var usage_stats_type = '';
    if((added_points=='30' || added_points=='80') && !$rootScope.rewardIsActiveTask){
        var daily_survey_day_by_day = [];
        var reward_awarded_daily = {};
        usage_stats_type = 'daily';
        //this is the streak data
        //
        //daily_survey_day_by_day = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1];
        var cognito_data = JSON.parse(window.localStorage['cognito_data'] || "{}");
        reward_awarded_daily = cognito_data['daily_streak']||{};
        //reward_awarded_daily = JSON.parse(window.localStorage['reward_awarded_daily'] || "{}");

        //if nothhing is there then initialize.
        if(Object.keys(reward_awarded_daily).length === 0){
            reward_awarded_daily["30"] = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            reward_awarded_daily["18"] = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            reward_awarded_daily["12"] = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            reward_awarded_daily["6"] = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            reward_awarded_daily["3"] = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            window.localStorage['reward_awarded_daily'] = JSON.stringify(reward_awarded_daily);
        }

        //
        console.log("reward_awarded_daily, " + JSON.stringify(reward_awarded_daily));

        //
        //console.log(moment(key, "YYYYMMDD").add(1, 'day').format('YYYYMMDD'));
        $scope.cards.push({name: "You earned "+ "30" +" points for completing the daily survey", show: false, up:0, class: 'blue', img: "img/30points.png", show_image: true});

        if(isreal == true || $rootScope.daily_survey_day_by_day == undefined){
            //var daily_survey = JSON.parse(window.localStorage['daily_survey_data'] || "{}");
            //console.log(JSON.stringify(daily_survey));
            //scope.total_daily_surveys = 0;

            //var cognito_data = JSON.parse(window.localStorage['cognito_data'] || "{}");
            var daily_survey = cognito_data['survey_data']['daily_survey'];

            var last_date = '';
            var first_date = '';
            for (var key in daily_survey) {
                //console.log(key);
                //scope.total_daily_surveys += 1;
                last_date = key;
            }
            for (var key in daily_survey) {
                first_date = key;
                break;
            }

            //console.log("Is real: " + isreal);
            //last_date = moment().format('YYYYMMDD');
            var flag = true;
            var current_date = first_date;
            while(flag){
              if(current_date in daily_survey){
                 //console.log("Exist: " + current_date);
                 daily_survey_day_by_day.push(1);
              }
              else{
                 //console.log("Doesn't exist: " + current_date);
                 daily_survey_day_by_day.push(0);
              }
              
              if(current_date === last_date)
                 flag = false;

              current_date = moment(current_date, "YYYYMMDD").add(1, 'day').format('YYYYMMDD');
            }
            console.log("daily_survey_day_by_day: " + daily_survey_day_by_day);


            //console.log("x: " + ($rootScope.daily_survey_day_by_day == undefined) + ", " + (isreal==false) + ", " + (($rootScope.daily_survey_day_by_day == undefined) && (isreal == false)));
            if(($rootScope.daily_survey_day_by_day == undefined) && (isreal == false)){
                daily_survey_day_by_day.push(1);
                //console.log("daily_survey_day_by_day 2: " + daily_survey_day_by_day);
            }
            $rootScope.daily_survey_day_by_day = daily_survey_day_by_day;
            $rootScope.reward_awarded_daily = reward_awarded_daily;

            //-- Save the reward
            if(isreal == true){
                var reinfrocement_data = $rootScope.reinfrocement_data;//JSON.parse(window.localStorage['reinfrocement_data'] || "{}");
                //if we alrady have the data
                if(moment().format('YYYYMMDD') in reinfrocement_data){
                }else
                    reinfrocement_data[moment().format('YYYYMMDD')] = {};

                reinfrocement_data[moment().format('YYYYMMDD')]['ds'] = 1;
                $rootScope.reinfrocement_data = reinfrocement_data;
                window.localStorage['reinfrocement_data'] = JSON.stringify(reinfrocement_data);
            }

        }else{
            if(isreal == false && (added_points=='30' || added_points=='80')){ //means we have daily survey
                $rootScope.daily_survey_day_by_day.push(1);
            }
        }
        //console.log(isNDayStreak(daily_survey_day_by_day,reward_awarded_daily,17));

        //
        console.log("Number of daily surveys: " + sum($rootScope.daily_survey_day_by_day));

        //
        daily_survey_day_by_day = $rootScope.daily_survey_day_by_day;
        reward_awarded_daily = $rootScope.reward_awarded_daily;

        //Streak: 30,18,12,6,3
        //rewards: 4,3,2,1,0.5
        $scope.showBadge = false;
        if(isNDayStreak(daily_survey_day_by_day,reward_awarded_daily,30,isreal)){
          monetary_reward += 2.5;
          $scope.showBadge = true;
          $scope.badge_img = "img/gold.png";
          $scope.how_many_days = 30;
          $scope.how_much = "2.5 dollars";
          $scope.cards.push({name: "You earned 2.5 dollars for completing the survey", show: false, up:0, class: 'blue', img: "img/18_Rev.jpg", show_image: true});
          $scope.cards.push({name: "You earned a shell stone for completing surveys 30 days in a row.", show: false, up:0, class: 'blue', img: "img/gold.png", show_image: true});
          $rootScope.badges['daily_survey'][5] += 1;
        }else{
           if(isNDayStreak(daily_survey_day_by_day,reward_awarded_daily,18,isreal)){
              monetary_reward += 1.5;
              $scope.showBadge = true;
              $scope.badge_img = "img/silver.png";
              $scope.how_many_days = 18;
              $scope.how_much = "1.5 dollars";
              $scope.cards.push({name: "You earned 1.5 dollars for completing the survey", show: false, up:0, class: 'blue', img: "img/18_Rev.jpg", show_image: true});
              $scope.cards.push({name: "You earned an agronite stone for completing surveys 18 days in a row.", show: false, up:0, class: 'blue', img: "img/silver.png", show_image: true});
              $rootScope.badges['daily_survey'][4] += 1;
           }else{
              if(isNDayStreak(daily_survey_day_by_day,reward_awarded_daily,12,isreal)){
                monetary_reward += 1;
                $scope.showBadge = true;
                $scope.badge_img = "img/bronze.png";
                $scope.how_many_days = 12;
                $scope.how_much = "1 dollar";
                $scope.cards.push({name: "You earned 1 dollar for completing the survey", show: false, up:0, class: 'blue', img: "img/18_Rev.jpg", show_image: true});
                $scope.cards.push({name: "You earned of a bloodstone for completing surveys 12 days in a row.", show: false, up:0, class: 'blue', img: "img/bronze.png", show_image: true});
                $rootScope.badges['daily_survey'][3] += 1;
              }else{
                  if(isNDayStreak(daily_survey_day_by_day,reward_awarded_daily,6,isreal)){
                    monetary_reward += 0.5;
                    $scope.showBadge = true;
                    $scope.badge_img = "img/blue.png";
                    $scope.how_many_days = 6;
                    $scope.how_much = "50 cents";
                    $scope.cards.push({name: "You earned 50 cents for completing the survey", show: false, up:0, class: 'blue', img: "img/50cent.jpg", show_image: true});
                    $scope.cards.push({name: "You earned an aquamarine stone for completing surveys 6 days in a row.", show: false, up:0, class: 'blue', img: "img/blue.png", show_image: true});
                    $rootScope.badges['daily_survey'][1] += 1;
                  }else{
                      if(isNDayStreak(daily_survey_day_by_day,reward_awarded_daily,3,isreal)){
                        monetary_reward += 0.25;
                        $scope.showBadge = true;
                        $scope.badge_img = "img/green.png";
                        $scope.how_many_days = 3;
                        $scope.how_much = "25 cents";
                        $scope.cards.push({name: "You earned 25 cents for completing the survey", show: false, up:0, class: 'blue', img: "img/50cent.jpg", show_image: true});
                        $scope.cards.push({name: "You earned a ruby stone completing surveys 3 days in a row.", show: false, up:0, class: 'blue', img: "img/green.png", show_image: true});
                        $rootScope.badges['daily_survey'][0] += 1;
                      }
                  }
              }
           }
        }

        //give money for the first day
        if($rootScope.first_date_of_study === moment().format('YYYYMMDD')){
            monetary_reward += 0.5;
            $scope.how_much = "50 cents";
            $scope.cards.push({name: "You earned 50 cents for completing the survey", show: false, up:0, class: 'blue', img: "img/50cent.jpg", show_image: true});
        }
      }



    function isNDayStreak(adherence_array,reward_awarded_daily,N,isreal){
      var total_days = 0;
      var isPaidInLastNDays = 0;
        if(daily_survey_day_by_day.length >= N){

            //
            for(var i = daily_survey_day_by_day.length-1; i>=daily_survey_day_by_day.length-N ; i--){
              total_days += adherence_array[i];
            }

            //
            for(var i = daily_survey_day_by_day.length-1; i>=daily_survey_day_by_day.length-N ; i--){
              isPaidInLastNDays += reward_awarded_daily[""+N][i];
            }
        }

        //if paid in the last N days also once then we remove the reward.
        //
        //console.log(reward_awarded_daily[""+N].length);
        //console.log(JSON.stringify(reward_awarded_daily));
        //console.log(adherence_array);

        if(total_days == N && isPaidInLastNDays == 0){
            reward_awarded_daily[""+N][daily_survey_day_by_day.length-1] = 1;

            //
            if(N%3 == 0)
              reward_awarded_daily["3"][daily_survey_day_by_day.length-1] = 1;
            if(N%6 == 0)
              reward_awarded_daily["6"][daily_survey_day_by_day.length-1] = 1;
            if(N%12 == 0)
              reward_awarded_daily["12"][daily_survey_day_by_day.length-1] = 1;
            if(N%18 == 0)
              reward_awarded_daily["18"][daily_survey_day_by_day.length-1] = 1;
            if(N%30 == 0)
              reward_awarded_daily["30"][daily_survey_day_by_day.length-1] = 1;

            if(isreal==true)//save if it is the real one.
              window.localStorage['reward_awarded_daily'] = JSON.stringify(reward_awarded_daily);
            return true;
        }
        else
            return false;
    }


    //////////////////////////////////////////////////////////////////////
    //show the reward for active tasks
    //////////////////////////////////////////////////////////////////////

    //$rootScope.weekly_survey_day_by_day = [];
    //15 will only happen for simulation
    if(added_points=='29' || $rootScope.rewardIsActiveTask){
        $rootScope.rewardIsActiveTask = false;
        $scope.cards.push({name: "You earned " + "30" + " points for completing the active tasks.", show: false, up:0, class: 'blue', img: "img/30points.png", show_image: true});
        usage_stats_type = 'active_task';

        //
        var reward_awarded_at = {};
        var cognito_data = JSON.parse(window.localStorage['cognito_data'] || "{}");
        reward_awarded_at = cognito_data['at_streak']||{};

        //
        console.log("reward_awarded_at, " + JSON.stringify(reward_awarded_at));

        //if nothhing is there then initialize.
        if(Object.keys(reward_awarded_at).length === 0){
            reward_awarded_at["30"] = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            reward_awarded_at["18"] = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            reward_awarded_at["12"] = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            reward_awarded_at["6"] = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            reward_awarded_at["3"] = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            window.localStorage['reward_awarded_at'] = JSON.stringify(reward_awarded_at);
        }

        //
        var at_day_by_day = [];
        if(isreal == true || $rootScope.at_day_by_day == undefined){
            //var daily_survey = JSON.parse(window.localStorage['daily_survey_data'] || "{}");
            //console.log(JSON.stringify(daily_survey));
            //scope.total_daily_surveys = 0;

            //var cognito_data = JSON.parse(window.localStorage['cognito_data'] || "{}");
            var active_tasks_survey = cognito_data['survey_data']['active_tasks_survey'];

            var last_date = '';
            var first_date = '';
            for (var key in active_tasks_survey) {
                //console.log(key);
                //scope.total_daily_surveys += 1;
                last_date = key;
            }
            for (var key in active_tasks_survey) {
                first_date = key;
                break;
            }

            //console.log("Is real: " + isreal);
            //last_date = moment().format('YYYYMMDD');
            var flag = true;
            var current_date = first_date;
            while(flag){
              if(current_date in active_tasks_survey){
                 //console.log("Exist: " + current_date);
                 at_day_by_day.push(active_tasks_survey[current_date]);
              }
              else{
                 //console.log("Doesn't exist: " + current_date);
                 at_day_by_day.push(0);
              }
              
              if(current_date === last_date)
                 flag = false;

              current_date = moment(current_date, "YYYYMMDD").add(1, 'day').format('YYYYMMDD');
            }

            //
            console.log("at_day_by_day: " + at_day_by_day);
            console.log("at_day_by_day2: " + JSON.stringify(active_tasks_survey));


            //console.log("x: " + ($rootScope.daily_survey_day_by_day == undefined) + ", " + (isreal==false) + ", " + (($rootScope.daily_survey_day_by_day == undefined) && (isreal == false)));
            if(($rootScope.at_day_by_day == undefined) && (isreal == false)){
                //if(moment().format('YYYYMMDD') in active_tasks_survey){}
                //else
                at_day_by_day.push(1);
                //console.log("daily_survey_day_by_day 2: " + daily_survey_day_by_day);
            }
            $rootScope.at_day_by_day = at_day_by_day;
            $rootScope.reward_awarded_at = reward_awarded_at;

            if(isreal == true){
                var reinfrocement_data = $rootScope.reinfrocement_data;//JSON.parse(window.localStorage['reinfrocement_data'] || "{}");
                //if we alrady have the data
                if(moment().format('YYYYMMDD') in reinfrocement_data){
                }else
                    reinfrocement_data[moment().format('YYYYMMDD')] = {};

                reinfrocement_data[moment().format('YYYYMMDD')]['at'] = 1;
                $rootScope.reinfrocement_data = reinfrocement_data;
                window.localStorage['reinfrocement_data'] = JSON.stringify(reinfrocement_data);
            }

        }else{
            if(isreal == false && added_points=='29'){ //means we have daily survey
                $rootScope.at_day_by_day.push(1);
                console.log("$rootScope.at_day_by_day: " + $rootScope.at_day_by_day);
            }
        }
        
        //
        at_day_by_day = $rootScope.at_day_by_day;
        reward_awarded_at = $rootScope.reward_awarded_at;

        //
        //Streak: 30,18,12,6,3
        //rewards: 4,3,2,1,0.5
        $scope.showBadge = false;
        //var monetary_reward = 0;
        if(isNAtStreak(at_day_by_day,reward_awarded_at,30,isreal)){
          monetary_reward += 2.5;
          $scope.showBadge = true;
          $scope.badge_img = "img/badgeAT6.png";
          $scope.how_many_days = 30;
          $scope.how_much = "2.5 dollars";
          $scope.cards.push({name: "You earned 2.5 dollars for completing the survey", show: false, up:0, class: 'blue', img: "img/18_Rev.jpg", show_image: true});
          $scope.cards.push({name: "You earned a Taihitian black pearl for completing actitve tasks 30 days in a row.", show: false, up:0, class: 'blue', img: $scope.badge_img, show_image: true});
          $rootScope.badges['active_tasks'][5] += 1;
        }else{
           if(isNAtStreak(at_day_by_day,reward_awarded_at,18,isreal)){
              monetary_reward += 1.5;
              $scope.showBadge = true;
              $scope.badge_img = "img/badgeAT5.png";
              $scope.how_many_days = 18;
              $scope.how_much = "1.5 dollars";
              $scope.cards.push({name: "You earned 1.5 dollars for completing the survey", show: false, up:0, class: 'blue', img: "img/18_Rev.jpg", show_image: true});
              $scope.cards.push({name: "You earned an orange pearl for completing actitve tasks 18 days in a row.", show: false, up:0, class: 'blue', img: $scope.badge_img, show_image: true});
              $rootScope.badges['active_tasks'][4] += 1;
           }else{
              if(isNAtStreak(at_day_by_day,reward_awarded_at,12,isreal)){
                monetary_reward += 1;
                $scope.showBadge = true;
                $scope.badge_img = "img/badgeAT4.png";
                $scope.how_many_days = 12;
                $scope.how_much = "1 dollar";
                $scope.cards.push({name: "You earned 1 dollar for completing the survey", show: false, up:0, class: 'blue', img: "img/18_Rev.jpg", show_image: true});
                $scope.cards.push({name: "You earned a Southsea golden pearl for completing actitve tasks 12 days in a row.", show: false, up:0, class: 'blue', img: $scope.badge_img, show_image: true});
                $rootScope.badges['active_tasks'][3] += 1;
              }else{
                  if(isNAtStreak(at_day_by_day,reward_awarded_at,6,isreal)){
                    monetary_reward += 0.5;
                    $scope.showBadge = true;
                    $scope.badge_img = "img/badgeAT2.png";
                    $scope.how_many_days = 6;
                    $scope.how_much = "50 cents";
                    $scope.cards.push({name: "You earned 50 cents for completing the active task", show: false, up:0, class: 'blue', img: "img/50cent.jpg", show_image: true});
                    $scope.cards.push({name: "You earned a pink pearl for completing actitve tasks 6 days in a row.", show: false, up:0, class: 'blue', img: $scope.badge_img, show_image: true});
                    $rootScope.badges['active_tasks'][1] += 1;
                  }else{
                      if(isNAtStreak(at_day_by_day,reward_awarded_at,3,isreal)){
                        monetary_reward += 0.25;
                        $scope.showBadge = true;
                        $scope.badge_img = "img/badgeAT1.png";
                        $scope.how_many_days = 3;
                        $scope.how_much = "25 cents";
                        $scope.cards.push({name: "You earned 25 cents for completing the active task", show: false, up:0, class: 'blue', img: "img/50cent.jpg", show_image: true});
                        $scope.cards.push({name: "You earned a Japanese Akaya white pearl for completing actitve tasks 3 days in a row.", show: false, up:0, class: 'blue', img: $scope.badge_img, show_image: true});
                        $rootScope.badges['active_tasks'][0] += 1;
                      }
                  }
              }
           }
        }

                //give money for the first day
        if($rootScope.first_date_of_study === moment().format('YYYYMMDD')){
            monetary_reward += 0.5;
            $scope.how_much = "50 cents";
            $scope.cards.push({name: "You earned 50 cents for completing the active task", show: false, up:0, class: 'blue', img: "img/50cent.jpg", show_image: true});
        }

    }

    function isNAtStreak(at_day_by_day,reward_awarded_at,N,isreal){
      var total_days = 0;
      var isPaidInLastNDays = 0;
        if(at_day_by_day.length >= N){

            //
            for(var i = at_day_by_day.length-1; i>=at_day_by_day.length-N ; i--){
              if(at_day_by_day[i] > 0 )
                total_days += 1; //at_day_by_day[i];
            }

            //
            for(var i = at_day_by_day.length-1; i>=at_day_by_day.length-N ; i--){
              isPaidInLastNDays += reward_awarded_at[""+N][i];
            }
        }

        //if paid in the last N days also once then we remove the reward.
        //
        //console.log(reward_awarded_daily[""+N].length);
        //console.log(JSON.stringify(reward_awarded_daily));
        //console.log(adherence_array);

        if(total_days == N && isPaidInLastNDays == 0){
            reward_awarded_at[""+N][at_day_by_day.length-1] = 1;

          //
          if(N%3 == 0)
            reward_awarded_at["3"][at_day_by_day.length-1] = 1;
          if(N%6 == 0)
            reward_awarded_at["6"][at_day_by_day.length-1] = 1;
          if(N%12 == 0)
            reward_awarded_at["12"][at_day_by_day.length-1] = 1;
          if(N%18 == 0)
            reward_awarded_at["18"][at_day_by_day.length-1] = 1;
          if(N%30 == 0)
            reward_awarded_at["30"][at_day_by_day.length-1] = 1;

          if(isreal==true)//save if it is the real one.
            window.localStorage['reward_awarded_at'] = JSON.stringify(reward_awarded_at);
          return true;
        }
        else
          return false;
    }




    //////////////////////////////////////////////////////////////////////
    //show the reward for badges, weekly survey
    //////////////////////////////////////////////////////////////////////

    //$rootScope.weekly_survey_day_by_day = [];
    console.log("Badges: " + JSON.stringify($rootScope.badges['weekly']));
    if((added_points=='50' || added_points=='80')  && !$rootScope.rewardIsActiveTask){
        usage_stats_type = 'weekly';

        $scope.cards.push({name: "You earned 50 extra points for completing last weeks details", show: false, up:0, class: 'blue', img: "img/50points.png", show_image: true});

        console.log("weekly_survey_day_by_day 'isreal': " + isreal);
        if(isreal == true || $rootScope.weekly_survey_day_by_day == undefined){
            //var weekly_survey = JSON.parse(window.localStorage['weekly_survey_data'] || "{}");
            //console.log(JSON.stringify("weekly survey: " + JSON.stringify(weekly_survey)));

            //
            var cognito_data = JSON.parse(window.localStorage['cognito_data'] || "{}");
            var weekly_survey = cognito_data['survey_data']['weekly_survey'];


            last_date = moment().format('YYYYMMDD');
            first_date = moment().format('YYYYMMDD');
            for (var key in weekly_survey) {
                last_date = key;
            }
            for (var key in weekly_survey) {
                first_date = key;
                break;
            }
            //moment().startOf('week');
            //console.log("last date: " + moment().startOf('week').format('YYYYMMDD'));
            //console.log("Is real: " + isreal);


            flag = true;
            var current_date = first_date;
            var weekly_survey_day_by_day = [];
            console.log("Weekly Survey: " + JSON.stringify(weekly_survey));
            while(flag){
                if(current_date in weekly_survey){
                     console.log("Exist: " + current_date);
                     weekly_survey_day_by_day.push(1);
                }
                else{
                     console.log("Doesn't exist: " + current_date);
                     weekly_survey_day_by_day.push(0);
                }
                  
                if(parseInt(current_date) >= parseInt(last_date))
                     flag = false;

                current_date = moment(current_date, "YYYYMMDD").add(7, 'day').format('YYYYMMDD');
                //console.log("Current date: " + current_date);
            }
            console.log("Weekly surveys: " +  JSON.stringify(weekly_survey_day_by_day));

            //means it is false, and I got a weekly_survey_day_by_day, means we need add an extra 1.
            if(($rootScope.weekly_survey_day_by_day == undefined) && (isreal == false)){
                weekly_survey_day_by_day.push(1);
                //console.log("daily_survey_day_by_day 2: " + daily_survey_day_by_day);
            }
            $rootScope.weekly_survey_day_by_day = weekly_survey_day_by_day;
            console.log("weekly_survey_day_by_day 2: " + weekly_survey_day_by_day);
            //$rootScope.reward_awarded_daily = reward_awarded_daily;
        }else{
            if(isreal == false){ //means we have daily survey

                $rootScope.weekly_survey_day_by_day.push(1);
                           console.log("weekly_survey_day_by_day 3: " + $rootScope.weekly_survey_day_by_day);
            }
        }

        //count the streaks
        var total_weekly_surveys = 0;
        for(var i=0; i<$rootScope.weekly_survey_day_by_day.length; i++)
          total_weekly_surveys += $rootScope.weekly_survey_day_by_day[i];
        
        //
        if(total_weekly_surveys%4 == 1){
          monetary_reward += 0.25;
          $scope.showBadge = true;
          $scope.badge_img = "img/green_trophy.png";
          $scope.how_many_days = 1;
          $scope.how_much = "25 cents";
          $scope.cards.push({name: "You earned 25 cents for completing the 1st weekly surveys.", show: false, up:0, class: 'blue', img: "img/50cent.jpg", show_image: true});
          $scope.cards.push({name: "You also earned a saphire stone for completing the 1st weekly surveys.", show: false, up:0, class: 'blue', img: "img/green_trophy.png", show_image: true});
          $rootScope.badges['weekly_survey'][0] = 1;
        }

        if(total_weekly_surveys%4 == 2){
          monetary_reward += 0.5;
          $scope.showBadge = true;
          $scope.badge_img = "img/bronze_trophy.png";
          $scope.how_many_days = 2;
          $scope.how_much = "50 cents";
          $scope.cards.push({name: "You earned 50 cents for completing 2nd weekly surveys.", show: false, up:0, class: 'blue', img: "img/50cent.jpg", show_image: true});
          $scope.cards.push({name: "You also earned a jade stone for completing 2nd weekly surveys.", show: false, up:0, class: 'blue', img: "img/bronze_trophy.png", show_image: true});
          $rootScope.badges['weekly_survey'][1] = 1;
        }

        if(total_weekly_surveys%4 == 3){
          monetary_reward += 1;
          $scope.showBadge = true;
          $scope.badge_img = "img/silver_trophy.png";
          $scope.how_many_days = 3;
          $scope.how_much = "1 dollar";
          $scope.cards.push({name: "You earned 1 dollar for completing 3rd weekly surveys.", show: false, up:0, class: 'blue', img: "img/18_Rev.jpg", show_image: true});
          $scope.cards.push({name: "You also earned an emrald stone for completing 3rd weekly surveys.", show: false, up:0, class: 'blue', img: "img/silver_trophy.png", show_image: true});
          $rootScope.badges['weekly_survey'][2] = 1;
        }

        if(total_weekly_surveys%4 == 0){
          monetary_reward += 1.5;
          $scope.showBadge = true;
          $scope.badge_img = "img/gold_trophy.png";
          $scope.how_many_days = 4;
          $scope.how_much = "1.5 dollar";
          $scope.cards.push({name: "You earned 1.5 dollar for completing 4th weekly surveys.", show: false, up:0, class: 'blue', img: "img/18_Rev.jpg", show_image: true});
          $scope.cards.push({name: "You also earned a red beryl stone for completing 4th weekly surveys.", show: false, up:0, class: 'blue', img: "img/gold_trophy.png", show_image: true});
          $rootScope.badges['weekly_survey'][3] = 1;
        }

    }
    $rootScope.badges['money'] = monetary_reward;

    //
    if($routeParams.real=='true'){

        var rl_data = JSON.parse(window.localStorage['cognito_data']);
        rl_data['badges'] = $rootScope.badges;
        //rl_data['badges']['money'] = monetary_reward;
        rl_data['daily_streak'] = JSON.parse(window.localStorage['reward_awarded_daily'] || "{}");
        rl_data['at_streak']= JSON.parse(window.localStorage['reward_awarded_at'] || "{}");
        //saraDatafactory.storedata('rl_data',rl_data, moment().format('YYYYMMDD')); //sync now
        rl_data['lastupdate'] = new Date().getTime();
        window.localStorage['cognito_data'] = JSON.stringify(rl_data);

        //window.localStorage['badges'] = JSON.stringify($rootScope.badges);
        //saraDatafactory.storedata('badges', $rootScope.badges, moment().format('YYYYMMDD'));
    }

    //////////////////////////////////////////////////////////////////////
    //show the reward for money
    //////////////////////////////////////////////////////////////////////

    //adjust_css();

    var type_of_work = 'survey';
    if(added_points=='29' || $rootScope.rewardIsActiveTask)
      type_of_work = 'active tasks';

    function adjust_css(){

      var colors = ['blue','red','green','yellow','blue','red','green','yellow','blue','red','green'];
      var increment = 20;
      if($scope.cards.length > 0){
        $scope.cards[0].up = 10;
        $scope.cards[0].class = 'blue';
        //$scope.cards[0].name = "1. " + $scope.cards[0].name;
        $scope.cards[0].name = $scope.cards[0].name;
        $scope.cards[0].show = true;
      }

      for(var i=1; i < $scope.cards.length; i++){
          $scope.cards[i].up = $scope.cards[i-1].up + increment;
          $scope.cards[i].class = colors[i];
          //$scope.cards[i].name =  "" + (i+1) + ". " + $scope.cards[i].name;
          $scope.cards[i].name =  $scope.cards[i].name;
          $scope.cards[i].show = false;
      }

      //console.log(JSON.stringify($scope.cards));

      $scope.next_message = "Show the next reward ";// (1" +  "/" + $scope.cards.length + ")";
      if($scope.cards.length==1)
            $scope.next_message = "Go to aquarium ";

      //$scope.congrats_message = "Thanks for completing the " + type_of_work + ".<br>You have unlocked <b>" + $scope.cards.length + "</b> rewards <i class='em em-tada'></i>" 
      
      //
      $scope.type_of_work = type_of_work;
      $scope.number_of_rewards = $scope.cards.length;

      $scope.gift_msg = "Reward 1 of " + $scope.cards.length;
    }
    //$scope.cards[0].up = 10;
    //$scope.cards[1].up = $scope.cards[0].up + 30;
    //$scope.cards[2].up = $scope.cards[1].up + 30;
    //$scope.cards[3].up = $scope.cards[2].up + 30;

    var index  = 1;
    


    $scope.throwOut = function () {
        //var myElement = document.getElementsByTagName('li[swing-card]:last');
        //console.log(myElement);
        //myElement.addClass('animated rotateOutUpLeft');

        //this will work when animate is completed.
        //$timeout(function () {
        //    $scope.cards.splice(-1);
        //}, 400);

        var status = $scope.cards[index-1];
        status['index'] = index-1;
        saraDatafactory.copyUsageStats({'view':'rewards_'+usage_stats_type,'status':status});


         if(index == $scope.cards.length){
            $location.path("/");
            return;
         }



         
         $scope.cards[index].show = true;
         index = index + 1;

         if(index == $scope.cards.length){
            $scope.next_message = "Go to aquarium ";// (" + index +  "/" + $scope.cards.length + ")";
            $scope.gift_msg = "Reward " + index + " of " + $scope.cards.length;
         }
          else{
            $scope.next_message = "Show me next reward ";//(" + index  + "/" + $scope.cards.length + ")";
            $scope.gift_msg = "Reward " + index + " of " + $scope.cards.length;
          }
    };


    function sum(arr){
        var total=0;
        for(var i in arr){
          total += arr[i]; 
        }
        return total;
    }

    saraDatafactory.copyUsageStats({'view':'rewards_'+usage_stats_type,'status':'start'});
    $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        saraDatafactory.copyUsageStats({'view':'rewards_'+usage_stats_type,'status':'destroy'});
    });



});