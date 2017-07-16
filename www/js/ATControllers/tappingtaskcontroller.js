app.controller("TappingTaskCtrl", function($scope, $http, $ionicPlatform, $location, $interval, saraDatafactory) {

    //var data = sinAndCos();
    //console.log(JSON.stringify(data));
    //load the questions

    $scope.seconds = 10;
    $scope.tapcount = 0;
    var isFinished = false;
    var counter = 0;

    $scope.goHome = function() {
        $location.path("/");
    };

    $scope.leftTapped = function() {
        if(isFinished == false)
            $scope.tapcount = $scope.tapcount + 1;
    };

    $scope.rightTapped = function() {
        if(isFinished == false)
            $scope.tapcount = $scope.tapcount + 1;
    };

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
                  if(ionic.Platform.isIOS()){
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
                      window.localStorage['cognito_data'] = JSON.stringify(rl_data);
                  }
            }

            if(counter == 13){
                $interval.cancel(promise);
                //$location.path("/activetasks");
                $location.path("/spatialtaskStep1");
            }
        }
    }

});



app.controller("TappingTaskStep1Ctrl", function($scope, $http, $ionicPlatform, $location, $interval) {
    //
    $scope.goHome = function() {
        $location.path("/");
    };
    $scope.goStep2 = function() {
        $location.path("/tappingtaskStep2");
    };
});


app.controller("TappingTaskStep2Ctrl", function($scope, $http, $ionicPlatform, $location, $interval) {
    //
    $scope.goHome = function() {
        $location.path("/");
    };
    $scope.goStep2 = function() {
        $location.path("/tappingtask");
    };
});