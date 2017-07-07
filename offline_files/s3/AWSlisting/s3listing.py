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

client = boto3.client('cognito-sync')

response = client.list_datasets(
    IdentityPoolId='us-east-1:0eb3cb88-6fb5-42a3-ae0b-ca32990ef453',
    IdentityId='us-east-1:0eb3cb88-6fb5-42a3-ae0b-ca32990ef453'
)

print response


