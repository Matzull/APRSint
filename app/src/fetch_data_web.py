import configparser
import pandas as pd
import os
import numpy as np
from app.interfaces.alchemy import AlchemyInterface
from app.db.schema import StationLocation
from scipy.spatial.distance import cdist


c_parser = configparser.ConfigParser()
c_parser.read("/home/matzul/APRSint/config.ini")
config = {"db": dict(c_parser["db"])}

alchemy_interface = AlchemyInterface(config)


class Fetcher:
    def __init__(self):
        print("Creating fetcher")
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
        data = alchemy_interface.select_obj(StationLocation)

        df = pd.DataFrame().from_records(
            [packet for packet in data], columns=StationLocation.__columns__
        )

        df = df.dropna(subset=["latitude", "longitude", "timestamp"]).head(15000)

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
            df["link"] = "https://google.com"
            return df
        else:
            print("Caching")
            self.cached = True
            return self.pre_calculate()
