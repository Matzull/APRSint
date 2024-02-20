import json
import sys

sys.path.append("/home/matzul/APRSint/app/utils")
import buffer as bf
from aprslib import IS, parse as prs

import logging

logger = logging.getLogger(__name__)


class AprsClient:
    def __init__(self, output_dir, headless=True) -> None:
        self._buffer = bf.Buffer(base_dir=output_dir, max_buffers_per_file=100)
        self._headless = headless
        self._client = IS("N0CALL")
        logger.info("APRS client initialized")

    def _append_to_buffer(self, packet):
        self._buffer.append(packet)

    def _parse_packet(self, packet):
        self._append_to_buffer(json.dumps(prs(packet)))

    def _debug(self, packet):
        print(packet)

    def connect(self):
        self._client.connect()

    def receive(self, debug=None, parse=False):
        if debug is None:
            debug = self._headless
        if debug:
            callback = self._debug
        elif parse:
            callback = self._parse_packet
        else:
            callback = self._append_to_buffer
        try:
            self._client.consumer(callback, raw=True, immortal=True)
        except Exception as e:
            logger.error(f"Error in receive with error {e}")
