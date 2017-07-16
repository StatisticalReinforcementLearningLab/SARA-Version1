app.controller("LifeInsightsCtrl", function($scope, $http, $ionicPlatform, $location, $routeParams, $rootScope, $cordovaStatusbar, $timeout, awsCognitoSyncFactory, awsCognitoIdentityFactory, $ionicHistory, $state, $ionicLoading, saraDatafactory, NgMap) {
    
    var type = $routeParams.type;
    console.log("" + type);

    //Show a graph
    var data_overlays = [];

    //
    var questions = ["Q1d","Q3d","Q4d","Q5d","Q6d"];// ,"Q7d"];
    var qimgs = ["img/stress.png","img/freetime.png","img/dance2.png","img/social.png","img/exciting.png"];
    var lifeInsightsTitle = ["How <b>relaxed</b> did you feel this week?", 
                "How much <b>free time</b> did you have this week?", 
                "How much <b>fun</b> did you have this week?  <i class='em em-tada'></i>", 
                "How <b>lonely</b> did you feel this week?", 
                "How <b>new</b> and <b>exciting</b> was your week?"];

    var qYaxis = ["Stress level","Hours free","Level of fun","Degree of loneliness","Level of exicitement"];        
    var qSubText = ["0 = low stress, 4 = high stress", 
                    "Hours of free time everyday",
                    "0 = low fun, 4 = a lot of fun",
                    "0 = very social, 4 = very lonely",
                    "0 = low excitment, 4 = very exciting"];   

    var lifeInsightsHighStress = ["Stressed <i class='em em-name_badge'></i><i class='em em-sweat_drops'></i>", 
                                    "15 hours <i class='em em-clock10'></i>", 
                                    "day was fun <i class='em em-balloon'></i>", 
                                    "day was like <i class='em em-person_frowning'></i", 
                                    "day was like <i class='em em-fire'></i><i class='em em-dancers'></i><i class='em em-palm_tree'></i>"];
    var lifeInsightsLowStress = ["Relaxed <i class='em em-sunglasses'></i><i class='em em-boat'></i>", 
                                    "0 hour <i class='em em-clock12'></i>", 
                                    "day was lame  <i class='em em--1'></i>", 
                                    "day was like <i class='em em-two_women_holding_hands'>", 
                                    "day was like <i class='em em-zzz'></i>"];

    //
    $scope.lifeinsights = [];


    saraDatafactory.copyUsageStats({'view':'lifeIn_'+type,'status':'start'});
    $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        saraDatafactory.copyUsageStats({'view':'lifeIn_'+type,'status':'destroy'});
    });
    var deregisterSecond = $ionicPlatform.registerBackButtonAction(
      function() {
        $location.path("/");
        //navigator.app.();
        window.location = "#/main";
      }, 100
    );
    $scope.$on('$destroy', deregisterSecond);


    //
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        console.log(StatusBar);
        if (ionic.Platform.isAndroid()) {
            //$cordovaStatusbar.overlaysWebView(true);
            //$cordovaStatusbar.styleHex('#4527A0');
            if (window.StatusBar) {
                StatusBar.overlaysWebView(true);
                StatusBar.backgroundColorByHexString("#004D40"); //Light
                //StatusBar.style(2); //Black, transulcent
                //StatusBar.style(3); //Black, opaque
            }
        }
    }
    //
    var visible_lifeinsights = {};

    if(type === 'demo'){

        //
        $scope.showAllLIButton = false;
        $scope.title_text = "All data insights";

        //
        visible_lifeinsights['Q1d'] = 1;
        visible_lifeinsights['Q3d'] = 1;
        visible_lifeinsights['Q4d'] = 1;
        visible_lifeinsights['Q5d'] = 1;
        visible_lifeinsights['Q6d'] = 1;
        visible_lifeinsights['steps'] = 1;
        visible_lifeinsights['maps'] = 1;
        visible_lifeinsights['maps'] = 1;
        visible_lifeinsights[type] = 1;

        //maps are together.
        //if(visible_lifeinsights['steps'] == 1)
        //    
    }
    else if(type === 'all'){
        $scope.showAllLIButton = false;
        $scope.title_text = "All data insights";
        //

        var rl_data = JSON.parse(window.localStorage['cognito_data'] || "{}");
        if(rl_data.hasOwnProperty('reinfrocement_data') && rl_data['reinfrocement_data'].hasOwnProperty('visible_lifeinsights'))
            visible_lifeinsights = rl_data['reinfrocement_data']['visible_lifeinsights'] || {};
        else
            visible_lifeinsights = {};
        
        if(visible_lifeinsights.hasOwnProperty('Q1d')){
            console.log(JSON.stringify(visible_lifeinsights));
        }else{
            //means we have nothing.
            visible_lifeinsights['Q1d'] = 0;
            visible_lifeinsights['Q3d'] = 0;
            visible_lifeinsights['Q4d'] = 0;
            visible_lifeinsights['Q5d'] = 0;
            visible_lifeinsights['Q6d'] = 0;
            visible_lifeinsights['steps'] = 0;
            visible_lifeinsights['maps'] = 1;
            window.localStorage['visible_lifeinsights'] = JSON.stringify(visible_lifeinsights);
        }

        //maps are together.
        //if(visible_lifeinsights['steps'] == 1)
        //    
    }else{
        $scope.showAllLIButton = true;
        $scope.title_text = "Today's life insight";
        //
        if(type.charAt(0)=='q')
            type = 'Q' + type.substr(1);

        visible_lifeinsights['Q1d'] = 0;
        visible_lifeinsights['Q3d'] = 0;
        visible_lifeinsights['Q4d'] = 0;
        visible_lifeinsights['Q5d'] = 0;
        visible_lifeinsights['Q6d'] = 0;
        visible_lifeinsights['steps'] = 0;
        visible_lifeinsights['maps'] = 0;
        //visible_lifeinsights['maps'] = 0;
        visible_lifeinsights[type] = 1;

        //console.log(JSON.stringify(visible_lifeinsights));
    }

    //
    $scope.showMaps = false;
    if(visible_lifeinsights['maps'] == 1)
        $scope.showMaps = true;

    loadQuestionLifeInsights();
    loadLifeInsightsLocStepsData(); 


    //----------------------------------------
    //-- Daily insights questions
    //----------------------------------------
    function loadQuestionLifeInsights(){
        saraDatafactory.loadLifeInsightsData(function(returnValue) {
            if (returnValue == null) {
                $http.get('js/lifeinsightsBig.json').success(function(data2) {
                    generateDailySurveyInsights(data2);
                });
            } else {
                generateDailySurveyInsights(JSON.parse(returnValue));
            }
        });
    }

    var date_size_full = 0;
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

                //
                if(visible_lifeinsights[questions[i]] == 0)
                    continue;

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
                if(total_data > 7)
                    total_data = 7;
                date_size_full = total_data;
                for(var j=0; j < dates.length; j++){
                    if(data[j] != -1){
                        //
                        if(questions[i] == "Q3d")
                            data[j] = data[j]/60 + 2 ; //2 is added because null shows up as zero
                        else
                            data[j] = data[j] + 2;
                        //if(questions[i] == "Q5d")
                        //    data[j] = 4-data[j];
                        //
                        
                        data_overlays.unshift([total_data - j, data[j], j]);
                    }else
                        data_overlays.unshift([total_data - j, null, j]);

                    console.log("Do: " + (total_data - j) + "," + data[j] + "," + j + ", " + questions[i]) ;

                    if(j==6)
                        break;

                    //if
                    //if(j==1)
                    //   break;
                }
                //console.log(data_overlays);
                //console.log(data_overlays);

                //
                var lin = loadviz(data_overlays, questions[i], qYaxis[i]);
                lin.title = lifeInsightsTitle[i];
                lin.img = qimgs[i];
                lin.subtext = qSubText[i];
                lin.top_message = lifeInsightsHighStress[i];
                lin.bottom_message = lifeInsightsLowStress[i];
                lin.showTopBottom = true;
                lin.question = questions[i];
                //console.log(JSON.stringify(lin))
                $scope.lifeinsights.push(lin);
                data_overlays = [];
                //break;
            }
    }


    //----------------------------------------
    //-- Steps and locations
    //----------------------------------------
    function loadLifeInsightsLocStepsData(){
        saraDatafactory.loadLifeInsightsLocStepsData(function(returnValue) {
            if (returnValue == null) {
                $http.get('js/lifeinsightsLOCSTEPS.json').success(function(data2) {
                    loadLocationStepCount(data2);
                });
            } else {
                loadLocationStepCount(JSON.parse(returnValue));
            }
        });
    }
    
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
        lifeinsight.title = "When were you the most <b>active</b> this week? ";
        lifeinsight.img = 'img/steps2.png';
        lifeinsight.subtext = "Average # of steps throughout the day (when you carreid the phone!)   ";
        lifeinsight.showTopBottom = false;
        //console.log(JSON.stringify(lin))

        if(visible_lifeinsights['steps'] == 1)
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

        var data_size = date_size_full;//data_overlays.length; //date_size_full;//data_overlays.length;
        console.log("data_size" + data_size);
        //console.log("" + JSON.stringify(data_overlays));
        var t_forceY = [1.49, 6.5];
        if(q==='Q3d')
            t_forceY = [2, 17];

        //$scope.data = [];
        var options = {
            chart: {
                type: 'lineChart',
                height: 250,
                margin: {
                    top: 10,
                    right: 10,
                    bottom: 20,
                    left: 10
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
                groupSpacing: 0.5,
                showYAxis:true,
                xAxis: {
                    axisLabel: '',
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
                            else{
                                //var m = moment(); // Initial moment object
                                //d = "" + d;
                                //m.set({'year': parseInt(d.substring(0, 4)), 'month': parseInt(d.substring(4,6))-1, 'date': parseInt(d.substring(6,8)) });

                                //console.log("" + parseInt(d.substring(0, 4)) + ", " + parseInt(d.substring(4,6)));
                                //m.set({'year': 2013, 'month': 5 });
                                //console.log(d + ", " + m.format('YYYYMMDD'));
                                //console.log(m.format('dddd').substring(0,2) + "/" + m.format('DD'));//data_size - d;)
                                //return m.format('dddd').substring(0,2) + "/" + m.format('D');//data_size - d; //d3.time.format('%x')(new Date(d))
                                //return d;
                                var m = moment();
                                m = m.subtract(data_size-d, 'day');


                                var day_abbr = m.format('dddd').substring(0,2);
                                //if((day_abbr=='Fr') || (day_abbr=='Mo') || (day_abbr=='We'))
                                //    day_abbr = m.format('dddd').substring(0,1);

                                return  day_abbr + "/" + m.format('D');
                            }
                        }
                    },
                    ticks: 7,
                    rotateLabels: 0,
                    axisLabelDistance: 0,
                    showMaxMin: false,
                    orient:'bottom',
                    tickSize: 10
                },
                yAxis: {
                    axisLabel: qYaxis,
                    axisLabelDistance: -20,
                    tickFormat: function(d) {
                        return ""; //d //d3.format(',.1f')(d);
                    },
                    ticks: 5,
                    rotateLabels: -30,
                    showMaxMin: false
                },
                tooltips: false,
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
                staggerLabel: true,
                forceY: t_forceY
            }
        };

        //
        var data_overlays_trunc = [];
        var k=0;
        console.log()
        for(var j=data_overlays.length-1; j>=0; j--,k++){
            if(k==7)
                break;
            data_overlays_trunc[j] = data_overlays[j];

        }

        var data = [{
            "key": q,
            "bar": true,
            "values": data_overlays_trunc
        }];  


        var lifeinsight = {"data":data, "options":options, "label": "id_" + q};

        //d3.select('#' + 'id_' + q + ' nv-x nv-axis nvd3-svg').attr('transform', 'translate(0,' + 0 + ')');;
        var svg = d3.select('#' + 'id_' + q + ' svg');
        svg.append("circle")
                          .attr("cx", 30)
                          .attr("cy", 30)
                         .attr("r", 20);
        console.log(svg);

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

    $scope.showLifeInishgts = function(){
        $location.path("/lifeinsights/all");
    };

    function wrap(text, width) {
          text.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
            while (word = words.pop()) {
              line.push(word);
              tspan.text(line.join(" "));
              if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
              }
            }
          });
    }


    $scope.ratingChanged = function(x){
        var rl_data = JSON.parse(window.localStorage['cognito_data'] || "{}");
        rl_data['reinfrocement_data'] = rl_data['reinfrocement_data'] ||{};
        var reinfrocement_data_today = rl_data['reinfrocement_data'][moment().format('YYYYMMDD')] || {};
        reinfrocement_data_today['reward_at_rating'] = x;
        reinfrocement_data_today['reward_at_rating_ts'] = moment().format("x");
        reinfrocement_data_today['reward_at_rating_tz'] = moment().format("ZZ");

        //console.log("" + x);

        if($rootScope.isRealReinforcement == true){
            rl_data['reinfrocement_data']['visible_lifeinsights'] = visible_lifeinsights;
            rl_data['reinfrocement_data'][moment().format('YYYYMMDD')] = reinfrocement_data_today;    
            window.localStorage['cognito_data'] = JSON.stringify(rl_data);    
            saraDatafactory.storedata('rl_data',rl_data, moment().format('YYYYMMDD'));
        }

        $location.path("/main");
    }

});