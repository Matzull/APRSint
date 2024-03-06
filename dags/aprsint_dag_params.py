from datetime import datetime, timedelta


CONFIG_PATH = "/home/matzul/APRSint/config.ini"
EXEC_PATH = "/home/matzul/miniforge3/envs/tfg_env/bin/python3"

default_args = {
    "owner": "AprsInt",
    "depends_on_past": False,
    "start_date": datetime(2024, 1, 1),
    "retries": 3,
    "retry_delay": timedelta(minutes=1),
    "email": ["marcal16@ucm.es"],
    "email_on_failure": True,
    "email_on_retry": False,
}
