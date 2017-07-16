app.controller("InspQuotesCtrl", function($scope, $http, $ionicPlatform, $location, $interval, $rootScope) {

    $scope.goHome = function() {
        $location.path("/");
    };

    //
    //-- extra = {"type": "engagement", "author": author, "message": quote, "image": engagement_data['img']}

    if($rootScope.insp_message == undefined){
        $rootScope.insp_message = {}
        $rootScope.insp_message["author"] = "2Pac";
        $rootScope.insp_message["message"] = "Quote";
        $rootScope.insp_message["image"] = "2pac.png";
    }

    $rootScope.insp_message["image"] = "img/engagementimages/" + $rootScope.insp_message["image"];
    //
    $scope.author = $rootScope.insp_message.author;
    $scope.message = $rootScope.insp_message.message;
    $scope.image = $rootScope.insp_message.image;

    //


});