from ..interfaces.aws import S3_Storage
import os
import time
import logging

logger = logging.getLogger(__name__)


def upload_files(config):
    base_path = "/mnt/ssd/database"
    s3 = S3_Storage(config)
    files = [file for file in os.listdir(base_path) if file.endswith(".gz")]
    for index, file in enumerate(files):
        try:
            s3.upload_file(base_path + "/" + file)
            os.remove(base_path + "/" + file)
            if index % 100 == 0:
                print(f"{index}/{len(files)}")
            time.sleep(0.5)
        except Exception as e:
            logger.error(f"Couldn upload file {file} to s3 with error {e}")


def download_files(config):
    s3 = S3_Storage(config)
    files = s3.list_files("aprsoutput")
    for index, file in enumerate(files):
        try:
            s3.download_file(file, "/mnt/ssd/database_proccessed/" + file)
            s3.delete_file(file)
            if index % 100 == 0:
                print(f"{index} / {len(files)}")
            time.sleep(0.5)
        except Exception as e:
            logger.error(f"Couldn download file {file} from s3 with error {e}")
