###################################################################################################
# IMPORTS

import configparser
import logging

###################################################################################################
# FUNCTIONS

logger = logging.getLogger(__name__)


def get_config(config_path):
    cfg = configparser.RawConfigParser()
    cfg.read(config_path)
    return cfg


def set_logger(level):
    logger.setLevel(logging.DEBUG)
    ch = logging.StreamHandler()
    ch.setLevel(level.upper())
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    ch.setFormatter(formatter)
    logger.addHandler(ch)
