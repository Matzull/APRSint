########################################################################################################################
# IMPORTS

import logging

from .interfaces.alchemy import AlchemyInterface
from .interfaces.aws import AWSInterface
from .interfaces.drive import DriveInterface
from .interfaces.proxy import ProxyInterface

########################################################################################################################
# CLASSES

logger = logging.getLogger(__name__)


class Base:

    def __init__(self, config):
        self.config = config

        self.alchemy_interface = AlchemyInterface(config)
        self.proxy_interface = ProxyInterface(config)
        self.aws_interface = AWSInterface(config)
        self.drive_interface = DriveInterface(config)

