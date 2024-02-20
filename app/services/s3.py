from ..interfaces.aws import S3_Storage
import os
import time


def upload_files(config):
    base_path = "/mnt/ssd/database"
    s3 = S3_Storage(config)
    for file in os.listdir(base_path):
        print(base_path + "/" + file)
        s3.upload_file(base_path + "/" + file)
        time.sleep(100)


def download_files(config):
    s3 = S3_Storage(config)
    for file in s3.list_files("aprsoutput"):
        print(file)
        s3.download_file(file)
    # s3.download_file("aprsint", "aprsint.db", "aprsint.db")
    time.sleep(100)
