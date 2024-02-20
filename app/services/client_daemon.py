import aprs_client as aprs
import sys
from time import sleep

sys.path.append("/home/matzul/APRSint/app/utils")
from utils import set_logger

# Wait for all the services to start
sleep(120)
set_logger("INFO")
aprsc = aprs.AprsClient(output_dir="/mnt/ssd/database")
aprsc.connect()
aprsc.receive(debug=False, parse=False)
