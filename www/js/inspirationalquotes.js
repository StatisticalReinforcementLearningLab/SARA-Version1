app.controller("InspQuotesCtrl", function($scope, $http, $ionicPlatform, $location, $interval, $rootScope) {

    $scope.goHome = function() {
        $location.path("/main");
    };

    //
    //-- extra = {"type": "engagement", "author": author, "message": quote, "image": engagement_data['img']}

    //$rootScope.insp_message = 
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


    //
    /*
    var updates = {};
    updates[custom_data.url + '/isClicked' ] = 1;
    updates[custom_data.url + '/whenClickedReadableTs' ] = moment().format("YYYY-MM-DD H:mm:ss a ZZ");
    updates[custom_data.url + '/whenClickedTs' ] = Date.now();
    //updates['/iOS/HistoryRegToken/' + newPostKey] = data;
    firebase.database().ref().update(updates);
    */


    $scope.isLiked = function() {

        //is liked
        var updates = {};
        updates[$rootScope.insp_message.url + '/isLiked' ] = 1;
        updates[$rootScope.insp_message.url + '/whenRatedReadableTs' ] = moment().format("YYYY-MM-DD H:mm:ss a ZZ");
        updates[$rootScope.insp_message.url + '/whenRatedTs' ] = Date.now();
        //updates['/iOS/HistoryRegToken/' + newPostKey] = data;
        firebase.database().ref().update(updates);
        $location.path("/main");

    };


    $scope.isNotLiked = function() {

        //is liked
        var updates = {};
        updates[$rootScope.insp_message.url + '/isLiked' ] = -1;
        updates[$rootScope.insp_message.url + '/whenRatedReadableTs' ] = moment().format("YYYY-MM-DD H:mm:ss a ZZ");
        updates[$rootScope.insp_message.url + '/whenRatedTs' ] = Date.now();
        //updates['/iOS/HistoryRegToken/' + newPostKey] = data;
        firebase.database().ref().update(updates);
        $location.path("/main");
        
    };


});