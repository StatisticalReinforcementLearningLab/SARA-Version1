app.config(function($routeProvider) {
  $routeProvider
  .when("/red", {
     templateUrl : "templates/main.html",
     controller : "MainCtrl"
     //templateUrl : "templates/survey.html",
     //controller : "SurveyCtrl"
            //templateUrl : "templates/recall.html",
            //controller : "RecallCtrl"
   })
  .when("/", {
    templateUrl : "templates/survey.html",
    controller : "DailySurveyCtrl"
  })
  .when("/weekly", {
    templateUrl : "templates/survey.html",
    controller : "WeeklySurveyCtrl"
  })
  .when("/red", {
    templateUrl : "templates/red.html",
    controller : "RedCtrl"
  });
});



