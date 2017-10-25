import random
from datetime import datetime, timedelta
from firebase import firebase
import json
import pdb

def getRandomInt(N): 
    rand_prob = random.randint(0,1000000)
    return rand_prob%N, rand_prob 



#==============================================================================================================================
#
# Generate dates
#
#==============================================================================================================================
print "-----------------------------------------------------"
TOTAL_DAYS = 365
def create_dates():
    start_date_dt = datetime.strptime("20170821", "%Y%m%d")
    print "Start date: " + start_date_dt.strftime ("%Y%m%d")
    d = start_date_dt

    days_enumeration = {}
    for i in range(TOTAL_DAYS):
        d = d + timedelta(days=1)
        date_str = d.strftime ("%Y%m%d")
        # print date_str
        # days_enumeration_obj = {}
        # days_enumeration_obj['date'] = date_str
        # days_enumeration_obj['number'] = i
        days_enumeration[date_str] = i
        # days_enumeration.append(days_enumeration_obj)

    #print days_enumeration    
    return days_enumeration

DATE_ENUMERATION = create_dates()
# d = datetime.today()
# date_str = d.strftime ("%Y%m%d")
# print days_enumeration[date_str]



#==============================================================================================================================
#
# Return all the randomizations
#
#==============================================================================================================================
print "-----------------------------------------------------"
def return_randomizations():
    total_sum = 0
    for j in range(1):
        x_engagment = []
        total = 0
        for i in range(TOTAL_DAYS):
            a,b = getRandomInt(2)
            total = total + a
            x_engagment.append(a)
        # print total
        # print x

        x_engagment_msg = []
        for i in range(TOTAL_DAYS):
            if x_engagment[i] == 0: 
                x_engagment_msg.append(-1)
            else:
                a,b = getRandomInt(38)
                total = total + a
                x_engagment_msg.append(a)

        x_reminder_rand_1 = []
        for i in range(TOTAL_DAYS):
            a,b = getRandomInt(2)
            total = total + a
            x_reminder_rand_1.append(a)
        # print total
        # print x2


        x_reminder_rand_2 = []
        for i in range(TOTAL_DAYS):
            if x_reminder_rand_1[i] == 0: 
                x_reminder_rand_2.append(-1)
            else:
                a,b = getRandomInt(3)
                total = total + a
                x_reminder_rand_2.append(a)
        # print total
        # print x3



        total_sum = total_sum + total

    return x_engagment, x_engagment_msg, x_reminder_rand_1, x_reminder_rand_2

print "Randomizations, " + str(return_randomizations())




print "-----------------------------------------------------"
#==============================================================================================================================
#
# For each user geneerate a new randomization and save. Do nothing if user already exist
#
#==============================================================================================================================
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


    firebase2 = firebase.FirebaseApplication('https://sara-3529f.firebaseio.com/', None)
    result = firebase2.get('/iOS/RegToken', None)
    for username in result:
        # print username

        if username in prior_users:
            print "User " + username + " alrady exist. No randomization is added"
        else:
            print "Adding randomization for user " + username
            randomization_obj = {}
            for date_str in DATE_ENUMERATION:
                randomization_obj[date_str] =  {}
                date_enum = DATE_ENUMERATION[date_str]
                x_engagment, x_engagment_msg, x_reminder_rand_1, x_reminder_rand_2 = return_randomizations()
                randomization_obj[date_str]['randomization_engagement'] = x_engagment[date_enum]
                randomization_obj[date_str]['randomization_engagement_message'] = x_engagment_msg[date_enum]
                randomization_obj[date_str]['randomization_reminder_level_1'] = x_reminder_rand_1[date_enum]
                randomization_obj[date_str]['randomization_reminder_level_2'] = x_reminder_rand_2[date_enum]


            # firebase4 = firebase.FirebaseApplication('https://sara-3529f.firebaseio.com/', None)

            # firebase3 = firebase.FirebaseApplication('https://sara-3529f.firebaseio.com/', None)
            # result = firebase3.post('/iOS/randomizations/' + engagement_notification_data['username'], engagement_notification_data)    
            # print randomization_obj
            firebase3 = firebase.FirebaseApplication('https://sara-3529f.firebaseio.com/', None)
            result = firebase3.post('/iOS/randomizations/' + username, randomization_obj)
            ALL_RANDOMIZATION_DATA[username] = randomization_obj 
            # print json.dumps(randomization_obj, sort_keys=True, indent=4)

        # break
get_randomization_for_each_user()
# print json.dumps(ALL_RANDOMIZATION_DATA, sort_keys=True, indent=4)



#==============================================================================================================================
#
# Return randomizations
#
#==============================================================================================================================
print "-----------------------------------------------------"
def return_randomizations_for_user(username,type):

    # get today's date
    d = datetime.today()
    date_str = d.strftime ("%Y%m%d")
    
    randomization_data_for_today_for_username = ALL_RANDOMIZATION_DATA[username][date_str]
    return randomization_data_for_today_for_username[type]


    #print days_enumeration[date_str]

# 
# test code
# print "randomization_engagement: " + str(return_randomizations_for_user('sara-study-29', 'randomization_engagement'))
# print "randomization_engagement_message: " + str(return_randomizations_for_user('sara-study-29', 'randomization_engagement_message'))
# print "randomization_reminder_level_1: " + str(return_randomizations_for_user('sara-study-29', 'randomization_reminder_level_1'))
# print "randomization_reminder_level_2: " + str(return_randomizations_for_user('sara-study-29', 'randomization_reminder_level_2'))
# 
print "-----------------------------------------------------"






"""
==============================================================================================================================
Checking the codes
==============================================================================================================================

x = []
total = 0


####### Check the 0,1 randomization
for i in range(10):
    a,b = getRandomInt(2)
    total = total + a
    x.append(a)
print total
print x



####### Check the 0-38 randomizaiton for engagement message
dist = {}
for i in range(10000):
    rand_num,b = getRandomInt(38) 
    if str(rand_num) in dist:
        dist[str(rand_num)] = dist[str(rand_num)] + 1
    else:
        dist[str(rand_num)] = 1
print dist



####### Check the 0-2 randomizaiton for reminder message
total_0 = 0
total_1 = 0
total_2 = 0
for i in range(1000):
    x,b = getRandomInt(3)
    if x == 0:
        total_0 = total_0 + 1
    if x == 1:
        total_1 = total_1 + 1
    if x == 2:
        total_2 = total_2 + 1    

print total_0, total_1, total_2

print getRandomInt(2)

"""