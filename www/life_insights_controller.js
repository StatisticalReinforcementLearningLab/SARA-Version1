app.controller("RedCtrl", function($scope, $http, $location, $cordovaStatusbar, $timeout, awsCognitoSyncFactory, awsCognitoIdentityFactory, $ionicHistory, $state, $ionicLoading, saraDatafactory) {

    //Show a graph
    var data_overlays = [];

    //
    var questions = ["Q1d","Q3d","Q4d","Q5d","Q6d"];// ,"Q7d"];
    var lifeInsightsTitle = ["Daily <b>stress</b> levels", "<b>Free hours</b> each day", "Level of <b>fun</b> each day", 
                "Degree of <b>loneliness</b>", "How <b>exciting</b> were your days?"];

    //
    $scope.lifeinsights = [];

    $http.get('js/lifeinsights.json').success(function(data2) {


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
            }

            //console.log("" + dates.length);
            for(var j=0; j < dates.length; j++){
                if(data[j] != -1)
                    data_overlays.unshift([total_data - j, data[j]]);
            }


            //
            var lin = loadviz(data_overlays, questions[i]);
            lin.title = lifeInsightsTitle[i];
            //console.log(JSON.stringify(lin))
            $scope.lifeinsights.push(lin);
            data_overlays = [];
            //break;
        }
    });


    /*
    for (var j = 0; j < 15; j++) {
        data_overlays.unshift([14 - j, getRandomInt(1, 13)]);
    }
    */
    

    function loadviz(data_overlays,q) {

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
                        if (d == data_size)
                            return "Today"
                        else
                            return data_size - d; //d3.time.format('%x')(new Date(d))
                    },
                    ticks: data_size-2,
                    rotateLabels: -90,
                    axisLabelDistance: 0,
                    showMaxMin: true
                },
                yAxis: {
                    axisLabel: '',
                    axisLabelDistance: -20,
                    tickFormat: function(d) {
                        if(d==0)
                            return "low" //'<tspan x="0" y="9" dy="0.71em">Family in feud with</tspan><tspan x="0" y="9" dy="1.81em">Zuckerbergs</tspan>'
                        if(d==5)
                            return "high"
                        return d; //d3.format(',.1f')(d);
                    },
                    ticks: 7,
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
                forceY: [0, 5]
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

});