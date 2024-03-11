##################################################################################################
# IMPORTS

from sqlalchemy import String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import Column, Integer
from sqlalchemy.ext.declarative import declarative_base

##################################################################################################
# PARAMETERS

SCHEMA = "aprsint"

##################################################################################################
# CLASSES


Base = declarative_base()


class Station(Base):
    """
    Class defining a station
    """

    __tablename__ = "stations"
    __table_args__ = {"schema": SCHEMA}
    __columns__ = ["station_id", "ssid", "symbol"]

    station_id = Column(String(15), primary_key=True)  # Station callsign
    ssid = Column(String(5))  # SSID
    symbol = Column(String(1))
    # comment = Column(String(500))

    def __str__(self):
        return f"{self.station_id}-{self.ssid} | {self.symbol}"

    def as_dict(self):
        return {
            "station_id": self.station_id,
            "ssid": self.ssid,
            "symbol": self.symbol,
        }

    def __eq__(self, other):
        if not isinstance(other, Station):
            return NotImplemented
        return (self.station_id) == (other.station_id)

    def __hash__(self):
        return hash((self.station_id))


class StationLocation(Base):
    """ """

    __tablename__ = "station_locations"
    __table_args__ = {"schema": SCHEMA}
    __columns__ = ["station", "timestamp", "latitude", "longitude"]

    id = Column(Integer, primary_key=True, autoincrement=True)
    station = Column(String(15), ForeignKey(Station.station_id), primary_key=True)
    timestamp = Column(DateTime)
    latitude = Column(Float)
    longitude = Column(Float)

    def __str__(self):
        return f"{self.station} | {self.latitude} | {self.longitude} | {self.timestamp}"

    def as_dict(self):
        return {
            "callsign": self.station,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "timestamp": self.timestamp,
        }


class Messages(Base):
    """
    Class defining a message
    """

    __tablename__ = "messages"
    __table_args__ = {"schema": SCHEMA}
    __columns__ = [
        "src_station",
        "dst_station",
        "path",
        "timestamp",
        "comment",
        "raw_packet",
    ]

    id = Column(Integer, primary_key=True)
    src_station = Column(String(15), ForeignKey(Station.station_id))  # Station callsign
    dst_station = Column(String(15), ForeignKey(Station.station_id))
    path = Column(String(100))
    timestamp = Column(DateTime)
    comment = Column(String(500))
    raw_packet = Column(JSONB())

    def __str__(self):
        return f"{self.id} | {self.src_station} | {self.dst_station} | {self.timestamp} | {self.comment}"

    def as_dict(self):
        return {
            "src_station": self.src_station,
            "dst_station": self.dst_station,
            "path": self.path,
            "timestamp": self.timestamp,
            "comment": self.comment,
            "raw_packet": self.raw_packet,
        }
