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
cur.execute("select * from survey_data")
rows = cur.fetchall()
cur.close()
conn.close()
print len(rows)

users_response = {}
users_response_time = {}
users_response_ts = {}
for i in range(len(rows)):
    if rows[i][2] in users_response:
       users_response[rows[i][2]].append(rows[i][1])
       users_response_time[rows[i][2]].append(rows[i][3])
       users_response_ts[rows[i][2]].append(int(rows[i][1].split('_')[0]))
    else:
       users_response[rows[i][2]]=[]
       users_response_time[rows[i][2]] = []
       users_response_ts[rows[i][2]] = []
       users_response[rows[i][2]].append(rows[i][1])
       users_response_time[rows[i][2]].append(rows[i][3])
       users_response_ts[rows[i][2]].append(int(rows[i][1].split('_')[0]))
    


#dbr data
conn = psycopg2.connect("dbname='MyBehavior' user='mash' host='localhost' password='123456'")
cur = conn.cursor()
cur.execute("select * from dbr_data")
rows = cur.fetchall()
cur.close()
conn.close()
print len(rows)

dbr_response = {}
dbr_response_time = {}
dbr_response_ts = {}
for i in range(len(rows)):
    if rows[i][2] in dbr_response:
       dbr_response[rows[i][2]].append(rows[i][1])
       dbr_response_time[rows[i][2]].append(rows[i][3])
       dbr_response_ts[rows[i][2]].append(int(rows[i][1].split('_')[0]))
    else:
       dbr_response[rows[i][2]]=[]
       dbr_response_time[rows[i][2]] = []
       dbr_response_ts[rows[i][2]] = []
       dbr_response[rows[i][2]].append(rows[i][1])
       dbr_response_time[rows[i][2]].append(rows[i][3])
       dbr_response_ts[rows[i][2]].append(int(rows[i][1].split('_')[0]))    







###################################################################################################
#
# overall
#
###################################################################################################

# How many files uploaded
table2 = PrettyTable(["Id", "IMEI", "Survey Responses", "Database files"])
table2.padding_width = 1 
table2.align["IMEI"] = "l"  
j = 1    
for x in users_response_time:
    #print x + ' survey: ' + str(len(users_response_time[x]))
    try:
        xx = [j, x, str(len(users_response_time[x])), str(len(dbr_response_time[x]))]
        table2.add_row(xx)
        j = j + 1
    except KeyError as e:
        print "Key error, " + x + str(e) 

print table2


#last uploaded
table2 = PrettyTable(["Id", "IMEI", "Survey Responses", "Database files"])
table2.padding_width = 1 
table2.align["IMEI"] = "l"  
j = 1    
for x in users_response_time:
    #print x + ' survey: ' + str(len(users_response_time[x]))
    try:
        xx = [j, x, str(max(users_response_time[x])), str(max(dbr_response_time[x]))]
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




#dbr uploaded
t_s = start_timestamp
user_data_dbrs = {}
while True:
    if t_s + 24*60*60*1000 > end_timestamp:
        break
    
    #set the limit   
    start_ts = t_s
    end_ts = t_s + 24*60*60*1000
    
    #
    for x in dbr_response_time:
        try:
            data_x = dbr_response_ts[x]
            
            count_responses = 0
            for xx in data_x:
            	xx = xx * 1000 # covert to ms
                if xx >= start_ts and xx < end_ts:
                     #print xx, start_ts, end_ts, (xx >= start_ts & xx < end_ts), len(data_x)
                     count_responses = count_responses + 1
                     
                            
            if x in user_data_dbrs:
               pass
            else:
               user_data_dbrs[x] = {}
            
            if str(start_ts) in user_data_dbrs[x]:
               pass
            else:
               user_data_dbrs[x][str(start_ts)] = []
            
            user_data_dbrs[x][str(start_ts)] = count_responses            
        
        except KeyError as e:
            print "Key error, " + x
        #pdb.set_trace()
    t_s = end_ts


#create plots
#pdb.set_trace()






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

# dbrs
for x in user_data_dbrs: # for each imei
        try:
            data_x = user_data_dbrs[x]
            for xx in user_data_dbrs[x]:
                reponse_count = user_data_dbrs[x][str(xx)]
                #print 'image: ' , x , xx, reponse_count
                #input into the database
                #
                date_string = datetime.datetime.fromtimestamp(float(xx)/1000.0).strftime('%Y-%m-%d')
                if x == 'null':
                    continue
                cur.execute("insert into email_every_day_data (timestamp, imei, data_type, response_count, timestamp_number, day_string) values ('" + str(xx) + "'," + str(x) + ",'" + "dbr" + "'," + str(reponse_count) + "," + xx + ",'" + date_string + "')")
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
#pdb.set_trace()


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


#with open('subject_data.text') as fp:
with open('/Users/mash/Desktop/email_scripts/subject_data_cbp.text') as fp:	
    for line in fp:
        #print line
        split_screen = line.split(',')
        
        #users_data (user_name, email, imei, user_study_id) values ('Mash',''ms2749@cornell.edu', '358239055270500','MyBehavior Long Term 1'); 
        cur.execute("insert into users_data (user_name, email, imei, user_study_id) values ('" + split_screen[0] + "','" + split_screen[1] + "','" + split_screen[2][:-1] + "','MyBehavior CBP Trial 1')")
        
conn.commit()
cur.close()
conn.close() 

#pdb.set_trace()




