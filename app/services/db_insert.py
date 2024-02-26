import os
import logging
import json
from ..db.Schema import AprsPacket
from time import sleep
import datetime
import re
from tqdm import tqdm

logger = logging.getLogger(__name__)

def clean_string(input_string):
    # accepted_chars = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}|;':,.<>/?`~*")
    # return ''.join(filter(lambda x: x in accepted_chars, input_string))
    return input_string.replace('\x00', '').replace('\u0000', '')

def db_insert(base):
    base_path = "/mnt/ssd/database_proccessed"

    for file in os.listdir(base_path):
        try:
            packets_json = json.load(open(base_path + "/" + file))
            packets = []
            for index, packet_json in enumerate(tqdm(packets_json)):
                try:
                    if packet_json.get("comment"):
                        packet_json["comment"] = clean_string(packet_json["comment"])
                    packet_json["raw"] = clean_string(packet_json["raw"])
                    packets.append(AprsPacket(
                        callsign = packet_json.get("from"),
                        ssid = None,
                        destination = packet_json.get("to"),
                        path = packet_json.get("path"),
                        latitude = packet_json.get("latitude"),
                        longitude = packet_json.get("longitude"),
                        timestamp = (datetime.datetime.fromtimestamp(packet_json.get("timestamp"))) if packet_json.get("timestamp") else None,
                        symbol = packet_json.get("symbol"),
                        comment = packet_json.get("comment"),
                        raw_packet = packet_json
                    ))
                    if index % 100 == 0:
                        base.alchemy_interface.bulk_insert_alchemy_objs(packets)
                        packets = []
                except Exception as e:
                    logger.error(f"Couldn't insert object {packet_json} to database with error {e}")
                    sleep(10)
        except Exception as e:
            logger.error(f"Couldn't load json {file} with error {e}")