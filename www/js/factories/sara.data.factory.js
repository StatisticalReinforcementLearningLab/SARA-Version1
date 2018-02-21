var mod = angular.module('sara.data.factory', ['aws.cognito.identity', 'aws.cognito.sync', 'ngCordova']);

mod.factory('saraDatafactory', function(awsCognitoSyncFactory, awsCognitoIdentityFactory, $location, $cordovaFile) {
    var sara = {};
    var cognitoUser = null; //CognitoUser object
    var datasetName = "userdata";
    var data = "kola";
    var key2 = 'key';

    var error = {
        message: null
    };
    var dataset = null; // Cognito Sync dataset object

    sara.testtstr = function() {
        console.log("test str");
    }


    sara.storedata = function(datasetname, data_temp, key_temp) {
        datasetName = datasetname;

        if (datasetname === 'rl_data') {
            if (data_temp['imei'] === "")
                data_temp['imei'] = window.localStorage['imei'] || "";
            data_temp['username'] = window.localStorage['username'] || "";
            window.localStorage['cognito_data'] = JSON.stringify(data_temp);//save the imei now.
            //window.localStorage['last_stored_date'] = key_temp;
        }

        /*
        if(datasetname === 'rl_data'){
            datasetname = 'rl_data_v2';
            key_temp = "data_key";
        }
        */


        data = data_temp;
        key2 = key_temp;
        

        //--- commented for open source            
        //connect();

        //save a local copy
        //var value = data;
        //window.localStorage['score_data'] = JSON.stringify(value);
        //console.log("storing: " + datasetname);

    }

    connect = function() {
        awsCognitoIdentityFactory.getUserFromLocalStorage(function(err, isValid) {
            if (err) {
                //$scope.error.message = err.message;
                console.log(err.message);
                $location.path("/");
                return;
            }
            //if(isValid) $state.go('todo', {}, {reoload: true})
            if (isValid) {
                awsCognitoSyncFactory.connect(datasetName, function(err, dataset_temp) {
                    if (err) $scope.error.message = err.message;
                    else {
                        dataset = dataset_temp;
                        //refreshTasksList();
                        //sync();
                        put();
                    }
                });
            } else
                $location.path("/");

            //$state.go('todo', {}, {reoload: true})
        });
    };

    put = function() {
        //var data_id = moment().format('YYYYMMDD-HH:mm:ss')
        console.log("kola " + datasetName + ", " + last_date);


        if (datasetName === 'rl_data') {
            var last_date = window.localStorage['last_stored_date'] || moment().format('YYYYMMDD');
            //
            // if today's date then don't do anything...
            //last_date = '20170905';

            //
            // new participants: no data, so "last_date" will be today, so no removing
            //
            // reinstall participants: no data for "last_date", so "last_date" will be today, so no removing. Keep past data.
            //
            // retaining participants: we have a "last_date", we delete that. Most days it will happen.
            //
            if(last_date === moment().format('YYYYMMDD')){
                dataset.put(key2, JSON.stringify(data), function(err, record) {
                    if (err) {
                        //$scope.error.message = err.message;
                        console.log("error: " + err.message);
                        return false;
                    }
                    //$scope.tasks[task_id] = $scope.task;
                    //console.log("no error: " + $scope.error.message);
                    //$scope.task = {};

                    sync();
                    //remove earlier record
                });
            }else{
                dataset.remove(last_date, function(err, record) {
                    dataset.put(key2, JSON.stringify(data), function(err, record) {
                        if (err) {
                            //$scope.error.message = err.message;
                            console.log("error: " + err.message);
                            return false;
                        }
                        //$scope.tasks[task_id] = $scope.task;
                        //console.log("no error: " + $scope.error.message);
                        //$scope.task = {};

                        sync();
                        //remove earlier record
                    });
                    //-- console.log(success);
                });
            }

            //
            console.log("from sara.factory.js" + JSON.stringify(data));
            window.localStorage['last_stored_date'] = key2;      

        }else{
            dataset.put(key2, JSON.stringify(data), function(err, record) {
                if (err) {
                    //$scope.error.message = err.message;
                    console.log("error: " + err.message);
                    return false;
                }
                //$scope.tasks[task_id] = $scope.task;
                //console.log("no error: " + $scope.error.message);
                //$scope.task = {};

                sync();
                //remove earlier record
            });
        }

    };


    sync = function(callback2) {
        callback2 = callback2 || undefined;
        return awsCognitoSyncFactory.synchronize(dataset, function(err, state) {
            console.log("syncing: 2: " + err + ", " + datasetName);
            if (err) {
                //$scope.error.message = err.message;
                return false;
            }
            if (callback2 != undefined) {
                callback2();
            }
        });
    };


    refreshTasksList = function() {
        dataset.getAllRecords(function(err, records) {
            //$scope.tasks = {};
            for (i = 0; i < records.length; i++) {
                if (records[i].value.length > 0) console.log("" + i + ", " + records[i].value + ", " + records[i].key);;
            }
        });
    }

    //-- 'game_score', moment().format('YYYYMMDD') + "2", 
    //sara.pullGameScoreData(callback2){
    sara.pullRLData = function(callback2) {
        //sync(function() {


        //---- commented for opensource    
        //sara.pullData('rl_data', "", callback2);
        


        //sara.pullData('rl_data_v2', "", callback2);
        //});
    }

    //-- 'game_score', moment().format('YYYYMMDD') + "2", 
    //sara.pullGameScoreData(callback2){
    sara.pullGameScoreData = function(callback2) {
        //sync(function() {
        sara.pullData('game_score', "", callback2);
        //});
    }

    //
    sara.pullData = function(datasetname, key_temp, callback2) {
        //console.log("datasetname: " + datasetname);
        datasetName = datasetname;
        key2 = key_temp;
        //connect();
        awsCognitoIdentityFactory.getUserFromLocalStorage(function(err, isValid) {
            if (err) {
                //$scope.error.message = err.message;
                
                if (isValid == false) { //means there is no user data in local storage.
                    $location.path("/");
                    return;
                }
            }
            //if(isValid) $state.go('todo', {}, {reoload: true})
            if (isValid) {
                awsCognitoSyncFactory.connect(datasetName, function(err, dataset_temp) {
                    if (err) {
                        //console.log("rl_data_v2: ERROR " + err.message);
                        //$scope.error.message = err.message;
                        callback2(null);
                    } else {
                        //console.log("rl_data_v2: No ERROR " + JSON.stringify(dataset_temp));

                        dataset = dataset_temp;
                        //sync();

                        //-- console.log("Holla");
                        sync(function() {
                        //    sara.pullData('game_score',"",callback2);
                            get(callback2);
                        });
                        //get(callback2);
                    }
                });
            } else
                $location.path("/");

            //$state.go('todo', {}, {reoload: true})
        });
    }

    get = function(callback2) {
        /*
        dataset.get(key2, function(err, value) {
          console.log('myRecord: ' + value);
          callback2(value);
        });
        */

        //ToDo: New user initialization.
        var cognito_data = {};
        cognito_data['survey_data'] = {};
        cognito_data['badges'] = {};
        cognito_data['imei'] = window.localStorage['imei'] || '';
        cognito_data['survey_data']['daily_survey'] = {}; //value['daily_survey'];
        cognito_data['survey_data']['weekly_survey'] = {}; //value['weekly_survey'];
        cognito_data['survey_data']['active_tasks_survey'] = {};
        cognito_data['username'] = window.localStorage['username'] || '';
        cognito_data = JSON.stringify(cognito_data);
        //I will keep the streaks empty since it will be initialized to the right value of nothing is defined.
        //badges will be initialized also if they are not available


        var last_date = window.localStorage['last_stored_date'] || 'unknown';
        console.log("last date: " + last_date);
        //if(last_date === "unknown"){
            dataset.getAllRecords(function(err, records) {
                //$scope.tasks = {};
                //console.log("Error message: " + err);
                var cognito_data2;

                //this is where I am getting the last data point.
                //--- Unnecessary
                //--- 

                //
                //i need to delete the useless ones
                //
                var all_dates = [];

                
                for (i = 0; i < records.length; i++) {
                    if (records[i].value.length > 0) {
                        console.log("" + i + ", " + records[i].value + ", " + records[i].key);
                        last_date = records[i].key;
                        window.localStorage['last_stored_date'] = last_date;
                        cognito_data2 = records[i].value; //write the last value

                        //
                        all_dates.push(last_date);
                    }
                }

                //sync();
                //console.log(JSON.stringify(cognito_data));
                if(cognito_data2 == undefined)
                    cognito_data2 = cognito_data;
                    
                

                //
                callback2(cognito_data2);


                //remove bad dates. This may happen because of syncing 
                if(all_dates.length > 0){
                    //
                    all_dates.pop();//remove the last date, because this is our latest data
                    remove_data_point(all_dates);
                }
                


                //if records length is zero then, we initializing
                if(records.length==0){
                    window.localStorage['cognito_data'] = cognito_data;
                    sara.storedata('rl_data',JSON.parse(cognito_data), moment().format('YYYYMMDD'));
                }

            });
        
        /*}else{
            console.log('last_date: ' + last_date);
            dataset.get(last_date, function(err, value) {
                var cognito_data2 = value;
                console.log('myRecord: ' + value);
                if(cognito_data2 == undefined)
                    cognito_data2 = cognito_data;

                //
                callback2(cognito_data2);


                //if records length is zero then, we initializing
                if(records.length==0){
                    window.localStorage['cognito_data'] = cognito_data;
                    sara.storedata('rl_data',JSON.parse(cognito_data), moment().format('YYYYMMDD'));
                }
            });
        }*/

    };

    remove_data_point = function(all_dates) {
        //
        //dataset.remove(last_date, function(err, record) {
        //});

        //

        //
        var date_to_remove = all_dates.pop();
        if(date_to_remove == undefined){

        }else{
            dataset.remove(date_to_remove, function(err, record) {

                //
                console.log("removed last date: " + date_to_remove);

                //
                if(all_dates.length>0)
                    remove_data_point(all_dates);

                //
                if(all_dates.length==0)
                    sync();
            });
        }

        //
        // for(var i=0; i<all_dates.length; i++)
        //    console.log("before_last_date: " + all_dates[i]);
    }

    //this will return null when file don't exist or not phone.
    sara.loadDataCollectionState = function(callback2) {

        if (ionic.Platform.isAndroid()) {
            var directory = cordova.file.externalRootDirectory;

            $cordovaFile.checkDir(cordova.file.externalRootDirectory, "SensorLogger")
                .then(function(success) {

                    var file_location = "data_at_id.txt";
                    //console.log("File loc: " + directory + "/SensorLogger/data/" + file_location);


                    $cordovaFile.checkFile(directory + "/SensorLogger/", file_location)
                        .then(function(success) {
                            // success
                            $cordovaFile.readAsText(directory + "/SensorLogger/", file_location)
                                .then(function(success) {
                                    // success
                                    //console.log("json content: " + success);
                                    callback2(success);
                                }, function(error) {
                                    // error
                                    callback2(null);
                                });
                        }, function(error) {
                            // error
                            callback2(null);
                        });


                }, function(error) {
                    // error
                    callback2(null);
                });
        } else {
            // error
            callback2(null);
        }
    };


    //this will return null when file don't exist or not phone.
    sara.loadLifeInsightsData = function(callback2) {

        if (ionic.Platform.isAndroid()) {
            var directory = cordova.file.externalRootDirectory;

            $cordovaFile.checkDir(cordova.file.externalRootDirectory, "SensorLogger")
                .then(function(success) {

                    var file_location = "lifeinsightsDS.txt";
                    //console.log("File loc: " + directory + "/SensorLogger/data/" + file_location);


                    $cordovaFile.checkFile(directory + "/SensorLogger/", file_location)
                        .then(function(success) {
                            // success
                            $cordovaFile.readAsText(directory + "/SensorLogger/", file_location)
                                .then(function(success) {
                                    // success
                                    //console.log("json content: " + success);
                                    callback2(success);
                                }, function(error) {
                                    // error
                                    callback2(null);
                                });
                        }, function(error) {
                            // error
                            callback2(null);
                        });


                }, function(error) {
                    // error
                    callback2(null);
                });
        } else {
            // error
            callback2(null);
        }
    };


    sara.loadLifeInsightsLocStepsData = function(callback2) {

        if (ionic.Platform.isAndroid()) {
            var directory = cordova.file.externalRootDirectory;

            $cordovaFile.checkDir(cordova.file.externalRootDirectory, "SensorLogger")
                .then(function(success) {

                    var file_location = "lifeinsightsLOCSTEPS.txt";
                    //console.log("File loc: " + directory + "/SensorLogger/data/" + file_location);


                    $cordovaFile.checkFile(directory + "/SensorLogger/", file_location)
                        .then(function(success) {
                            // success
                            $cordovaFile.readAsText(directory + "/SensorLogger/", file_location)
                                .then(function(success) {
                                    // success
                                    //console.log("json content: " + success);
                                    callback2(success);
                                }, function(error) {
                                    // error
                                    callback2(null);
                                });
                        }, function(error) {
                            // error
                            callback2(null);
                        });


                }, function(error) {
                    // error
                    callback2(null);
                });
        } else {
            // error
            callback2(null);
        }
    };




    //
    sara.saveDataCollectionState = function(value_ds, value_ws) {

        //
        var value_ds_ws = {};
        value_ds_ws['daily_survey'] = value_ds; //value['daily_survey'];
        value_ds_ws['weekly_survey'] = value_ws; //value['weekly_survey'];
        value_ds_ws['username'] = window.localStorage['username'] || 'unknwon2';
        value_ds_ws['score'] = window.localStorage['fish_aquarium_score'] || '0';
        //value_ds_ws['active_tasks_survey'] = value['active_tasks_survey'];

        if (ionic.Platform.isAndroid()) {
            var directory = cordova.file.externalRootDirectory;

            $cordovaFile.checkDir(cordova.file.externalRootDirectory, "SensorLogger")
                .then(function(success) {

                    var file_location = "data_ds_ws.txt";
                    //console.log("File loc: " + directory + "/SensorLogger/data/" + file_location);

                    //$cordovaFile.writeFile(cordova.file.applicationStorageDirectory, file_location, encrypted, true )
                    $cordovaFile.writeFile(directory + "/SensorLogger/", file_location, JSON.stringify(value_ds_ws, null, 4), true)
                        .then(function(success) {
                            // success
                            console.log("File written " + file_location);
                        }, function(error) {
                            // error
                            console.log("ERROR ERROR ERROR ERROR ERROR: " + JSON.stringify(error));
                        });

                }, function(error) {
                    // error
                    $cordovaFile.createDir(directory, "SensorLogger", false)
                        .then(function(success) {
                            // success
                            //call again man
                            sara.copyJSONToFile(data, type);
                        }, function(error) {
                            // error
                            console.log("ERROR: Probably on a device");
                            //means I 
                        });

                });
        }
    };

    //
    sara.copyJSONToFile = function(data, type) {

        var data2 = data;
        data = JSON.stringify(data);
        var encrypted = encrypt(data, "xxxxxxxxxxxxxxx");
        var decrypted = decrypt(encrypted, "xxxxxxxxxxxxxxx");


        var isOpenSource = true;
        if(isOpenSource == true)
            return;


        if (ionic.Platform.isAndroid()) {

            if(type == "active_task"){
                var updates = {};
                var survey_data = {};
                survey_data['username'] = window.localStorage['username'] || "unknwon";
                survey_data['ts'] = new Date().getTime();
                survey_data['readableTs'] = moment().format('MMMM Do YYYY, h:mm:ss a ZZ');
                survey_data['data'] = encrypted;
                //survey_data['decrypted'] = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
                //survey_data['regId'] = $ionicPush.token;
                //survey_data['ts'] = new Date().getTime();
                //survey_data['readableTs'] = moment().format('MMMM Do YYYY, h:mm:ss a ZZ');

                updates['/android/data/' + survey_data['username'] + "/" + type + "/" + moment().format('YYYYMMDD-HHmmss')] = survey_data;
                //updates['/iOS/HistoryRegToken/' + newPostKey] = data;
                firebase.database().ref().update(updates);

            }else{
                var directory = cordova.file.externalRootDirectory;


                $cordovaFile.checkDir(cordova.file.externalRootDirectory + "/SensorLogger/", "data")
                    .then(function(success) {

                        var file_location = type + "_" + moment().format('YYYYMMDD-HHmmss') + ".txt";
                        //console.log("File loc: " + directory + "/SensorLogger/data/" + file_location);

                        //$cordovaFile.writeFile(cordova.file.applicationStorageDirectory, file_location, encrypted, true )
                        $cordovaFile.writeFile(directory + "/SensorLogger/data/", file_location, encrypted, true)
                            .then(function(success) {
                                // success
                                console.log("File written " + file_location);
                            }, function(error) {
                                // error
                                console.log("ERROR ERROR ERROR ERROR ERROR: " + JSON.stringify(error));
                            });

                    }, function(error) {
                        // error
                        $cordovaFile.createDir(directory + "/SensorLogger/", "data", false)
                            .then(function(success) {
                                // success
                                //call again man
                                sara.copyJSONToFile(data, type);
                            }, function(error) {
                                // error
                                console.log("ERROR: Probably on a device");
                                //means I 
                        });

                    });
            }


        }



        //data = JSON.parse(data);
        sara.copyDailtSurveyForLifeInsight(data2,type);
    };


    //
    sara.copyDailtSurveyForLifeInsight = function(data, type) {
        //

        //var h = sjcl.codec.hex, count = 2048 ;
        //var salt = h.fromBits(sjcl.random.randomWords('10','0'));
        //var encrypted_message = sjcl.encrypt("password", JSON.stringify(data),{count:2048,salt:salt,ks:256});
        //var encrypted_message = sjcl.encrypt("password", JSON.stringify(data),{count:2048,ks:256});
        //var encrypted_message = window.sjcl.encrypt("password", "data");
        //console.log("Encrypted: " + encrypted_message);
        //console.log("Decrypted: " + window.sjcl.decrypt("password", encrypted_message));

        var isOpenSource = true;
        if(isOpenSource == true)
            return;


        data = JSON.stringify(data);
        var encrypted = encrypt(data, "xxxxxxxxxxxxxxx");
        var decrypted = decrypt(encrypted, "xxxxxxxxxxxxxxx");
        //console.log("Encrypted: " + encrypted);
        //console.log("Decrypted: " + decrypted.toString(CryptoJS.enc.Utf8));

        if (ionic.Platform.isAndroid()) {
            var directory = cordova.file.externalRootDirectory;
            //directory = directory.slice(7);

            // success
            //

            //var Crypt = new Crypt();  // constructor  
            /*** encrypt */

            //var ciphertext = CryptoJS.AES.encrypt("plaintext", "Secret Passphrase");  
            // H3fAh9bppeg=xuHy8woEtOfYYI18tLM76A==BKUvKCztSNl8  

            /*** decrypt */
            //var plaintext  = CryptoJS.AES.decrypt(ciphertext, "Secret Passphrase"); 
            //var xxx =  "" + encrypted.toString();


            $cordovaFile.checkDir(cordova.file.externalRootDirectory + "/SensorLogger/", "lifeinsight")
                .then(function(success) {

                    var file_location = moment().format('YYYYMMDD') + ".txt";
                    //console.log("File loc: " + directory + "/SensorLogger/data/" + file_location);

                    //$cordovaFile.writeFile(cordova.file.applicationStorageDirectory, file_location, encrypted, true )
                    $cordovaFile.writeFile(directory + "/SensorLogger/lifeinsight/", file_location, encrypted, true)
                        .then(function(success) {
                            // success
                            console.log("File written " + file_location);
                        }, function(error) {
                            // error
                            console.log("ERROR ERROR ERROR ERROR ERROR: " + JSON.stringify(error));
                        });

                }, function(error) {
                    // error
                    $cordovaFile.createDir(directory + "/SensorLogger/", "lifeinsight", false)
                        .then(function(success) {
                            // success
                            //call again man
                            sara.copyDailtSurveyForLifeInsight(data, type);
                        }, function(error) {
                            // error
                            console.log("ERROR: Probably on a device");
                            //means I 
                });
            });
        }
    };



    //
    sara.copyUsageStats = function(data) {
        //

        //var h = sjcl.codec.hex, count = 2048 ;
        //var salt = h.fromBits(sjcl.random.randomWords('10','0'));
        //var encrypted_message = sjcl.encrypt("password", JSON.stringify(data),{count:2048,salt:salt,ks:256});
        //var encrypted_message = sjcl.encrypt("password", JSON.stringify(data),{count:2048,ks:256});
        //var encrypted_message = window.sjcl.encrypt("password", "data");
        //console.log("Encrypted: " + encrypted_message);
        //console.log("Decrypted: " + window.sjcl.decrypt("password", encrypted_message));



        //data = JSON.stringify(data);
        //var encrypted = data;
        //var encrypted = encrypt(data, "Z&wz=BGw;%q49/<)");
        //var decrypted = decrypt(encrypted, "Z&wz=BGw;%q49/<)");
        //console.log("Encrypted: " + encrypted);
        //console.log("Decrypted: " + decrypted.toString(CryptoJS.enc.Utf8));


        var isOpenSource = true;
        if(isOpenSource == true)
            return;

        var string_to_write = moment().format('x') + "," + JSON.stringify(data);

        var existing_usage_data = window.localStorage["usage_data"] || '';
        if(existing_usage_data === ''){ //no data is available
            existing_usage_data = {};
            existing_usage_data['date'] = '';
        }else
            existing_usage_data = JSON.parse(existing_usage_data);

        //check if the date is today. We won't keep old records.
        if(existing_usage_data['date'] === moment().format('YYYYMMDD')){
        }else{
            existing_usage_data['date'] = moment().format('YYYYMMDD');
            existing_usage_data['data'] = [];//we start a new one;
        }
        //{'view':'main','status':'resume'}
        existing_usage_data['data'].push({'view':data.view, 'status': data.status, 'ts':moment().format('x'), 'readable_ts':moment().format("YYYY-MM-DD H:mm:ss a ZZ")});   
        //existing_usage_data['data'] = [];
        window.localStorage["usage_data"] = JSON.stringify(existing_usage_data);


        if (ionic.Platform.isAndroid()) {
            var directory = cordova.file.externalRootDirectory;
            $cordovaFile.checkDir(cordova.file.externalRootDirectory + "/SensorLogger/", "data")
                .then(function(success) {

                    var file_location = moment().format('YYYYMMDD') + "_usage.txt";
                    //console.log("File loc: " + directory + "/SensorLogger/data/" + file_location);


                    //$cordovaFile.writeFile(cordova.file.applicationStorageDirectory, file_location, encrypted, true )
                    //--- lifeinsight/
                    $cordovaFile.writeFile(directory + "/SensorLogger/data/", file_location, JSON.stringify(existing_usage_data, null, 4), true)
                        .then(function(success) {
                            // success
                            console.log("File written " + file_location);
                        }, function(error) {
                            // error
                            console.log("ERROR ERROR ERROR ERROR ERROR: " + JSON.stringify(error));
                        });

                }, function(error) {
                    // error
                    $cordovaFile.createDir(directory + "/SensorLogger/", "data", false)
                        .then(function(success) {
                            // success
                            //call again man
                            sara.copyDailtSurveyForLifeInsight(data, type);
                        }, function(error) {
                            // error
                            console.log("ERROR: Probably on a device");
                            //means I 
                });
            });
        }

    };


    encrypt = function(msg, pass) {

        // Code goes here
        var keySize = 256;
        var ivSize = 128;
        var iterations = 100;

        //var message = "Hello World";
        //var password = "Secret Password";
        var salt = CryptoJS.lib.WordArray.random(128 / 8);

        var key = CryptoJS.PBKDF2(pass, salt, {
            keySize: keySize / 32,
            iterations: iterations
        });

        var iv = CryptoJS.lib.WordArray.random(128 / 8);

        var encrypted = CryptoJS.AES.encrypt(msg, key, {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC

        });

        // salt, iv will be hex 32 in length
        // append them to the ciphertext for use  in decryption
        var transitmessage = salt.toString() + iv.toString() + encrypted.toString();
        return transitmessage;
    };

    decrypt = function(transitmessage, pass) {

        // Code goes here
        var keySize = 256;
        var ivSize = 128;
        var iterations = 100;

        var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
        var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
        var encrypted = transitmessage.substring(64);

        var key = CryptoJS.PBKDF2(pass, salt, {
            keySize: keySize / 32,
            iterations: iterations
        });

        var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC

        });
        return decrypted;
    };


    


    return sara;

});