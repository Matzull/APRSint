########################################################################################################################
# IMPORTS

import logging

from .interfaces.alchemy import AlchemyInterface

########################################################################################################################
# CLASSES

logger = logging.getLogger(__name__)


class Base:
    def __init__(self, config):
        self.config = config

        self.alchemy_interface = AlchemyInterface(config)
