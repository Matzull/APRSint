import aprslib
import gzip
import os
from tqdm import tqdm

max_buffers_per_file = 25
progress_bar = tqdm(total=max_buffers_per_file, desc="Filling buffer")
class Buffer:
    def __init__(self, max_size = 100):
        self.data = []
        self.max_size = max_size
        self.file_blocks = 0
        self.iterations = 0

    def append(self, data):
        if len(self.data) + 1 > self.max_size:
            progress_bar.update(1)
            self.file_blocks += 1
            self.write_to_file(self.data)
        self.data.append(data)

    def write_to_file(self, data):
        if self.file_blocks > max_buffers_per_file:
            #print('Max file blocks reached')
            with open(f"data_{self.iterations}.txt", "r") as f:
                with gzip.open(f"data_{self.iterations}.txt.gz", "wt") as zip_file:
                    for line in f:
                        zip_file.write(line)
            os.remove(f"data_{self.iterations}.txt")
            progress_bar.reset()
            print('\033[4A\033[2K', end='')
            self.file_blocks = 0
            self.iterations += 1
        with open(f"data_{self.iterations}.txt", "a") as f:
            for packet in data:
                f.write(str(packet) + "\n")
        self._flush()
        
    def _flush(self):
        self.data = []



os.system('cls')
buffer = Buffer()
def callback(packet):
    buffer.append(packet)

AIS = aprslib.IS("N0CALL")
AIS.connect()
AIS.consumer(callback, raw=True)
progress_bar.close()