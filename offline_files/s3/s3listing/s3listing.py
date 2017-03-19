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
import datetime
import time
s3 = boto3.resource('s3')
buckets = s3.buckets.all()

print "list all buckets"
for bucket in buckets:
    print bucket.name



bucket = s3.Bucket('sara-umich')
for o in bucket.objects.filter(Prefix='v1/', Delimiter='/'): #all(): #filter(Delimiter='/'):
   print(o.key + ", " + o.last_modified.strftime("%Y-%m-%d %H:%M:%S"))
#   print(o.key + ", " + str(time.mktime(o.last_modified.timetuple())))


client = boto3.client('s3')
response = client.put_object(
        Bucket='sara-umich',
        Body='',
        Key='v1/201701/'
        )

def create_folders():
    for i in range(1,13): #months
        #response = client.put_object(Bucket='sara-umich',Body='',Key='v1/201701/')
        for j in range(1,32): #days
            key_str = 'v1/2017' + str(i).zfill(2) + '/2017' + str(i).zfill(2) + str(j).zfill(2) + "/"
            print key_str
            response = client.put_object(Bucket='sara-umich',Body='',Key=key_str)

            key_str = 'v1/2017' + str(i).zfill(2) + '/2017' + str(i).zfill(2) + str(j).zfill(2) + "/activetasks/"
            #print key_str
            response = client.put_object(Bucket='sara-umich',Body='',Key=key_str)

            key_str = 'v1/2017' + str(i).zfill(2) + '/2017' + str(i).zfill(2) + str(j).zfill(2) + "/sensors/"
            #print key_str
            response = client.put_object(Bucket='sara-umich',Body='',Key=key_str)

            key_str = 'v1/2017' + str(i).zfill(2) + '/2017' + str(i).zfill(2) + str(j).zfill(2) + "/survey/"
            #print key_str
            response = client.put_object(Bucket='sara-umich',Body='',Key=key_str)

    #break

# bucket = s3.Bucket('levitsky-experiment')
# for o in bucket.objects.filter(Delimiter='/'):
#   print(o.key + ", " + o.last_modified.strftime("%Y-%m-%d %H:%M:%S"))
   #print(o.key + ", " + str(time.mktime(o.last_modified.timetuple()))) 


# get the ids
# then get the dates and times, who is lagging behind for today.
# 
#
