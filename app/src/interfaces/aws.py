import io
import logging
import boto3
import configparser as cp
import os

logger = logging.getLogger(__name__)


class S3_Storage:
    def __init__(self):
        config_parser = cp.ConfigParser()
        creds = config_parser.read("../../config.ini")
        if creds == []:
            logger.warning("Could not find config.ini file")
            return
        creds = config_parser["AWS_CREDENTIALS"]
        self.session = boto3.Session(
            aws_access_key_id=creds["AWS_ACCESS_KEY_ID"],
            aws_secret_access_key=creds["AWS_SECRET_ACCESS_KEY"],
        )
        self.s3 = self.session.resource("s3")

    def list_buckets(self):
        return [bucket.name for bucket in self.s3.buckets.all()]
        
    def upload_file(self, bucket, local_file, dest_file=None):
        if dest_file is None:
            dest_file = local_file.split("/")[-1]
        print(os.listdir())
        with open(local_file, "rb") as data:
            self.s3.Bucket(bucket).put_object(Key=dest_file, Body=data) 

    def download_file(self, bucket, bucket_file, dest_file=None):
        if dest_file is None:
            dest_name = bucket_file
        try:
            response = self.s3.Object(bucket, bucket_file).get()
            with open(dest_file, "wb") as dest_name:
                dest_name.write(response["Body"].read())
        except Exception as e:
            logger.info(f"{bucket_file} does not exist")
