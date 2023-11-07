from tqdm import tqdm
import os
import gzip

class Buffer:
    def __init__(self, buffer_length = 100, max_buffers_per_file=25, debug=False):
        self.data = []
        self.buffer_length = buffer_length
        self.buffers_in_file = 0
        self.max_buffers_per_file = max_buffers_per_file
        self.iterations = 0
        self.buffers_in_file = 0
        self.debug = debug
        if debug:
            self.progress_bar = tqdm(total=max_buffers_per_file, desc="Filling buffer")

    def append(self, data):
        if len(self.data) + 1 > self.buffer_length:
            if self.debug:
                self.progress_bar.update(1)
            self.buffers_in_file += 1
            self.write_to_file(self.data)
        self.data.append(data)

    def write_to_file(self, data):
        if self.buffers_in_file > self.max_buffers_per_file:
            with open(f"./database/data_{self.iterations}.txt", "r") as f:
                with gzip.open(f"./database/data_{self.iterations}.txt.gz", "wt") as zip_file:
                    for line in f:
                        zip_file.write(line)
            os.remove(f"./database/data_{self.iterations}.txt")
            self.buffers_in_file = 0
            self.iterations += 1
        with open(f"./database/data_{self.iterations}.txt", "a") as f:
            for packet in data:
                f.write(str(packet) + "\n")
        self._flush()
        if self.debug:
            self.progress_bar.reset()
            print('\033[4A\033[2K', end='')
        
    def _flush(self):
        self.data = []