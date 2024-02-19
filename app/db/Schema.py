########################################################################################################################
# IMPORTS

from sqlalchemy import String, Float, DateTime

from sqlalchemy import Column, Integer
from sqlalchemy.ext.declarative import declarative_base


########################################################################################################################
# PARAMETERS

SCHEMA = "public"

########################################################################################################################
# CLASSES


Base = declarative_base()


class Station(Base):
    """
    Class defining an aprs station
    """
    __tablename__ = "station"
    __table_args__ = {"schema": SCHEMA}

    id_station = Column(Integer, primary_key=True)
    callsign = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    altitude = Column(Float)

class packet(Base):
    """
    Class defining an aprs packet
    """
    __tablename__ = "packet"
    __table_args__ = {"schema": SCHEMA}

    id_packet = Column(Integer, primary_key=True)
    id_station = Column(Integer)
    timestamp = Column(DateTime)
    latitude = Column(Float)
    longitude = Column(Float)
    altitude = Column(Float)
    speed = Column(Float)
    course = Column(Float)
    symbol = Column(String)
    comment = Column(String)
    path = Column(String)
    raw = Column(String)
    digipeaters = Column(String)
    message = Column(String)
    telemetry = Column(String)
    weather = Column(String)
    status = Column(String)
    object = Column(String)
