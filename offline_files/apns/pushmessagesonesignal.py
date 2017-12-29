from apns import APNs, Frame, Payload
import random
from firebase import firebase
import datetime
import os.path
import json
from pprint import pprint
import time
import pdb
import pyrebase
import logging
import threading
import datetime
import requests
import json 
import os.path
import os

_logger = logging.getLogger()
_logger.setLevel(logging.DEBUG)

CERT_FILE = '/home/ubuntu/SARA/apns/apns-dev-cert.pem'
# CERT_FILE = 'apns-dev-cert.pem';
if os.path.isfile(CERT_FILE): # if file exist then we are on server
    CERT_FILE = "/home/ubuntu/SARA/apns/apns-prod-cert-Jul15.crt.pem"
    KEY_FILE = "/home/ubuntu/SARA/apns/apns-prod-cert-Jul15.key.pem"
    FISH_JSON_FILE = "/home/ubuntu/SARA/apns/fishpoints.json"
else:
    # CERT_FILE = 'apns-prod-cert-Jul15.pem'
    # CERT_FILE = 'apns-dev-cert.pem'
    CERT_FILE = "apns-prod-cert-Jul15.crt.pem"
    KEY_FILE = "apns-prod-cert-Jul15.key.pem"
    FISH_JSON_FILE = 'fishpoints.json'
print "CERT_FILE: " + CERT_FILE

print "Connecting to APNs"
#apns-prod-cert-Jul15.key.pem
#apns-prod-cert-Jul15.crt.pem



#### Get pre-randomize results
ALL_RANDOMIZATION_DATA = {}
def get_randomization_for_each_user():

    #already in database
    firebase3 = firebase.FirebaseApplication('https://sara-3529f.firebaseio.com/', None)
    result = firebase3.get('/iOS/randomizations', None)

    # get all prior users
    prior_users = {}
    if result == None:
        print "No prior user found"
    else:
        for username in result:
            # print "Prior, " +  username
            prior_users[username] = username

            #get prior user's randomization
            # print username
            rand_data_all = result[username]
            for key in rand_data_all:
                rand_data = rand_data_all[key]
                # print json.dumps(rand_data, sort_keys=True, indent=4)
                # pdb.set_trace()
                ALL_RANDOMIZATION_DATA[username] = rand_data
                break
get_randomization_for_each_user()


#### Get pre-randomize results
def return_randomizations_for_user(username,type_of_randomization):

    # get today's date
    d = datetime.datetime.today()
    date_str = d.strftime ("%Y%m%d")
    
    randomization_data_for_today_for_username = ALL_RANDOMIZATION_DATA[username][date_str]
    return randomization_data_for_today_for_username[type_of_randomization]

def write_log_to_file(text):
    d1 = datetime.datetime.today()
    date_str = d1.strftime("%b %d %Y %H:%M:%S %Z")
    text = date_str + "---" + text + "\n"
    if os.path.isfile('/home/ubuntu/SARA/apns/apns-dev-cert.pem'):
        with open("/var/www/html/dailyupdates/log.txt", "r+") as f:
            content = f.read()
            f.seek(0, 0)
            f.write(text.rstrip('\r\n') + '\n' + content)
    else:
        with open("log.txt", "r+") as f:
            content = f.read()
            f.seek(0, 0)
            f.write(text.rstrip('\r\n') + '\n' + content)



apns = APNs(use_sandbox=False, cert_file=CERT_FILE, key_file=KEY_FILE, enhanced=True)
# apns = APNs(use_sandbox=False, cert_file=CERT_FILE, enhanced=True)
# print "error message listener"

# a global variable with all the messages
frame = Frame() 
hasMessage = False

def executeSomething():
    #code here
    time.sleep(5)
    #print "Awake " + str(hasMessage)
    # print frame
    if hasMessage == True:
        apns.gateway_server.register_response_listener(response_listener)
        print "Sending all messages"
        apns.gateway_server.send_notification_multiple(frame)

        # 
        _logger.debug("getting msg from feedback server...")
        for (token, failed_time) in apns.feedback_server.items():
            _logger.debug("failed: " + str(token) + "\tmsg: " + str(failed_time))
t1 = threading.Thread(target=executeSomething, args=[])
t1.start()

def response_listener(error_response):
    # print "client get error-response: " + str(error_response)
    _logger.debug("client get error-response: " + str(error_response))



def send_message(token_hex, message, header, extra):
    # Send an iOS 10 compatible notification
    #token_hex = '85257c7ddadfac725b6d0188bfae585f3058a7ed188b7eadeb79826fd7c10f77'

    # alert={"title": header, "body": message}
    # payload
    payload = Payload(alert=message, sound="default", badge=1, custom={'extra': extra})
    identifier = random.getrandbits(32)
    print "Send notifications called"
    # apns.gateway_server.send_notification(token_hex, payload, identifier=identifier)

    # identifier = 1
    if extra["type"] == "reminder":
        expiry_time = datetime.datetime.now().replace(hour=23, minute=59)
        expiry = time.mktime(expiry_time.timetuple())
    if extra["type"] == "engagement":
        expiry_time = datetime.datetime.now().replace(hour=18, minute=00)
        expiry = time.mktime(expiry_time.timetuple()) #time.time()+3600

    priority = 10
    global hasMessage
    #print "hasMsg: " + str(hasMessage)
    hasMessage = True
    #print "hasMsg: " + str(hasMessage)
    frame.add_item(token_hex, payload, identifier, expiry, priority)
    

# A number between 0...N-1
def getRandomInt(username,type_of_randomization): 
    # rand_prob = random.randint(0,1000000)
    # return rand_prob%N
    return return_randomizations_for_user(username,type_of_randomization)


#########################################################################################################
#
#  reminder notification
#   
#########################################################################################################
def send_reminder_notifications_onesignal(quote_text, notification_image, player_id, username):
    #######################################
    # -- Engagement notifications
    #######################################
    header = {"Content-Type": "application/json; charset=utf-8",
              "Authorization": "Basic OWQzMzA4ODItOTliMC00NDY3LWJhYjgtYmQwN2YyMTk1OTQ2"}

    #notification_image = 'easy.png';
    #quote_text = "Do you know it only takes a minute to complete the survey and active tasks in SARA?"
    #author_name = '2pac';
    #player_id = "cb15d77a-90d3-41ac-af8e-a1a687c6026d"
    notification_type = 'reminder'

    notification_text = "\n\n1 survey, 2 active tasks remaining"

    #
    reminder_notification_data = {}

    #randomization codes
    rand_prob = getRandomInt(username,'randomization_reminder_level_1') #getRandomInt(2) #random.randint(0,1) #zero or one 
    reminder_notification_data['primary-randomization'] = rand_prob
    # rand_prob = 1
    if rand_prob == 0: #
        quote_text = "Don't forget to complete the surveys and active tasks on SARA" + notification_text
        notification_image = 'fishjournal.png'
        reminder_notification_data['secondary-randomization'] = -1
    else:
        rand_prob2 = getRandomInt(username,'randomization_reminder_level_2') # getRandomInt(3) #random.randint(0,2)
        reminder_notification_data['secondary-randomization'] = rand_prob2

        #
        # rand_prob2 = 2
        if rand_prob2 == 0:
            quote_text = "Do you know it only takes a minute to complete the survey and active tasks in SARA?" + notification_text
            notification_image = 'easy.png'

        else:
            firebase2 = firebase.FirebaseApplication('https://sara-3529f.firebaseio.com/', None)
            result = firebase2.get('/iOS/userdata/' + username, None)
            daily_streak = result[u'streak'] # this is the final streak we have got.. this what we need.
            point = result[u'score']
            last_log_date = result[u'lastlogdate']

            # fix the "last_log_date", because if it is earlier than today, we are done.
            if last_log_date != datetime.datetime.now().strftime ("%Y%m%d"):
                daily_streak = 0
            # print(result)

            # daily_streak = 27
            #------ streak info
            if rand_prob2 == 1:
                if daily_streak == 0:
                    reminder_text = "Do you know that if you input data in SARA for consecutive days then you can earn money?" + notification_text
                    image_name = "green.png";

                if (daily_streak >=1) and (daily_streak < 3):
                    reminder_text = "You are " + str(3-daily_streak) +  " day(s) away from finishing a 3 day streak and earn some money" + notification_text
                    image_name = "green.png";

                if (daily_streak >=3) and (daily_streak < 6):
                    reminder_text = "You are " + str(6-daily_streak) +  " day(s) away from finishing a 6 day streak and earn some money" + notification_text
                    image_name = "blue.png"

                if (daily_streak >=6) and (daily_streak < 9):
                    # aBitmap = BitmapFactory.decodeResource(context.getResources(), R.drawable.red);
                    reminder_text = "You are " + str(9-daily_streak) +  " day(s) away from finishing a 9 day streak and earn some money" + notification_text
                    image_name = "red.png"

                if (daily_streak >=9) and (daily_streak < 12):
                    reminder_text = "You are " + str(12-daily_streak) +  " day(s) away from finishing a 12 day streak and earn some money" + notification_text
                    image_name = "bronze.png";

                if (daily_streak >=12) and (daily_streak < 18):
                    reminder_text = "You are " + str(18-daily_streak) +  " day(s) to finishing a 18 day streak and earn some money" + notification_text
                    image_name = "red.png"

                if (daily_streak >=18) and (daily_streak < 24):
                    reminder_text = "You are " + str(24-daily_streak) +  " day(s) to finishing a 24 day streak and earn some money" + notification_text
                    image_name = "bronze.png"

                if daily_streak >=24:
                    reminder_text = "You are " + str(30-daily_streak) +  " day(s) to finishing a 30 day streak and earn some money" + notification_text
                    image_name = "gold.png";

                image_name = "fiftycent.png";
                quote_text = reminder_text
                notification_image = image_name

            # daily_streak = 27
            # streak 
            if rand_prob2 == 2:
                reminder_text = "You are close to unlocking the clown fish."  + notification_text;
                #reminder_text2 = "Close to unlocking a fish...";
                image_name = "fishimg/nemo.png";

                #

                with open(FISH_JSON_FILE) as json_data:
                    fish_data = json.load(json_data)
                    for i in range(len(fish_data)): #();i++){
                        obj = fish_data[i];
                        fish_point = obj["points"];
                        if point < fish_point:
                            image_name = obj["img"];
                            reminder_text = "You are close to unlocking the " + obj["name"] + "."  + notification_text;
                            break

                quote_text = reminder_text
                notification_image = image_name


    # 
    d = datetime.datetime.now()
    
    unixtime = time.mktime(d.timetuple())
    reminder_notification_data['whenScheduledTs'] = unixtime
    reminder_notification_data['whenScheduledReadableTs'] = time.strftime("%b %d %Y %H:%M:%S %Z", time.localtime(unixtime))
    reminder_notification_data['whenNotifiedTs'] = unixtime
    reminder_notification_data['whenNotifiedReadableTs'] = time.strftime("%b %d %Y %H:%M:%S %Z", time.localtime(unixtime))

    
    
    reminder_notification_data['text'] = quote_text
    reminder_notification_data['img'] = notification_image

    firebase3 = firebase.FirebaseApplication('https://sara-3529f.firebaseio.com/', None)

    result = firebase3.post('/iOS/reminder_notification/'+ username, reminder_notification_data)
    # print result
    key = str(result[u'name'])

    update_url = '/iOS/reminder_notification/'+ username  + "/" + key

    payload = {"app_id": "ae8ddfb9-a504-41e2-bc97-477017bb925f",
               "include_player_ids": [player_id],
               "headings": {"en": "Time to checkin on SARA"},
               "contents": {"en": quote_text},
               "ios_attachments": {"id": "https://s3.amazonaws.com/aws-website-sara-ubicomp-h28yp/sarapp/" + notification_image},
               "data": {"image": "author_image", "message": "quote_text", "author": "author_name", "type": notification_type, "url": update_url},
               #"buttons": [{"id": "iLike", "text": "Like"}, {"id": "iNope", "text": "Nope"}],
               "ios_badgeType": "Increase",
               "ios_badgeCount": 1,
               "collapse_id": "reminder", 
               "delayed_option": "timezone",
               "delivery_time_of_day": "6:00PM",
               "ttl" : 259200,
               "priority": 10}

    # send reminder request
    #"""
    req = requests.post("https://onesignal.com/api/v1/notifications", headers=header, data=json.dumps(payload))
    print(req.status_code, req.reason)

    delivery_status_data = {}
    delivery_status_data['whenDeliveredTs'] = time.mktime(d.timetuple())
    unixtime = time.mktime(d.timetuple())
    delivery_status_data['whenDeliveredReadbleTs'] = time.strftime("%b %d %Y %H:%M:%S %Z", time.localtime(unixtime))
    delivery_status_data['req_status'] = req.status_code
    delivery_status_data['req_data'] = req.reason
    firebase3 = firebase.FirebaseApplication('https://sara-3529f.firebaseio.com/', None)
    result = firebase3.post(update_url + "/delivery_status", delivery_status_data)
    #"""


def send_reminder_notifications():
    reminder_message = "Don't forget to complete the surveys on SARA to unlock new fishes and other rewards!!"
    reminder_header = "Reminder"
    #token_hex = '85257c7ddadfac725b6d0188bfae585f3058a7ed188b7eadeb79826fd7c10f77'

    #get all the tokens
    firebase2 = firebase.FirebaseApplication('https://sara-3529f.firebaseio.com/', None)
    result = firebase2.get('/iOS/RegToken', None)
    print(result)


    for username in result:

        #
        if result[username]['regId'] == "decomissioned":
            player_id = str(result[username]['oneSignalId'])
            quote_text = "Do you know it only takes a minute to complete the survey and active tasks in SARA?"
            notification_image = 'easy.png'
            try: 
                send_reminder_notifications_onesignal(quote_text, notification_image, player_id, username)
                write_log_to_file(" Reminder message to " + username  + " sent successfully")
            except:
                write_log_to_file(" ERROR: Reminder message to " + username  + " was not sent successfully")
                pass     
        else:
            token_hex = str(result[username]['regId']['token'])
            #print token_hex
            extra = {"type": "reminder"}
            send_message(token_hex, reminder_message, reminder_header, extra)

#
# send_message(token_hex, reminder_message, reminder_header)
current_time = datetime.datetime.now()
#print "current_time: "  + str(current_time.hour)
# if current_time.hour==18 and current_time.minute <15:
# if current_time.hour==21 and current_time.minute <15:
if current_time.hour==0 and current_time.minute <45 and current_time.minute >=30:
    send_reminder_notifications()
else:
    print "It is not time to send reminder notifications"
# send_reminder_notifications()







#########################################################################################################
#
#  engagement notification
#   
#########################################################################################################
def schedule_engagement_notifications():
    print "ScheduleEngagment notification"
            
    # resolve server file name        
    ENG_NOTI_FILE = '/home/ubuntu/SARA/apns/engagment_notiications.json'
    # CERT_FILE = 'apns-dev-cert.pem';
    if os.path.isfile(ENG_NOTI_FILE): # if file exist then we are on server
        pass
    else:
        ENG_NOTI_FILE = 'engagment_notiications.json'

    #get all the tokens and users
    firebase2 = firebase.FirebaseApplication('https://sara-3529f.firebaseio.com/', None)
    result = firebase2.get('/iOS/RegToken', None)
    print(result)


    for username in result:
        with open(ENG_NOTI_FILE) as data_file:    
            engagement_data = json.load(data_file)
            #pprint(data)
            #print len(engagement_data)

            engagement_notification_data = {}
            engagement_notification_data['username'] = username

            rand_prob = getRandomInt(username,'randomization_engagement') # getRandomInt(2) #random.randint(0,1) #zero or one    
            engagement_notification_data['isRandomized'] = rand_prob

            if rand_prob == 1:
                #get a random message
                #index = random.randint(0,59)
                index = getRandomInt(username,'randomization_engagement_message') # getRandomInt(38)
                #print engagement_data[index][u'quote']
                #print engagement_data[index][u'author']
                engagement_notification_data['quote'] = engagement_data[index][u'quote']
                engagement_notification_data['author'] = engagement_data[index][u'author']
                engagement_notification_data['img'] = engagement_data[index][u'img']
                #

            d = datetime.datetime.now()
            unixtime = time.mktime(d.timetuple())
            engagement_notification_data['whenScheduledTs'] = unixtime
            engagement_notification_data['whenScheduledReadableTs'] = time.strftime("%b %d %Y %H:%M:%S %Z", time.localtime(unixtime))
            

            # get a random time between 10AM to 6PM
            d = d.replace(hour=16, minute=00)
            # print d
            # print random.randint(0,8*60*60)
            unixtime = time.mktime(d.timetuple()) #+ random.randint(0,8*60*60)
            engagement_notification_data['whenNotifiedTs'] = unixtime
            engagement_notification_data['whenNotifiedReadbleTs'] = time.strftime("%b %d %Y %H:%M:%S %Z", time.localtime(unixtime))
            engagement_notification_data['isNotified'] = 0

            firebase3 = firebase.FirebaseApplication('https://sara-3529f.firebaseio.com/', None)
            result = firebase3.post('/iOS/engagement_notification/' + engagement_notification_data['username'], engagement_notification_data)
            write_log_to_file("Scheduling engagement message for " + username)
                #print result
            #for 

current_time = datetime.datetime.now()
#print "current_time: "  + str(current_time.hour)
if current_time.hour==0 and current_time.minute <15:
    schedule_engagement_notifications()
else:
    print "It is not time to schedule engagement notifications"
# schedule_engagement_notifications()




#####################################
# --- send engagment notifications
#####################################
## send_engagement_notifications_onesignal(author, quote, engagement_data['img'], player_id, engagement_data_key, username)
def send_engagement_notifications_onesignal(author_name, quote_text, author_image, player_id, engagement_key, username):
    #######################################
    # -- Engagement notifications
    #######################################
    header = {"Content-Type": "application/json; charset=utf-8",
              "Authorization": "Basic OWQzMzA4ODItOTliMC00NDY3LWJhYjgtYmQwN2YyMTk1OTQ2"}


    #author_image = '2pac.png';
    #quote_text = "I love it when you dance like there's nobody there."
    #author_name = '2pac';
    #player_id = "cb15d77a-90d3-41ac-af8e-a1a687c6026d"
    notification_type = 'engagement'
    update_url = '/iOS/engagement_notification/'+ username +'/' + engagement_key

    payload = {"app_id": "ae8ddfb9-a504-41e2-bc97-477017bb925f",
               "include_player_ids": [player_id],
               "headings": {"en": "A quote from '" + author_name + "'"},
               "contents": {"en": "\"" + quote_text + "\"\n\nDon't forget to log in SARA tonight."},
               "ios_attachments": {"id": "https://s3.amazonaws.com/aws-website-sara-ubicomp-h28yp/sarapp/engagement_images/" + author_image},
               "data": {"image": author_image, "message": quote_text, "author": author_name, "type": notification_type, "url": update_url},
               "buttons": [{"id": "iLike", "text": "Like"}, {"id": "iNope", "text": "Nope"}],
               "ios_badgeType": "Increase",
               "ios_badgeCount": 1,
               "collapse_id": "engagement", 
               "delayed_option": "timezone",
               "delivery_time_of_day": "4:00PM",
               "ttl" : 259200,
               "priority": 10}

    # 259200, three days

    req = requests.post("https://onesignal.com/api/v1/notifications", headers=header, data=json.dumps(payload))
    print(req.status_code, req.reason)

    #store delivery status
    d = datetime.datetime.now()
    delivery_status_data = {}
    delivery_status_data['whenDeliveredTs'] = time.mktime(d.timetuple())
    unixtime = time.mktime(d.timetuple())
    delivery_status_data['whenDeliveredReadbleTs'] = time.strftime("%b %d %Y %H:%M:%S %Z", time.localtime(unixtime))
    delivery_status_data['req_status'] = req.status_code
    delivery_status_data['req_data'] = req.reason
    firebase3 = firebase.FirebaseApplication('https://sara-3529f.firebaseio.com/', None)
    result = firebase3.post(update_url + "/delivery_status", delivery_status_data)


def send_engagement_notifications():
    #1. run through all users I have
    #2. then see if any notification is within next 15 minutes, if it is then send.

    #get all the tokens and users
    config = {
        "apiKey": "AIzaSyAcu9Zd2zBwZvA-XC0H715h9fJd-WG9Nr4",
        "authDomain": "sara-3529f.firebaseapp.com",
        "databaseURL": "https://sara-3529f.firebaseio.com",
        "projectId": "sara-3529f",
        "storageBucket": "sara-3529f.appspot.com",
        "messagingSenderId": "831721083674"
    };
    py_firebase = pyrebase.initialize_app(config)
    db = py_firebase.database()

    firebase2 = firebase.FirebaseApplication('https://sara-3529f.firebaseio.com/', None)
    result = firebase2.get('/iOS/RegToken', None)
    print(result)
    
    #
    for username in result:

        #token for sending push notifications
        


        firebase2 = firebase.FirebaseApplication('https://sara-3529f.firebaseio.com/', None)
        result_engagement = firebase2.get('/iOS/engagement_notification/' + username, None)
        # print(result_engagement)

        if result_engagement == None:
            continue

        #1. get current time
        d = datetime.datetime.now()
        unixtime = time.mktime(d.timetuple())

        #2. see if the time is right to send
        for engagement_data_key in result_engagement:
            engagement_data = result_engagement[engagement_data_key]
            whenNotifiedTs = engagement_data['whenNotifiedTs']
            whenNotifiedTs = int(whenNotifiedTs)

            #---- at 4PM...
            # d = d.replace(hour=16, minute=01)
            # d = d.replace(hour=18, minute=38)
            # whenNotifiedTs = time.mktime(d.timetuple())

            # print "username: " + username + ", key: " + engagement_data_key + "time: " + str(whenNotifiedTs) + "," + str(unixtime)

            #debug code
            #if (whenNotifiedTs > 1507492702) and (whenNotifiedTs < 1507492902):
            #    whenNotifiedTs = 1507492802
            #    unixtime = 1507492702
            # 
            whenNotifiedTs = whenNotifiedTs + 240 # add two minutes so all notifications are delivered, because we will start sending at 4PM, if the time is 4:00:02

            # if (unixtime<=whenNotifiedTs) and ((unixtime+15*60)>whenNotifiedTs): #correct one
            # if unixtime<=whenNotifiedTs: 
            # if unixtime>=whenNotifiedTs and unixtime<(whenNotifiedTs+15*60*4*24): 
                # print "222 username: " + username + ", key: " + engagement_data_key
            # if True:
            if unixtime<whenNotifiedTs: # today at 4PM, unixtime at 12:15AM will be less than only for todays "whenNotifiedTs" and higher than any one else.
                if engagement_data['isRandomized'] == 1:
                    db.child("iOS").child("engagement_notification").child(username).child(engagement_data_key).update({"isNotified": 1})

                    author = engagement_data['author']
                    quote = engagement_data['quote']

                    #
                    engagement_message = author + ": " + quote #author + ": " + 
                    if len(engagement_message) > 75:
                        engagement_message = engagement_message[:75] + '..'
                    engagement_header = "Inspirtational quote for today"

                    #
                    # print engagement_message
                    # print engagement_header

                    if result[username]['regId'] == "decomissioned":
                        player_id = str(result[username]['oneSignalId'])
                        # send_engagement_notifications_onesignal(author_name,quote_text,author_image,player_id,engagement_key)
                        try: 
                            send_engagement_notifications_onesignal(author, quote, engagement_data['img'], player_id, engagement_data_key, username)
                            write_log_to_file(" Engagement message to " + username  + " sent successfully")
                        except:
                            write_log_to_file(" ERROR: Engagement message to " + username  + " was not sent successfully")
                            pass    
                    else:
                        token_hex = str(result[username]['regId']['token'])
                        extra = {"type": "engagement", "author": author, "message": quote, "image": engagement_data['img']}
                        engagement_message = 'Quote from "' + author + '": ' + quote + "." #" " + quote
                        send_message(token_hex, engagement_message, engagement_header, extra)
            else:
                pass
                # print "it is not time to send engagement message or not randomized"        

            #pdb.set_trace()

# send_engagement_notifications()

# send_engagement_notifications()
if current_time.hour==0 and current_time.minute <30 and current_time.minute >=15:
    # schedule_engagement_notifications()
    send_engagement_notifications()
else:
    print "It is not time to send engagement notifications"



def send_demo_notifications():
    print "demo notification"
    header = {"Content-Type": "application/json; charset=utf-8",
              "Authorization": "Basic OWQzMzA4ODItOTliMC00NDY3LWJhYjgtYmQwN2YyMTk1OTQ2"}

    quote_text = "demo notification"
    notification_type = 'reminder'
    update_url = 'null'
    notification_image = ""
    notification_image = 'fishjournal.png'
    player_id = '82b74b76-1efc-401f-8f67-19dd6829c2f9'
    payload = {"app_id": "ae8ddfb9-a504-41e2-bc97-477017bb925f",
               "include_player_ids": [player_id],
               "headings": {"en": "Time to checkin on SARA"},
               "contents": {"en": quote_text},
               "ios_attachments": {"id": "https://s3.amazonaws.com/aws-website-sara-ubicomp-h28yp/sarapp/" + notification_image},
               "data": {"image": "author_image", "message": "quote_text", "author": "author_name", "type": notification_type, "url": update_url},
               #"buttons": [{"id": "iLike", "text": "Like"}, {"id": "iNope", "text": "Nope"}],
               "ios_badgeType": "Increase",
               "ios_badgeCount": 1,
               "collapse_id": "reminder2", 
               "ttl" : 259200,
               "delayed_option": "timezone",
               "delivery_time_of_day": "9:55PM",
               "priority": 10}
    req = requests.post("https://onesignal.com/api/v1/notifications", headers=header, data=json.dumps(payload))           
    #req = requests.post(("https://onesignal.com/api/v1/notifications", headers=header, data=json.dumps(payload))
    print(req.status_code, req.reason)
    #print json.dumps(r.json(), indent=4, sort_keys=False) 
    # pass

# send_demo_notifications()



# save the last 30 days data
def get_30_day_notifications():
    #
    # req = requests.post("https://onesignal.com/api/v1/notifications", headers=header, data=json.dumps(payload))
    header = {"Content-Type": "application/json; charset=utf-8",
              "Authorization": "Basic OWQzMzA4ODItOTliMC00NDY3LWJhYjgtYmQwN2YyMTk1OTQ2"}
    r = requests.get("https://onesignal.com/api/v1/notifications?app_id=" + "ae8ddfb9-a504-41e2-bc97-477017bb925f" + "&limit=1&offset=0", headers=header)
    print json.dumps(r.json(), indent=4, sort_keys=False)

    last_30_day_count = r.json()
    last_30_day_count = last_30_day_count['total_count']
    print last_30_day_count

    #
    offset = 0
    last_30_day_count = last_30_day_count - last_30_day_count%50
    last_30_day_count = last_30_day_count + 1
    all_notifications = []
    print last_30_day_count
    for i in range(last_30_day_count):
        if ((i+1)%50==0) or (i==(last_30_day_count-1)):
            print i+1, offset
        else:
            continue

        #
        r = requests.get("https://onesignal.com/api/v1/notifications?app_id=" + "ae8ddfb9-a504-41e2-bc97-477017bb925f" + "&limit=50&offset=" + str(offset), headers=header)
        notifications = r.json()
        notifications = notifications['notifications']#['id']
        all_notifications.extend(notifications)
        offset = offset + 50

    print len(all_notifications)
    # pdb.set_trace()

    if os.path.isfile('/home/ubuntu/SARA/apns/apns-dev-cert.pem'): # if file exist then we are on server
        COG_BACKUP_DIRECTORY = "/home/ubuntu/SARA/noti_data/"
    else:
        COG_BACKUP_DIRECTORY = "./noti_data/"


    if not os.path.exists(COG_BACKUP_DIRECTORY):
        os.makedirs(COG_BACKUP_DIRECTORY)

    d = datetime.datetime.today()
    date_str = d.strftime ("%Y%m%d")
    json_file = open(COG_BACKUP_DIRECTORY + '/' + date_str + ".txt","w")
    json_file.write(json.dumps(all_notifications, indent=4, sort_keys=True)) 
    json_file.close()

if current_time.hour==23 and current_time.minute <45 and current_time.minute >=30:
    get_30_day_notifications()
else:
    print "Not time to save notification data"


# Test codes
# write_log_to_file("holla")
# print "randomization_engagement: " + str(return_randomizations_for_user('sara-study-29', 'randomization_engagement')) #return_randomizations_for_user(username,type_of_randomization)
# print "randomization_engagement: " + str(getRandomInt('sara-study-29', 'randomization_engagement'))
# print "randomization_engagement: " + str(getRandomInt('sara-study-29', 'randomization_engagement'))
# print "randomization_engagement_message: " + str(getRandomInt('sara-study-29', 'randomization_engagement_message'))
# print "randomization_reminder_level_1: " + str(getRandomInt('sara-study-29', 'randomization_reminder_level_1'))
# print "randomization_reminder_level_2: " + str(getRandomInt('sara-study-29', 'randomization_reminder_level_2'))



# engagment notification
def error_check():
    print "error message listener"
    def response_listener(error_response):
        print "client get error-response: " + str(error_response)
    apns.gateway_server.register_response_listener(response_listener)

    #New APNS connection
    print "earlier APNs results"
    feedback_connection = APNs(use_sandbox=True, cert_file=CERT_FILE, key_file=KEY_FILE ,enhanced=True)
    # Get feedback messages.
    for (token_hex, fail_time) in feedback_connection.feedback_server.items():
        # do stuff with token_hex and fail_time
        print token_hex
        print fail_time
error_check()