app.controller("LifeInsightsCtrl", function($scope, $http, $location, $cordovaStatusbar, $timeout, awsCognitoSyncFactory, awsCognitoIdentityFactory, $ionicHistory, $state, $ionicLoading, saraDatafactory, NgMap) {
    
    //Show a graph
    var data_overlays = [];

    //
    var questions = ["Q1d","Q3d","Q4d","Q5d","Q6d"];// ,"Q7d"];
    var qimgs = ["img/stress.png","img/freetime.png","img/dance2.png","img/social.png","img/exciting.png"];
    var lifeInsightsTitle = ["Daily <b>stress</b> levels", "<b>Free hours</b> each day", "Level of <b>fun</b> each day", 
                "Degree of <b>loneliness</b>", "How <b>exciting</b> were your days?"];

    var qYaxis = ["Stress level","Hours free","Level of fun","Degree of loneliness","Level of exicitement"];        
    var qSubText = ["0 = low stress, 4 = high stress", 
                    "Hours of free time everyday",
                    "0 = low fun, 4 = a lot of fun",
                    "0 = very social, 4 = very lonely",
                    "0 = low excitment, 4 = very exciting"];   

    //
    $scope.lifeinsights = [];

    //----------------------------------------
    //-- Daily insights questions
    //----------------------------------------
    saraDatafactory.loadLifeInsightsData(function(returnValue) {
        if (returnValue == null) {
            $http.get('js/lifeinsights.json').success(function(data2) {
                generateDailySurveyInsights(data2);
            });
        } else {
            generateDailySurveyInsights(JSON.parse(returnValue));
        }
    });


    function generateDailySurveyInsights(data2){

            //
            //console.log("json content: " + JSON.stringify(sdcard_data));
            //data2 = JSON.parse();
            //}
            //});
            //$http.get('js/lifeinsights.json').success(function(data2) {

            //console.log(JSON.stringify(data2["Q1d"]));
            //console.log(JSON.stringify(data2["Q1d"]['dates']));
            //console.log(JSON.stringify(data2["Q1d"]['data']));

            for(var i=0; i < questions.length; i++){

                var dates = JSON.parse(data2[questions[i]]['dates']);
                var data = JSON.parse(data2[questions[i]]['data']);

                //
                var total_data = 0;
                for(var j=0; j < dates.length; j++){
                    if(data[j] != -1)
                        total_data++;

                    //if(j==1)
                    //    break;
                }

                //console.log("" + dates.length);
                for(var j=0; j < dates.length; j++){
                    if(data[j] != -1){
                        //
                        if(questions[i] == "Q3d")
                            data[j] = data[j]/60;
                        //if(questions[i] == "Q5d")
                        //    data[j] = 4-data[j];

                        data_overlays.unshift([total_data - j, data[j]]);
                    }
                    //if(j==1)
                    //   break;
                }


                //
                var lin = loadviz(data_overlays, questions[i], qYaxis[i]);
                lin.title = lifeInsightsTitle[i];
                lin.img = qimgs[i];
                lin.subtext = qSubText[i];
                //console.log(JSON.stringify(lin))
                $scope.lifeinsights.push(lin);
                data_overlays = [];
                //break;
            }
    }


    //----------------------------------------
    //-- Steps and locations
    //----------------------------------------
    saraDatafactory.loadLifeInsightsLocStepsData(function(returnValue) {
        if (returnValue == null) {
            $http.get('js/lifeinsightsLOCSTEPS.json').success(function(data2) {
                loadLocationStepCount(data2);
            });
        } else {
            loadLocationStepCount(JSON.parse(returnValue));
        }
    });
    
    //$http.get('js/lifeinsightsLOCSTEPS.json').success(function(data2) {
    //    loadLocationStepCount(data2);
    //});


    //locations
    function loadLocationStepCount(data2){
        //generateDailySurveyInsights(data2);
        //console.log("json content: " + JSON.stringify(data2));
        var stepsPerHour = JSON.parse(data2['steps']);
        //console.log("json content: " + JSON.stringify(stepsPerHour));

        //steps
        var data_overlays = [];
        for(var j=0; j < stepsPerHour.length; j++){
            data_overlays.push([j,stepsPerHour[j]]);
        }
        var data_size = data_overlays.length;
        //console.log("" + data_size);
        //console.log("" + JSON.stringify(data_overlays));

        //$scope.data = [];
        var options = {
            chart: {
                type: 'historicalBarChart',
                height: 250,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 65,
                    left: 48
                },
                x: function(d) {
                    return d[0];
                },
                y: function(d) {
                    return d[1];
                },
                showValues: true,
                showLegend: false,
                valueFormat: function(d) {  
                    return d; //d3.format(',.1f')(d);
                },
                color: ["#00796B"],
                duration: 100,
                xAxis: {
                    axisLabel: 'hours in a day',
                    tickFormat: function(d) {
                        if (d == 0)
                            return "12AM";
                        if (d == 5)
                            return "5AM";
                        if (d == 10)
                            return "10AM";
                        if (d == 15)
                            return "3PM";
                        if (d == 18)
                            return "6PM";
                        if (d == 20)
                            return "8PM";
                        else
                            return d; //d3.time.format('%x')(new Date(d))
                    },
                    ticks: 4,
                    rotateLabels: 0,
                    axisLabelDistance: 0,
                    showMaxMin: false
                },
                yAxis: {
                    axisLabel: "Step count",
                    axisLabelDistance: -20,
                    tickFormat: function(d) {
                        return d; //d3.format(',.1f')(d);
                    },
                    ticks: 5,
                    rotateLabels: -30,
                    showMaxMin: false
                },
                tooltip: {
                    keyFormatter: function(d) {
                        return d; //d3.time.format('%x')(new Date(d));
                    }
                },
                padData: true,
                zoom: {
                    enabled: false,
                    scaleExtent: [1, 5],
                    useFixedDomain: false,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: true,
                    unzoomEventType: 'dblclick.zoom'
                },
                forceY: [-0.5, 4.5]
            }
        };

        var data = [{
            "key": "Steps per hours",
            "bar": true,
            "values": data_overlays
        }];
        var lifeinsight = {"data":data, "options":options};
        lifeinsight.title = "Times you <b>walk</b> in a typical day";
        lifeinsight.img = 'img/steps2.png';
        lifeinsight.subtext = "Average step count at different hours for the last 14 days";
        //console.log(JSON.stringify(lin))
        $scope.lifeinsights.push(lifeinsight);
        //$scope.options = options;
        //$scope.data = data;




        //----------- Location
        //add the markers
        //----------- location
        //console.log("json content: " + JSON.stringify(data2));
        var loc0 = data2['loc0'];
        //console.log("json content: " + JSON.stringify(loc0));

        //
        var center_lat = (data2['loc0']['lat'] + data2['loc1']['lat'])/2;
        var center_lng = (data2['loc0']['lng'] + data2['loc1']['lng'])/2;

        $scope.map_center = "" + center_lat + "," + center_lng;

        //location
        //$scope.markers = [];
        //var location_point = new Object();
        $scope.location_point0 = {};
        $scope.location_point0["loc"] = "" + data2['loc0']['lat'] + "," + data2['loc0']['lng'];
        $scope.location_point0["title"] = data2['loc0']['address'];
        //$scope.markers.push(location_point);
        //var location_point1 = new Object();
        $scope.location_point1 = {};
        $scope.location_point1["loc"] = "" + data2['loc1']['lat'] + "," + data2['loc1']['lng'];
        $scope.location_point1["title"] = data2['loc1']['address'];
        //$scope.markers.push(location_point1);

        //console.log("json content: " + JSON.stringify($scope.markers));
        var bounds = new google.maps.LatLngBounds();
        bounds.extend(new google.maps.LatLng(data2['loc0']['lat'],data2['loc0']['lng']));
        bounds.extend(new google.maps.LatLng(data2['loc1']['lat'],data2['loc1']['lng']));
        NgMap.getMap().then(function(map) {
            map.setCenter(bounds.getCenter());
            map.fitBounds(bounds);
        });

    }




    /*
    for (var j = 0; j < 15; j++) {
        data_overlays.unshift([14 - j, getRandomInt(1, 13)]);
    }
    */
    

    function loadviz(data_overlays,q,qYaxis) {

        var data_size = data_overlays.length;
        //console.log("" + data_size);
        //console.log("" + JSON.stringify(data_overlays));

        //$scope.data = [];
        var options = {
            chart: {
                type: 'lineChart',
                height: 250,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 65,
                    left: 48
                },
                x: function(d) {
                    return d[0];
                },
                y: function(d) {
                    return d[1];
                },
                showValues: true,
                showLegend: false,
                valueFormat: function(d) {  
                    return d; //d3.format(',.1f')(d);
                },
                color: ["#00796B"],
                duration: 100,
                xAxis: {
                    axisLabel: 'days ago',
                    tickFormat: function(d) {
                        //console.log("" + data_size + ", " + d + ", " + qYaxis);
                        if (data_size==1){
                            if (d < 1)
                                return "Today"
                            else
                                return ""; //d3.time.format('%x')(new Date(d))
                        }else{
                            if (d == data_size)
                                return "Today"
                            else
                                return data_size - d; //d3.time.format('%x')(new Date(d))
                        }
                    },
                    ticks: null,
                    rotateLabels: 0,
                    axisLabelDistance: 0,
                    showMaxMin: true
                },
                yAxis: {
                    axisLabel: qYaxis,
                    axisLabelDistance: -20,
                    tickFormat: function(d) {
                        return d; //d3.format(',.1f')(d);
                    },
                    ticks: 5,
                    rotateLabels: -30,
                    showMaxMin: false
                },
                tooltip: {
                    keyFormatter: function(d) {
                        return d; //d3.time.format('%x')(new Date(d));
                    }
                },
                padData: true,
                zoom: {
                    enabled: false,
                    scaleExtent: [1, 5],
                    useFixedDomain: false,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: true,
                    unzoomEventType: 'dblclick.zoom'
                },
                forceY: [-0.5, 4.5]
            }
        };

        var data = [{
            "key": q,
            "bar": true,
            "values": data_overlays
        }];  


        var lifeinsight = {"data":data, "options":options};
        return lifeinsight;
        //
        /*
        var data2 = [{
            "key": "Else",
            "bar": true,
            "values": data_overlays
        }];
        */ 
        //lifeinsight = {"data":data2, "options":options};
        //$scope.lifeinsights.push(lifeinsight);
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //
    $scope.goHome = function() {
        $location.path("/main");
    };

});