
#
# User Name    Access Key Id    Secret Access Key
# levitsky-experiment-user    AKIAJ2HUZJVMUVSLBIOA    1D8ioP6YxFPgbhwlnK4+m2REybkjFMD5FYWk5OJp
#

# [default]
# Sara config
#
# aws_access_key_id = AKIAJHXFU74S5SDWYHTQ
# aws_secret_access_key = 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
#
#
# Date: Jan 11, 2017
# -- AKIAI2SU3X2R6FIPDSDA
# -- ucMIS2OmhiQocMFwaynSHunH0aSA8k9OzL/qPiET

# Levitsky config
# 
# [default]
# aws_access_key_id = AKIAJ2HUZJVMUVSLBIOA
# aws_secret_access_key = 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


#access_key
#secret_key


import boto3
import json
import datetime
from datetime import datetime, timedelta
import prettytable
import pdb

client = boto3.client("cognito-identity", region_name = "us-east-1")


response = client.list_identities(
    IdentityPoolId='us-east-1:1c7436a4-e3fb-417b-945a-f3a4cc413d9a',
    MaxResults=60,
    HideDisabled=False
)

#pretty print
# print response['Identities'][0]

all_identities = response['Identities'];
i = 1

sync_client = boto3.client('cognito-sync', region_name = "us-east-1")


d = datetime.today() - timedelta(days=0)
date_str = d.strftime("%A") + ', ' + d.strftime("%b %d %Y") 
ts_str = d.strftime("%I:%M %p") 

header = '<html><head><style>tr:nth-child(even){background-color: #f2f2f2}</style></head>'

body3 = '<h2 style="padding:0; margin: 0;">SARA study daily update: </h2>'
body3 = body3 + '<h3 style="padding:0; margin: 0;">' + date_str + '</h3>'
body3 = body3 + '<p style="padding:0; margin: 0;"> Last updated at ' + ts_str + ' today</p>'
body = "<br><br>==============================================================" +  "<br><br><br>"
first_table_body = ""

for i in range(len(all_identities)):
    identityId = all_identities[i]['IdentityId']
    response = sync_client.list_datasets(
        IdentityPoolId = 'us-east-1:1c7436a4-e3fb-417b-945a-f3a4cc413d9a',
        IdentityId = identityId
    )
    #print identityId # + ", " + str(response)

    #
    x = prettytable.PrettyTable(["Date", "Day", "Survey", "Active tasks"])

    #
    all_datasets = response[u'Datasets']
    for j in range(len(all_datasets)):
        # print all_datasets[j][u'DatasetName']
        if all_datasets[j][u'DatasetName'] == 'rl_data':
            # print all_datasets[j][u'DatasetName']
            response = sync_client.list_records(
                        IdentityPoolId='us-east-1:1c7436a4-e3fb-417b-945a-f3a4cc413d9a',
                        IdentityId=identityId,
                        DatasetName='rl_data',
                        MaxResults=223
                    )
            #print response
            #if True:
            #if identityId == 'us-east-1:432c0f2b-12ba-46fc-95f8-28e116d12971':
            #if identityId == 'us-east-1:2d2d720b-b7cb-40c6-b6ea-39c748e80034':
            if identityId != 'us-east-1:213a76cd-de58-4067-bd3b-6f9ac0547cd7':
                #print response
                #print len(response[u'Records'])
                last_day_response = response[u'Records'][-1]
                last_day_response = json.loads(last_day_response[u'Value'])
                last_day_daily_survey = last_day_response[u'survey_data'][u'daily_survey']
                last_day_active_tasks = last_day_response[u'survey_data'][u'active_tasks_survey']
                last_day_weekly_survey = last_day_response[u'survey_data'][u'weekly_survey']
                
                

                #
                username = last_day_response[u'username'];
                print identityId
                print username

                #
                if "focus-group" in username: 
                    continue
                if "mash-N5" in username: 
                    continue                    
                if "user-test" in username: 
                    continue
                if "test-1" in username: 
                    continue      
                if "sara-study-test" in username: 
                    continue
                if "test-0" in username: 
                    continue   

                #start_date = last_day_daily_survey[0]
                # pdb.set_trace()

                #
                if u'money' in last_day_response[u'badges']:
                    money = str(last_day_response[u'badges'][u'money'])
                else:
                    money = "0"
                # pdb.set_trace()


                start_date_dt = datetime.strptime("20200101", "%Y%m%d")
                # start_date = "20200101"
                for key in last_day_response[u'survey_data'][u'daily_survey']:
                    # start_date = key
                    b = datetime.strptime(key, "%Y%m%d")
                    if b < start_date_dt:
                        start_date_dt = b
                        start_date = key
                    #break 
                
                #if "sara-study-7" in username:
                #    pdb.set_trace()


                total_days = 0    
                while True:
                    d = datetime.today() - timedelta(days=total_days)
                    date_str = d.strftime ("%Y%m%d")
                    total_days = total_days + 1
                    if date_str == start_date:
                        start_date2 = d.strftime("%A") + ', ' + d.strftime("%b %d %Y") 
                        break

                #create the html
                #write email content
                #header
                body = body + "<b>User Name</b>: " + username + "<br>"
                body = body + "<b>Id</b>: " + identityId + "<br>"
                
                body = body + "<b>Start date: </b>: " + start_date2 + "<br><br><br>"

                #create the table
                body = body + '<table style="width:400px; border-collapse: collapse;">'
                body = body + '<tr><th style="padding:8px; text-align: left;background-color: #4CAF50;color: white;">Date</th><th style="padding:8px; text-align: left;background-color: #4CAF50;color: white;">Day</th><th style="padding:8px; text-align: left;background-color: #4CAF50;color: white;">Surveys</th><th style="padding:8px; text-align: left;background-color: #4CAF50;color: white;">Active tasks</th><th style="padding:8px; text-align: left;background-color: #4CAF50;color: white;">Dai.Sur Random</th><th style="padding:8px; text-align: left;background-color: #4CAF50;color: white;">Act.Tsk Random</th></tr>'
    
                # 
                data_per_day = [];
                total_ds = 0;
                total_at = 0;
                total_ds_7 = 0;
                total_at_7 = 0;
                total_ds_today = 0;
                total_at_today = 0;

                last_logged_date = ''
                logging_string = ''
                for k in range(30):
                    d = datetime.today() - timedelta(days=k)
                    date_str = d.strftime ("%Y%m%d")
                    day_str = d.strftime ("%A")
                    #print date_str

                    #
                    temp_data_per_day= {}
                    temp_data_per_day['date'] = date_str
                    temp_data_per_day['day'] = day_str

                    #


                    if date_str in last_day_daily_survey:
                        temp_data_per_day['ds'] = last_day_daily_survey[date_str]
                    else:
                        temp_data_per_day['ds'] = 0
                    total_ds = total_ds + temp_data_per_day['ds']    

                    if date_str in last_day_active_tasks:
                        temp_data_per_day['at'] = last_day_active_tasks[date_str]
                    else:
                        temp_data_per_day['at'] = 0
                    total_at = total_at + int(temp_data_per_day['at']/2.0) 

                    logged_count = temp_data_per_day['ds'] + int(temp_data_per_day['at']/2.0)

                    if last_logged_date == '': 
                        if logged_count > 0:
                            last_logged_date = d.strftime("%b %d %Y")

                    if logged_count > 0:        
                        logging_string = logging_string + '|'      
                    else:
                        logging_string = logging_string + '-'  

                    #
                    data_per_day.append(temp_data_per_day)
                    x.add_row([date_str, day_str, temp_data_per_day['ds'], temp_data_per_day['at']])

                    if k == 0:
                        total_ds_today = total_ds
                        total_at_today = total_at

                    if k < 7:
                        total_ds_7 = total_ds
                        total_at_7 = total_at

                    #reinforcement reward data
                    if u'reinfrocement_data' in last_day_response:
                        reinforcement_intervention_reward = last_day_response[u'reinfrocement_data']
                        if date_str in reinforcement_intervention_reward:
                            if u'reward_ds' in reinforcement_intervention_reward[date_str]:
                                reward_ds_rand = str(reinforcement_intervention_reward[date_str][u'reward_ds'])
                            else:
                                reward_ds_rand = '-'

                            if u'reward_at' in reinforcement_intervention_reward[date_str]:    
                                reward_at_rand = str(reinforcement_intervention_reward[date_str][u'reward_at'])
                            else:
                                reward_at_rand = '-'
                        else:
                            reward_ds_rand = '-'
                            reward_at_rand = '-'
                    else:
                        reward_ds_rand = '-'
                        reward_at_rand = '-'
                                 

                    #
                    body = body + '<tr><td style="padding:8px; text-align: left;">' + date_str + '</td><td style="padding:8px; text-align: left;">' + day_str  + '</td><td style="padding:8px; text-align: left;">' + str(temp_data_per_day['ds'])  + '</td><td style="padding:8px; text-align: left;">' + str(temp_data_per_day['at']) + '</td><td style="padding:8px; text-align: left;">' + reward_ds_rand + '</td><td style="padding:8px; text-align: left;">' + reward_at_rand +'</td></tr>'
    
                    if date_str == start_date:
                        break

                #total_at = total_at


                body = body + '</table>'

                #replies overall
                body = body + '<br><br><h4 style="padding:0; margin: 0;">Overall reponse</h4>'
                #body = body + "===========================================" + ""
                body = body + "Survey completed: " + str(total_ds) +  "<br>"
                body = body + "Active tasks completed: " + str(total_at) +  "<br>"
                body = body + "<br><br>==============================================================" +  "<br><br><br>"

                

                print "================================================================"
                print "===    " + username
                print "================================================================"
                print "Start date: " + start_date2
                print "Total days: ", total_days
                print x
                print "Total daily survey: ", total_ds
                print "Total active tasks: ", total_at
                print '\n'


                break

    if "focus-group" in username:
        continue
    if "mash-N5" in username:
        continue                    
    if "user-test" in username:
        continue
    if "test-1" in username: 
        continue
    if "sara-study-test" in username: 
        continue
    if "test-0" in username: 
        continue  

    data_today = str(total_ds_today) + "/" + str(total_at_today) + " (" + str(round(100*(total_ds_today+total_at_today)/2.0,2)) + ")"

    if total_days >= 1: 
        # data_7 = str(total_ds_7) + "/" + str(total_at_7) + " (" + str(round(100*(total_ds_7+total_at_7)/14.0,2)) + ")"
        # total_days
        data_7 = str(total_ds_7) + "/" + str(total_at_7) + " (" + str(round(100*(total_ds_7+total_at_7)/(total_days*2.0),2)) + ")"
    else: 
        data_7 = '--'

    if total_days > 1:     
        data_30 = str(total_ds) + "/" + str(total_at) + " (" + str(round(100*(total_ds+total_at)/(total_days*2.0),2)) + ")"
    else:
        data_30 = '--'

    logging_string = logging_string[::-1]    
    #if round(100*(total_ds_7+total_at_7)/14.0,2) < 50:
    if "-study-" in username:
        first_table_body = first_table_body + '<tr><td style="padding:8px; text-align: left;">' + username  + '</td><td style="padding:8px; text-align: left;">' + str(total_days) + '</td><td style="padding:8px; text-align: left;">' + data_today + '</td><td style="padding:8px; text-align: left;">' + data_7 + '</td><td style="padding:8px; text-align: left;">' + data_30 + '</td><td style="padding:8px; text-align: left;">' + last_logged_date + '</td><td style="padding:8px; text-align: left;">' + logging_string + '</td><td style="padding:8px; text-align: left;">' + money + '</td></tr>' 
    else:
        first_table_body = first_table_body + '<tr style="color: #82B1FF;"><td style="padding:8px; text-align: left;"><b>' + username + '</b></td><td style="padding:8px; text-align: left;"><b>' + str(total_days) + '</b></td><td style="padding:8px; text-align: left;"><b>' + data_today + '</b></td><td style="padding:8px; text-align: left;"><b>' + data_7 + '</b></td><td style="padding:8px; text-align: left;"><b>' + data_30 + '</b></td><td style="padding:8px; text-align: left;"><b>' + last_logged_date + '</b></td><td style="padding:8px; text-align: left;"><b>' + logging_string+ '</b></td><td style="padding:8px; text-align: left;"><b>' + money + '</b></td></tr>'
    i = i + 1



body2 = '<br><br><h3>Summary</h3><b>Stored as: </b> (no_of_survey/no_of_active_tasks)'
body2 = body2 + '<table style="width:1100px; border-collapse: collapse;">'
body2 = body2 + '<tr><th style="padding:8px; text-align: left;background-color: #D32F2F;color: white;">id</th>'
body2 = body2 + '<th style="padding:8px; text-align: left;background-color: #D32F2F;color: white;">Total<br>days</th>'
body2 = body2 + '<th style="padding:8px; text-align: left;background-color: #D32F2F;color: white;">Today</th>'
body2 = body2 + '<th style="padding:8px; text-align: left;background-color: #D32F2F;color: white;">Last<br>7 days</th>'
body2 = body2 + '<th style="padding:8px; text-align: left;background-color: #D32F2F;color: white;">Last<br>30 days</th>'
body2 = body2 + '<th style="padding:8px; text-align: left;background-color: #D32F2F;color: white;">Last<br>seen</th>'
body2 = body2 + '<th style="padding:8px; text-align: left;background-color: #D32F2F;color: white;">Logging over days<br> "|" is yes, "-" is no, (first day to today)</th>'
body2 = body2 + '<th style="padding:8px; text-align: left;background-color: #D32F2F;color: white;">Money</th></tr>'
body2 = body2 + first_table_body
body2 = body2 + '</table><br><br>'

body = header + "<body>" + body3 + body2 + body + "</body></html>"

d = datetime.today()
date_str = d.strftime ("%Y%m%d")

file = open(date_str + '.html', 'w')
file.write(body)
file.close()


file = open("/var/www/html/dailyupdates/" + date_str + '.html', 'w')
file.write(body)
file.close()

file = open("/var/www/html/dailyupdates/" + 'index' + '.html', 'w')
file.write(body)
file.close()




"""
response = client.list_datasets(
    IdentityPoolId='us-east-1:0eb3cb88-6fb5-42a3-ae0b-ca32990ef453',
    IdentityId='us-east-1:0eb3cb88-6fb5-42a3-ae0b-ca32990ef453'
)

print response
"""