########################################################################################################################
# IMPORTS

from sqlalchemy import Column, Integer
from sqlalchemy.ext.declarative import declarative_base


########################################################################################################################
# PARAMETERS

SCHEMA = 'public'

########################################################################################################################
# CLASSES


Base = declarative_base()


class Table(Base):
    __tablename__ = 'tablename'
    __table_args__ = {'schema': SCHEMA}

    id = Column(Integer, primary_key=True)
