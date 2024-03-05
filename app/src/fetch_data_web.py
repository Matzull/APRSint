import pandas as pd
from sklearn.neighbors import NearestNeighbors
import numpy as np
from app.interfaces.alchemy import AlchemyInterface
import configparser
from time import time_ns
from app.db.schema import AprsPacket

c_parser = configparser.ConfigParser()
c_parser.read("/home/matzul/APRSint/config.ini")
config = {"db": dict(c_parser["db"])}

alchemy_interface = AlchemyInterface(config)


def fetch_data():
    time_start = time_ns()
    data = alchemy_interface.select_query(AprsPacket)
    time_query = time_ns()
    print("Time to query data: ", (time_query - time_start) / 1e6, " ms")
    df = pd.DataFrame().from_records([packet.as_dict() for packet in data])

    df = df.dropna(subset=["latitude", "longitude", "timestamp"])

    coords = df[["latitude", "longitude"]].values

    # Usar NearestNeighbors para encontrar vecinos en un radio
    # El radio está en grados y puedes ajustarlo según tus necesidades
    radius = 0.5  # Ajusta este valor según tus necesidades
    nbrs = NearestNeighbors(radius=radius, algorithm="ball_tree").fit(coords)
    distances, indices = nbrs.radius_neighbors(coords)

    # Calcular la densidad: número de puntos en el radio para cada punto
    density = np.array([len(indices[i]) for i in range(len(coords))])

    # Agregar la densidad al DataFrame original
    df["density"] = density
    time_end = time_ns()
    print("Time to fetch data: ", (time_end - time_start) / 1e6, " ms")
    return df.head(1000)
