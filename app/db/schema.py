##################################################################################################
# IMPORTS

import datetime
from sqlalchemy import String, Float, DateTime
from sqlalchemy.dialects.postgresql import JSONB

from sqlalchemy import Column, Integer
from sqlalchemy.ext.declarative import declarative_base

##################################################################################################
# PARAMETERS

SCHEMA = "aprsint"

##################################################################################################
# CLASSES


Base = declarative_base()


class AprsPacket(Base):
    """
    Class defining an aprs packet
    """

    __tablename__ = "aprs_packets"
    __table_args__ = {"schema": SCHEMA}

    id = Column(Integer, primary_key=True)
    callsign = Column(String(15))  # Station callsign
    ssid = Column(String(5))  # SSID
    destination = Column(String(15))
    path = Column(String(100))
    latitude = Column(Float)
    longitude = Column(Float)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    symbol = Column(String(1))
    comment = Column(String(500))
    raw_packet = Column(JSONB())

    def __str__(self):
        time = (str(self.timestamp) + " | ") if self.timestamp else ""
        return f"{time}From: {self.callsign} | To: {self.destination}"

    def as_dict(self):
        return {
            "id": self.id,
            "callsign": self.callsign,
            "ssid": self.ssid,
            "destination": self.destination,
            "path": self.path,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "timestamp": self.timestamp,
            "symbol": self.symbol,
            "comment": self.comment,
            "raw_packet": self.raw_packet,
        }
