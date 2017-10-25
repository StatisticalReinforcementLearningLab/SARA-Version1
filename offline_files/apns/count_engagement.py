import json
from pprint import pprint
import pdb


with open('engagment_notiications.json') as data_file:    
    data = json.load(data_file)
pprint(data)
pdb.set_trace()