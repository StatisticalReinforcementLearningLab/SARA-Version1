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


_logger = logging.getLogger()
_logger.setLevel(logging.DEBUG)

CERT_FILE = '/home/ubuntu/SARA/apns/apns-dev-cert.pem'
# CERT_FILE = 'apns-dev-cert.pem';
if os.path.isfile(CERT_FILE): # if file exist then we are on server
    CERT_FILE = "/home/ubuntu/SARA/apns/apns-prod-cert-Jul15.crt.pem"
    KEY_FILE = "/home/ubuntu/SARA/apns/apns-prod-cert-Jul15.key.pem"
else:
    # CERT_FILE = 'apns-prod-cert-Jul15.pem'
    # CERT_FILE = 'apns-dev-cert.pem'
    CERT_FILE = "apns-prod-cert-Jul15.crt.pem"
    KEY_FILE = "apns-prod-cert-Jul15.key.pem"
print "CERT_FILE: " + CERT_FILE

print "Connecting to APNs"
#apns-prod-cert-Jul15.key.pem
#apns-prod-cert-Jul15.crt.pem

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
    



#########################################################################################################
#
#  reminder notification
#   
#########################################################################################################
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
        token_hex = str(result[username]['regId']['token'])
        print token_hex

        extra = {"type": "reminder"}
        #
        send_message(token_hex, reminder_message, reminder_header, extra)

#
# send_message(token_hex, reminder_message, reminder_header)
current_time = datetime.datetime.now()
#print "current_time: "  + str(current_time.hour)
if current_time.hour==18 and current_time.minute <15:
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

            rand_prob = random.randint(0,1) #zero or one    
            engagement_notification_data['isRandomized'] = rand_prob

            if rand_prob == 1:
                #get a random message
                index = random.randint(0,59)
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
            d = d.replace(hour=10, minute=00)
            print d
            print random.randint(0,8*60*60)
            unixtime = time.mktime(d.timetuple()) + random.randint(0,8*60*60)
            engagement_notification_data['whenNotifiedTs'] = unixtime
            engagement_notification_data['whenNotifiedReadbleTs'] = time.strftime("%b %d %Y %H:%M:%S %Z", time.localtime(unixtime))
            engagement_notification_data['isNotified'] = 0

            firebase3 = firebase.FirebaseApplication('https://sara-3529f.firebaseio.com/', None)
            result = firebase3.post('/iOS/engagement_notification/' + engagement_notification_data['username'], engagement_notification_data)
                #print result
            #for 

current_time = datetime.datetime.now()
#print "current_time: "  + str(current_time.hour)
if current_time.hour==1 and current_time.minute <15:
    schedule_engagement_notifications()
else:
    print "It is not time to schedule engagement notifications"
#schedule_engagement_notifications()




#####################################
# --- send notifications
#####################################
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
        token_hex = str(result[username]['regId']['token'])

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

            #
            if unixtime<=whenNotifiedTs and (unixtime+15*60)>whenNotifiedTs: #correct one
            # if unixtime<=whenNotifiedTs: 
            # if unixtime>=whenNotifiedTs and unixtime<(whenNotifiedTs+15*60*4*24): 
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

                    #
                    extra = {"type": "engagement", "author": author, "message": quote, "image": engagement_data['img']}

                    engagement_message = 'Quote from "' + author + '": ' + quote + "." #" " + quote
                    #
                    #
                    send_message(token_hex, engagement_message, engagement_header, extra)
            else:
                pass
                # print "it is not time to send engagement message or not randomized"        

            #pdb.set_trace()



send_engagement_notifications()












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