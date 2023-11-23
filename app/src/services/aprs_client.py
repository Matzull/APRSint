import json
from utils.buffer import Buffer
from aprslib import IS, parse as prs


class AprsClient:
    def __init__(self, headless=True) -> None:
        self._buffer = Buffer(debug=True, buffer_length=25)
        self._headless = headless
        self._client = IS("N0CALL")

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
        self._client.consumer(callback, raw=True)
