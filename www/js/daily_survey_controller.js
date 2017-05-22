app.controller("DailySurveyCtrl", function($scope, $http, $interval,$location, $sce, $ionicPopup, $routeParams, ngProgressFactory, saraDatafactory) {

    //status bar color
    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        console.log(StatusBar);
        if (ionic.Platform.isAndroid()) {
            //$cordovaStatusbar.overlaysWebView(true);
            //$cordovaStatusbar.styleHex('#4527A0');
            if (window.StatusBar) {
                StatusBar.overlaysWebView(true);
                StatusBar.backgroundColorByHexString("#303F9F"); //Light
                //StatusBar.style(2); //Black, transulcent
                //StatusBar.style(3); //Black, opaque
            }
        }
    }



    $scope.notification_id = $routeParams.id;

    $scope.msg = "<h1>I love Surveys. Give me more.</h1>";
    $scope.emaresponse = JSON.parse(window.localStorage['emas'] || '[]');
    console.log("EMA response: " + JSON.stringify($scope.emaresponse));

    $scope.qs = [{
        "name": "Q0",
        "text": "Test q"
    }];

    var survey_data = [];
    var autocomplete_options = [];
    //console.log(survey_data);


    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.progressbar.start();
    $scope.progressbar.setHeight('3px');
    $scope.progressbar.setColor('#0ff');
    $scope.progressbar.reset();



    //
    var day_time = ""; //"Lunch at " + moment("hh:mm a");
    var current_hour = moment().hour();
    if (current_hour >= 6 && current_hour <= 11)
        day_time = "Good Morning";
    if (current_hour >= 12 && current_hour <= 18)
        day_time = "Good Afternoon";
    if (current_hour >= 18 && current_hour <= 23)
        day_time = "Good Evening";
    if (current_hour >= 0 && current_hour <= 5)
        day_time = "Good Evening";

    day_time = "Survey";
    $scope.greetings = day_time;

    //load email
    $scope.email = window.localStorage['email'];

    //this is a callback.
    $http.get('js/data.json').success(function(data) {
        //$http.get('js/data.json').success(function(data) {
        console.log("Questions: " + data);

        //randomize the order of array
        //data = shuffle(data);

        survey_data = data;
        $scope.qs = data;
        $scope.survey = {};


        //
        var survey_string = "";
        for (var i = 0; i < survey_data.length; i++) {

            var obj = survey_data[i];
            console.log("Done " + obj.text);
            survey_string = process_survey(obj, survey_string, obj.name);
        }
        //$scope.$apply(); 
        //console.log(survey_string);
        /*
        var  cache = [];
        JSON.stringify($scope, function(key, value) {
                      if (typeof value === 'object' && value !== null) {
                          if (cache.indexOf(value) !== -1) {
                              // Circular reference found, discard key
                              return;
                          }
                          // Store value in our collection
                          cache.push(value);
                      }
                      return value;
        });
        console.log(cache);
        cache = null;
        */
        $scope.thisCanBeusedInsideNgBindHtml = survey_string;
        //$sce.trustAsHtml(survey_string); 
        //survey_string;

        //init();

        $scope.survey.starttimeUTC = new Date().getTime();

    });




    //function affectclick(index,mood){
    //$scope.affect = [];
    //$scope.affect[0] = 'Afraid';  
    $scope.affectclick = function(index, q, mood) {
        console.log("" + index + ", " + mood);

        //
        //if(index == 1){
        if ($scope.affect[index - 1].includes("<u>"))
            $scope.affect[index - 1] = $scope.affect[index - 1].replace('<u><b>', '').replace('</b></u>', '');
        else
            $scope.affect[index - 1] = '<u><b>' + $scope.affect[index - 1] + '</b></u>';
        //}

        for (var i = 0; i < $scope.affect.length; i++) {
            if ((i + 1) == index)
                continue;
            else {
                $scope.affect[i] = $scope.affect[i].replace('<u><b>', '');
                $scope.affect[i] = $scope.affect[i].replace('</b></u>', '');
                //console.log($scope.affect);
            }
        }

        $scope.reponse_ts[q] = {};
        $scope.reponse_ts[q].ts = Date.now();
        $scope.reponse_ts[q].readable_ts = moment().format("MMMM Do YYYY, h:mm:ss a");

        $scope.survey[q] = mood;
        console.log(JSON.stringify($scope.survey));
    }



    function shuffle(data_array) {

        //var idx_array = [0,1,2,3,4,5,6,7];
        var array = [0, 1, 2, 3, 4, 5];

        var currentIndex = array.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            //
            // And swap it with the current element.
            //
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;

            //
            /*
            temporaryValue = idx_array[currentIndex];
            idx_array[currentIndex] = idx_array[randomIndex];
            idx_array[randomIndex] = temporaryValue;
            */

        }

        //remove 5;
        /*
        console.log("Before splicing: " + idx_array);
        for(var i = 0; i < idx_array.length; i++){
          if(idx_array[i] == 5){
            temporaryValue = array[i];
            array.splice(i,1);
            idx_array.splice(i,1);
            break;
          }
        }
        console.log("After splicing: " + idx_array);
        return array;
        */

        //
        console.log("Before splicing: " + array);
        for (var i = 0; i < array.length; i++) {
            if (array[i] == 5) {
                array.splice(i + 1, 0, 6);
                break;
            }
        }
        console.log("After splicing: " + array);


        //copy the data to a new one
        var shuffled_data_array = data_array.slice();;
        for (var i = 0; i < array.length; i++) {
            shuffled_data_array[i] = data_array[array[i]];
        }
        console.log("Shuffled data array size: " + shuffled_data_array.length);

        return shuffled_data_array;


    }

    //init();
    //$scope.init2 = function() {
    var promise = $interval(init, 500);
    //init();
    function init(){
        var c = document.getElementById("myCanvas");
        //alert("holla");
        if(c==null)
            return;
        else
            $interval.cancel(promise);

        c.style.width ='100%';
        c.width  = c.offsetWidth;
        c.height = c.width;


        var ctx = c.getContext("2d");
        var imageObj = new Image();
        imageObj.src = 'https://s3.amazonaws.com/sara-umich/appfiles/affect_grid.png';
        imageObj.onload = function(){
        ctx.drawImage(imageObj, 0, 0, imageObj.width,    imageObj.height, // source rectangle
                       0, 0, c.width, c.height); // destination rectangle
        }

        //corner points
        var top_x = (42.0/354.0)*c.width;
        var top_y = (32.0/354.0)*c.height;
        var bottom_x = (320.0/354.0)*c.width;
        var bottom_y = (320.0/354.0)*c.height;
        
        c.addEventListener("mousedown", function (e) {
            drawing = true;
            lastPos = getMousePos(c, e);
            //console.log("x:" + lastPos.x + ", y:" + lastPos.y + ":::: " + c.width + "," + c.height);

            var x = -1;
            var y = -1;
            if((lastPos.x >= top_x) && (lastPos.y >= top_y) && (lastPos.x <= bottom_x) && (lastPos.y <= bottom_y)){
                x = 10 * (lastPos.x - top_x) / (bottom_x - top_x) - 5;
                y = 5 - 10 * (lastPos.y - top_y) / (bottom_y - top_y) - 5;
                //console.log("x:" + x + ", y:" + y);
                $scope.survey.QMood = "" + x + ":" + y;

                //
                $scope.inputchanged("QMood");
            }else{
                return;
            }
            
            var rect = c.getBoundingClientRect();
            ctx.beginPath();
            ctx.clearRect(0, 0, rect.right-rect.left, rect.bottom-rect.top);
            ctx.closePath();
            
            //
            ctx.drawImage(imageObj, 0, 0, imageObj.width,    imageObj.height, // source rectangle
                       0, 0, c.width, c.height); // destination rectangle
            
            //ctx.drawImage(imageObj, 0, 0);
            ctx.beginPath();
            ctx.arc(lastPos.x,lastPos.y,10,0,2*Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'red';
            ctx.stroke();
            
            
            
        }, false);
        //alert("holla");
    }

    function getMousePos(canvasDom, mouseEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
          x: mouseEvent.clientX - rect.left,
          y: mouseEvent.clientY - rect.top
        };
    }

    //load the questions
    $scope.goHome = function() {
        $location.path("/");
    };

    //console.log($scope.qs);
    $scope.submit = function() {

        // A post entry.
        /*
        var postData = {
          author: username,
          uid: uid,
          body: body,
          title: title,
          starCount: 0
        };
        */

        $scope.survey.endtimeUTC = new Date().getTime();
        $scope.survey.ts = moment().format('MMMM Do YYYY, h:mm:ss a');

        // Get a key for a new Post.
        //var newPostKey = firebase.database().ref().child('SARA').child('Daily').push().key;

        // Write the new post's data simultaneously in the posts list and the user's post list.
        //var updates = {};
        $scope.survey.reponse_ts = $scope.reponse_ts;
        $scope.survey.devicInfo = ionic.Platform.device();
        $scope.survey.id = $scope.email;

        var rl_data = JSON.parse(window.localStorage['cognito_data']);
        rl_data['survey_data']['daily_survey'][moment().format('YYYYMMDD')] = 1;

        //save to cognito
        saraDatafactory.storedata('rl_data',rl_data, moment().format('YYYYMMDD'));
        window.localStorage['cognito_data'] = JSON.stringify(rl_data);

        //write to SD card file
        saraDatafactory.copyJSONToFile($scope.survey, 'daily_survey');


        //save to "data_ds_ws.txt"
        saraDatafactory.saveDataCollectionState(rl_data['survey_data']['daily_survey'], rl_data['survey_data']['weekly_survey']); 

        //------------------------------------------------------------------------------------------
        //
        // TODO: for life-insights I will need to encrypt the data somewhere.
        //
        //------------------------------------------------------------------------------------------





        //$scope.survey.randq = $scope.rand_index;
        //updates['/SARA/Daily/' + newPostKey] = $scope.survey;
        //updates['/user-posts/' + $scope.survey.id + '/' + newPostKey] = $scope.survey;
        //firebase.database().ref().update(updates);

        //
        //window.localStorage['daily_survey_' + moment().format('YYYYMMDD')] = 1;

        //
        //saraDatafactory.storedata('daily_survey2', $scope.survey, moment().format('YYYYMMDD'));

        //
        /*
        var score_data = JSON.parse(window.localStorage['score_data'] || "{}");
        console.log("DS: " + JSON.stringify(score_data));
        if(score_data.hasOwnProperty("daily_survey")){
        }else
            score_data['daily_survey'] = {};

        score_data['daily_survey'][moment().format('YYYYMMDD')] = 1;
        window.localStorage['score_data'] = JSON.stringify(score_data);
        */
        //saraDatafactory.storedata('game_score2', score_data, moment().format('YYYYMMDD'));

        

        //----- save the "data" from sdcard.
        


        //
        //var daily_survey = score_data['daily_survey']; //JSON.parse(window.localStorage['daily_survey_data'] || "{}");
        //daily_survey[moment().format('YYYYMMDD')] = 1;
        //console.log(JSON.stringify("Works: " +  JSON.stringify(daily_survey)));
        //window.localStorage['daily_survey_data'] = JSON.stringify(daily_survey);


        //console.log(JSON.stringify(window.localStorage['daily_survey']));
        /*
        //save the new notificaiton data
        $scope.imei = window.localStorage['IMEI'];
        var imei2 = $scope.imei;
        if (imei2 == '867686022106536')
            imei2 = imei2 + '-dated';


        $scope.notification_data = JSON.parse(window.localStorage['notificaiton_data'] || "{}");
        var notification_d = $scope.notification_data[moment().format('YYYYMMDD')]["notification_" + $scope.notification_id];
        notification_d['ema_data'] = $scope.survey;
        notification_d['whenEMAAnswered'] = new Date().getTime();
        $scope.notification_data[moment().format('YYYYMMDD')]["notification_" + $scope.notification_id] = notification_d;
        window.localStorage['notificaiton_data'] = JSON.stringify($scope.notification_data);
        //firebase.database().ref('/notification-v2/' + imei2 + '/' + moment().format('YYYYMMDD') + '/').set($scope.notification_data[moment().format('YYYYMMDD')]);
        firebase.database().ref('/notification-v2/' + imei2 + '/' + moment().format('YYYYMMDD') + '/' + "notification_" + $scope.notification_id + "/whenEMAAnswered/").set(notification_d['whenEMAAnswered']);
        firebase.database().ref('/notification-v2/' + imei2 + '/' + moment().format('YYYYMMDD') + '/' + "notification_" + $scope.notification_id + "/ema_data/").set($scope.survey);
              

        //save the random index for this EMA
        $scope.rand_idx = JSON.parse(window.localStorage['ema_random_idx'] || "{}");
        $scope.rand_idx[moment().format('YYYYMMDD') + "_" + $scope.notification_id] = $scope.rand_index; 
        window.localStorage['ema_random_idx'] = JSON.stringify($scope.rand_idx);


        //save to local response
        $scope.emaresponse.push({
                  "id": $scope.emaresponse.length,
                  "date": moment().format("MMMM Do YYYY, h:mm:ss a"),
                  "unix_time": Date.now(),
                  "response": $scope.survey,
                  "email": $scope.email,
                  "randomq": $scope.rand_index,
                  "recall": null});
        window.localStorage['emas'] = JSON.stringify($scope.emaresponse);
        */

        //move to the diffrent path
        $location.path("/reward/30/true");

    };



    //show pop-up
    $scope.showPopup = function() {
        $scope.data = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input ng-model="data.email">',
            title: 'Enter Id',
            subTitle: 'Current id: <b>' + $scope.email + '<b>',
            scope: $scope,
            buttons: [{
                text: 'Cancel'
            }, {
                text: '<b>Save</b>',
                type: 'button-assertive',
                onTap: function(e) {
                    if (!$scope.data.email) {
                        //don't allow the user to close unless he enters wifi password
                        e.preventDefault();
                    } else {
                        //
                        //save the json data in local storage
                        window.localStorage['email'] = $scope.data.email;
                        $scope.email = $scope.data.email;
                        return $scope.data.email;
                    }
                }
            }]
        });

        myPopup.then(function(res) {
            console.log('Tapped!', res);
        });
    };

    //
    $scope.callbackMethod = function(query, isInitializing, componentId) {
        // depends on the configuration of the `items-method-value-key` (items) and the `item-value-key` (name) and `item-view-value-key` (name)


        //return { "items": [ 'test1 ' + query, 'test2 ' + query, 'test3', 'mash'] }
        var results = [];
        var index;
        var entry;
        console.log(componentId);
        console.log(autocomplete_options);
        var source = autocomplete_options[componentId]; //[ 'test1 ', 'test2 ', 'test3', 'mash'] ; //
        // Look for componentID to set the element for specific elements 
        // https://github.com/guylabs/ion-autocomplete
        var unchanged_query = query;
        query = query.toUpperCase();
        for (index = 0; index < source.length; ++index) {
            entry = source[index];
            if (entry.toUpperCase().indexOf(query) != -1) {
                results.push(entry);
            }
        }

        if (results.length == 0)
            results = [unchanged_query];

        console.log('Survey:\n ' + $scope.survey);
        return {
            "items": results
        };

    };

    //Look at this
    //--- https://github.com/guylabs/ion-autocomplete/blob/master/test/e2e/ion-autocomplete.prepopulated.e2e.html
    $scope.model = [];
    $scope.externalModel = ['test1-', 'test2-', 'test3-'];
    $scope.selectedItems = [];
    $scope.preselectedSearchItems = [{
        id: "1",
        name: "1",
        view: "view: 1"
    }, {
        id: "2",
        name: "2",
        view: "view: 2"
    }];
    $scope.modelToItemMethod = function(modelValue) {
        // get the full model item from the model value and return it. You need to implement the `getModelItem` method by yourself 
        // as this is just a sample. The method needs to retrieve the whole item (like the `items-method`) from just the model value.
        return {
            id: modelValue,
            name: modelValue,
            view: modelValue
        }
    };

    $scope.getTestItems = function(query, isInitializing) {
        if (isInitializing) {
            return {
                items: []
            }
        } else {
            return {
                items: [{
                    id: "1",
                    name: query + "1",
                    view: "view: " + query + "1"
                }, {
                    id: "2",
                    name: query + "2",
                    view: "view: " + query + "2"
                }, {
                    id: "3",
                    name: query + "3",
                    view: "view: " + query + "3"
                }]
            };
        }
    };


    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    $scope.clickedMethod = function(callback) {
        // print out the selected item
        console.log("Clicked item is: " + callback.item);

        if (typeof callback.item == 'undefined')
            return;

        //I have to change based on id, and add them
        $scope.autocomplete_options = JSON.parse(window.localStorage['ema_ac_' + callback.componentId] || '[]');
        //options = [];
        var found = false;
        for (var k = 0; k < $scope.autocomplete_options.length; k++) {
            //-- options.push($scope.autocomplete_options[k].text);
            if ($scope.autocomplete_options[k].text == callback.item) {
                $scope.autocomplete_options[k].times++;
                found = true;
            }
            //-- $scope.autocomplete_options.push({"text": options[k] + "_test2", "times": 1});
        }
        if (found == false) {
            $scope.autocomplete_options.push({
                "text": callback.item,
                "times": 1
            });
        }
        window.localStorage['ema_ac_' + callback.componentId] = JSON.stringify($scope.autocomplete_options);

        // print out the component id
        console.log(callback.componentId);

        // print out the selected items if the multiple select flag is set to true and multiple elements are selected
        console.log(callback.selectedItems);
    }

    //
    $scope.reponse_ts = {};
    //$scope.clicked_question = [0,0,0,0,0,0,0,0,0,0,0,0,0];
    //$scope.total_clicked = 0;
    $scope.inputchanged = function(questions) {
        console.log("Qs:" + questions + ", ts:" + Date.now() + ", readable_time:" + moment().format("MMMM Do YYYY, h:mm:ss a"));



        //
        /*
        var all_quesitons = ['Q1','Q2','Q3','Q4','Q6','Q7','Q9','Q10','Q11','Q12','Q13','Q14','Q15'];

        var clicked_index = contains(all_quesitons,questions);
        if(clicked_index != -1){
          if($scope.clicked_question[clicked_index] == 0)//means first time
            $scope.total_clicked = $scope.total_clicked  + 1;

          $scope.clicked_question[clicked_index] = 1;
        }
        */

        //
        $scope.reponse_ts[questions] = {};
        $scope.reponse_ts[questions].ts = Date.now();
        $scope.reponse_ts[questions].readable_ts = moment().format("MMMM Do YYYY, h:mm:ss a");

        //make a percentage
        //console.log("" + 100*$scope.total_clicked/13 + ", " + $scope.total_clicked + ", " + clicked_index);
        //$scope.progressbar.set(100*$scope.total_clicked/13);
        //
        //init();

    }

    function contains(a, obj) {
        var i = a.length;
        while (i--) {
            if (a[i] === obj) {
                return i;
            }
        }
        return -1;
    }



    // process survey
    function process_survey(obj, survey_string, i) {

        //------------------------------------------------------                  
        // Random 
        //------------------------------------------------------   
        // 'component-id="Q' + i + '" ' + 
        if (obj.type == 'random') {
            var filename = obj.extra;
            console.log("location: " + filename);
            var has_returned = 0;
            survey_string = survey_string + '<p compile="randomq""></p>';
            $http.get(filename).success(function(data2) {
                var obj_random_q = data2;
                var rand_index = getRandomInt(0, obj_random_q.length - 1)
                $scope.randomq = process_survey(obj_random_q[rand_index], "", i);
                $scope.rand_index = rand_index;
            });

        } else {
            //
            if (obj.type == "captcha") {


                survey_string = [survey_string,
                    '<div class="card"><div class="quetiontextstyle">',
                    obj.text + "<br><b>" + '<img src="js/captcha_images/{{survey.q7answer}}" alt="Smiley face" height="60" width="auto">' + "</b>",
                    '</div>'
                ].join(" ");

                var filename = obj.extra.filesnames;
                var dir_loc = obj.extra.captchdir;
                $http.get(filename).success(function(data3) {
                    var obj_captcha_q = data3[0].data;
                    console.log("captcha data: " + obj_captcha_q + ", length: " + obj_captcha_q.length);
                    $scope.survey.q7answer = data3[0].data[getRandomInt(0, obj_captcha_q.length - 1)];
                });

                obj.type = "textbox";

            } else {
                if (("extra" in obj) && ("dependency" in obj.extra)) {
                    $scope.survey.test = obj.extra.dependency.question == obj.extra.dependency.show;
                    //'<div class="card" ng-show=' + '{{survey.' + obj.extra.dependency.question + '=="' + obj.extra.dependency.show + '"}}' +'>', 
                    survey_string = [survey_string,
                        '<div class="card" ng-show=(' + 'survey.' + obj.extra.dependency.question + '=="' + obj.extra.dependency.show + '"' + ')>',
                        //'<div class="card" ng-show=' + '"' + 'true"}}' + '>', 
                        '<div class="quetiontextstyle">',
                        obj.text,
                        '</div>'
                    ].join(" ");
                } else {
                    survey_string = [survey_string,
                        '<div class="card"><div class="quetiontextstyle">',
                        obj.text,
                        '</div>'
                    ].join(" ");
                }
            }

            //------------------------------------------------------                  
            //text box  
            //------------------------------------------------------                 
            if (obj.type == "textbox") {
                survey_string = [survey_string,
                    '<label class="item item-input">',
                    '<input type="text" ng-model="survey.' + i + '"', ' ng-change="inputchanged(\'' + i + '\')"></label>'
                ].join(" ");
            }



            //------------------------------------------------------
            //  mood
            //------------------------------------------------------
            if (obj.type == 'mood') {

                survey_string = [survey_string,
                    '<div class="radioimages">',
                    '<label><input type="radio" ng-model="survey.' + i + '" value="high-sad" ng-change="inputchanged(\'' + i + '\')"/><img style="width:18%;" src=img/5.png></label>',
                    '<label><input type="radio" ng-model="survey.' + i + '" value="low-sad" ng-change="inputchanged(\'' + i + '\')"/><img style="width:18%;" src=img/4.png></label>',
                    '<label><input type="radio" ng-model="survey.' + i + '" value="neutral" ng-change="inputchanged(\'' + i + '\')"/><img style="width:18%;" src=img/3.png></label>',
                    '<label><input type="radio" ng-model="survey.' + i + '" value="low-happy"  ng-change="inputchanged(\'' + i + '\')"/><img style="width:18%;" src=img/2.png></label>',
                    '<label><input type="radio" ng-model="survey.' + i + '" value="high-happy"  ng-change="inputchanged(\'' + i + '\')"/><img style="width:18%;" src=img/1.png></label>',
                    '</label></div>'
                ].join(" ");
                /*
                survey_string = [ survey_string, 
                '<div class="radioimages">',
                '<label><input type="radio" ng-model="survey.' + i + '" value="high-sad"/><img style="width:18%;" src=img/5.png></label>',
                '<label><input type="radio" ng-model="survey.' + i + '" value="low-sad"/><img style="width:18%;" src=img/4.png></label>',
                '<label><input type="radio" ng-model="survey.' + i + '" value="neutral"/><img style="width:18%;" src=img/3.png></label>',
                '<label><input type="radio" ng-model="survey.' + i + '" value="low-happy"/><img style="width:18%;" src=img/2.png></label>',
                '<label><input type="radio" ng-model="survey.' + i + '" value="high-happy"/><img style="width:18%;" src=img/1.png></label>',
                '</label></div>'].join(" ");
                */
            }


            //------------------------------------------------------
            //  mood-grid
            //------------------------------------------------------
            if (obj.type == 'moodgrid') {

                $scope.affect = ['Afraid', 'Tense', 'Excited', 'Delighted', 'Frustrated', 'Angry', 'Happy', 'Glad', 'Miserable', 'Sad', 'Calm', 'Satisfied', 'Gloomy', 'Tired', 'Sleepy', 'Serene'];

                var affect = $scope.affect;
                var colors = ['#ff99a3', '#ff99a3', '#ffc266', '#ffc266', '#ffb3ba', '#ffb3ba', '#FFE0B2', '#FFE0B2', '#BBDEFB', '#BBDEFB', '#C8E6C9', '#C8E6C9', '#e7f3fe', '#e7f3fe', '#eef7ee', '#eef7ee'];
                /*
                survey_string = [ survey_string, 
                '<div class="radioimages">',
                '<label><input type="radio" ng-model="survey.' + i + '" value="high-sad" ng-change="inputchanged(\'' + i + '\')"/><img style="width:18%;" src=img/5.png></label>',
                '<label><input type="radio" ng-model="survey.' + i + '" value="low-sad" ng-change="inputchanged(\'' + i + '\')"/><img style="width:18%;" src=img/4.png></label>',
                '<label><input type="radio" ng-model="survey.' + i + '" value="neutral" ng-change="inputchanged(\'' + i + '\')"/><img style="width:18%;" src=img/3.png></label>',
                '<label><input type="radio" ng-model="survey.' + i + '" value="low-happy"  ng-change="inputchanged(\'' + i + '\')"/><img style="width:18%;" src=img/2.png></label>',
                '<label><input type="radio" ng-model="survey.' + i + '" value="high-happy"  ng-change="inputchanged(\'' + i + '\')"/><img style="width:18%;" src=img/1.png></label>',
                '</label></div>'].join(" ");
                */

                var html_string = [];
                for (var j = 0; j < 4; j++) {

                    html_string.push('<div class = "row">');

                    for (var ii = 0; ii < 4; ii++) {
                        var index = j * 4 + ii;
                        html_string.push('<div ng-click="affectclick(' + (index + 1) + ',\'' + i + '\'' + ',\'' + affect[index] + '\')" class = "col col-25"><div style="width:100%;padding-bottom:15%;padding-top:25%;background-color:' + colors[index] + '" align="center">' +
                            '<p ng-bind-html="affect[' + index + ']"></p></div></div>');
                    }
                    html_string.push('</div>');
                }
                html_string = html_string.join(" ");
                survey_string = [survey_string, html_string].join(" ");

                /*
                survey_string = [ survey_string, 
                '<div class="radioimages">',
                '<label><input type="radio" ng-model="survey.' + i + '" value="high-sad"/><img style="width:18%;" src=img/5.png></label>',
                '<label><input type="radio" ng-model="survey.' + i + '" value="low-sad"/><img style="width:18%;" src=img/4.png></label>',
                '<label><input type="radio" ng-model="survey.' + i + '" value="neutral"/><img style="width:18%;" src=img/3.png></label>',
                '<label><input type="radio" ng-model="survey.' + i + '" value="low-happy"/><img style="width:18%;" src=img/2.png></label>',
                '<label><input type="radio" ng-model="survey.' + i + '" value="high-happy"/><img style="width:18%;" src=img/1.png></label>',
                '</label></div>'].join(" ");
                */
            }

            if (obj.type == "moodgrid2") {
                survey_string = [survey_string,
                    '<canvas id="myCanvas" width="310" height="310" style="border:0px solid #000000;padding:10px;">',
                    'Your browser does not support the HTML5 canvas tag.',
                    '</canvas>'
                ].join(" ");
            }



            //------------------------------------------------------                  
            // Autocomplete 
            //------------------------------------------------------   
            // 'component-id="Q' + i + '" ' + 
            if (obj.type == 'autocomplete') {
                survey_string = survey_string +
                    '<label class="item item-input">' +
                    '<input ion-autocomplete type="text" readonly="readonly" ' +
                    'class="ion-autocomplete" autocomplete="on" ng-model="survey.' + i +
                    '" max-selected-items="1" items-method-value-key="items" ' +
                    'items-method="callbackMethod(query,isInitializing,componentId)" ' +
                    'items-clicked-method="clickedMethod(callback)" ' +
                    'title-text = "' + obj.text + '" ' +
                    'id="Q' + i + '" ' +
                    'component-id="' + i + '"' +
                    ' ng-change="inputchanged(\'' + i + '\')"/>' +
                    '</label>';
                options = obj.extra;


                //if i have records for the question load from there. 
                $scope.autocomplete_options = JSON.parse(window.localStorage['ema_ac_' + i] || '[]');
                if ($scope.autocomplete_options.length == 0) {
                    for (var k = 0; k < options.length; k++) {
                        $scope.autocomplete_options.push({
                            "text": options[k],
                            "times": 1
                        });
                    }
                    window.localStorage['ema_ac_' + i] = JSON.stringify($scope.autocomplete_options);
                } else {
                    options = [];

                    $scope.autocomplete_options.sort(function(a, b) {
                        return b.times - a.times;
                    });

                    for (var k = 0; k < $scope.autocomplete_options.length; k++) {
                        options.push($scope.autocomplete_options[k].text);

                        //  
                        //console.log("Item " + k + ": " + $scope.autocomplete_options[k].text + " " + $scope.autocomplete_options[k].times);
                    }
                    //
                }

                autocomplete_options[i] = options;

                //auto complete assigned
                console.log("Autocomplete options: " + autocomplete_options[i]);
            }


            //------------------------------------------------------ 
            // radio button       
            //------------------------------------------------------            
            if (obj.type == "radiobutton") {

                //------------------------------------------------------ 
                //radio button, vertical     
                //------------------------------------------------------   
                if (obj.extra.orientation == "vertical") {
                    survey_string = survey_string + '<div class="radiovertical"><ul>';

                    for (var j = 0; j < obj.extra.choices.length; j++) {

                        /*  
                        survey_string = survey_string + '<li><input type="radio" id="optionQ' + 
                          i + "I" + j + '" name="Q' + i + '"><label for="optionQ' + i + "I" + 
                          j + '">' + obj.extra.choices[j] + 
                          '</label><div class="check"></div></li>';
                          */


                        survey_string = [survey_string,
                            '<li><input type="radio" id="option' + i + "I" + j + '" name="' + i + '" ng-model="survey.' + i + '" value="' + obj.extra.choices[j] + '"  ng-change="inputchanged(\'' + i + '\')">',
                            '<label for="option' + i + "I" + j + '">' + obj.extra.choices[j] + '</label>',
                            '<div class="check"></div></li>'
                        ].join(" ");

                    }

                    survey_string = survey_string + '</ul></div>';
                }

                //------------------------------------------------------ 
                //radio button, vertical     
                //------------------------------------------------------
                if (obj.extra.orientation == "horzontal") {

                    survey_string = survey_string + '<div class="radiohorizontal"><ul>';

                    //starting text
                    survey_string = survey_string + '<li><p>' + obj.extra.choices[0] + '</p></li>';

                    //middle text
                    for (var j = 0; j < obj.extra.levels; j++) {
                        survey_string = [survey_string,
                            '<li><input type="radio" id="option' + i + "I" + j + '" name="Q' + i + '" ng-model="survey.' + i + '" value="' + j + '"  ng-change="inputchanged(\'' + i + '\')">',
                            '<label for="option' + i + "I" + j + '"></label>',
                            '<div class="check"></div></li>'
                        ].join(" ");
                    }

                    //ending text
                    survey_string = survey_string + '<li><p>' + obj.extra.choices[1] + '</p></li>';

                    survey_string = survey_string + '</ul></div>';
                }

            }


            /*
                   <div class="item range">
                      <i class="icon ion-volume-low"></i>
                      <input type="range" min="0" max="{{user.max}}" value="{{user.min}}" step="1000" ng-model="user.value" name="volume">
                      <i class="icon ion-volume-high"></i>
                      {{user.value}}
                   </div>
                 */

            //------------------------------------------------------                  
            //text box  
            //------------------------------------------------------                 
            if (obj.type == "range") {
                var min = obj.extra.choices[2];
                var max = obj.extra.choices[3];
                var step = obj.extra.choices[4];
                $scope.survey[i] = 5;
                survey_string = [survey_string,
                    '<div class = "row" style="margin-bottom=0px;">',
                    '<div class = "col col-10"><p align="center" style="padding-top:2px;padding-bottom:2px;margin:0px;border-radius:5px;background:#4e5dca;color:white;">0</p></div>',
                    '<div class = "col col-10"></div>',
                    '<div class = "col col-20 col-offset-20"><p align="center" style="padding-top:2px;padding-bottom:2px;margin:0px;border-radius:25px;background:#303F9F;color:white;"><b>{{survey.' + i + '}}</b></p></div>',
                    '<div class = "col col-10"></div>',
                    '<div class = "col col-10 col-offset-20"><p align="center" style="padding-top:2px;padding-bottom:2px;margin:0px;border-radius:5px;background:#4e5dca;color:white;">10</p></div>',
                    '</div>',
                    '<div class="item range range-balanced" style="padding:10px;padding-top:1px;border-width:0px;">',
                    '<p style="text-align: center;color: black;">' + obj.extra.choices[0] + "</p>",
                    '<input type="range" min="' + min + '" max="' + max + '" value="' + min + '" step="' + step + '" ng-model="survey.' + i + '" name="' + i + '" ng-change="inputchanged(\'' + i + '\')"' + '>',
                    '<p style="text-align: center;color:black;">' + obj.extra.choices[1] + "</p>",
                    '</div>',
                ].join(" ");

                /*
                    '<div class = "row">',
                    '<div class = "col col-33"><p align="left" style="padding-top:2px;">0</p></div>',
                    '<div class = "col col-33"><p align="center" style="padding-top:2px;"><b>{{survey.' + i + '}}</b></p></div>',
                    '<div class = "col col-33"><p align="right" style="padding-top:2px;">10</p></div>',
                    '</div>',
                */
            }

            if (obj.type == "range2") {
                var min = obj.extra.choices[2];
                var max = obj.extra.choices[3];
                var step = obj.extra.choices[4];
                $scope.survey[i] = 300;
                survey_string = [survey_string,
                    '<div class = "row">',
                    '<div class = "col col-33 col-offset-67"><p align="center" style="padding:5px;border-radius:25px;background:#303F9F;color:white;"><b>{{survey.' + i + '/60}} hours</b></p></div>',
                    '</div>',
                    '<div class="item range range-balanced" style="padding:10px;border-width:0px;">',
                    '<p style="text-align: center;color: black;">' + obj.extra.choices[0] + "</p>",
                    '<input type="range" min="' + min + '" max="' + max + '" value="' + min + '" step="' + step + '" ng-model="survey.' + i + '" name="' + i + '" ng-change="inputchanged(\'' + i + '\')"' + '>',
                    '<p style="text-align: center;color:black;">' + "10<br>hours" + "</p>",
                    '</div>',
                ].join(" ");
            }


            //------------------------------------------------------                  
            //checkbox  
            //------------------------------------------------------                 
            if (obj.type == "checkbox") {
                survey_string = survey_string + '<div class="list">';
                for (var j = 0; j < obj.extra.choices.length; j++) {
                    survey_string = [survey_string, '<ion-checkbox style="border-color:#fff;border-width: 0px;" ng-model="survey.' + i + 'O' + j + '" ng-change="inputchanged(\'' + i + '\')"' + '>' + obj.extra.choices[j] + '</ion-checkbox>'].join(" ");
                }
                survey_string = survey_string + '</div>';
            }

            survey_string = survey_string + '</div>';
        }
        return survey_string;

    }


});