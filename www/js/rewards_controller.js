app.controller("RewardsCtrl", function($scope, $location,$cordovaStatusbar,$rootScope,$routeParams,$http,saraDatafactory) {
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


    //
    //$rootScope.total_score = 320;
    console.log("current score: " + $rootScope.total_score);

    //
    var added_points = $routeParams.added;
    console.log("added: " + added_points);

    //
    $scope.added_fish_points = added_points;

    //all badges
    var badges = JSON.parse(window.localStorage['badges'] || "{}");
    if(!('weekly' in badges)){ //means things are empty.
        badges['daily_survey'] = [0,0,0,0,0,0];
        badges['weekly_survey'] = [0,0,0,0];
        badges['active_tasks'] = [0,0,0,0,0,0];
        badges['money'] = 0;

        if($routeParams.real=='true')
            window.localStorage['badges'] = JSON.stringify(badges);
    }
    if($rootScope.badges==undefined) //undefined means we need gate from another place.
      $rootScope.badges = badges;



    $http.get('js/fishpoints.json').success(function(data) {
      //console.log("Fishes: " + data);

      //contents
      
      var survey_string = "";
      $scope.images = [];
      $scope.fish_names = "";
      added_points = parseInt(added_points);
      $rootScope.total_score = parseInt($rootScope.total_score);

      for(var i = 0; i < data.length; i++) {
          if((data[i].points > ($rootScope.total_score - added_points)) && (data[i].points <= $rootScope.total_score)){

                //console.log("" + data[i].points + "," + $rootScope.total_score + "," + added_points + "," + (data[i].points > $rootScope.total_score) + "," + ($rootScope.total_score + added_points));
                data[i].img = data[i].img.substring(0, data[i].img.length-4) + '_tn.jpg';
                $scope.images.push(data[i].img);
                $scope.fish_names = "Congratulations "+ data[i].name.valueOf() + " has been unlocked.";
                                                                                                                                                                                                                                           
                if("trivia" in data[i])
                    $scope.trivia_text = data[i].trivia.valueOf();
                else
                    $scope.trivia_text =  'Fun facts'; 

                $scope.cards.push({name: $scope.fish_names, show: true, up:0, class: 'blue', img: data[i].img, show_image: true});
                $scope.cards.push({name: $scope.trivia_text, show: true, up:0, class: 'blue', img: data[i].img, show_image: true});
          }
      }
      console.log($scope.images);

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


      //console.log("Fishes: " + JSON.stringify($scope.pointsdata));
      //$scope.$apply();

      var isreal2 = $routeParams.real=='true';
        if(isreal2 == true){
          //This will force a reload
          //+= parseInt(added_points);
          $rootScope.total_score = undefined; 
      }

      //$scope.$apply();
      //call to adjust color.
      adjust_css();

    });


    

    //////////////////////////////////////////////////////////////////////
    //show the reward for badges, daily survey
    //////////////////////////////////////////////////////////////////////
    var isreal = $routeParams.real=='true';
    if(added_points=='30' && !$rootScope.rewardIsActiveTask){
        var daily_survey_day_by_day = [];
        var reward_awarded_daily = {};

        //this is the streak data
        //
        //daily_survey_day_by_day = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1];
        reward_awarded_daily = JSON.parse(window.localStorage['reward_awarded_daily'] || "{}");

        //if nothhing is there then initialize.
        if(Object.keys(reward_awarded_daily).length === 0){
            reward_awarded_daily["30"] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            reward_awarded_daily["18"] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            reward_awarded_daily["12"] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            reward_awarded_daily["6"] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            reward_awarded_daily["3"] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            window.localStorage['reward_awarded_daily'] = JSON.stringify(reward_awarded_daily);
        }

        //
        console.log("reward_awarded_daily, " + JSON.stringify(reward_awarded_daily));

        //
        //console.log(moment(key, "YYYYMMDD").add(1, 'day').format('YYYYMMDD'));
        $scope.cards.push({name: "You earned 30 points for completing the daily survey", show: false, up:0, class: 'blue', img: "img/gold.png", show_image: false});

        if(isreal == true || $rootScope.daily_survey_day_by_day == undefined){
            var daily_survey = JSON.parse(window.localStorage['daily_survey_data'] || "{}");
            //console.log(JSON.stringify(daily_survey));
            //scope.total_daily_surveys = 0;
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

        }else{
            if(isreal == false && added_points=='30'){ //means we have daily survey
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
        var monetary_reward = 0;
        if(isNDayStreak(daily_survey_day_by_day,reward_awarded_daily,30,isreal)){
          monetary_reward = 4;
          $scope.showBadge = true;
          $scope.badge_img = "img/gold.png";
          $scope.how_many_days = 30;
          $scope.how_much = "4 dollars";
          $scope.cards.push({name: "You earned 4 dollars for completing surveys 30 days in a row.", show: false, up:0, class: 'blue', img: "img/gold.png", show_image: true});
          $rootScope.badges['daily_survey'][5] += 1;
        }else{
           if(isNDayStreak(daily_survey_day_by_day,reward_awarded_daily,18,isreal)){
              monetary_reward = 3;
              $scope.showBadge = true;
              $scope.badge_img = "img/silver.png";
              $scope.how_many_days = 18;
              $scope.how_much = "3 dollars";
              $scope.cards.push({name: "You earned 3 dollars for completing surveys 18 days in a row.", show: false, up:0, class: 'blue', img: "img/silver.png", show_image: true});
              $rootScope.badges['daily_survey'][4] += 1;
           }else{
              if(isNDayStreak(daily_survey_day_by_day,reward_awarded_daily,12,isreal)){
                monetary_reward = 2;
                $scope.showBadge = true;
                $scope.badge_img = "img/bronze.png";
                $scope.how_many_days = 12;
                $scope.how_much = "2 dollars";
                $scope.cards.push({name: "You earned of 2 dollars for completing surveys 12 days in a row.", show: false, up:0, class: 'blue', img: "img/bronze.png", show_image: true});
                $rootScope.badges['daily_survey'][3] += 1;
              }else{
                  if(isNDayStreak(daily_survey_day_by_day,reward_awarded_daily,6,isreal)){
                    monetary_reward = 1;
                    $scope.showBadge = true;
                    $scope.badge_img = "img/blue.png";
                    $scope.how_many_days = 6;
                    $scope.how_much = "1 dollar";
                    $scope.cards.push({name: "You earned 1 dollar for completing surveys 6 days in a row.", show: false, up:0, class: 'blue', img: "img/blue.png", show_image: true});
                    $rootScope.badges['daily_survey'][1] += 1;
                  }else{
                      if(isNDayStreak(daily_survey_day_by_day,reward_awarded_daily,3,isreal)){
                        monetary_reward = 0.5;
                        $scope.showBadge = true;
                        $scope.badge_img = "img/green.png";
                        $scope.how_many_days = 3;
                        $scope.how_much = "50 cents";
                        $scope.cards.push({name: "You earned 50 cents for completing surveys 3 days in a row.", show: false, up:0, class: 'blue', img: "img/green.png", show_image: true});
                        $rootScope.badges['daily_survey'][0] += 1;
                      }
                  }
              }
           }
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
    if(added_points=='15'  || $rootScope.rewardIsActiveTask){
        $rootScope.rewardIsActiveTask = false;
        $scope.cards.push({name: "You earned " + added_points + " points for completing the active task(s).", show: false, up:0, class: 'blue', img: "img/gold.png", show_image: false});

        //
        
    }




    //////////////////////////////////////////////////////////////////////
    //show the reward for badges, weekly survey
    //////////////////////////////////////////////////////////////////////

    //$rootScope.weekly_survey_day_by_day = [];
    console.log("Badges: " + JSON.stringify($rootScope.badges['weekly']));
    if(added_points=='50'  && !$rootScope.rewardIsActiveTask){

        $scope.cards.push({name: "You earned 50 points for completing the weekly survey", show: false, up:0, class: 'blue', img: "img/gold.png", show_image: false});

        console.log("weekly_survey_day_by_day 'isreal': " + isreal);
        if(isreal == true || $rootScope.weekly_survey_day_by_day == undefined){
            var weekly_survey = JSON.parse(window.localStorage['weekly_survey_data'] || "{}");
            console.log(JSON.stringify("Weekly survey: " + JSON.stringify(weekly_survey)));

            last_date = '';
            first_date = '';
            for (var key in weekly_survey) {
                    last_date = key;
            }
            for (var key in weekly_survey) {
                    first_date = key;
                    break;
            }
            //moment().startOf('week');
            console.log("last date: " + moment().startOf('week').format('YYYYMMDD'));
            //console.log("Is real: " + isreal);


            flag = true;
            var current_date = first_date;
            var weekly_survey_day_by_day = [];
            while(flag){
                if(current_date in weekly_survey){
                     console.log("Exist: " + current_date);
                     weekly_survey_day_by_day.push(1);
                }
                else{
                     console.log("Doesn't exist: " + current_date);
                     weekly_survey_day_by_day.push(0);
                }
                  
                if(current_date === last_date)
                     flag = false;

                current_date = moment(current_date, "YYYYMMDD").add(7, 'day').format('YYYYMMDD');
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
        if(total_weekly_surveys == 1){
          monetary_reward = 0.5;
          $scope.showBadge = true;
          $scope.badge_img = "img/green_trophy.png";
          $scope.how_many_days = 1;
          $scope.how_much = "50 cents";
          $scope.cards.push({name: "You unlocked daily step count for completing your first weekly survey.", show: false, up:0, class: 'blue', img: "img/green_trophy.png", show_image: true});
          $rootScope.badges['weekly_survey'][0] = 1;
        }

        if(total_weekly_surveys == 2){
          monetary_reward = 1;
          $scope.showBadge = true;
          $scope.badge_img = "img/bronze_trophy.png";
          $scope.how_many_days = 2;
          $scope.how_much = "1 dollar";
          $scope.cards.push({name: "You earned 1 dollars for completing two weekly surveys.", show: false, up:0, class: 'blue', img: "img/bronze_trophy.png", show_image: true});
          $rootScope.badges['weekly_survey'][1] = 1;
        }

        if(total_weekly_surveys == 3){
          monetary_reward = 2;
          $scope.showBadge = true;
          $scope.badge_img = "img/silver_trophy.png";
          $scope.how_many_days = 3;
          $scope.how_much = "2 dollars";
          $scope.cards.push({name: "You earned 2 dollars for completing three weekly surveys.", show: false, up:0, class: 'blue', img: "img/silver_trophy.png", show_image: true});
          $rootScope.badges['weekly_survey'][2] = 1;
        }

        if(total_weekly_surveys == 4){
          monetary_reward = 3;
          $scope.showBadge = true;
          $scope.badge_img = "img/gold_trophy.png";
          $scope.how_many_days = 4;
          $scope.how_much = "3 dollars";
          $scope.cards.push({name: "You earned 3 dollars for completing three weekly surveys.", show: false, up:0, class: 'blue', img: "img/gold_trophy.png", show_image: true});
          $rootScope.badges['weekly_survey'][3] = 1;
        }

    }


    //
    if($routeParams.real=='true'){
        window.localStorage['badges'] = JSON.stringify($rootScope.badges);
        //saraDatafactory.storedata('badges', $rootScope.badges, moment().format('YYYYMMDD'));
    }

    //////////////////////////////////////////////////////////////////////
    //show the reward for money
    //////////////////////////////////////////////////////////////////////

    

    adjust_css();

    function adjust_css(){

      var colors = ['blue','red','green','yellow','blue','red','green','yellow'];
      var increment = 20;
      if($scope.cards.length > 0){
        $scope.cards[0].up = 10;
        $scope.cards[0].class = 'blue';
        $scope.cards[0].show = true;
      }

      for(var i=1; i < $scope.cards.length; i++){
          $scope.cards[i].up = $scope.cards[i-1].up + increment;
          $scope.cards[i].class = colors[i];
          $scope.cards[i].show = false;
      }

      console.log(JSON.stringify($scope.cards));

      $scope.next_message = "Show the next reward ";// (1" +  "/" + $scope.cards.length + ")";

      $scope.congrats_message = "Thanks for completing the survey. You have unlocked " + $scope.cards.length + " gifts."
      $scope.gift_msg = "Gift 1 of " + $scope.cards.length;
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

         if(index == $scope.cards.length){
            $location.path("/");
            return;
         }

         $scope.cards[index].show = true;
         index = index + 1;

         if(index == $scope.cards.length){
            $scope.next_message = "Go to aquarium ";// (" + index +  "/" + $scope.cards.length + ")";
            $scope.gift_msg = "Gift " + index + " of " + $scope.cards.length;
         }
          else{
            $scope.next_message = "Show me next reward ";//(" + index  + "/" + $scope.cards.length + ")";
            $scope.gift_msg = "Gift " + index + " of " + $scope.cards.length;
          }
    };


    function sum(arr){
        var total=0;
        for(var i in arr){
          total += arr[i]; 
        }
        return total;
    }





});