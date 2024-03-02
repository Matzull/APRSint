import os
import logging
import json
import datetime

logger = logging.getLogger(__name__)


def clean_json(input_string):
    return json.loads(
        json.dumps(input_string)
        .replace("\u0000", " ")
        .replace("\\u0000", " ")
        .replace("\00", " ")
        .replace("\0", " ")
    )


def db_insert(base):
    base_path = "/mnt/ssd/database_proccessed"
    files = os.listdir(base_path)
    for file_no, file in enumerate(files):
        try:
            packets_json = json.load(open(base_path + "/" + file))
            packets_json = clean_json(packets_json)
            packets = []
            for packet_json in packets_json:
                packets.append(
                    dict(
                        callsign=packet_json.get("from"),
                        ssid=None,
                        destination=packet_json.get("to"),
                        path=packet_json.get("path"),
                        latitude=packet_json.get("latitude"),
                        longitude=packet_json.get("longitude"),
                        timestamp=(
                            (
                                datetime.datetime.fromtimestamp(
                                    packet_json.get("timestamp")
                                )
                            )
                            if packet_json.get("timestamp")
                            else None
                        ),
                        symbol=packet_json.get("symbol"),
                        comment=packet_json.get("comment"),
                        raw_packet=packet_json,
                    )
                )
            base.alchemy_interface.bulk_insert_alchemy_dicts(packets)
        except Exception as e:
            print(f"Failed with error {e}")
            logger.error(f"Couldn't load json {file} with error {e}")
        try:
            os.remove(base_path + "/" + file)
            if file_no % 100 == 0:
                print(f"{file_no}/{len(files)}")
        except Exception as e:
            print(f"Failed with error {e}")
            logger.error(f"Couldn't delete object {file} with error {e}")
