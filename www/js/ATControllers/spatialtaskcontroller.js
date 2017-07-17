app.controller("SpatialTaskCtrl", function($scope, $http, $ionicPlatform, $location, $interval, $rootScope, saraDatafactory) {

    var counter = 0;

    $scope.goHome = function() {
        $location.path("/");
    };

    saraDatafactory.copyUsageStats({'view':'SpatialTaskCtrl','status':'start'});
    $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        saraDatafactory.copyUsageStats({'view':'SpatialTaskCtrl','status':'destroy'});
    });

    var deregisterSecond = $ionicPlatform.registerBackButtonAction(
      function() {
        //$location.path("/");
        navigator.app.backHistory();
      }, 100
    );
    $scope.$on('$destroy', deregisterSecond);


    $scope.images = [];
    for(var i=0; i<9; i++)
        $scope.images[i] = 'img/greyspt.png';

    var promise = $interval(falshcounter, 1000);
    $rootScope.image_sequence = [];
    function falshcounter() {
        counter = counter + 1;

        if(counter<=5){
            //change the flashing
            $rootScope.image_sequence[counter-1] = getRandomInt(0,8);
            $scope.images[$rootScope.image_sequence[counter-1]] = 'img/bluespt.png';

            if(counter > 1)
                $scope.images[$rootScope.image_sequence[counter-2]] = 'img/greyspt.png';
        }

        if(counter==6){
            $interval.cancel(promise);
            $location.path("/spatialtask2");
        }

        console.log($rootScope.image_sequence);
    }

    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
    */
    function getRandomInt(min, max) {
        var random_number = Math.floor(Math.random() * (max - min + 1)) + min;
        while(true){
            var isInArrayAlready = false;
            for(var i=0; i < $rootScope.image_sequence.length; i++)
                if($rootScope.image_sequence[i] == random_number)
                    isInArrayAlready = true;

            if(isInArrayAlready==true)
                random_number = Math.floor(Math.random() * (max - min + 1)) + min;
            else
                break;
        }
        return random_number;
    }

});


app.controller("SpatialTask2Ctrl", function($scope, $http, $ionicPlatform, $location, $interval, $rootScope, saraDatafactory) {

    $scope.goHome = function() {
        $location.path("/");
    };

    saraDatafactory.copyUsageStats({'view':'SpatialTask2Ctrl','status':'start'});
    $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        saraDatafactory.copyUsageStats({'view':'SpatialTask2Ctrl','status':'destroy'});
    });

    var deregisterSecond = $ionicPlatform.registerBackButtonAction(
      function() {
        //$location.path("/");
        navigator.app.backHistory();
      }, 100
    );
    $scope.$on('$destroy', deregisterSecond);


    $scope.goHome2 = function() {
        //
        //var active_tasks_survey_data = JSON.parse(window.localStorage['active_tasks_survey'] || "{}");
        //active_tasks_survey_data[moment().format('YYYYMMDD')] = 2;
        //window.localStorage['active_tasks_survey'] = JSON.stringify(active_tasks_survey_data);
        var spatial_data = {};
        spatial_data['ts'] = new Date().getTime();
        spatial_data['readableTs'] = moment().format('MMMM Do YYYY, h:mm:ss a ZZ');
        spatial_data['type'] = "spatial";
        spatial_data['isCorrect'] = "incorrect";
        spatial_data['sequence'] = JSON.stringify(image_sequence);

        var at_data = JSON.parse(window.localStorage['activetasks_data_today'] || '[]');
        at_data.push(spatial_data);
        window.localStorage['activetasks_data_today'] = JSON.stringify(at_data);


        $location.path("/activetaskscompleted");
    };

    $scope.goSpatialTask = function() {
        $location.path("/spatialtask");
    };

    $scope.images = [];
    for(var i=0; i<9; i++)
        $scope.images[i] = 'img/greyspt.png';
    //$scope.images[1] = 'img/greyspt.png';
    //$scope.images[4] = 'img/greyspt.png';
    //$scope.images[6] = 'img/greyspt.png';

    var image_sequence = $rootScope.image_sequence;
    var counter = 0;
    $scope.isCorrect = true;
    $scope.allCorrect = false;
    $scope.isFinished = false;
    var promise;
    var start_time = Date.now();
    var end_time = Date.now();
    $scope.tapindex = function(index) {
        //console.log($rootScope.image_sequence);
        //console.log(index);

        if(image_sequence[counter] == index)
            $scope.images[index] = 'img/bluespt.png';
        else{
            $scope.images[index] = 'img/redspt.png';
            $scope.isCorrect = false;
            $scope.isFinished = true;
        }

        counter = counter + 1;
        end_time = Date.now();


        //console.log("" + counter + ", " + $scope.isCorrect)
        if((counter==5) && ($scope.isCorrect==true)){
            //$location.path("/");
            $scope.allCorrect = true;
            //$scope.isFinished = true;
            promise = $interval(falshcounter, 2000);

            if(ionic.Platform.isIOS()){
                var rl_data = JSON.parse(window.localStorage['cognito_data']);
                if(rl_data.hasOwnProperty('life-insights')){
                }else{
                    rl_data['life-insights'] = {};
                    rl_data['life-insights']['daily_survey'] = {};
                    rl_data['life-insights']['at_sp'] = {};
                    rl_data['life-insights']['at_tap'] = {};
                }
                rl_data['life-insights']['at_sp'][moment().format('YYYYMMDD')] = end_time-start_time;
                //save to cognito
                saraDatafactory.storedata('rl_data',rl_data, moment().format('YYYYMMDD'));
                window.localStorage['cognito_data'] = JSON.stringify(rl_data);
            }


            var spatial_data = {};
            spatial_data['ts'] = new Date().getTime();
            spatial_data['readableTs'] = moment().format('MMMM Do YYYY, h:mm:ss a ZZ');
            spatial_data['type'] = "spatial";
            spatial_data['isCorrect'] = "correct";
            spatial_data['sequence'] = JSON.stringify(image_sequence);

            var at_data = JSON.parse(window.localStorage['activetasks_data_today'] || '[]');
            at_data.push(spatial_data);
            window.localStorage['activetasks_data_today'] = JSON.stringify(at_data);
        }
        function falshcounter() {
            //
            var active_tasks_survey_data = JSON.parse(window.localStorage['active_tasks_survey'] || "{}");
            active_tasks_survey_data[moment().format('YYYYMMDD')] = 2;
            window.localStorage['active_tasks_survey'] = JSON.stringify(active_tasks_survey_data);

            $location.path("/activetaskscompleted");
            $interval.cancel(promise);
        }


    }

});


app.controller("SpatialTaskStep1Ctrl", function($scope, $http, $ionicPlatform, $location, $interval, saraDatafactory) {
    //
    $scope.goHome = function() {
        $location.path("/");
    };
    $scope.goStep2 = function() {
        $location.path("/spatialtaskStep2");
    };

    saraDatafactory.copyUsageStats({'view':'SpatialTaskStep1Ctrl','status':'start'});
    $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        saraDatafactory.copyUsageStats({'view':'SpatialTaskStep1Ctrl','status':'destroy'});
    });

    var deregisterSecond = $ionicPlatform.registerBackButtonAction(
      function() {
        //$location.path("/");
        navigator.app.backHistory();
      }, 100
    );
    $scope.$on('$destroy', deregisterSecond);
});


app.controller("SpatialTaskStep2Ctrl", function($scope, $http, $ionicPlatform, $location, $interval, saraDatafactory) {
    //
    $scope.goHome = function() {
        $location.path("/");
    };
    $scope.goStep2 = function() {
        $location.path("/spatialtask");
    };

    saraDatafactory.copyUsageStats({'view':'SpatialTaskStep2Ctrl','status':'start'});
    $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        saraDatafactory.copyUsageStats({'view':'SpatialTaskStep2Ctrl','status':'destroy'});
    });

    var deregisterSecond = $ionicPlatform.registerBackButtonAction(
      function() {
        //$location.path("/");
        navigator.app.backHistory();
      }, 100
    );
    $scope.$on('$destroy', deregisterSecond);


});


app.controller("ActiveTasksCompletedCtrl", function($scope, $http, $ionicPlatform, $location, $interval, saraDatafactory) {
    //
    $scope.goHome = function() {
        $location.path("/");
    };

    saraDatafactory.copyUsageStats({'view':'ActiveTasksCompletedCtrl','status':'start'});
    $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        saraDatafactory.copyUsageStats({'view':'ActiveTasksCompletedCtrl','status':'destroy'});
    });

    var deregisterSecond = $ionicPlatform.registerBackButtonAction(
      function() {
        //$location.path("/");
        navigator.app.backHistory();
      }, 100
    );
    $scope.$on('$destroy', deregisterSecond);


    $scope.goStep2 = function() {
        //
        //var active_tasks_survey_data = JSON.parse(window.localStorage['active_tasks_survey'] || "{}");
        //active_tasks_survey_data[moment().format('YYYYMMDD')] = 2;
        //window.localStorage['active_tasks_survey'] = JSON.stringify(active_tasks_survey_data);

        //$location.path("/main");
        /*
        $scope.$broadcast('game:addscore', {
                state: 29,
                isReal: true
            });
        }
        */
        $scope.survey = JSON.parse(window.localStorage['activetasks_data_today'] || '[]');
        saraDatafactory.copyJSONToFile($scope.survey, 'active_task');


        var rl_data = JSON.parse(window.localStorage['cognito_data']);
        rl_data['survey_data']['active_tasks_survey'][moment().format('YYYYMMDD')] = 2;
        window.localStorage['cognito_data'] = JSON.stringify(rl_data);
        saraDatafactory.storedata('rl_data',rl_data, moment().format('YYYYMMDD'));

        $location.path("/reward/29/true");
    };
});
