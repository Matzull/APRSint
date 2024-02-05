from tqdm import tqdm
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
        self.s3 = self.session.client("s3")

    def list_buckets(self):
        return [bucket["Name"] for bucket in self.s3.list_buckets()["Buckets"]]
        
    def upload_file(self, bucket, local_file, dest_file=None):
        if dest_file is None:
            dest_file = local_file.split("/")[-1]
        with tqdm(total= os.path.getsize(local_file),  desc=f'Destination: s3://{bucket}/{dest_file}', bar_format="{percentage:.1f}%|{bar:25} | {rate_fmt} | {desc}",  unit='B', unit_scale=True, unit_divisor=1024) as pbar:
            self.s3.upload_file(local_file, bucket, dest_file, Callback=pbar.update)

    def download_file(self, bucket, bucket_file, dest_file=None):
        if dest_file is None:
            dest_file = bucket_file
        try:
            meta_data = self.s3.head_object(Bucket=bucket, Key=bucket_file)
            total_length = int(meta_data.get('ContentLength', 0))
            with tqdm(total=total_length,  desc=f'Source: s3://{bucket}/{bucket_file}', bar_format="{percentage:.1f}%|{bar:25} | {rate_fmt} | {desc}",  unit='B', unit_scale=True, unit_divisor=1024) as pbar:
                self.s3.download_file(bucket, bucket_file, dest_file, Callback=pbar.update)
        except Exception as e:
            print(f"Error: {e}")
            logger.info(f"{bucket_file} does not exist")
