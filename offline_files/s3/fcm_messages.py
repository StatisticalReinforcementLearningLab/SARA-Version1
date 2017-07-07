import sys
sys.path.append('/usr/local/lib/python2.7/dist-packages')

import json
import urllib2
from firebase import firebase

fcm_server_url = 'https://fcm.googleapis.com/fcm/send'
authorization_key = 'AAAAwaZwkxo:APA91bH4kuhPcHWrHQE32oeQREZyxbg1Lccjb-T35jFbRK8VH7_bVodcIuzXRvmEg2IGr_yWrWxH_vTstmvXWvm_k9IMB6kku3gHMX4EZeRLYwoYLmUp-XDBOZVMkZaWoP5DJPBlER4h'
#authorization_key = 'AIzaSyAxSOGACTluGQfQdQnVmGAe_ZqD1alr8C0'

xx = "key=" + authorization_key
headers = {'Authorization': xx, 'Content-Type': "application/json"}


data_message = {
    "Nick" : "Web mario",
    "body" : "great match!",
    "Room" : "PortugalVSDenmark"
}



#get the id of others from the FCM
firebase = firebase.FirebaseApplication('https://sara-3529f.firebaseio.com/', None)
result = firebase.get('/fcm', None)
print(result)

for imei in result:

    #
    user = result[imei]

    #
    if 'token' not in user:
       print("No key for " + imei)
       continue

    token = user['token']
    print("Token " + token)

    fcm_id = token #'cXB_uTNcuWg:APA91bG7J7DJNawqBwkdXFl2qKhmhFyiCUbCq4ac2tR5Tu_nFyoxr7FAIt30ySkxgXQiMspF2nT2f2guczvt4xHZz0nqOwAzyCS8kT3i-uQFr_CgRN6A2ozoBr7TQgi8y2RDE9uIDSaw'
    payload = {}
    payload["data"] = data_message
    payload["to"] = fcm_id
    payload["priority"] = "high"
    data = json.dumps(payload)

    req = urllib2.Request(fcm_server_url, data, headers)
    f = urllib2.urlopen(req)
    response = f.read()
    f.close()

