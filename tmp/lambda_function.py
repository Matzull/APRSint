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
    error = 0
    success = 0
    try:
        with gz.GzipFile(fileobj=BytesIO(gz_file), mode="rb") as f:
            for line in f.readlines():
                try:
                    packets.append(parse(line))
                    success += 1
                except Exception:
                    error += 1
        s3.put_object(
            Body=json.dumps(packets).encode("utf-8"),
            Bucket="aprsoutput",
            Key=(key.split(".")[0]) + ".json",
        )
    except Exception as e:
        return {"statusCode": 400, "body": f"Error: {e}"}
    return {"statusCode": 200, "body": f"Success: {success}, Error: {error}"}
