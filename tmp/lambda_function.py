import json
import boto3
import gzip as gz
from io import BytesIO
from aprslib import parse

def lambda_handler(event, context):
    s3 = boto3.client("s3")
    bucket = event["Records"][0]["s3"]["bucket"]["name"]
    key = event["Records"][0]["s3"]["object"]["key"]
    response = s3.get_object(Bucket=bucket, Key=key)
    gz_file = response["Body"].read()
    packets = []
    with gz.GzipFile(fileobj=BytesIO(gz_file), mode='rb') as f:
        for line in f.readlines():
            try:
                packets.append(parse(line))
            except Exception as e:
                print("Error parsing line: " + line.decode("utf-8") + " With error: " + str(e))

    return {
        'statusCode': 200,
        'body': json.dumps(packets)
    }