from tqdm import tqdm
import logging
import boto3
import os

logger = logging.getLogger(__name__)


class S3_Storage:
    def __init__(self, config):
        creds = config["AWS_CREDENTIALS"]
        self.session = boto3.Session(
            aws_access_key_id=creds["AWS_ACCESS_KEY_ID"],
            aws_secret_access_key=creds["AWS_SECRET_ACCESS_KEY"],
        )
        self.in_bucket = config["AWS"]["IN_BUCKET"]
        self.out_bucket = config["AWS"]["OUT_BUCKET"]
        self.s3 = self.session.client("s3")

    def list_buckets(self):
        return [bucket["Name"] for bucket in self.s3.list_buckets()["Buckets"]]

    def list_files(self, bucket):
        return [obj["Key"] for obj in self.s3.list_objects(Bucket=bucket)["Contents"]]
    
    def delete_file(self, bucket_file):
        try:
            self.s3.delete_object(Bucket=self.out_bucket, Key=bucket_file)
        except Exception as e:
            logger.info(f"{bucket_file} does not exist")

    def upload_file(self, local_file, dest_file=None):
        if dest_file is None:
            dest_file = local_file.split("/")[-1]
        try:
            with tqdm(
                total=os.path.getsize(local_file),
                desc=f"Destination: s3://{self.in_bucket}/{dest_file}",
                bar_format="{percentage:.1f}%|{bar:25} | {rate_fmt} | {desc}",
                unit="B",
                unit_scale=True,
                unit_divisor=1024,
            ) as pbar:
                self.s3.upload_file(
                    local_file, self.in_bucket, dest_file, Callback=pbar.update
                )
        except Exception as e:
            print(f"Error: {e}")
            logger.info(f"{local_file} does not exist")

    def download_file(self, bucket_file, dest_file=None):
        if dest_file is None:
            dest_file = bucket_file
        try:
            meta_data = self.s3.head_object(Bucket=self.out_bucket, Key=bucket_file)
            total_length = int(meta_data.get("ContentLength", 0))
            with tqdm(
                total=total_length,
                desc=f"Source: s3://{self.out_bucket}/{bucket_file}",
                bar_format="{percentage:.1f}%|{bar:25} | {rate_fmt} | {desc}",
                unit="B",
                unit_scale=True,
                unit_divisor=1024,
            ) as pbar:
                self.s3.download_file(
                    self.out_bucket, bucket_file, dest_file, Callback=pbar.update
                )
        except Exception as e:
            logger.info(f"{bucket_file} does not exist")
