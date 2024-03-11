import os
import logging
import json
import datetime
from time import sleep
from app.db.schema import Station, StationLocation, Messages

logger = logging.getLogger(__name__)


def clean_json(input_string):
    return json.loads(
        json.dumps(input_string)
        .replace("\u0000", " ")
        .replace("\\u0000", " ")
        .replace("\00", " ")
        .replace("\0", " ")
    )


def db_insert(base, delete=False):
    base_path = "/mnt/ssd/database_proccessed"
    files = os.listdir(base_path)

    for file_no, file in enumerate(files):
        try:
            with open(base_path + "/" + file, "r", encoding="utf-8") as f:
                packets_json = json.load(f)
            packets_json = clean_json(packets_json)
            stations = set()
            locations = []
            messages = []
            for i, packet_json in enumerate(packets_json):
                stations.add(
                    Station(
                        station_id=packet_json.get("from"),
                        ssid=packet_json.get("ssid"),
                        symbol=packet_json.get("symbol"),
                    )
                )
                stations.add(
                    Station(station_id=packet_json.get("to"), ssid=None, symbol="@")
                )
                if packet_json.get("latitude"):
                    locations.append(
                        {
                            "station": packet_json.get("from"),
                            "timestamp": (
                                (
                                    datetime.datetime.fromtimestamp(
                                        packet_json.get("timestamp")
                                    )
                                )
                                if packet_json.get("timestamp")
                                else datetime.datetime.now()
                            ),
                            "latitude": packet_json.get("latitude"),
                            "longitude": packet_json.get("longitude"),
                        }
                    )
                messages.append(
                    {
                        "src_station": packet_json.get("from"),
                        "dst_station": packet_json.get("to"),
                        "path": packet_json.get("path"),
                        "timestamp": (
                            (
                                datetime.datetime.fromtimestamp(
                                    packet_json.get("timestamp")
                                )
                            )
                            if packet_json.get("timestamp")
                            else datetime.datetime.now()
                        ),
                        "comment": packet_json.get("comment"),
                        "raw_packet": packet_json,
                    }
                )
            print("Inserting")
            # for loc in locations[:15]:
            #     print(loc)

            base.alchemy_interface.bulk_insert_alchemy_objs(list(stations), Station)
            base.alchemy_interface.bulk_insert_alchemy_dicts(locations, StationLocation)
            base.alchemy_interface.bulk_insert_alchemy_dicts(messages, Messages)
        except Exception as e:
            print(f"Failed with error {e}")
            logger.error(f"Couldn't load json {file} with error {e}")
            sleep(5)
        try:
            if delete:
                os.remove(base_path + "/" + file)
                if file_no % 100 == 0:
                    print(f"{file_no}/{len(files)}")
        except Exception as e:
            print(f"Failed with error {e}")
            logger.error(f"Couldn't delete object {file} with error {e}")
