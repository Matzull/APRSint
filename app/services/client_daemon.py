import sys
from time import sleep
import aprs_client as aprs  # pylint: disable=import-error

sys.path.append("/home/matzul/APRSint/app/utils")
from utils import set_logger  # pylint: disable=wrong-import-position, import-error

# Wait for all the services to start
sleep(120)
set_logger("INFO")
aprsc = aprs.AprsClient(output_dir="/mnt/ssd/database")
aprsc.connect()
aprsc.receive(debug=False, parse=False)
