app.controller("TappingTaskCtrl", function($scope, $http, $ionicPlatform, $location, $interval, saraDatafactory) {

    //var data = sinAndCos();
    //console.log(JSON.stringify(data));
    //load the questions

    $scope.seconds = 10;
    $scope.tapcount = 0;
    var isFinished = false;
    var counter = 0;

    $scope.gifimage = "img/Tap1.gif";
    $scope.goHome = function() {
        $location.path("/");
    };

    saraDatafactory.copyUsageStats({'view':'TappingTaskCtrl','status':'start'});
    $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        saraDatafactory.copyUsageStats({'view':'TappingTaskCtrl','status':'destroy'});
    });

    var deregisterSecond = $ionicPlatform.registerBackButtonAction(
      function() {
        //$location.path("/");
        navigator.app.backHistory();
      }, 100
    );
    $scope.$on('$destroy', deregisterSecond);


    var tap_data_left = [];
    var tap_data_right = [];
    $scope.leftTapped = function() {
        if(isFinished == false){
            $scope.tapcount = $scope.tapcount + 1;
            tap_data_left.push(new Date().getTime());
            change_image($scope.tapcount);
        }
    };

    $scope.rightTapped = function() {
        if(isFinished == false){
            $scope.tapcount = $scope.tapcount + 1;
            tap_data_right.push(new Date().getTime());
            change_image($scope.tapcount);
        }
    };

    function change_image(tapcount){
        if(tapcount>=20 && tapcount<40)
            $scope.gifimage = "img/Tap2.gif";
        if(tapcount>=40 && tapcount<60)
            $scope.gifimage = "img/Tap3.gif";
        if(tapcount>=60 && tapcount<80)
            $scope.gifimage = "img/Tap4.gif";
        if(tapcount>=80 && tapcount<100)
            $scope.gifimage = "img/Tap5.gif";
        if(tapcount>=100)
            $scope.gifimage = "img/Tap6.gif";

    }

    $scope.addAT = function() {

        //
        var active_tasks_survey_data = JSON.parse(window.localStorage['active_tasks_survey'] || "{}");
        active_tasks_survey_data[moment().format('YYYYMMDD')] = 2;
        window.localStorage['active_tasks_survey'] = JSON.stringify(active_tasks_survey_data);

        $location.path("/");
    };

    var promise = $interval(decreaseCounter, 1000);
    function decreaseCounter() {
        counter = counter + 1;

        if($scope.seconds > 0)
            $scope.seconds = $scope.seconds - 1;
        else{
            $scope.seconds = "Finished";
            isFinished = true;

            if(counter==11){
                  //if(ionic.Platform.isIOS()){
                      var rl_data = JSON.parse(window.localStorage['cognito_data']);
                      if(rl_data.hasOwnProperty('life-insights')){
                      }else{
                          rl_data['life-insights'] = {};
                          rl_data['life-insights']['daily_survey'] = {};
                          rl_data['life-insights']['at_sp'] = {};
                          rl_data['life-insights']['at_tap'] = {};
                      }
                      rl_data['life-insights']['at_tap'][moment().format('YYYYMMDD')] = $scope.tapcount;
                      //save to cognito
                      //saraDatafactory.storedata('rl_data',rl_data, moment().format('YYYYMMDD'));
                      rl_data['lastupdate'] = new Date().getTime();
                      window.localStorage['cognito_data'] = JSON.stringify(rl_data);
                  //}
            }

            if(counter == 13){

                var tapping_data = {};
                tapping_data['ts'] = new Date().getTime();
                tapping_data['readableTs'] = moment().format('MMMM Do YYYY, h:mm:ss a ZZ');
                tapping_data['type'] = "tapping";
                tapping_data['left'] = tap_data_left;
                tapping_data['right'] = tap_data_right;

                var at_data = JSON.parse(window.localStorage['activetasks_data_today'] || '[]');
                at_data.push(tapping_data);
                window.localStorage['activetasks_data_today'] = JSON.stringify(at_data);


                $interval.cancel(promise);
                //$location.path("/activetasks");
                $location.path("/spatialtaskStep1");
            }
        }
    }

});



app.controller("TappingTaskStep1Ctrl", function($scope, $http, $ionicPlatform, $location, $interval, saraDatafactory, saraDatafactory) {
    //
    $scope.goHome = function() {
        $location.path("/");
    };
    $scope.goStep2 = function() {
        $location.path("/tappingtaskStep2");
    };

    saraDatafactory.copyUsageStats({'view':'TappingTaskStep1Ctrl','status':'start'});
    $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        saraDatafactory.copyUsageStats({'view':'TappingTaskStep1Ctrl','status':'destroy'});
    });

    var deregisterSecond = $ionicPlatform.registerBackButtonAction(
      function() {
        //$location.path("/");
        navigator.app.backHistory();
      }, 100
    );
    $scope.$on('$destroy', deregisterSecond);


    window.localStorage['activetasks_data_today'] = '[]';


});


app.controller("TappingTaskStep2Ctrl", function($scope, $http, $ionicPlatform, $location, $interval, saraDatafactory) {
    //
    $scope.goHome = function() {
        $location.path("/");
    };
    $scope.goStep2 = function() {
        $location.path("/tappingtask");
    };


    saraDatafactory.copyUsageStats({'view':'TappingTaskStep2Ctrl','status':'start'});
    $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        saraDatafactory.copyUsageStats({'view':'TappingTaskStep2Ctrl','status':'destroy'});
    });

    var deregisterSecond = $ionicPlatform.registerBackButtonAction(
      function() {
        //$location.path("/");
        navigator.app.backHistory();
      }, 100
    );
    $scope.$on('$destroy', deregisterSecond);


});