###################################################################################################
# IMPORTS

import logging

from .interfaces.alchemy import AlchemyInterface

###################################################################################################
# CLASSES

logger = logging.getLogger(__name__)


class Base:
    #pylint: disable=too-few-public-methods
    def __init__(self, config):
        self.config = config

        self.alchemy_interface = AlchemyInterface(config)
