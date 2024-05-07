import os
import logging
import json
import datetime
from time import sleep
from app.db.schema import Station, StationLocation, Messages
import geopandas as gpd
import pandas as pd
from tqdm import tqdm
import uuid
from decimal import Decimal

logger = logging.getLogger(__name__)


def get_countries(world, coordinates):
    coords_df = pd.DataFrame(coordinates, columns=["Latitude", "Longitude"])
    coords = gpd.GeoDataFrame(
        coords_df, geometry=gpd.points_from_xy(coords_df.Longitude, coords_df.Latitude)
    )
    coords.crs = world.crs
    # Perform spatial join with world borders data
    result = gpd.sjoin(coords, world, how="left", predicate="intersects")
    return result.name.values


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

    world = gpd.read_feather("./app/shapefiles/world.feather")
    for file_no, file in enumerate(files):
        try:
            with open(base_path + "/" + file, "r", encoding="utf-8") as f:
                packets_json = json.load(f)
            packets_json = clean_json(packets_json)
            stations = set()
            locations = []
            messages = []

            for i, packet_json in tqdm(enumerate(packets_json)):
                callsign = packet_json.get("from").split("-")
                stations.add(
                    Station(
                        station_id=callsign[0],
                        ssid=callsign[1] if len(callsign) == 2 else None,
                        symbol=packet_json.get("symbol"),
                    )
                )
                # This addition is to ensure that all the dst stations are also inserted in the db
                callsign_to = packet_json.get("to").split("-")
                stations.add(
                    Station(
                        station_id=callsign_to[0],
                        ssid=callsign_to[1] if len(callsign_to) == 2 else None,
                        symbol="@",
                    )
                )
                now = datetime.datetime.now()
                id = uuid.uuid4()
                if packet_json.get("latitude"):
                    locations.append(
                        {
                            "sync_id": id,
                            "station": callsign[0],
                            "timestamp": (
                                (
                                    datetime.datetime.fromtimestamp(
                                        packet_json.get("timestamp")
                                    )
                                )
                                if packet_json.get("timestamp")
                                else now
                            ),
                            "latitude": Decimal(packet_json.get("latitude")).quantize(
                                Decimal("0.00001")
                            ),
                            "longitude": Decimal(packet_json.get("longitude")).quantize(
                                Decimal("0.00001")
                            ),
                        }
                    )
                messages.append(
                    {
                        "sync_id": id,
                        "src_station": callsign[0],
                        "dst_station": packet_json.get("to").split("-")[0],
                        "path": packet_json.get("path"),
                        "timestamp": (
                            (
                                datetime.datetime.fromtimestamp(
                                    packet_json.get("timestamp")
                                )
                            )
                            if packet_json.get("timestamp")
                            else now
                        ),
                        "comment": packet_json.get("comment"),
                        "raw_packet": packet_json,
                    }
                )
            countries = get_countries(
                world,
                [
                    (loc["latitude"], loc["longitude"])
                    for loc in locations
                    if loc["latitude"]
                ],
            )
            for loc, country in zip(locations, countries):
                loc["country"] = country

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
