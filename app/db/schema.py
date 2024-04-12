##################################################################################################
# IMPORTS

from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB, NUMERIC, TSVECTOR
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
    ssid = Column(String(6))  # SSID
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
    __columns__ = ["station", "timestamp", "latitude", "longitude", "country"]

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, primary_key=True)
    station = Column(String(15), ForeignKey(Station.station_id), primary_key=True)
    latitude = Column(NUMERIC(9, 5))
    longitude = Column(NUMERIC(9, 5))
    country = Column(String(50))

    def __str__(self):
        return f"{self.station} | {self.latitude} | {self.longitude} | {self.timestamp}"

    def as_dict(self):
        return {
            "callsign": self.station,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "timestamp": self.timestamp,
            "country": self.country,
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

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, primary_key=True)
    src_station = Column(String(15), ForeignKey(Station.station_id))  # Station callsign
    dst_station = Column(String(15), ForeignKey(Station.station_id))
    path = Column(String(100))
    comment = Column(String(500))
    raw_packet = Column(JSONB())

    def __str__(self):
        return f"{self.id} | {self.src_station} | {self.timestamp} | {self.comment}"

    def as_dict(self):
        return {
            "src_station": self.src_station,
            "dst_station": self.dst_station,
            "path": self.path,
            "timestamp": self.timestamp,
            "comment": self.comment,
            "raw_packet": self.raw_packet,
        }


class QRZProfiles(Base):
    """
    Class defining a qrz profile
    """

    __tablename__ = "qrz_profiles"
    __table_args__ = {"schema": SCHEMA}
    __columns__ = ["station", "data"]

    station = Column(String(15), ForeignKey(Station.station_id), primary_key=True)
    data = Column(JSONB())

    def __str__(self):
        return f"{self.station} | {self.data}"

    def as_dict(self):
        return {
            "station": self.station,
            "data": self.data,
        }
