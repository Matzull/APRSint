from utils.buffer import Buffer
from aprslib import IS, parse
import json


class Aprs_client:
    def __init__(self, headless=True) -> None:
        self._buffer = Buffer()
        self._headless = False
        self._client = IS("N0CALL")

    def _append_to_buffer(self, packet):
        self._buffer.append(packet)

    def _parse_packet(self, packet):
        self._append_to_buffer(json.dumps(parse(packet)))

    def connect(self):
        self._client.connect()

    def receive(self, debug=False, parse=False):
        if debug:
            callback = lambda packet: print(packet)
        elif parse:
            callback = self._parse_packet
        else:
            callback = self._append_to_buffer
        self._client.consumer(callback, raw=True)
