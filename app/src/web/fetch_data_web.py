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
    def __init__(self, base_dir):
        self.base_dir = base_dir
        self.cached = False

    def count_points_within_radius(self, df, radius):
        # Convertir coordenadas a radianes
        lat_rad = np.radians(df["latitude"].astype(float))
        lon_rad = np.radians(df["longitude"].astype(float))

        # Calcular matriz de distancias
        coords = np.column_stack((lat_rad, lon_rad))
        distances = cdist(coords, coords) * 6371  # Radio de la Tierra en kilómetros

        # Contar puntos dentro del radio
        counts = (
            np.sum(distances <= radius, axis=1) - 1
        )  # Restar 1 para excluir el propio punto

        return counts

    def pre_calculate(self, base_dir):
        df_sl = alchemy_interface.select_obj(StationLocation, df=True)  # , limit=5000,
        df_sl = df_sl.drop_duplicates(subset=["station", "country"])
        df_si = alchemy_interface.select_obj(Station, df=True)  # , limit=5000,
        df = pd.merge(df_sl, df_si, left_on="station", right_on="station_id")

        df = df.dropna(subset=["latitude", "longitude", "timestamp"])

        df = df.groupby(["latitude", "longitude"]).filter(
            lambda x: x["station"].nunique() == 1
        )

        # df["density"] = 1#self.count_points_within_radius(df, 50)
        print(df.shape)
        df.to_feather(base_dir + "/cache/map_data.feather")
        return df

    def cache_map(self):
        self.pre_calculate(self.base_dir)

    def cache_graph(self):
        df_sl = alchemy_interface.select_obj(
            Messages, columns=["src_station", "dst_station", "timestamp"], df=True
        )  # , limit=5000
        df_sl["timestamp"] = df_sl["timestamp"].dt.date
        unique_stations = pd.concat(
            [df_sl["src_station"], df_sl["dst_station"]]
        ).unique()
        unique_series = pd.Series(unique_stations)
        unique_series.to_csv(
            self.base_dir + "/assets/nodes.csv", index=False, header=False
        )
        df_sl["count"] = df_sl.groupby(df_sl.columns.tolist()).transform("size")
        df_sl = df_sl.drop_duplicates()
        df_sl.to_csv(self.base_dir + "/assets/messages.csv", index=False, header=False)

    def fetch_data(self):
        return pd.read_feather(self.base_dir + "/cache/map_data.feather")

    def search_comment(
        self,
        text,
        table=Messages,
        language="English",
        columns=["src_station", "comment"],
    ):
        return alchemy_interface.search_text(
            table=table, language=language, text=text, columns=columns
        )


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
            ["timestamp", "latitude", "longitude", "country"],
            limit=10,
            df=True,
            **{"station": self.station_id},
        )

        data_messages = alchemy_interface.select_obj(
            Messages,
            ["dst_station", "path", "timestamp", "comment"],
            limit=10,
            df=True,
            **{"src_station": self.station_id},
        )

        packets = pd.merge(data_location, data_messages, on="timestamp", how="right")

        return data_station, packets
