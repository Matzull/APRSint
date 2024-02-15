import aprs_client as aprs
import sys
sys.path.append("/home/matzul/APRSint/app/utils")
from utils import set_logger
set_logger("INFO")
aprsc = aprs.AprsClient(output_dir="/mnt/ssd/database")
aprsc.connect()
aprsc.receive(debug=False, parse=False)
