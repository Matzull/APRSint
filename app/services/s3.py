from ..interfaces.aws import S3_Storage
import os
import time
import logging

logger = logging.getLogger(__name__)


def upload_files(config):
    base_path = "/mnt/ssd/database"
    s3 = S3_Storage(config)
    for file in os.listdir(base_path):
        print(base_path + "/" + file)
        try:
            s3.upload_file(base_path + "/" + file)
            os.remove(base_path + "/" + file)
            time.sleep(5)
        except Exception as e:
            logger.error(f"Couldn upload file {file} to s3 with error {e}")


def download_files(config):
    s3 = S3_Storage(config)
    for file in s3.list_files("aprsoutput"):
        try:
            s3.download_file(file, "/mnt/ssd/database_proccessed/" + file)
            s3.delete_file(file)
            time.sleep(5)
        except Exception as e:
            logger.error(f"Couldn download file {file} from s3 with error {e}")
