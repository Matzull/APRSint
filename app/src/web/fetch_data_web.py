import configparser
import pandas as pd
import os
import numpy as np
from app.interfaces.alchemy import AlchemyInterface
from app.db.schema import StationLocation, Station, Messages
from scipy.spatial.distance import cdist

c_parser = configparser.ConfigParser()
c_parser.read("/home/matzul/APRSint/config.ini")
config = {"db": dict(c_parser["db"])}

alchemy_interface = AlchemyInterface(config)


class HomeFetcher:
    def __init__(self):
        self.cached = False

    def count_points_within_radius(self, df, radius):
        # Convertir coordenadas a radianes
        lat_rad = np.radians(df["latitude"])
        lon_rad = np.radians(df["longitude"])

        # Calcular matriz de distancias
        coords = np.column_stack((lat_rad, lon_rad))
        distances = cdist(coords, coords) * 6371  # Radio de la Tierra en kilómetros

        # Contar puntos dentro del radio
        counts = (
            np.sum(distances <= radius, axis=1) - 1
        )  # Restar 1 para excluir el propio punto

        return counts

    def pre_calculate(self):
        df_sl = alchemy_interface.select_obj(StationLocation, limit=5000, df=True)
        df_si = alchemy_interface.select_obj(Station, limit=5000, df=True)
        df = pd.merge(df_sl, df_si, left_on="station", right_on="station_id")

        df = df.dropna(subset=["latitude", "longitude", "timestamp"])

        df = df.groupby(["latitude", "longitude"]).filter(
            lambda x: x["station"].nunique() == 1
        )

        df["density"] = self.count_points_within_radius(df, 50)

        df.to_csv("./data.csv")
        return df

    def fetch_data(self):
        if os.path.exists("./data.csv"):
            print("Data exists")
            df = pd.read_csv("./data.csv", parse_dates=["timestamp"])
            return df
        else:
            print("Caching")
            self.cached = True
            return self.pre_calculate()


class StationFetcher:
    def __init__(self, station_id):
        self.station_id = station_id

    def fetch_data(self):
        print(f"Fetching station {self.station_id}")
        data_station = alchemy_interface.select_obj(
            Station, **{"station_id": self.station_id}
        )

        data_location = alchemy_interface.select_obj(
            StationLocation,
            ["id", "timestamp", "latitude", "longitude", "country"],
            limit=10,
            df=True,
            **{"station": self.station_id},
        )
        
        data_messages = alchemy_interface.select_obj(
            Messages,
            ["src_station", "dst_station", "path", "timestamp", "comment"],
            limit=10,
            df=True,
            **{"src_station": self.station_id},
        )
        packets = pd.concat(
            [data_location, data_messages.drop("timestamp", axis=1)], axis=1
        ).drop(["id", "src_station"], axis=1)

        return data_station, packets
