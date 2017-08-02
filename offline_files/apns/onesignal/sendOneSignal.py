import requests
import json
from firebase import firebase
import time
import datetime


header = {"Content-Type": "application/json; charset=utf-8",
          "Authorization": "Basic OWQzMzA4ODItOTliMC00NDY3LWJhYjgtYmQwN2YyMTk1OTQ2"}

#payload = {"app_id": "ae8ddfb9-a504-41e2-bc97-477017bb925f",
#           "included_segments": ["All"],
#           "contents": {"en": "English Message"}}

# "include_player_ids": ["6392d91a-b206-4b7b-a620-cd68e32c3a76","76ece62b-bcfe-468c-8a78-839aeaa8c5fa","8e0f21fa-9a5a-4ae7-a9a6-ca1f24294b86"],



#######################################
# -- Engagement notifications
#######################################
author_image = '2pac.png';
quote_text = "I love it when you dance like there's nobody there."
author_name = '2pac';
player_id = "cb15d77a-90d3-41ac-af8e-a1a687c6026d"
notification_type = 'engagement'
update_url = '/iOS/engagement_notification/sara-ios-test/-KphoFb1nVKifmLJ18f3'

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







#######################################
# -- Reminder notifications
#######################################
notification_image = 'easy.png';
quote_text = "Do you know it only takes a minute to complete the survey and active tasks in SARA?"
author_name = '2pac';
player_id = "cb15d77a-90d3-41ac-af8e-a1a687c6026d"
notification_type = 'reminder'

payload = {"app_id": "ae8ddfb9-a504-41e2-bc97-477017bb925f",
           "include_player_ids": [player_id],
           "headings": {"en": "Survey reminder for SARA"},
           "contents": {"en": quote_text},
           "ios_attachments": {"id": "https://s3.amazonaws.com/aws-website-sara-ubicomp-h28yp/sarapp/" + notification_image},
           "data": {"image": author_image, "message": quote_text, "author": author_name, "type": notification_type},
           #"buttons": [{"id": "iLike", "text": "Like"}, {"id": "iNope", "text": "Nope"}],
           "ios_badgeType": "Increase",
           "ios_badgeCount": 1,
           "collapse_id": "reminder", 
           "ttl" : 259200,
           "priority": 10}

# 259200, three days

#req = requests.post("https://onesignal.com/api/v1/notifications", headers=header, data=json.dumps(payload))
#print(req.status_code, req.reason)







