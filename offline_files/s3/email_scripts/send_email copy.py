import psycopg2
from prettytable import PrettyTable
import pdb

def print_table(table):
    col_width = [max(len(x) for x in col) for col in zip(*table)]
    for line in table:
        print "| " + " | ".join("{0:{1}}".format(x, col_width[i])
                                for i, x in enumerate(line)) + " |"








###################################################################################################
#
# read data files
#
###################################################################################################

#survey data

conn = psycopg2.connect("dbname='MyBehavior' user='mash' host='localhost' password='123456'")
cur = conn.cursor()
#pdb.set_trace()
cur.execute("select * from survey_data")
rows = cur.fetchall()
cur.close()
conn.close()

print len(rows)


users_response = {}
users_response_time = {}
users_response_ts = {}
for i in range(len(rows)):
    #print rows[i][2]
    if rows[i][2] in users_response:
       users_response[rows[i][2]].append(rows[i][1])
       users_response_time[rows[i][2]].append(rows[i][3])
       users_response_ts[rows[i][2]].append(int(rows[i][1].split('_')[0]))
    else: #rows[i][2] in users_response:
       users_response[rows[i][2]]=[]
       users_response_time[rows[i][2]] = []
       users_response_ts[rows[i][2]] = []
       users_response[rows[i][2]].append(rows[i][1])
       users_response_time[rows[i][2]].append(rows[i][3])
       users_response_ts[rows[i][2]].append(int(rows[i][1].split('_')[0]))
    


#dbr data
conn = psycopg2.connect("dbname='MyBehavior' user='mash' host='localhost' password='123456'")
cur = conn.cursor()
#pdb.set_trace()
cur.execute("select * from dbr_data")
rows = cur.fetchall()
cur.close()
conn.close()

print len(rows)


dbr_response = {}
dbr_response_time = {}
dbr_response_ts = {}
for i in range(len(rows)):
    #print rows[i][2]
    if rows[i][2] in dbr_response:
       dbr_response[rows[i][2]].append(rows[i][1])
       dbr_response_time[rows[i][2]].append(rows[i][3])
       dbr_response_ts[rows[i][2]].append(int(rows[i][1].split('_')[0]))
    else: #rows[i][2] in users_response:
       dbr_response[rows[i][2]]=[]
       dbr_response_time[rows[i][2]] = []
       dbr_response_ts[rows[i][2]] = []
       dbr_response[rows[i][2]].append(rows[i][1])
       dbr_response_time[rows[i][2]].append(rows[i][3])
       dbr_response_ts[rows[i][2]].append(int(rows[i][1].split('_')[0]))
         
       
       
#image data
conn = psycopg2.connect("dbname='MyBehavior' user='mash' host='localhost' password='123456'")
cur = conn.cursor()
#pdb.set_trace()
cur.execute("select * from img_data")
rows = cur.fetchall()
cur.close()
conn.close()

print len(rows)


img_response = {}
img_response_time = {}
img_response_ts = {}
for i in range(len(rows)):
    #print rows[i][2]
    if rows[i][2] in img_response:
       img_response[rows[i][2]].append(rows[i][1])
       img_response_time[rows[i][2]].append(rows[i][3])
       img_response_ts[rows[i][2]].append(1000*float(rows[i][1].split('/')[-1].split('_')[0]))
    else: #rows[i][2] in img_response:
       img_response[rows[i][2]]=[]
       img_response_time[rows[i][2]] = []
       img_response_ts[rows[i][2]] = []
       img_response[rows[i][2]].append(rows[i][1])
       img_response_time[rows[i][2]].append(rows[i][3])
       img_response_ts[rows[i][2]].append(1000*float(rows[i][1].split('/')[-1].split('_')[0]))      
#
#pdb.set_trace()













###################################################################################################
#
# overall
#
###################################################################################################
table2 = PrettyTable(["Count", "IMEI", "Survey Responses", "Database files", "Images uploaded"])
table2.padding_width = 1 
table2.align["IMEI"] = "l"  
j = 1    
for x in users_response_time:
    #print x + ' survey: ' + str(len(users_response_time[x]))
    try:
        xx = [j, x, str(len(users_response_time[x])), str(len(dbr_response_time[x])), '0'] #, str(len(img_response_time[x]))]
        table2.add_row(xx)
        j = j + 1
    except KeyError as e:
        print "Key error, " + x + str(e) 

print table2




#last uploaded
table2 = PrettyTable(["Count", "IMEI", "Survey Responses", "Database files", "Images uploaded"])
table2.padding_width = 1 
table2.align["IMEI"] = "l"  
j = 1    
for x in users_response_time:
    #print x + ' survey: ' + str(len(users_response_time[x]))
    try:
        xx = [j, x, str(max(users_response_time[x])), str(max(dbr_response_time[x])),'0'] # str(max(img_response_time[x]))]
        table2.add_row(xx)
        j = j + 1
    except KeyError as e:
        print "Key error, " + x 

print table2












###################################################################################################
#
# per day
#
###################################################################################################
table2 = PrettyTable(["Count", "IMEI", "Survey Responses", "Database files", "Images uploaded"])
table2.padding_width = 1 
table2.align["IMEI"] = "l"  
j = 1

start_timestamp = 1460694325000 - 7*24*60*60*1000 # 1414976400000 # Nov 3, 2014 1AM

#get last nights time
import datetime
now = datetime.datetime.now()
ts = now.strftime("%s")
end_timestamp = int(ts)*1000 + 24*60*60*1000 #

#survey responses
t_s = start_timestamp
user_data_survey = {}
while True:
    if t_s + 24*60*60*1000 > end_timestamp:
        
        break
    
    #set the limit   
    start_ts = t_s
    end_ts = t_s + 24*60*60*1000
    
    #
    for x in users_response_time:
        try:
            data_x = users_response_ts[x]
            
            count_responses = 0
            for xx in data_x:
                if xx >= start_ts and xx < end_ts:
                     #print xx, start_ts, end_ts, (xx >= start_ts & xx < end_ts), len(data_x)
                     count_responses = count_responses + 1
                     
                            
            if x in user_data_survey:
               pass
            else:
               user_data_survey[x] = {}
            
            if str(start_ts) in user_data_survey[x]:
               pass
            else:
               user_data_survey[x][str(start_ts)] = []
            
            user_data_survey[x][str(start_ts)] = count_responses            
        
        except KeyError as e:
            print "Key error, " + x
        #pdb.set_trace()
    t_s = end_ts    




#Images uploaded
t_s = start_timestamp
user_data_images = {}
while True:
    if t_s + 24*60*60*1000 > end_timestamp:
        break
    
    #set the limit   
    start_ts = t_s
    end_ts = t_s + 24*60*60*1000
    
    #
    for x in img_response_time:
        try:
            data_x = img_response_ts[x]
            
            count_responses = 0
            for xx in data_x:
                if xx >= start_ts and xx < end_ts:
                     #print xx, start_ts, end_ts, (xx >= start_ts & xx < end_ts), len(data_x)
                     count_responses = count_responses + 1
                     
                            
            if x in user_data_images:
               pass
            else:
               user_data_images[x] = {}
            
            if str(start_ts) in user_data_images[x]:
               pass
            else:
               user_data_images[x][str(start_ts)] = []
            
            user_data_images[x][str(start_ts)] = count_responses            
        
        except KeyError as e:
            print "Key error, " + x
        #pdb.set_trace()
    t_s = end_ts


#create plots













###################################################################################################
#
# write per day in a database
#
###################################################################################################

conn = psycopg2.connect("dbname='MyBehavior' user='mash' host='localhost' password='123456'")
cur = conn.cursor()

#delete older entries
cur.execute("Delete from email_every_day_data")
conn.commit()

# images
for x in user_data_images: # for each imei
        try:
            data_x = user_data_images[x]
            for xx in user_data_images[x]:
                reponse_count = user_data_images[x][str(xx)]
                #print 'image: ' , x , xx, reponse_count
                #input into the database
                #
                date_string = datetime.datetime.fromtimestamp(float(xx)/1000.0).strftime('%Y-%m-%d')
                if x == 'null':
                    continue
                cur.execute("insert into email_every_day_data (timestamp, imei, data_type, response_count, timestamp_number, day_string) values ('" + str(xx) + "'," + str(x) + ",'" + "img" + "'," + str(reponse_count) + "," + xx + ",'" + date_string + "')")
                #cur. commit() 
        except KeyError as e:
            print "Key error, " + x	


# survey responses
for x in user_data_survey: # for each imei
        try:
            data_x = user_data_survey[x]
            for xx in user_data_survey[x]:
                reponse_count = user_data_survey[x][str(xx)]
                #print 'image: ' , x , xx, reponse_count
                #input into the database
                #
                date_string = datetime.datetime.fromtimestamp(float(xx)/1000.0).strftime('%Y-%m-%d')
                if x == 'null':
                    continue
                if len(x) == 0:
                    continue
                if '_' in str(x):
                    continue
                if x == 'Dummy':
                    continue
                cur.execute("insert into email_every_day_data (timestamp, imei, data_type, response_count, timestamp_number, day_string) values ('" + str(xx) + "'," + str(x) + ",'" + "survey" + "'," + str(reponse_count) + "," + xx + ",'" + date_string + "')")
                #cur. commit() 
        except KeyError as e:
            print "Key error, " + x	         


conn.commit()
cur.close()
conn.close() 





###################################################################################################
#
# parse the names for storing subject infos.
#
###################################################################################################
conn = psycopg2.connect("dbname='MyBehavior' user='mash' host='localhost' password='123456'")
cur = conn.cursor()

#delete older entries
cur.execute("Delete from users_data")
conn.commit()


with open('subject_data.text') as fp:
    for line in fp:
        #print line
        split_screen = line.split(',')
        
        #users_data (user_name, email, imei, user_study_id) values ('Mash',''ms2749@cornell.edu', '358239055270500','MyBehavior Long Term 1'); 
        cur.execute("insert into users_data (user_name, email, imei, user_study_id) values ('" + split_screen[0] + "','" + split_screen[1] + "','" + split_screen[2][:-1] + "','MyBehavior Long Term 1')")
        
conn.commit()
cur.close()
conn.close() 

#pdb.set_trace()


###################################################################################################
#
# send invidual emails
#
###################################################################################################
import smtplib
import time

SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
sender = 'mashfiqui.r.s@gmail.com'
recipient = 'ms2749@cornell.edu'
subject = 'MyBehavior study update (' + time.strftime("%b %d, %Y") + ")"
subject_base = 'MyBehavior study update (' + time.strftime("%b %d, %Y") + ")"




conn = psycopg2.connect("dbname='MyBehavior' user='mash' host='localhost' password='123456'")
cur = conn.cursor()
#pdb.set_trace()
cur.execute("select * from users_data")
rows1 = cur.fetchall()
cur.close()
conn.close()

#print len(rows)


users_response = {}
users_response_time = {}
users_response_ts = {}
rows1 = []
for i in range(len(rows1)):
    imei = rows1[i][2]
    email = rows1[i][3]
    user_name = rows1[i][1]
    
    #
    # pdb.set_trace()
    #
    
    #
    print "Emailing " + user_name + ", " + email + ", " + imei
    
    
    body = '<h2 style="padding:0; margin: 0;">MyBehavior study daily update</h2>'
    
    subject = subject_base + " -- " + user_name
    
    survey_files = []
    img_files = [] #[4, 51, 10, 11, 20,1]
    conn = psycopg2.connect("dbname='MyBehavior' host='localhost' user='mash' password='123456'")
    cur = conn.cursor()
    
    #images
    cur.execute("select response_count from email_every_day_data where imei = '" + imei + "' and data_type = 'img' order by timestamp_number")
    rows = cur.fetchall()
    for row in rows:
        img_files.append(row[0])
            
    #survey
    cur.execute("select response_count from email_every_day_data where imei = '" + imei + "' and data_type = 'survey' order by timestamp_number")
    rows = cur.fetchall()
    for row in rows:
        survey_files.append(row[0])
    cur.close()
    conn.close()
    
    
    
    #get total replies
    total_survey_files = 0
    for i in range(len(survey_files)):
        total_survey_files = total_survey_files + survey_files[i]
    total_image_files = 0
    for i in range(len(img_files)):
        total_image_files = total_image_files + img_files[i]
    
    #replies in last 7 days
    last_7_survey_files = 0
    last_7_image_files = 0
    
    if len(survey_files) < 7:
        print "   Skipping " +  user_name
        continue
    
    for i in range (1,8):
        last_7_survey_files = last_7_survey_files + survey_files[-1*i]
        last_7_image_files = last_7_image_files + img_files[-1*i]    
    
    
    #link the data
    
    
    
    #write email content
    #header
    body = body + "<b>User Name</b>: " + user_name + "<br>"
    body = body + "<b>IMEI</b>: " + imei + "<br>"
    body = body + "<b>Email address</b>: " + email + "<br><br><br>"
    #body = body + "<b>Start date</b>: " + " Nov 3, 2014 " + "<br><br><br>"
    
    #link for graphs
    body = body + '<a href="http://data.pac.cs.cornell.edu/MyBehavior/usage_report?imei=' + imei + '"><h2 style="padding:0; margin: 0;">Click here to see a timeline of your responses</a></h2>' + "<br><br><br>"
    
    #reply in last 7 days
    body = body + '<h3 style="padding:0; margin: 0;">Your reponses last seven days</h3>'
    #body = body + "===========================================" + "<br>"
    body = body + "Survey completed: " + str(last_7_survey_files) +  "<br>"
    body = body + "Food images logged: " + str(last_7_image_files) +  "<br><br>"
    
    
    #create the table
    body = body + '<table style="width:300px; border: 1px solid black;">'
    body = body + '<tr><th style="padding:1px; text-align: left;">Day</th><th style="padding:1px; text-align: left;">Surveys</th><th style="padding:1px; text-align: left;">Food images</th></tr>'
    
    for i in range (1,8):
        day_ = datetime.datetime.now() - datetime.timedelta(days = (i)) 
        body = body + '<tr><td style="padding:1px; text-align: left;">' + day_.strftime('%b %d') + '</td><td style="padding:1px; text-align: left;">' + str(survey_files[-1*i]) + '</td><td style="padding:1px; text-align: left;">' + str(img_files[-1*i]) + '</td></tr>'
    
    body = body + '</table>'
    
    #replies overall
    body = body + '<br><br><h3 style="padding:0; margin: 0;">Your overall reponse</h3>'
    #body = body + "===========================================" + ""
    body = body + "Survey completed: " + str(total_survey_files) +  "<br>"
    body = body + "Food images logged: " + str(total_image_files) +  "<br><br><br>"
    
    
    
    #send email code
    #make a function afterwards
    #headers = ["From: " + sender,
    #       "Subject: " + subject,
    #       "To: " + recipient,
    #       "MIME-Version: 1.0",
    #       "Content-Type: text/html"]
    #headers = "\r\n".join(headers)
    #session = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    #session.ehlo()
    #session.starttls()
    #session.ehlo 
    #session.login('mashfiqui.r.s', 'shu12925')
    #session.sendmail(sender, recipient, headers + "\r\n\r\n" + body)
    #session.quit()
    
    
    








###################################################################################################
#
# send overall emails
#
###################################################################################################
import smtplib
import time

SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
sender = 'mashfiqui.r.s@gmail.com'
recipient = 'ms2749@cornell.edu'
subject = 'MyBehavior study update (' + time.strftime("%b %d, %Y") + ")"
subject_base = 'MyBehavior study update (' + time.strftime("%b %d, %Y") + ")"




conn = psycopg2.connect("dbname='MyBehavior' user='mash' host='localhost' password='123456'")
cur = conn.cursor()
#pdb.set_trace()
cur.execute("select * from users_data")
rows1 = cur.fetchall()
cur.close()
conn.close()

#print len(rows)
body = '<h2 style="padding:0; margin: 0;">MyBehavior study daily update</h2>'

users_response = {}
users_response_time = {}
users_response_ts = {}
for i in range(len(rows1)):
    imei = rows1[i][2]
    email = rows1[i][3]
    user_name = rows1[i][1]
    
    #
    # pdb.set_trace()
    #
    
    #
    print "Emailing " + user_name + ", " + email + ", " + imei
    
    subject = subject_base + " -- " + user_name
    
    survey_files = []
    img_files = [] #[4, 51, 10, 11, 20,1]
    conn = psycopg2.connect("dbname='MyBehavior' host='localhost' user='mash' password='123456'")
    cur = conn.cursor()
    
    #images
    cur.execute("select response_count from email_every_day_data where imei = '" + imei + "' and data_type = 'img' order by timestamp_number")
    rows = cur.fetchall()
    for row in rows:
        img_files.append(row[0])
            
    #survey
    cur.execute("select response_count from email_every_day_data where imei = '" + imei + "' and data_type = 'survey' order by timestamp_number")
    rows = cur.fetchall()
    for row in rows:
        survey_files.append(row[0])
    cur.close()
    conn.close()
    
    
    
    #get total replies
    total_survey_files = 0
    for i in range(len(survey_files)):
        total_survey_files = total_survey_files + survey_files[i]
    total_image_files = 0
    for i in range(len(img_files)):
        total_image_files = total_image_files + img_files[i]
    
    #replies in last 7 days
    last_7_survey_files = 0
    last_7_image_files = 0
    
    if len(survey_files) < 0:
        print "   Skipping " +  user_name
        continue
    
    for i in range (1,9):
        if i > len(survey_files):
           continue
        last_7_survey_files = last_7_survey_files + survey_files[-1*i]
        last_7_image_files = last_7_image_files + 0 #img_files[-1*i]    
    
    
    #link the data
    print "---- Processing " + user_name    
    
    
    #write email content
    #header
    body = body + "<b>User Name</b>: " + user_name + "<br>"
    body = body + "<b>IMEI</b>: " + imei + "<br>"
    body = body + "<b>Email address</b>: " + email + "<br><br><br>"
    #body = body + "<b>Start date</b>: " + " Nov 3, 2014 " + "<br><br><br>"
    
    #link for graphs
    body = body + '<a href="http://data.pac.cs.cornell.edu/MyBehavior/usage_report?imei=' + imei + '"><h2 style="padding:0; margin: 0;">Click here to see a timeline of your responses</a></h2>' + "<br><br><br>"
    
    #reply in last 7 days
    body = body + '<h3 style="padding:0; margin: 0;">Your reponses last seven days</h3>'
    #body = body + "===========================================" + "<br>"
    body = body + "Survey completed: " + str(last_7_survey_files) +  "<br>"
    body = body + "Food images logged: " + str(last_7_image_files) +  "<br><br>"
    
    
    #create the table
    body = body + '<table style="width:300px; border: 1px solid black;">'
    body = body + '<tr><th style="padding:1px; text-align: left;">Day</th><th style="padding:1px; text-align: left;">Surveys</th><th style="padding:1px; text-align: left;">Food images</th></tr>'
    
    for i in range (1,8):
        if i > len(survey_files):
           print str(survey_files)
           continue
        day_ = datetime.datetime.now() - datetime.timedelta(days = (i)) 
        body = body + '<tr><td style="padding:1px; text-align: left;">' + day_.strftime('%b %d') + '</td><td style="padding:1px; text-align: left;">' + str(survey_files[-1*i]) + '</td><td style="padding:1px; text-align: left;">' + '</td></tr>' #str(img_files[-1*i]) + '</td></tr>'
    
    body = body + '</table>'
    
    #replies overall
    body = body + '<br><br><h3 style="padding:0; margin: 0;">Your overall reponse</h3>'
    #body = body + "===========================================" + ""
    body = body + "Survey completed: " + str(total_survey_files) +  "<br>"
    body = body + "Food images logged: " + str(total_image_files) +  "<br>"
    body = body + "==============================================================" +  "<br><br><br>"
    
    
    
#send email code
#make a function afterwards
#cc = ['fnokeke@gmail.com']
cc = ['ms2749@cornell.edu']
headers = ["From: " + sender,
           "Subject: " + subject,
           "To: " + recipient,
           "MIME-Version: 1.0",
           "Content-Type: text/html"]
headers = "\r\n".join(headers)
session = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
session.ehlo()
session.starttls()
session.ehlo 
session.login('mashfiqui.r.s', 'shu12925')
session.sendmail(sender, [recipient] + cc, headers + "\r\n\r\n" + body)
session.quit()
    
    
    
    
    
                
    
        
""" 
cur = conn.cursor()
        cur.execute(
            "insert into hit (imei, meal_id, phone_food_id, hit_id, hit_type_id, assignment_id, accept_time, submit_time, approval_rejection_time, previous_phone_food_ids) values ('" +
            str(imei) + "'," + str(meal_id) + "," + str(phone_food_id) + ",'" + str(HITId) + "','" + str(HITTypeId) + "'," +
            str(assignment_id) + ",'" + str(accept_time) + "','" + str(submit_time) + "','" + str(approval_rejection_time) + "','" + str(imagePhoneIdsLastN) + "')")
        conn.commit()
        cur.close()
        conn.close()       
for x in users_response_time:
    #print x + ' survey: ' + str(len(users_response_time[x]))
    try:
        xx = [j, x, str(max(users_response_time[x])), str(max(dbr_response_time[x])), str(max(img_response_time[x]))]
        table2.add_row(xx)
        j = j + 1
    except KeyError as e:
        print "Key error, " + x 

print table2
"""
